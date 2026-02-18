
import React from 'react';

interface LoaderProps {
    text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-600 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-300">{text}</p>
        </div>
    );
};
