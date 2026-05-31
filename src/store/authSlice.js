import { createSlice } from '@reduxjs/toolkit';
import { clearSession, getStoredSession, storeSession } from '../lib/api';

const storedSession = getStoredSession();

const initialState = {
  isAuthenticated: Boolean(storedSession?.accessToken),
  user: storedSession?.user?.email ?? null,
  name: storedSession?.user?.name ?? null,
  role: storedSession?.user?.role ?? null,
  avatar: storedSession?.user?.avatar ?? null,
  address: storedSession?.user?.address ?? null,
  mobile: storedSession?.user?.mobile ?? null,
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
      state.avatar = action.payload.user.avatar ?? null;
      state.address = action.payload.user.address ?? null;
      state.mobile = action.payload.user.mobile ?? null;
    },
    logout: (state) => {
      clearSession();
      state.isAuthenticated = false;
      state.user = null;
      state.name = null;
      state.role = null;
      state.avatar = null;
      state.address = null;
      state.mobile = null;
    },
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.user = action.payload.email;
      state.role = action.payload.role;
      state.avatar = action.payload.avatar ?? null;
      state.address = action.payload.address ?? null;
      state.mobile = action.payload.mobile ?? null;

      const stored = getStoredSession();
      if (stored) {
        stored.user = action.payload;
        storeSession(stored);
      }
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
