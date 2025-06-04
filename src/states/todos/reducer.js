import { ActionType } from './action';

function todosReducer(todos = [], action = {}) {
  switch (action.type) {
    case ActionType.GET_TODOS:
      return action.payload.todos;

    case ActionType.EDIT_TODO:
      // update todo di array sesuai id yang diedit
      return todos.map(todo =>
        todo.id === action.payload.todo.id
          ? { ...todo, ...action.payload.todo }
          : todo
      );

    default:
      return todos;
  }
}

function isAddTodoReducer(status = false, action = {}) {
  switch (action.type) {
    case ActionType.ADD_TODO:
      return action.payload.status;
    default:
      return status;
  }
}

function isDeleteTodoReducer(status = false, action = {}) {
  switch (action.type) {
    case ActionType.DELETE_TODO:
      return action.payload.status;
    default:
      return status;
  }
}

function detailTodoReducer(todo = null, action = {}) {
  switch (action.type) {
    case ActionType.DETAIL_TODO:
      return action.payload.todo;
    default:
      return todo;
  }
}

export {
  todosReducer,
  isAddTodoReducer,
  isDeleteTodoReducer,
  detailTodoReducer
};
