import PostsExcerpt from './PostsExcerpt';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
  fetchPosts,
} from './postsSlice';
import { useEffect, useRef } from 'react';
import { AppDispatch } from '../../app/store';

const PostsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      if (postsStatus === 'idle') {
        dispatch(fetchPosts());
        effectRan.current = true;
      }
    }
  }, [postsStatus, dispatch]);

  let content;
  if (postsStatus === 'loading') {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === 'succeeded') {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post) => (
      <PostsExcerpt key={post.id} post={post} />
    ));
  } else if (postsStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};
export default PostsList;
