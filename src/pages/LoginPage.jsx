// File: src/pages/LoginPage.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginInput from '../components/LoginInput';
import { asyncSetAuthLogin } from '../states/authLogin/action';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authLogin = null } = useSelector((states) => states);

  const onAuthLogin = ({ email, password }) => {
    dispatch(asyncSetAuthLogin({ email, password }));
  };

  useEffect(() => {
    if (authLogin !== null) {
      navigate('/'); 
    }
  }, [authLogin, navigate]);

  return (
    <div className="container pt-2">
      <LoginInput onAuthLogin={onAuthLogin} />
    </div>
  );
}

export default LoginPage;