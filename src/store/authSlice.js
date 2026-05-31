import { createSlice } from '@reduxjs/toolkit';
import { clearSession, getStoredSession } from '../lib/api';

const storedSession = getStoredSession();

const initialState = {
  isAuthenticated: Boolean(storedSession?.accessToken),
  user: storedSession?.user?.email ?? null,
  name: storedSession?.user?.name ?? null,
  role: storedSession?.user?.role ?? null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user.email;
      state.name = action.payload.user.name;
      state.role = action.payload.user.role;
    },
    logout: (state) => {
      clearSession();
      state.isAuthenticated = false;
      state.user = null;
      state.name = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
