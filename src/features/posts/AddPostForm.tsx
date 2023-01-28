import React, { useState } from 'react';
import { addNewPost } from './postsSlice';
import { selectAllUsers } from '../users/usersSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

const AddPostForm = () => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setuserId] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const users = useAppSelector(selectAllUsers);

  const onTitledChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);
  const onAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setuserId(e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

  const onSavePostClicked = () => {
    try {
      setAddRequestStatus('pending');
      dispatch(
        addNewPost({
          title,
          body: content,
          userId,
          id: '',
          content: '',
          date: '',
          reactions: {},
        })
      ).unwrap();
      setTitle('');
      setContent('');
      setuserId('');
    } catch (error) {
      console.log(error);
    } finally {
      setAddRequestStatus('idle');
    }
  };

  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTile">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitledChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          name="postAuthor"
          id="postAuthor"
          value={userId}
          onChange={onAuthorChange}
        >
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
export default AddPostForm;
