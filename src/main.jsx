import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import 'antd/dist/reset.css';
import './styles/global.css';
import './index.css';

// 开发环境下启用 Mock
if (import.meta.env.MODE === 'development') {
  import('./mock');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
