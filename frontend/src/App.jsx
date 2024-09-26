import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';

const App = () => {
    const getInitialMode = () => {
        const userPreference = localStorage.getItem('theme');
        return (
            userPreference ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light')
        );
    };

    const [mode, setMode] = useState(getInitialMode);
    const [theme, setTheme] = useState(mode === 'dark' ? '🌙' : '☀️');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        setTheme(mode === 'dark' ? '🌙' : '☀️');
    }, [mode]);

    const toggleTheme = () => {
        const newTheme = mode === 'dark' ? 'light' : 'dark';
        setMode(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        success: {
                            style: {
                                background:
                                    mode === 'dark' ? '#1F2937' : '#FFFFFF',
                                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                                boxShadow: '0 0 10px rgba(82, 109, 130, 0.7)',
                            },
                        },
                        error: {
                            style: {
                                background:
                                    mode === 'dark' ? '#1F2937' : '#FFFFFF',
                                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                                boxShadow: '0 0 10px rgba(82, 109, 130, 0.7)',
                            },
                        },
                    }}
                />
            </div>
            <Router>
                <div
                    className={`min-h-screen bg-backgroundColor-light dark:bg-backgroundColor-dark text-textColor-dark dark:text-textColor-light font-poppins`}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>

                    <button
                        id="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
                        className="fixed bottom-5 right-5 px-3 py-2 text-2xl rounded-xl shadow-lg bg-cardBackgroundColor-light dark:bg-cardBackgroundColor-dark transition-colors duration-300 ease-in-out"
                    >
                        {theme}
                    </button>
                </div>
            </Router>
        </>
    );
};

export default App;
