
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthenticatedApp } from './AuthenticatedApp';
import { UnauthenticatedApp } from './UnauthenticatedApp';

const App: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
