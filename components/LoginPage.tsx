
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
    onSwitchToSignUp: () => void;
}

const Logo = () => (
    <div className="flex items-center justify-center space-x-3">
        <svg width="48" height="48" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            <circle cx="128" cy="128" r="120" stroke="url(#logo-gradient)" strokeWidth="16"/>
            <path d="M101.812 73.6667C104.281 68.6667 111.417 65.3333 117.25 68C132.25 74.8333 125.75 96.6667 122.25 106.5C117.25 121.5 118.917 141.5 131.25 152.5C144.25 164.167 155.25 164 163.75 162.5C175.75 160.5 186.25 174.667 181.75 185.5C178.688 192.833 170.917 195.167 164.75 192C149.25 185.167 155.25 163.333 158.75 153.5C163.75 138.5 162.083 118.5 149.75 107.5C136.75 95.8333 125.75 96 117.25 97.5C105.25 99.5 94.75 85.3333 99.25 74.5L101.812 73.6667Z" fill="url(#logo-gradient)"/>
        </svg>
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-indigo-600">
            Scriptoria
        </h1>
    </div>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="max-w-md w-full text-center">
                <Logo />
                <p className="mt-2 text-lg text-gray-400">The Intelligent Film Production Assistant</p>
            </div>

            <div className="max-w-sm w-full mt-10 bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-2xl shadow-indigo-900/20 p-8">
                <h2 className="text-2xl font-bold text-center text-gray-200">Welcome Back</h2>
                {error && <p className="mt-2 text-center text-sm text-red-400 bg-red-900/50 p-2 rounded-md">{error}</p>}
                <form onSubmit={handleLogin} className="mt-6 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address</label>
                        <input
                            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                            className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-400">Password</label>
                        <input
                             id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                             className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-8 py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-teal-400 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-800/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignUp} className="font-medium text-indigo-400 hover:text-indigo-300">
                        Sign Up
                    </button>
                </p>
            </div>
             <footer className="text-center mt-12 text-gray-500">
                <p>Powered by Google Gemini</p>
            </footer>
        </div>
    );
};
