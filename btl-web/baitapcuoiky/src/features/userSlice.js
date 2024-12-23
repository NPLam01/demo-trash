import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    avatar: null,
    userData: {
      name: '',
      age: '',
      birthdate: '',
      email: '',
      phone: ''
    }
  },
  reducers: {
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    }
  }
});

export const { setAvatar, setUserData } = userSlice.actions;
export default userSlice.reducer;
