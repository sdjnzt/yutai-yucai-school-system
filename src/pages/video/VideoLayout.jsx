import React from 'react';
import { Outlet } from 'react-router-dom';
import { VideoCameraOutlined } from '@ant-design/icons';

export default function VideoLayout() {
  return (
    <div>
      <div className="header">
        <h2 className="page-title"><VideoCameraOutlined /> 视频监控</h2>
      </div>
      <Outlet />
    </div>
  );
} 