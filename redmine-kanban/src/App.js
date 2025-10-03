import React, { useState } from 'react';
import './App.css';
import KanbanBoard from './components/KanbanBoard';
import Login from './components/Login';
import { initApi } from './services/redmine';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (apiKey) => {
    initApi(apiKey);
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <h1>Redmine Kanban Board</h1>
          <KanbanBoard />
        </>
      )}
    </div>
  );
}

export default App;