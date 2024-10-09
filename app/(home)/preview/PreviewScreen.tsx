'use client';

import React from 'react';
import ProfileCard from '@/components/widgets/ProfileCard';

export default function PreviewScreen() {
    return (
        <div className="relative h-screen">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-[#5a49e0] rounded-b-[20px]"></div>
            <div className="absolute top-1/3 left-0 w-full h-2/3 bg-white"></div>

            {/* Profile Card */}
            <ProfileCard />
        </div>
    );
}
