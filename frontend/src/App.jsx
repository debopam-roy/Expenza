import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Navigate
import { useQuery } from '@apollo/client';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import { AiOutlineSun, AiOutlineMoon } from 'react-icons/ai';
import { GET_USER } from './graphql/queries/users.queries';

const App = () => {
    const getInitialMode = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        } else {
            const prefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches;
            return prefersDark ? 'dark' : 'light';
        }
    };

    const [mode, setMode] = useState(getInitialMode);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    const { loading: userLoading, data: userData } = useQuery(GET_USER);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        localStorage.setItem('theme', mode);
    }, [mode]);

    if (userLoading) return <div>Loading...</div>; // Handle loading state

    return (
        <>
            <Toaster position="top-right" />
            <Router>
                <div className="min-h-screen bg-backgroundColor-light dark:bg-backgroundColor-dark text-textColor-dark dark:text-textColor-light font-poppins">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </Router>

            {/* Floating Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="fixed bottom-4 right-4 p-3 rounded-full bg-cardBackgroundColor-light dark:bg-cardBackgroundColor-dark"
                aria-label="Toggle Theme"
            >
                {mode === 'dark' ? (
                    <AiOutlineSun className="text-black dark:text-white" />
                ) : (
                    <AiOutlineMoon className="text-black dark:text-white" />
                )}
            </button>
        </>
    );
};

export default App;
