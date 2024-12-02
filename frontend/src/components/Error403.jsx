import { Link } from "react-router-dom";


const Error403 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold text-red-500">403 - Truy cập bị từ chối</h1>
            <p className="text-gray-600 mt-4">
                Xin lỗi, bạn không có quyền truy cập vào trang này.
            </p>
            <Link
                to="/"
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Về Trang Chủ
            </Link>
        </div>
    );
}

export default Error403
