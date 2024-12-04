import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-red-500">404 - Không tìm thấy</h1>
      <p className="text-gray-600 mt-4">
        Xin lỗi, chúng tôi không tìm thấy trang bạn đang tìm kiếm.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Về Trang Chủ
      </Link>
    </div>
  );
};

export default NotFound;
