import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey) {
      onLogin(apiKey);
    }
  };

  return (
    <div className="login-container">
      <h2>Connect to Redmine</h2>
      <form onSubmit={handleSubmit}>
        <label>
          API Key:
          <input
            type="password" // Use password type to obscure the key
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your Redmine API Key"
            required
          />
        </label>
        <button type="submit">Connect</button>
      </form>
    </div>
  );
};

export default Login;