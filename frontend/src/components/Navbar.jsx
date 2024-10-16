import React from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { LOGOUT_USER } from '../graphql/mutations/users.mutation';

const Navbar = () => {
    const navigate = useNavigate();
    const [logoutUser] = useMutation(LOGOUT_USER); // Using the mutation here

    // Logout handler
    const handleLogout = async () => {
        try {
            const { data } = await logoutUser(); // Execute the mutation and wait for the response
            if (data?.logoutUser !== '') {
                throw new Error('Logout failed.');
            }
            toast.success('Logged out successfully');
            // Redirect to login page
            navigate('/login');
        } catch (error) {
            toast.error('Failed to log out');
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="flex justify-between items-center px-10 py-3 bg-cardBackgroundColor-light dark:bg-cardBackgroundColor-dark shadow-xl">
            {/* Logo */}
            <div className="text-xl font-libre_baskerville text-suggestionColor-light dark:text-suggestionColor-dark">
                Expenza
            </div>

            {/* Right section: Mode toggle, Profile, and Logout */}
            <div className="flex items-center space-x-4">
                <div className="relative group">
                    <img
                        src={
                            // user?.getUser.user.profile_picture ||
                            'https://avatar.iran.liara.run/public/boy?username=random'
                        }
                        alt="Profile"
                        className="w-5 h-5 rounded-full cursor-pointer"
                    />
                    <span className="absolute bottom-10 left-1 opacity-0 group-hover:opacity-100 bg-suggestionColor-light dark:bg-suggestionColor-dark text-white text-xs py-1 px-2 rounded-md transition-opacity duration-300">
                        {
                            // user?.getUser.user.name ||
                            'Anonymous'
                        }{' '}
                    </span>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center text-red-500"
                >
                    <AiOutlineLogout className="text-xl" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
