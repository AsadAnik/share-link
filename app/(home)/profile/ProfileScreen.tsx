"use client";

import React, { useState } from "react";
import ContentLayoutWrapper from "@/components/home/ContentLayoutWrapper";
import ProfileImgPicker from "@/components/widgets/ProfileImgPicker";
import FemaleAvatar from "@/assets/img/female-avatar.png";

interface LinkData {
    id: string;
    platform: string;
    url: string;
}

const ProfileScreen = (): React.ReactElement => {
    const [imageSrc, setImageSrc] = useState<string>(FemaleAvatar.src);

    const [links, setLinks] = useState<LinkData[]>([
        { id: "1", platform: "GitHub", url: "https://www.github.com/benwright" },
        { id: "2", platform: "YouTube", url: "https://www.youtube.com/benwright" },
        {
            id: "3",
            platform: "LinkedIn",
            url: "https://www.linkedin.com/in/benwright",
        },
    ]);


    return (
        <ContentLayoutWrapper
            links={links}
            title="Profile Details"
            subTitle="Add your details to create a personal touch to your profile."
        >
            <div className="container grid grid-cols-1 gap-4">
                <div className="flex flex-row gap-4 justify-between items-center bg-gray-50 p-8 rounded-lg shadow-md w-full mx-auto">
                    <label htmlFor="#" className="text-sm text-gray-500">Profile picture</label>

                    <ProfileImgPicker imageSrc={imageSrc} setImageSrc={setImageSrc} />

                    <p className="text-xs text-gray-500">
                        Image must be below 1024x1024px.
                        <br />
                        Use PNG or JPG format.
                    </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-md w-full mx-auto">
                    <form className="space-y-4">
                        {/* First Name Field */}
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="firstName"
                                className="block text-gray-600 font-medium"
                            >
                                First name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="w-2/3 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                placeholder="Ben"
                            />
                        </div>

                        {/* Last Name Field */}
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="lastName"
                                className="block text-gray-600 font-medium"
                            >
                                Last name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="w-2/3 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                placeholder="Wright"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="flex items-center justify-between">
                            <label htmlFor="email" className="block text-gray-600 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-2/3 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                placeholder="ben@example.com"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </ContentLayoutWrapper>
    );
};

export default ProfileScreen;
