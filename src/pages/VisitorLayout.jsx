import React from 'react';
import { Outlet } from 'react-router-dom';

export default function VisitorLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
} 