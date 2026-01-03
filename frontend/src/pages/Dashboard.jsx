import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user.username} 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here’s a snapshot of your account information.
        </p>

        {/* Profile Card */}
        <div className="mt-8 bg-white shadow-sm rounded-xl p-6 border">
          <div className="flex items-center gap-4">
            {user.picture ? (
              <img
                src={user.picture}
                alt="profile"
                className="h-16 w-16 rounded-full border object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Add your dashboard content here */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Your Activity</h3>
          <p className="text-gray-600 mt-2">More dashboard widgets coming soon...</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
