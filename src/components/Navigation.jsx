import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaPlus, FaUser, FaRightFromBracket } from 'react-icons/fa6';
import React, { useState, useEffect } from 'react';

function Navigation({ authLogin, onAuthSignOut }) {
  const { id, name } = authLogin;

  const [photo, setPhoto] = useState(authLogin.photo);

  // Sync photo dari localStorage jika ada, agar otomatis update
  useEffect(() => {
    const storedPhoto = localStorage.getItem('userPhoto');
    if (storedPhoto) {
      setPhoto(storedPhoto);
    } else {
      setPhoto(authLogin.photo);
    }

    // Optional: listen perubahan localStorage dari tab lain
    const handleStorageChange = (event) => {
      if (event.key === 'userPhoto') {
        setPhoto(event.newValue || authLogin.photo);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [authLogin.photo]);

  const handleDropdownClick = (e) => e.preventDefault();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Todo App</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navApp"
          aria-controls="navApp"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navApp">
          <ul className="navbar-nav ms-auto">
            <li className="mt-2">
              <Link className="btn btn-light btn-sm text-dark" to="/todos/add">
                <FaPlus /> Buat Todo
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link mx-2 dropdown-toggle"
                href="#"
                id="navUser"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleDropdownClick}
              >
                <img
                  className="nav-profile"
                  src={photo || '/default-profile.png'}
                  alt={id}
                  title={name}
                  onError={(e) => { e.target.src = '/default-profile.png'; }}
                />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navUser">
                <li>
                  <Link className="dropdown-item" to="/users/me">
                    <FaUser /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={onAuthSignOut}
                  >
                    <FaRightFromBracket /> Sign out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

const authLoginShape = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
};

Navigation.propTypes = {
  authLogin: PropTypes.shape(authLoginShape).isRequired,
  onAuthSignOut: PropTypes.func.isRequired,
};

export default Navigation;
