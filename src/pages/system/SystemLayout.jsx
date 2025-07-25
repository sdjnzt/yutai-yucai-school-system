import React from 'react';
import { Outlet } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';

export default function SystemLayout() {
  return (
    <div>
      <div className="header">
        <h2 className="page-title"><SettingOutlined /> 系统管理</h2>
      </div>
      <Outlet />
    </div>
  );
} 