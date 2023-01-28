import PostsExcerpt from './PostsExcerpt';
import { useSelector } from 'react-redux';
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
  fetchPosts,
} from './postsSlice';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../app/hooks';

const PostsList = () => {
  const dispatch = useAppDispatch();
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

  return <section>{content}</section>;
};
export default PostsList;
