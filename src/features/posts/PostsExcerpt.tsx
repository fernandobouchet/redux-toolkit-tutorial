import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';

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
      <h3>{post.title}</h3>
      {post.body && <p>{post.body.substring(0, 100)}</p>}
      <p>
        <PostAuthor userId={post.userId} />
      </p>
      <TimeAgo timestamp={post.date} />
      <ReactionButtons post={post} />
    </article>
  );
};
export default PostsExcerpt;
