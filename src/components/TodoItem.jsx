import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { postedAt } from '../utils/tools';
import { FaClock, FaTrash, FaPen } from "react-icons/fa6";
import { useState } from 'react';

function TodoItem({ todo, onDeleteTodo, onEditTodo }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedCover, setEditedCover] = useState(todo.cover || '');

  let badgeStatus, badgeLabel;
  if (todo.is_finished) {
    badgeStatus = 'badge bg-success text-white ms-3';
    badgeLabel = 'Selesai';
  } else {
    badgeStatus = 'badge bg-warning text-dark ms-3';
    badgeLabel = 'Belum Selesai';
  }

  const handleSaveEdit = () => {
    const updatedTodo = {
      ...todo,
      title: editedTitle,
      cover: editedCover,
    };
    onEditTodo(updatedTodo);
    setShowEdit(false);
  };

  return (
    <>
      <div className='card mt-3'>
        <div className='card-body'>
          <div className='row align-items-center'>
            <div className='col-8 d-flex flex-column flex-md-row align-items-md-center'>
              <h5>
                <Link to={`/todos/${todo.id}`} className='text-primary'>
                  {todo.title}
                </Link>
              </h5>
              <span className={badgeStatus + ' ms-md-3'}>
                {badgeLabel}
              </span>
            </div>
            <div className='col-4 text-end'>
              <button type='button' onClick={() => setShowEdit(true)} className='btn btn-sm btn-outline-primary me-2'>
                <FaPen /> Edit
              </button>
              <button type='button' onClick={() => {
                Swal.fire({
                  title: 'Hapus Todo',
                  text: `Apakah kamu yakin ingin menghapus todo: ${todo.title}?`,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Ya, Tetap Hapus',
                  customClass: {
                    confirmButton: 'btn btn-danger me-3 mb-4',
                    cancelButton: 'btn btn-secondary mb-4'
                  },
                  buttonsStyling: false
                }).then((result) => {
                  if (result.isConfirmed) {
                    onDeleteTodo(todo.id);
                  }
                });
              }} className='btn btn-sm btn-outline-danger'>
                <FaTrash /> Hapus
              </button>
            </div>
            <div className='col-12 mt-2'>
              <div className="text-sm text-muted">
                <FaClock />
                <span className='ps-2'>{postedAt(todo.created_at)}</span>
              </div>
            </div>
            {todo.cover && (
              <div className='col-12 mt-3'>
                <img src={todo.cover} alt="Todo Cover" className='img-fluid rounded' style={{ maxHeight: '200px' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      {showEdit && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Todo</h5>
                <button type="button" className="btn-close" onClick={() => setShowEdit(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Judul</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cover URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCover}
                    onChange={(e) => setEditedCover(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Batal</button>
                <button className="btn btn-primary" onClick={handleSaveEdit}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const todoItemShape = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  is_finished: PropTypes.number.isRequired,
  cover: PropTypes.string,
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
};

TodoItem.propTypes = {
  todo: PropTypes.shape(todoItemShape).isRequired,
  onDeleteTodo: PropTypes.func.isRequired,
  onEditTodo: PropTypes.func.isRequired,
};

export { todoItemShape };
export default TodoItem;
