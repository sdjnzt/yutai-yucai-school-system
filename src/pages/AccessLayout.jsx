import React from 'react';
import { Outlet } from 'react-router-dom';
import { SafetyOutlined } from '@ant-design/icons';

export default function AccessLayout() {
  return (
    <div>
      <div className="header">
        <h2 className="page-title"><SafetyOutlined /> 门禁管理</h2>
      </div>
      <Outlet />
    </div>
  );
} 