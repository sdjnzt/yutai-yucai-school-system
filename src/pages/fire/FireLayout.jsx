import React from 'react';
import { Outlet } from 'react-router-dom';

export default function FireLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
} 