import React from 'react';
import { Outlet } from 'react-router-dom';
import { CarOutlined } from '@ant-design/icons';

export default function ParkingLayout() {
  return (
    <div>
      <div className="header">
        <h2 className="page-title"><CarOutlined /> 停车管理</h2>
      </div>
      <Outlet />
    </div>
  );
} 