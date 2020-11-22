import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { server_host_url } from '../../configLoader';

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async ({ user_name, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${server_host_url}/login`, {
        user_name,
        password,
      });
      if (!response?.data) throw new Error('fetchUser returned no data');
      if (response.data.code === 400) throw new Error(response.data.message);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  currentRequestId: undefined,
  loading: 'idle',
  error: null,
  loggedIn: {},
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: {
    [fetchUser.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId;
        state.loading = 'pending';
        state.error = null;
      }
    },

    [fetchUser.fulfilled]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined;
        state.loading = 'idle';
        state.error = null;
        state.loggedIn = payload;
      }
    },

    [fetchUser.rejected]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined;
        state.loading = 'idle';
        state.error = payload.message;
      }
    },
  },
});

const { reducer, actions } = usersSlice;
export const { logout } = actions;

export default reducer;
