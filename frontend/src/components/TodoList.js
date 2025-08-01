import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/todos', config);
      if (response.data.Status === 'Success') {
        setTodos(response.data.todos);
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create todo
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const response = await axios.post('http://localhost:8081/todos', newTodo, config);
      if (response.data.Status === 'Success') {
        setNewTodo({ title: '', description: '' });
        fetchTodos();
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  // Update todo
  const handleUpdateTodo = async (todo) => {
    try {
      const response = await axios.put(`http://localhost:8081/todos/${todo.id}`, todo, config);
      if (response.data.Status === 'Success') {
        setEditingTodo(null);
        fetchTodos();
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      const response = await axios.delete(`http://localhost:8081/todos/${id}`, config);
      if (response.data.Status === 'Success') {
        fetchTodos();
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  // Toggle todo completion
  const handleToggleComplete = async (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await handleUpdateTodo(updatedTodo);
  };

  if (loading) {
    return <div className="text-center mt-4">Loading todos...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Todo List</h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Create Todo Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Todo</h5>
          <form onSubmit={handleCreateTodo}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Todo title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Description (optional)"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                rows="2"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Todo
            </button>
          </form>
        </div>
      </div>

      {/* Todo List */}
      <div className="row">
        {todos.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">No todos yet. Create your first todo!</div>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="col-12 mb-3">
              <div className={`card ${todo.completed ? 'border-success' : ''}`}>
                <div className="card-body">
                  {editingTodo?.id === todo.id ? (
                    // Edit Mode
                    <div>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editingTodo.title}
                        onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                      />
                      <textarea
                        className="form-control mb-2"
                        value={editingTodo.description}
                        onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                        rows="2"
                      />
                      <div className="btn-group">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdateTodo(editingTodo)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingTodo(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h5 className={`card-title ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                            {todo.title}
                          </h5>
                          {todo.description && (
                            <p className={`card-text ${todo.completed ? 'text-muted' : ''}`}>
                              {todo.description}
                            </p>
                          )}
                          <small className="text-muted">
                            Created: {new Date(todo.created_at).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="btn-group ms-2">
                          <button
                            className={`btn btn-sm ${todo.completed ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleToggleComplete(todo)}
                            title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {todo.completed ? '✓' : '○'}
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setEditingTodo(todo)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteTodo(todo.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList; 