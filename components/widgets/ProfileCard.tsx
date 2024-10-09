'use client';
import React from 'react';
import { FaGithub, FaYoutube, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';

const ProfileCard = () => {
    return (
        <div className="relative flex items-center justify-center h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                {/* Profile Picture */}
                <div className="flex justify-center">
                    <Image
                        src="/path-to-image.jpg" // Replace with actual image path
                        alt="Profile"
                        className="rounded-full border-4 border-white"
                        width={100}
                        height={100}
                    />
                </div>

                {/* Name and Email */}
                <h2 className="text-xl font-semibold mt-4">Ben Wright</h2>
                <p className="text-gray-500 mb-6">ben@example.com</p>

                {/* Social Media Buttons */}
                <div className="space-y-3">
                    <a href="#" className="flex items-center justify-center bg-black text-white py-2 rounded-md gap-2 hover:bg-gray-800">
                        <FaGithub />
                        <span>GitHub</span>
                    </a>

                    <a href="#" className="flex items-center justify-center bg-red-600 text-white py-2 rounded-md gap-2 hover:bg-red-700">
                        <FaYoutube />
                        <span>YouTube</span>
                    </a>

                    <a href="#" className="flex items-center justify-center bg-blue-600 text-white py-2 rounded-md gap-2 hover:bg-blue-700">
                        <FaLinkedin />
                        <span>LinkedIn</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;