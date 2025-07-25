import React from 'react';
import { Outlet } from 'react-router-dom';
import { BankOutlined } from '@ant-design/icons';

export default function OfficeLayout() {
  return (
    <div>
      <div className="header">
        <h2 className="page-title"><BankOutlined /> 办公管理</h2>
      </div>
      <Outlet />
    </div>
  );
} 