const api = (() => {
  const BASE_URL = 'https://public-api.delcom.org/api/v1';

  function putAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }

  function getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Helper untuk handle response dan error
  async function _handleResponse(response) {
    let responseJson;
    try {
      responseJson = await response.json();
    } catch {
      throw new Error('Invalid JSON response from server');
    }

    const { success, message, data } = responseJson;

    if (!success) {
      throw new Error(message || 'Request failed');
    }

    return data || message;
  }

  // Fetch yang otomatis pakai Authorization token
  async function _fetchWithAuth(url, options = {}) {
    const token = getAccessToken();
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorResponse = await response.json();
        if (errorResponse.message) {
          errorMessage = errorResponse.message;
        }
      } catch {
        // Ignore JSON parsing error
      }
      throw new Error(errorMessage);
    }

    return response;
  }

  // AUTH

  async function postAuthRegister({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    return _handleResponse(response);
  }

  async function postAuthLogin({ email, password }) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await _handleResponse(response);

   
    if (data.token) {
      putAccessToken(data.token);
    }

    return data.token;
  }

  async function getMe() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`);
    return _handleResponse(response);
  }

  async function postChangePhotoProfile({ photoFile }) {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await _fetchWithAuth(`${BASE_URL}/users/photo`, {
      method: 'POST',
      body: formData,
    });

    return _handleResponse(response);
  }

  // TODOS

  async function postAddTodo({ title, description }) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    const data = await _handleResponse(response);
    return data.todo_id;
  }

  async function postChangeCoverTodo({ id, cover }) {
    const formData = new FormData();
    formData.append('cover', cover);

    const response = await _fetchWithAuth(`${BASE_URL}/todos/${id}/cover`, {
      method: 'POST',
      body: formData,
    });

    return _handleResponse(response);
  }

  async function putUpdateTodo({ id, title, description, is_finished }) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, is_finished }),
    });

    const data = await _handleResponse(response);
    return data.todo_id;
  }

  async function deleteTodo(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    return _handleResponse(response);
  }

  async function getAllTodos(is_finished) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos?is_finished=${is_finished}`);
    const data = await _handleResponse(response);
    return data.todos;
  }

  async function getDetailTodo(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/todos/${id}`);
    const data = await _handleResponse(response);
    return data.todo;
  }

  return {
    putAccessToken,
    getAccessToken,
    postAuthRegister,
    postAuthLogin,
    getMe,
    postChangePhotoProfile,
    postAddTodo,
    postChangeCoverTodo,
    putUpdateTodo,
    deleteTodo,
    getAllTodos,
    getDetailTodo,
  };
})();

export default api;   