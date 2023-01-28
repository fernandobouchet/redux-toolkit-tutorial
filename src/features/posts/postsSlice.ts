import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
  EntityState,
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

interface State {
  status: string;
  error: string | undefined | null;
  count: number;
}

const postAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState: EntityState<Post> & State = postAdapter.getInitialState({
  status: 'idle',
  error: null,
  count: 0,
});

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

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (initialPost: Post) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return initialPost;
      return `${response?.status}: ${response?.statusText}`;
    } catch (err: any) {
      return err.message;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount(state) {
      state.count = state.count + 1;
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
        postAdapter.upsertMany(state, loadedPosts);
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
        postAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log(`Update could not complete`);
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postAdapter.removeOne(state, id);
      });
  },
});

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostsIds,
} = postAdapter.getSelectors((state: RootState) => state.posts);

export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export const getCount = (state: RootState) => state.posts.count;

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId.toString() === userId)
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
