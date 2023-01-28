import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/users';

type state = {
  id: string;
  name: string;
};

const initialState: state[] = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export const selectUserById = (state: RootState, userId: string | undefined) =>
  state.users.find((user) => user.id.toString() === userId);

export default userSlice.reducer;
