import { hideLoading, showLoading } from 'react-redux-loading-bar';

import api from '../../utils/api';
import { setAuthLoginActionCreator } from '../authLogin/action';
const ActionType = {
SET_IS_PRELOAD: 'SET_IS_PRELOAD',
};
function setIsPreloadActionCreator(isPreload) {
return {
type: ActionType.SET_IS_PRELOAD,
payload: {
isPreload,
},
};
}
function asyncPreloadProcess() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const authUser = await api.getMe();
      dispatch(setAuthLoginActionCreator(authUser));
    } catch (error) {
      console.error(error);
      dispatch(setAuthLoginActionCreator(null));
    } finally {
      dispatch(setIsPreloadActionCreator(false)); // penting
      dispatch(hideLoading()); // HARUS DI SINI
    }
  };
}

export {
ActionType,
setIsPreloadActionCreator,
asyncPreloadProcess,
};