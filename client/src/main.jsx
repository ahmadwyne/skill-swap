// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  // Import the Redux provider
import './index.css';  // Global CSS file
import App from './App.jsx';  // Import the App component
import store from './redux/store';  // Import the Redux store
import '@fortawesome/fontawesome-free/css/all.min.css';


if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>  {/* Wrap App component with Redux Provider */}
      <App />
    </Provider>
  </StrictMode>
);