import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bed, LogIn, LogOut, UserCircle, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Bed className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">StayBooker</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <UserCircle className="h-6 w-6" />
                  <span className="text-gray-800">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/register"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;