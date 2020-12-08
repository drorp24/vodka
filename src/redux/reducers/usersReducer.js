import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { server_host_url, logged_in } from '../../configLoader';

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async ({ user_name, password }, thunkAPI) => {
    try {
      const response = await fetch(`${server_host_url}/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name,
          password,
        }),
      });
      const json = await response.json();
      if (!json) throw new Error('fetchUser returned no data');
      if (json.code === 400) throw new Error(json.message);
      return json;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  currentRequestId: undefined,
  loading: 'idle',
  error: null,
  loggedIn: logged_in ? {
    password: "test123",
    username: "test"
  } : {},
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logout: () => ({...initialState, loggedIn: {}}),
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
