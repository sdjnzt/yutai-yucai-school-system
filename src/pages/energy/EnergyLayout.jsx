import React from 'react';
import { Outlet } from 'react-router-dom';

export default function EnergyLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
} 