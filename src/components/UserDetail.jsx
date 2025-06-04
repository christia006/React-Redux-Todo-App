import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/tools';
import { FaUpload } from 'react-icons/fa6';

function UserDetail({ authLogin, onUserUpdate }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoLocal, setPhotoLocal] = useState('');

  // Saat komponen mount, cek apakah ada foto di localStorage
  useEffect(() => {
    const storedPhoto = localStorage.getItem('userPhoto');
    if (storedPhoto) {
      setPhotoLocal(storedPhoto);
    }
  }, []);

  // Handler upload file: baca file jadi base64 dan simpan ke localStorage
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setError('');
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result; // base64 string
        try {
          localStorage.setItem('userPhoto', base64);
          setPhotoLocal(base64);

          // Update user photo di parent juga (opsional)
          if (typeof onUserUpdate === 'function') {
            onUserUpdate({
              ...authLogin,
              photo: base64,
            });
          }
        } catch (e) {
          setError('Gagal menyimpan foto di localStorage');
        }
        setLoading(false);
      };

      reader.onerror = () => {
        setError('Gagal membaca file foto');
        setLoading(false);
      };

      reader.readAsDataURL(file); // baca file jadi base64
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset input supaya bisa upload file sama lagi
      fileInputRef.current.click();
    }
  };

  return (
    <div id={`user-${authLogin.id}`} className="card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-12">
            <div className="d-flex align-items-center">
              <div>
                <img
                  className="rounded-circle"
                  width={76}
                  height={76}
                  src={photoLocal || authLogin.photo || '/default-profile.png'}
                  alt="User Profile"
                  onError={(e) => { e.target.src = '/default-profile.png'; }}
                />
              </div>
              <div className="ms-3">
                <h3 className="text-primary">{authLogin.name}</h3>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleUploadClick}
                  disabled={loading}
                  type="button"
                >
                  <FaUpload /> {loading ? 'Mengunggah...' : 'Ubah Foto Profil'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {error && <div className="text-danger mt-2">{error}</div>}
              </div>
            </div>
            <hr />
            <table className="table table-bordered mt-3">
              <tbody>
                <tr>
                  <th>Nama</th>
                  <td>{authLogin.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{authLogin.email}</td>
                </tr>
                <tr>
                  <th>Bergabung sejak</th>
                  <td>{formatDate(authLogin.created_at)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const authLoginShape = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  photo: PropTypes.string,
  created_at: PropTypes.string.isRequired,
};

UserDetail.propTypes = {
  authLogin: PropTypes.shape(authLoginShape).isRequired,
  onUserUpdate: PropTypes.func,
};

export { authLoginShape };
export default UserDetail;
