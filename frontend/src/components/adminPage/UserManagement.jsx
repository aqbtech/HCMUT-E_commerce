// UserManagement.js
import { useState, useEffect } from "react";
import axios from "axios";
import Title from "../Title";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user");
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    }; 
    fetchUsers();
  }, []);

  const updateUserStatus = async (userId, status) => {
    try {
      await axios.patch(`http://localhost:3000/user/${userId}`, { status });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const toggleUserStatus = (userId, status) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status } : user)));
    updateUserStatus(userId, status);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        <Title text1="Quản Lý" text2="Người Bán" />
      </h2>
      <table className="w-full border border-gray-300">
        {/* Table Headers */}
        <thead>
          <tr>
            <th className="p-2 border-b text-left">Tên</th>
            <th className="p-2 border-b text-left">Email</th>
            <th className="p-2 border-b text-left">Số điện thoại</th>
            <th className="p-2 border-b text-left">Vai trò</th>
            <th className="p-2 border-b text-left">Trạng thái</th>
            <th className="p-2 border-b text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border-b">{`${user.Hovatendem} ${user.ten}`}</td>
              <td className="p-2 border-b">{user.email}</td>
              <td className="p-2 border-b">{user.sdt}</td>
              <td className="p-2 border-b">
                {user.role === "b" ? "Buyer" : user.role === "s" ? "Seller" : "Admin"}
              </td>
              <td className="p-2 border-b">{user.status ? "Hoạt động" : "Đã chặn"}</td>
              <td className="p-2 border-b">
                <button
                  className={`px-4 py-2 rounded ${user.status ? "bg-gray-400" : "bg-red-400"} hover:bg-black hover:text-white`}
                  onClick={() => toggleUserStatus(user.id, user.status ? 0 : 1)}
                >
                  {user.status ? "Chặn" : "Gỡ Chặn"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
