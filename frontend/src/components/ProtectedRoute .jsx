import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, userRole, allowedRoles }) => {
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Nếu đã đăng nhập nhưng không có quyền, chuyển hướng đến trang không được phép
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/Error_403" />;
  }

  // Nếu thoả cả hai điều kiện, render nội dung
  return children;
};

export default ProtectedRoute;
