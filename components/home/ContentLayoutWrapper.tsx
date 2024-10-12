"use client";

import React from "react";
import Image from "next/image";
import Phone from "@/assets/img/phone.png";
import { useGetProfileQuery } from "@/store";

interface ContentLayoutProps {
    children?: React.ReactNode;
    links?: any[];
    title?: string;
    subTitle?: string;
    addLink?: () => void;
    handleOnSave?: () => void;
    isSaveProcess?: boolean;
    isLinkCreateProcess?: boolean;
}

const demoLink = [
    { id: "1", platform: "GitHub", url: "https://www.github.com/benwright" },
    { id: "2", platform: "YouTube", url: "https://www.youtube.com/benwright" },
    {
        id: "3",
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/benwright",
    },
];

const ContentLayoutWrapper = ({
    children,
    links = demoLink,
    title = "Demo Title",
    subTitle = "Demo Subtitle",
    addLink,
    handleOnSave,
    isSaveProcess,
    isLinkCreateProcess
}: ContentLayoutProps) => {
    // const { data: profileData, isLoading: loadingForProfileData } = useGetProfileQuery();
    const { data: profileData } = useGetProfileQuery();


    return (
        <div className="content-wrapper">
            <section className="left-content">
                <div className="phone-container relative">
                    <Image src={Phone} alt="Phone" className="phone-img" />

                    <div className="absolute top-10 left-5 w-11/12 h-full phone-contents">
                        <div className="bg-gray-200 mb-4 avatar-circle">
                            {profileData?.photoUrl ? (
                                <img
                                    src={profileData?.photoUrl ?? ''}
                                    className="rounded-full"
                                    alt=""
                                />
                            ) : null}
                        </div>

                        <div className="bg-gray-200 mb-4 title-email-name items-center justify-center flex flex-col">
                            <p className="text-xs">{profileData?.email}</p>
                        </div>

                        {links.map((link) => (
                            <div
                                key={link.id}
                                className={`flex items-center space-x-3 mb-3 rounded-lg p-2
                  ${link.platform === "GitHub" ? "bg-black text-white" : ""}
                  ${link.platform === "YouTube" ? "bg-red-500 text-white" : ""}
                  ${link.platform === "LinkedIn" ? "bg-blue-600 text-white" : ""
                                    }`}
                            >
                                <span>{link.platform}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="right-content">
                <div className="grid mb-5 gap-2 mt-4 ml-2 mr-2">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-gray-500 text-sm font-thin">{subTitle}</p>

                    {addLink && (
                        <button
                            className="text-[#7860df] border border-[#7860df] px-4 py-2 rounded-lg font-thin text-sm mt-5 hover:bg-[#7860df] hover:text-white"
                            onClick={addLink}
                            disabled={isLinkCreateProcess}
                        >
                            {isLinkCreateProcess ? "Creating..." : "+ Add new link"}
                        </button>
                    )}
                </div>

                {children}

                <hr />

                <div className="flex w-full containers mx-auto items-center justify-end mt-5 mr-2">
                    <button
                        className="bg-[#7860df] text-white px-4 py-2 rounded-lg font-thin text-sm flex-end"
                        onClick={handleOnSave}
                        disabled={isSaveProcess}
                    >
                        {isSaveProcess ? "Saving..." : "Save"}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ContentLayoutWrapper;
