
import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';

export const UnauthenticatedApp: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    const toggleView = () => setIsLoginView(prev => !prev);

    return isLoginView 
        ? <LoginPage onSwitchToSignUp={toggleView} /> 
        : <SignUpPage onSwitchToLogin={toggleView} />;
};
