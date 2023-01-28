import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import { Link } from 'react-router-dom';

type Post = {
  post: {
    id: string;
    title: string;
    content: string;
    body?: string | undefined;
    userId: string;
    date: string;
    reactions: {
      [key: string]: number;
    };
  };
};

const PostsExcerpt: React.FC<Post> = ({ post }) => {
  return (
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
  );
};
export default PostsExcerpt;
