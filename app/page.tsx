import { Metadata } from 'next/types';
import { HomeWrapper } from '@/components/wrappers/HomeWrapper';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  title: `${process.env.APP_DISPLAY_NAME} | home`,
  description: `${process.env.APP_DISPLAY_NAME}, home page`,
};

export default function Home() {
  return (
    <>
      <HomeWrapper className="z-30">
       <h3>I am Home here</h3>
      </HomeWrapper>
      <Footer />
    </>
  );
}