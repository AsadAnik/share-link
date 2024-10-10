import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${process.env.APP_DISPLAY_NAME} API`,
  description: `${process.env.APP_DISPLAY_NAME} api for web and mobile`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
