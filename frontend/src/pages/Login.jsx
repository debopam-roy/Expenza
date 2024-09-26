import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../graphql/mutations/users.mutation';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginUser] = useMutation(LOGIN_USER);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSigninData = async (event) => {
        event.preventDefault();
        setIsLoggingIn(true);

        try {
            const response = await loginUser({
                variables: {
                    userDetails: {
                        email,
                        password,
                    },
                },
            });
            if (response && response.data) {
                const accessToken = response.data['loginUser'];
                localStorage.setItem('access_token', accessToken);
                setEmail('');
                setPassword('');
                toast.success('Login Successful');
            } else {
                toast.error('Login Unsuccessful');
            }
        } catch (err) {
            console.error('Error during login:', err);
            toast.error(err.message || 'Login Unsuccessful');
        } finally {
            setIsLoggingIn(false);
        }
    };
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div
                id="cardContainer"
                className="p-8 bg-cardBackgroundColor-light dark:bg-cardBackgroundColor-dark rounded-lg shadow-lg sm:w-full sm:max-w-md"
            >
                <div className="text-left">
                    <h2 className="text-4xl font-extrabold font-libre_baskerville text-headlineColor-light dark:text-headlineColor-dark">
                        Sign In
                    </h2>
                    <p className="mt-3 text-base text-suggestionColor-light dark:text-suggestionColor-dark">
                        Welcome back. We're glad to see you again!
                    </p>
                </div>

                <form
                    id="signin"
                    className="space-y-10"
                    onSubmit={handleSigninData}
                >
                    <div className="flex flex-col mt-8 space-y-4">
                        <div>
                            <label
                                htmlFor="email_address"
                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                            >
                                Email Address
                            </label>
                            <input
                                required
                                type="email"
                                id="email_address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex: john.doe@mail.com"
                                className="w-full mt-1 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2 
                                  text-suggestionColor-light dark:text-suggestionColor-dark
                                  focus:ring-textInputRingColor-light dark:focus:ring-textInputRingColor-dark"
                                disabled={isLoggingIn}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                >
                                    Password
                                </label>
                                <span
                                    onClick={
                                        !isLoggingIn
                                            ? togglePasswordVisibility
                                            : undefined
                                    }
                                    className={`text-sm text-buttonHoverColor-light dark:text-buttonHoverColor-light ${isLoggingIn ? 'cursor-not-allowed' : 'cursor-pointer'} hover:text-buttonHoverColor-light dark:hover:text-buttonHoverColor-dark`}
                                    disabled={isLoggingIn}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </div>
                            <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ex: password@123"
                                className="w-full mt-1 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2 
                                  text-suggestionColor-light dark:text-suggestionColor-dark
                                  focus:ring-textInputRingColor-light dark:focus:ring-textInputRingColor-dark"
                                disabled={isLoggingIn}
                            />
                        </div>
                    </div>

                    <button
                        id="login-button"
                        type="submit"
                        className={`w-full py-3 bg-buttonColor-light dark:bg-buttonColor-light uppercase hover:bg-buttonHoverColor-light dark:hover:bg-buttonHoverColor-dark ${isLoggingIn ? 'cursor-not-allowed' : 'cursor-pointer'} font-semibold rounded-md shadow-md transition duration-300 text-headlineColor-dark`}
                        disabled={isLoggingIn}
                    >
                        Submit
                    </button>

                    <p className="text-center">
                        Don't have an account?{' '}
                        {isLoggingIn ? (
                            <span
                                className={`text-buttonHoverColor-light dark:text-buttonHoverColor-light cursor-not-allowed`}
                            >
                                <u>Register Here</u>
                            </span>
                        ) : (
                            <Link
                                className={`text-buttonHoverColor-light dark:text-buttonHoverColor-light cursor-pointer hover:text-buttonHoverColor-light dark:hover:text-buttonHoverColor-dark`}
                                to="/register"
                            >
                                <u>Register Here</u>
                            </Link>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
