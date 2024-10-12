"use client";
import React from "react";
import { FaGithub, FaYoutube, FaLinkedin } from "react-icons/fa";
import { useGetLinksQuery, useGetProfileQuery } from "@/store";

const ProfileCard = () => {
    // Fetch profile and links data
    const { data: profileData, isLoading: loadingProfile } = useGetProfileQuery();
    const { data: linksData, isLoading: loadingLinks } = useGetLinksQuery();

    // Show a loading message while fetching data
    if (loadingProfile || loadingLinks) {
        return <div>Loading...</div>;
    }

    // Handle cases where no data is returned
    if (!profileData || !linksData) {
        return <div>Error: Data not found</div>;
    }

    // Extracting profile data
    const { fname, lname, email, photoUrl } = profileData;

    // Mapping social media platforms to their respective icons
    const platformIcons = {
        GitHub: <FaGithub />,
        YouTube: <FaYoutube />,
        LinkedIn: <FaLinkedin />,
        // Add more platforms as needed
    };

    return (
        <div className="relative flex items-center justify-center h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                {/* Profile Picture */}
                <div className="flex justify-center">
                    <img
                        src={photoUrl || "/default-avatar.png"} // Use a fallback image if photoUrl is not available
                        alt="Profile"
                        className="rounded-full border-4 border-white"
                        width={100}
                        height={100}
                    />
                </div>

                {/* Name and Email */}
                <h2 className="text-xl font-semibold mt-4">
                    {fname} {lname}
                </h2>
                <p className="text-gray-500 mb-6">{email}</p>

                {/* Social Media Links */}
                <div className="space-y-3">
                    {linksData.map((link) => (
                        <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center py-2 rounded-md gap-2 ${link.platform === "GitHub"
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : link.platform === "YouTube"
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : link.platform === "LinkedIn"
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-400 text-white hover:bg-gray-500"
                                }`}
                        >
                            {platformIcons[link.platform as keyof typeof platformIcons] ||
                                null}
                            <span>{link.platform}</span>
                        </a>
                    ))}{" "}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
