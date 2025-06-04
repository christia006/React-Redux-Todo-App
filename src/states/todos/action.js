import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { showErrorDialog } from '../../utils/tools';

export const ActionType = {
  GET_TODOS: 'GET_TODOS',
  ADD_TODO: 'ADD_TODO',
  DELETE_TODO: 'DELETE_TODO',
  DETAIL_TODO: 'DETAIL_TODO',
  EDIT_TODO: 'EDIT_TODO',
};

function getTodosFromStorage() {
  const todosJSON = localStorage.getItem('todos');
  if (!todosJSON) return [];
  try {
    return JSON.parse(todosJSON);
  } catch {
    return [];
  }
}

function saveTodosToStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

export function getTodosActionCreator(todos) {
  return {
    type: ActionType.GET_TODOS,
    payload: { todos },
  };
}

export function addTodoActionCreator(status) {
  return {
    type: ActionType.ADD_TODO,
    payload: { status },
  };
}

export function deleteTodoActionCreator(status) {
  return {
    type: ActionType.DELETE_TODO,
    payload: { status },
  };
}

export function detailTodoActionCreator(todo) {
  return {
    type: ActionType.DETAIL_TODO,
    payload: { todo },
  };
}

export function editTodoActionCreator(todo) {
  return {
    type: ActionType.EDIT_TODO,
    payload: { todo },
  };
}

export function asyncGetTodos(is_finished = '') {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      let todos = getTodosFromStorage();
      if (is_finished !== '') {
        todos = todos.filter(todo => String(todo.is_finished) === is_finished);
      }
      dispatch(getTodosActionCreator(todos));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

export function asyncAddTodo({ title, description }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const todos = getTodosFromStorage();
      const newTodo = {
        id: +new Date(),
        title,
        description,
        is_finished: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      todos.push(newTodo);
      saveTodosToStorage(todos);
      dispatch(addTodoActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

export function asyncDeleteTodo(id) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const todos = getTodosFromStorage();
      const newTodos = todos.filter(todo => todo.id !== id);
      saveTodosToStorage(newTodos);
      dispatch(deleteTodoActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

export function asyncDetailTodo(id) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const todos = getTodosFromStorage();
      const detail = todos.find(todo => todo.id === parseInt(id));
      dispatch(detailTodoActionCreator(detail));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}

export function asyncEditTodo(updatedTodo) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      let todos = getTodosFromStorage();
      todos = todos.map(todo =>
        todo.id === updatedTodo.id
          ? { ...todo, ...updatedTodo, updated_at: new Date().toISOString() }
          : todo
      );
      saveTodosToStorage(todos);

      // Kirim data todo terbaru lengkap dengan updated_at
      const updatedWithTimestamp = {
        ...updatedTodo,
        updated_at: new Date().toISOString(),
      };
      dispatch(editTodoActionCreator(updatedWithTimestamp));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(hideLoading());
  };
}
