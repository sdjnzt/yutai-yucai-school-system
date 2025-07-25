import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import App from './App';
import 'antd/dist/reset.css';
import './styles/global.css';
import './index.css';

// 设置 dayjs 语言为中文
dayjs.locale('zh-cn');

// 开发环境下启用 Mock
if (import.meta.env.MODE === 'development') {
  import('./mock');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </React.StrictMode>,
);
