import type { Metadata } from 'next';
import DefaultNavbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
    title: `${process.env.APP_DISPLAY_NAME}`,
    description: `${process.env.APP_DISPLAY_NAME}`,
};

export default function DefaultLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <DefaultNavbar />
            <div className="mt-10 flex h-full w-full items-center justify-center gap-2 bg-[#F5F5F5]">
                <div className="z-30 mt-[90px] flex h-full flex-col pb-20 xs:ml-3 xs:mr-3 xs:w-[380px] sm:w-[480px] md:w-[768px] lg:w-[80%] xl:w-[80%] 2xl:w-[1440px]">
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
}
