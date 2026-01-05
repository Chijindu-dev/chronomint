import React from 'react';

const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="url(#paint0_linear)" strokeWidth="6" strokeDasharray="20 10" />
        <path d="M50 20V50L70 65" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="8" fill="var(--primary)" />
        <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--secondary)" />
            </linearGradient>
        </defs>
    </svg>
);

export default Logo;
