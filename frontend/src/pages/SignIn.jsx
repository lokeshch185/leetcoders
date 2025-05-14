import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signin`, {
                username,
                password,
            });
            const { message, token, data } = response.data;
            setMessage(message);
            if (rememberMe) {
                localStorage.setItem('token', token);
                localStorage.setItem('userData', JSON.stringify(data));
            } else {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('userData', JSON.stringify(data));
            }
            navigate('/userPage');
        } catch (error) {
            setMessage('Sign-in failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signup`, {
                name,
                username,
                email,
                password,
            });
            setMessage(response.data.message);
            setIsRegister(false);
        } catch (error) {
            setMessage('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRememberMe = (event) => {
        setRememberMe(event.target.checked);
    };

    return (
        <section className="flex items-center bg-gray-100 rounded-lg justify-center">
            <div className="flex w-full max-w-lg overflow-hidden rounded-lg space-y-6">
                <div className="w-full">
                    <div className="bg-blue-100 border-l-4 w-full border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-md mt-5">
                        <p className=""><span className="font-semibold">Note:</span> Please use your own leetcode username to register/signin.</p>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 text-center">
                        Leetcoders
                    </h1>
                    {message && <p className="text-center text-red-500">{message}</p>}

                    <form onSubmit={isRegister ? handleRegister : handleSignIn} className="space-y-2">
                        {isRegister && (
                            <>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                                placeholder="Leetcode username"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {!isRegister && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={handleRememberMe}
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-primary-300"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => alert('Forgot Password functionality coming soon!')}
                                    className="text-sm text-black font-medium text-primary-600 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}
                        <div className="flex flex-col items-center">
                            <button
                                type="submit"
                                className="w-content text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                disabled={loading}
                            >
                                {loading ?
                                    <div className="text-center my-4">
                                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                                    </div>
                                    : isRegister ? 'Sign up' : 'Sign in'}
                            </button>

                        </div>

                        <p className="text-sm font-light text-gray-600 text-center">
                            {isRegister ? (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsRegister(false)}
                                        className="font-medium text-primary-600 hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don’t have an account yet?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsRegister(true)}
                                        className="font-medium text-primary-600 hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SignIn;
