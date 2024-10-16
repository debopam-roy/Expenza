import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { REGISTER_USER } from '../graphql/mutations/users.mutation';
import { GET_USER } from '../graphql/queries/users.queries';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [gender, setGender] = useState('Male');
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const available_genders = ['Male', 'Female', 'Others'];
    const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSignupData = async (event) => {
        event.preventDefault();
        setIsRegistering(true);

        try {
            const response = await registerUser({
                variables: {
                    userDetails: {
                        name,
                        email,
                        gender,
                        password,
                        phone: `${countryCode}${phone}`,
                    },
                },
            });
            if (response && response.data) {
                const access_token = response.data['registerUser'];
                setName('');
                setEmail('');
                setPassword('');
                setPhone('');
                setGender('Male');
                toast.success('Registration Successful');
                navigate('/');
            } else {
                toast.error('Registration Unsuccessful');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            toast.error(`Registration Unsuccessful`);
        } finally {
            setIsRegistering(false);
        }
    };

    const { loading: userLoading, data: userData } = useQuery(GET_USER);

    useEffect(() => {
        if (userData && userData.getUser) {
            if (userData?.getUser.authenticated) {
                navigate('/');
            }
        }
    }, [userData]);

    return (
        <div className="min-h-screen flex items-center justify-center mx-4 md:mx-2">
            <div
                id="cardContainer"
                className="p-8 bg-cardBackgroundColor-light dark:bg-cardBackgroundColor-dark rounded-lg shadow-lg sm:w-full sm:max-w-md"
            >
                <div className="text-left">
                    <h2 className="text-4xl font-extrabold font-libre_baskerville text-headlineColor-light dark:text-headlineColor-dark">
                        Sign Up
                    </h2>
                    <p className="mt-3 text-base text-suggestionColor-light dark:text-suggestionColor-dark">
                        Let’s get you started. Your journey starts here!
                    </p>
                </div>

                <form
                    id="signup"
                    className="space-y-10"
                    onSubmit={handleSignupData}
                >
                    <div className="flex flex-col mt-8 space-y-4">
                        <div>
                            <label
                                htmlFor="full_name"
                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                            >
                                Full Name
                            </label>
                            <input
                                required
                                type="text"
                                id="full_name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: John Doe"
                                className="w-full mt-1 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2 text-suggestionColor-light dark:text-suggestionColor-dark focus:ring-textInputRingColor-light dark:focus:ring-textInputRingColor-dark"
                                disabled={isRegistering}
                            />
                        </div>

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
                                className="w-full mt-1 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2 text-suggestionColor-light dark:text-suggestionColor-dark focus:ring-textInputRingColor-light dark:focus:ring-textInputRingColor-dark"
                                disabled={isRegistering}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone_number"
                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                            >
                                Phone Number
                            </label>
                            <div className="flex space-x-2 mt-1">
                                <input
                                    type="tel"
                                    id="country_code"
                                    placeholder="+91"
                                    value={countryCode}
                                    onChange={(e) =>
                                        setCountryCode(e.target.value)
                                    }
                                    pattern="^\+\d{1,4}$"
                                    className="w-1/5 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2 text-suggestionColor-light dark:text-suggestionColor-dark focus:ring-textInputRingColor-light dark:focus:ring-textInputRingColor-dark"
                                    disabled={isRegistering}
                                />
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="1234567890"
                                    pattern="\d{5}\s?\d{5}"
                                    className="w-4/5 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2 text-suggestionColor-light dark:text-suggestionColor-dark focus:ring-textInputRingColor-light dark:focus:ring-textInputRingColor-dark"
                                    disabled={isRegistering}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="gender"
                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                            >
                                Gender
                            </label>

                            <div className="mt-1 pe-4 py-2 flex justify-between space-x-2">
                                {available_genders.map((item) => (
                                    <label
                                        key={item}
                                        className={`inline-flex items-center ${isRegistering ? 'cursor-auto' : 'cursor-pointer'}r mt-1 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2`}
                                        disabled={isRegistering}
                                    >
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={gender === item}
                                            onChange={() => setGender(item)}
                                            className="form-radio"
                                            disabled={isRegistering}
                                        />
                                        <span className="ml-2 block font-medium text-suggestionColor-light dark:text-suggestionColor-dark">
                                            {item}
                                        </span>
                                    </label>
                                ))}
                            </div>
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
                                        !isRegistering
                                            ? togglePasswordVisibility
                                            : undefined
                                    }
                                    className={`text-sm text-buttonHoverColor-light dark:text-buttonHoverColor-light ${isRegistering ? 'cursor-not-allowed' : 'cursor-pointer'} hover:text-buttonHoverColor-light dark:hover:text-buttonHoverColor-dark`}
                                    disabled={isRegistering}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ex: password@123"
                                className="w-full mt-1 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2 text-suggestionColor-light dark:text-suggestionColor-dark focus:ring-textInputRingColor-light dark:focus:ring-textInputRingColor-dark"
                                disabled={isRegistering}
                            />
                        </div>
                    </div>

                    <button
                        id="register-button"
                        type="submit"
                        className={`w-full py-3 bg-buttonColor-light dark:bg-buttonColor-light uppercase hover:bg-buttonHoverColor-light dark:hover:bg-buttonHoverColor-dark ${isRegistering ? 'cursor-not-allowed' : 'cursor-pointer'} font-semibold rounded-md shadow-md transition duration-300 text-headlineColor-dark`}
                        disabled={isRegistering}
                    >
                        Submit
                    </button>
                    <p className="text-center">
                        Already have an account?{' '}
                        {isRegistering ? (
                            <span
                                className={`text-buttonHoverColor-light dark:text-buttonHoverColor-light cursor-not-allowed`}
                            >
                                <u>Login Here</u>
                            </span>
                        ) : (
                            <Link
                                className={`text-buttonHoverColor-light dark:text-buttonHoverColor-light cursor-pointer hover:text-buttonHoverColor-light dark:hover:text-buttonHoverColor-dark`}
                                to="/login"
                            >
                                <u>Login Here</u>
                            </Link>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
