import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // 检查 token 是否存在且有效
  const isValidToken = token && token.startsWith('dummy-token-');
  
  if (!isValidToken) {
    // 清除无效的 token
    localStorage.clear();
    // 重定向到登录页面，保存当前路径
    return <Navigate to="login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 