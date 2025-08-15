import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IAuthInfo } from '../../models';
import { ROLES, STORAGE_KEYS } from '../../constants';

const initialState: IAuthInfo = {
  user: {
    email: '',
    role: ROLES.ADMIN,
  },
  accessToken: sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || '',
  refreshToken: sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || '',
  expiresIn: Number(sessionStorage.getItem(STORAGE_KEYS.EXPIRES_IN) || 0),
};

export const authSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthInfo: (state, action: PayloadAction<IAuthInfo>) => {
      return { ...state, ...action.payload };
    },
    resetAuthInfo: (_state) => ({
      user: {
        email: '',
        role: '',
      },
      accessToken: '',
      refreshToken: '',
      expiresIn: 0,
    }),
  },
});

export const { setAuthInfo, resetAuthInfo } = authSlice.actions;
export default authSlice.reducer;
