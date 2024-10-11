"use client";

import React, { useState } from "react";
import BrandIcon from "@/assets/icon/icon.png";
import Image from "next/image";
import Link from "next/link";
import { FaLink } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { usePathname, useRouter } from "next/navigation";
import { authAction, useAppDispatch } from "@/store";
import { authSignout, getAuthTokenFromCookie } from "@/store/actions";
import { toast } from "react-toastify";

export default function Navbar(): React.ReactElement {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    // CHECK USER AUTHENTICATION
    const isAuthenticated = getAuthTokenFromCookie();

    // SIGN-OUT HANDLE FUNCTION
    // region Sign-Out Handle
    const handleSingOut = async () => {
        try {
            setIsLoading(true);
            const result = await dispatch(authSignout()).unwrap();

            if (result?.success) {
                toast(result?.message as string);
                dispatch(authAction.reset({ result: true }));
                router.push('/signin');

            } else {
                toast.error(result?.message as string);
            }

            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            const { message } = error as unknown as any;
            toast.error(message as string);
        }
    };

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

            {!isAuthenticated ? null : (
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

                    {/* logout button here  */}
                    <button
                        className="text-[maroon] border border-[maroon] rounded-lg px-4 py-2 ml-2 hover:bg-[red] hover:text-[white]"
                        onClick={handleSingOut}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loggingout..." : "Logout"}
                    </button>
                </div>
            )}
        </div>
    );
}
