import React from 'react';
import '../App.css';

type FullScreenLoaderProps = {
    isVisible: boolean;
};

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fullscreen-loader">
            <div className="spinner"></div>
        </div>
    );
};

export default FullScreenLoader;
