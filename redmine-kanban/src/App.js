import React, { useState } from 'react';
import './App.css';
import KanbanBoard from './components/KanbanBoard';
import Login from './components/Login';
import { initApi } from './services/redmine';

function App() {
  const [credentials, setCredentials] = useState(null);

  const handleLogin = (creds) => {
    initApi(creds.url, creds.apiKey);
    setCredentials(creds);
  };

  return (
    <div className="App">
      {!credentials ? (
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