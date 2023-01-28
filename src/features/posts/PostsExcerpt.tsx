import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectPostById } from './postsSlice';
import { EntityId } from '@reduxjs/toolkit';

type PostId = {
  postId: EntityId;
};

const PostsExcerpt: React.FC<PostId> = ({ postId }) => {
  const post = useAppSelector((state) => selectPostById(state, postId));

  return (
    <>
      {post && (
        <article>
          <h2>{post.title}</h2>
          {post.body && <p>{post.body.substring(0, 75)}...</p>}
          <p>
            <PostAuthor userId={post.userId} />
          </p>
          <Link to={`post/${post.id}`}>View Post</Link>
          <TimeAgo timestamp={post.date} />
          <ReactionButtons post={post} />
        </article>
      )}
    </>
  );
};
export default PostsExcerpt;
