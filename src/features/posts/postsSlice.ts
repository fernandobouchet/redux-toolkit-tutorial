import {
  createSlice,
  nanoid,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { sub } from 'date-fns';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

type Post = {
  id: string;
  title: string;
  content: string;
  body?: string;
  userId: string | number;
  date: string;
  reactions: {
    [key: string]: number;
  };
};

type State = {
  posts: Post[];
  status: string;
  error: string | undefined | null;
};

const initialState: State = {
  posts: [],
  status: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk(
  'posts/addNewPosts',
  async (initialPost: Post) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (initialPost: Post) => {
    const { id } = initialPost;
    const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
    return response.data;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
            userId,
          },
        };
      },
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let min = 1;
        const loadedPosts = action.payload.map((post: Post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log(`Update could not complete`);
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const selectPostById = (state: RootState, postId: string | undefined) =>
  state.posts.posts.find((post) => post.id.toString() === postId);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
