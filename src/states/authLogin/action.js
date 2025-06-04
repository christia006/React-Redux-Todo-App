import { showLoading, hideLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import { showErrorDialog } from '../../utils/tools';

const ActionType = {
  SET_AUTH_LOGIN: 'SET_AUTH_LOGIN',
  UNSET_AUTH_LOGIN: 'UNSET_AUTH_LOGIN',
  UPDATE_PROFILE_PICTURE: 'UPDATE_PROFILE_PICTURE',
};

function setAuthLoginActionCreator(authLogin) {
  return {
    type: ActionType.SET_AUTH_LOGIN,
    payload: { authLogin },
  };
}

function unsetAuthLoginActionCreator() {
  return {
    type: ActionType.UNSET_AUTH_LOGIN,
    payload: { authLogin: null },
  };
}

function updateProfilePictureActionCreator(avatarUrl) {
  return {
    type: ActionType.UPDATE_PROFILE_PICTURE,
    payload: { avatar: avatarUrl },
  };
}

function asyncSetAuthLogin({ email, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      // Ambil users dari localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];

      // Cek kecocokan email dan password
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Email atau password salah!');
      }

      // Simulasikan login berhasil
      const token = 'dummy_token'; // Bisa diganti dengan token asli dari API jika tersedia
      api.putAccessToken(token);

      // Pastikan user punya properti avatar (foto profil)
      const userWithAvatar = {
        ...user,
        avatar: user.avatar || 'https://example.com/default-avatar.png',
      };

      dispatch(setAuthLoginActionCreator(userWithAvatar));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

function asyncUnsetAuthLogin() {
  return (dispatch) => {
    dispatch(showLoading());
    dispatch(unsetAuthLoginActionCreator());
    api.putAccessToken('');
    dispatch(hideLoading());
  };
}

function asyncUpdateProfilePicture(avatarUrl) {
  return (dispatch, getState) => {
    dispatch(showLoading());
    try {
      // Ambil data user saat ini
      const { authLogin } = getState().auth;
      if (!authLogin) {
        throw new Error('User belum login');
      }

      // Update user dengan avatar baru
      const updatedUser = { ...authLogin, avatar: avatarUrl };

      // Update data di localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.map(user =>
        user.email === updatedUser.email ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update di redux state
      dispatch(updateProfilePictureActionCreator(avatarUrl));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

export {
  ActionType,
  setAuthLoginActionCreator,
  unsetAuthLoginActionCreator,
  updateProfilePictureActionCreator,
  asyncSetAuthLogin,
  asyncUnsetAuthLogin,
  asyncUpdateProfilePicture,
}; 