
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import type { Project } from '../types';

interface User {
    name: string;
    email: string;
    password?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    projects: Project[];
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    addProject: (projectData: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUsersFromStorage = (): User[] => {
    try {
        const storedUsers = localStorage.getItem('scriptoriaUsersDB');
        return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return [];
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('scriptoriaUser');
            if (storedUser) {
                 setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse current user from localStorage", error);
            localStorage.removeItem('scriptoriaUser');
        }
    }, []);

    const fetchProjects = useCallback(() => {
        if (currentUser) {
            try {
                const storedProjects = localStorage.getItem(`scriptoria_projects_${currentUser.email}`);
                setProjects(storedProjects ? JSON.parse(storedProjects) : []);
            } catch (error) {
                console.error("Failed to parse projects from localStorage", error);
                setProjects([]);
            }
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchProjects();
        } else {
            setProjects([]); // Clear projects on logout
        }
    }, [currentUser, fetchProjects]);


    const login = async (email: string, password: string): Promise<void> => {
        const users = getUsersFromStorage();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('scriptoriaUser', JSON.stringify(userWithoutPassword));
            setCurrentUser(userWithoutPassword);
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const signup = async (name: string, email: string, password: string): Promise<void> => {
        const users = getUsersFromStorage();
        if (users.some(u => u.email === email)) {
            throw new Error('An account with this email already exists.');
        }

        const newUser: User = { name, email, password };
        const updatedUsers = [...users, newUser];
        localStorage.setItem('scriptoriaUsersDB', JSON.stringify(updatedUsers));
        
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem('scriptoriaUser', JSON.stringify(userWithoutPassword));
        setCurrentUser(userWithoutPassword);
    };

    const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
        if (!currentUser) throw new Error("User not authenticated");
        
        const newProject: Project = {
            ...projectData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };

        const updatedProjects = [newProject, ...projects];
        localStorage.setItem(`scriptoria_projects_${currentUser.email}`, JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        return newProject;
    };


    const logout = () => {
        localStorage.removeItem('scriptoriaUser');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!currentUser, user: currentUser, projects, login, signup, addProject, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
