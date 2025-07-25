import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MaintenanceLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
} 