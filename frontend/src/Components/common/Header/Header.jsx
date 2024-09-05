/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { 
  UserIcon, 
  ArrowLeftStartOnRectangleIcon, 
  ArrowRightStartOnRectangleIcon, 
  HomeIcon,
  CubeTransparentIcon,
  SquaresPlusIcon 
} from '@heroicons/react/24/outline';

const NavLink = ({ to, icon: Icon, children, onClick }) => (
  <li>
    <Link
      to={to}
      className="text-gray-700 hover:text-blue-500 flex items-center"
      onClick={onClick}
    >
      <Icon className="w-5 h-5 mr-2" />
      {children}
    </Link>
  </li>
);

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
          <CubeTransparentIcon className="w-8 h-8 text-blue-600 mr-2" />
          BlockVote
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <NavLink to="/" icon={HomeIcon}>
              Home
            </NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" icon={SquaresPlusIcon}>
                  Dashboard
                </NavLink>
                <NavLink to="/profile" icon={UserIcon}>
                  Profile
                </NavLink>
                <NavLink to="/login" icon={ArrowLeftStartOnRectangleIcon} onClick={handleLogout}>
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" icon={ArrowRightStartOnRectangleIcon}>
                  Login
                </NavLink>
                <NavLink to="/register" icon={UserIcon}>
                  Register
                </NavLink>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
