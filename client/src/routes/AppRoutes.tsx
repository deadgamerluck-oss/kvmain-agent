import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DemoPage } from '@/pages/DemoPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Primary Dedicated AI Agent Route */}
      <Route path="/" element={<DemoPage />} />
      <Route path="/demo" element={<DemoPage />} />

      {/* Redirect any other path straight into the AI Agent */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
