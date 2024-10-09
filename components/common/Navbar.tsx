"use client";

import React from "react";
import BrandIcon from "@/assets/icon/icon.png";
import Image from "next/image";
import Link from "next/link";
import { FaLink } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { usePathname } from "next/navigation";

export default function Navbar(): React.ReactElement {
    const pathname = usePathname();

    return (
        <div className="flex w-full containers mx-auto items-center justify-center px-4 py-4 my-4 bg-white h-10 custom-navbar">
            {pathname === "/preview" || pathname === "/share" ? (
                <div className="w-full flex items-center justify-start gap-2">
                    <Link href={"/link"}>
                        <button
                            className={`text-[#7860df] border border-[#7860df] rounded-lg px-4 py-2 `}
                        >
                            Back to Editor
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="w-full flex items-center justify-start gap-2">
                    <div>
                        <Image
                            src={BrandIcon.src}
                            alt="Brand Icon"
                            width={30}
                            height={30}
                        />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-xl">devLinks</h3>
                    </div>
                </div>
            )}

            {pathname === "/link" || pathname === "/profile" ? (
                <div className="w-full flex items-center justify-center gap-3">
                    <Link
                        href="/link"
                        className={`flex items-center justify-center gap-2 text-sm p-2 rounded-md 
                    ${pathname === "/link"
                                ? "bg-[#f0edff] text-[#7860df] font-bold"
                                : "text-black font-normal hover:underline"
                            }`}
                    >
                        <FaLink />
                        <span>Links</span>
                    </Link>

                    <Link
                        href="/profile"
                        className={`flex items-center justify-center gap-2 text-sm p-2 rounded-md 
                    ${pathname === "/profile"
                                ? "bg-[#f0edff] text-[#7860df] font-bold"
                                : "text-black font-normal hover:underline"
                            }`}
                    >
                        <CgProfile />
                        <span>Profile Details</span>
                    </Link>
                </div>
            ) : null}

            <div className="w-full flex items-center justify-end">
                <Link href={pathname === "/preview" ? "/" : "/preview"}>
                    <button
                        className={`text-[#7860df] border border-[#7860df] rounded-lg px-4 py-2 ${pathname === "/preview"
                                ? "bg-[#7860df] text-[#fff] font-bold"
                                : ""
                            }`}
                    >
                        {pathname === "/preview" ? "Share Link" : "Preview"}
                    </button>
                </Link>
            </div>
        </div>
    );
}
