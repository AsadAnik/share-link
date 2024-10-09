import Link from 'next/link';
import React from 'react';

export default function Footer() {
    return (
        <section className="flex w-full justify-center bg-white pb-32 pt-20">
            <footer className="mt-2 flex h-full w-full flex-col xs:ml-3 xs:mr-3 sm:w-[480px] md:w-[768px] lg:w-[80%] lg:flex-row xl:w-[80%] 2xl:w-[1440px]">
                <div className="flex w-full flex-col lg:flex-row">
                    <section className="flex w-full flex-col items-center justify-center gap-6 text-center xs:pb-10 sm:pb-10 lg:w-[50%] lg:gap-3 lg:text-start">
                        <h1 className="w-full text-2xl font-medium">
                            Subscribe to Our Newsletter
                        </h1>

                        <div className="flex h-[64px] w-full items-center justify-between rounded-[10px] border border-[#C4C4C4] bg-white px-3">
                            <label htmlFor="" className="w-full">
                                <input
                                    type="email"
                                    name="newsletter"
                                    placeholder="Your email Address"
                                    className="w-full bg-transparent outline-none"
                                />
                            </label>

                            {/*add your onClicl function below*/}
                            <button className="h-[35px] w-full max-w-[101px] rounded bg-gradient-to-r from-[#E2335E] via-[#3E41F1] to-[#24AFD4] font-medium text-[#F0F0F0]">
                                Subscribe
                            </button>
                        </div>
                        <p className="w-[80%] text-lg lg:w-full">
                            {
                                'You’ll get exclusive music updates, new releases, early event access, curated playlists, and insider news. Join now!'
                            }
                        </p>
                    </section>

                    <section className="flex w-full justify-around text-start text-lg lg:w-[50%] lg:justify-end lg:gap-[12%] xl:gap-[16%]">
                        <div className="flex flex-col justify-between space-y-2 lg:h-[128px] lg:max-w-[90px]">
                            <Link href={'/'} className="hover:underline">
                                Home
                            </Link>

                            <Link href={'/create'} className="hover:underline">
                                Create
                            </Link>

                            <Link href={'/library'} className="hover:underline">
                                Library
                            </Link>

                            <Link href={'/explore'} className="hover:underline">
                                Explore
                            </Link>
                        </div>

                        <div className="flex flex-col justify-between space-y-2 lg:h-[128px] lg:max-w-[90px]">
                            <Link href={'/about'} className="hover:underline">
                                About
                            </Link>

                            <Link href={'/subscription'} className="hover:underline">
                                Pricing
                            </Link>

                            <Link href={'/careers'} className="hover:underline">
                                Careers
                            </Link>

                            <Link href={'/blogs'} className="hover:underline">
                                Blogs
                            </Link>
                        </div>

                        <div className="flex flex-col justify-between space-y-2 lg:h-[128px] lg:max-w-[191px]">
                            <Link href={'/whats-new'} className="hover:underline">
                                What’s New
                            </Link>

                            <Link href={'/help'} className="hover:underline">
                                Help
                            </Link>

                            <Link href={'/support'} className="hover:underline">
                                Support
                            </Link>

                            <Link href={'/terms-conditions'} className="hover:underline">
                                Terms & Conditions
                            </Link>
                        </div>
                    </section>
                </div>
            </footer>
        </section>
    );
}
