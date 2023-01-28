import { useAppSelector } from '../../app/hooks';
import { selectAllUsers } from '../users/usersSlice';

type userId = {
  userId: string | number;
};

const PostAuthor: React.FC<userId> = ({ userId }) => {
  const users = useAppSelector(selectAllUsers);
  const author = users.find((user) => user.id === userId);
  return <span>by {author ? author.name : 'Unknow author'}</span>;
};

export default PostAuthor;
