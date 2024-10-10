import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';
import { Metadata } from 'next';
import './swagger.css';

export const metadata: Metadata = {
  title: `${process.env.APP_DISPLAY_NAME} api docs`,
  description: `${process.env.APP_DISPLAY_NAME} api for web and mobile`,
};

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="bg-gray-50 pb-10 pt-10">
      <ReactSwagger spec={spec} />
    </section>
  );
}
