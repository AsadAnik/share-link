# devLinks

![devLinks Logo](https://your-logo-url.com) <!-- You can add a link to your project's logo here -->

**devLinks** is a profile link management tool that allows users to create and customize multiple social media and web profile links in one place. With an intuitive interface, users can easily manage, share, and preview their profiles on mobile devices, enhancing their online presence.

## Features

- **Profile Customization**: Add, edit, and remove links with ease.

- **Responsive Design**: Preview how your profile will look on a mobile device.

- **Authentication**: Sign up, sign in, and manage your profile securely.

- **Dynamic Routing**: Easy navigation between links, profile details, and previews.

- **Protected Routes**: Public access for authentication routes and secure access for profile-related pages.

- **Built with Modern Technologies**: Next.js 14, React, Firebase, and Tailwind CSS.

## Table of Contents

- [Project Demo](#project-demo)

- [Technologies Used](#technologies-used)

- [Getting Started](#getting-started)

- [Folder Structure](#folder-structure)

- [API Endpoints](#api-endpoints)

- [How It Works](#how-it-works)

- [Future Improvements](#future-improvements)

- [Contributing](#contributing)

- [License](#license)

<!-- ## Project Demo

You can find a live demo of this project [here](https://your-live-demo-link.com). -->

## Technologies Used

- **Frontend**: 

  - [React](https://reactjs.org/) with [Next.js 14](https://nextjs.org/) for server-side rendering and routing.

  - [Tailwind CSS](https://tailwindcss.com/) for styling and responsive design.

  - [TypeScript](https://www.typescriptlang.org/) for type safety.

- **Backend**:

  - [Firebase](https://firebase.google.com/) for authentication, Firestore for database storage, and Firebase Storage for media handling.

- **Deployment**:

  - [Vercel](https://vercel.com/) for continuous integration and hosting.

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

- Make sure you have [Node.js](https://nodejs.org/) installed.

- Set up a Firebase project and create your `.env.local` file with Firebase config keys.

### Installation

1\. Clone the repository:

    `git clone https://github.com/AsadAnik/share-link`

2\. Navigate to the project folder:

   `cd devlinks`

3\. Install the required dependencies:

   `npm install`

4\. Set up your environment variables:

   Create a `.env.local` file in the root directory and add your Firebase credentials as follows:

```bash
    APP_DISPLAY_NAME='Dev Links'
    NODE_ENV=development
    PORT=3000
    SECRET_TOKEN='SHARE_LINK'

    # next js public
    NEXT_PUBLIC_API_URL=http://localhost:${PORT}
    NEXT_PUBLIC_PORT=${PORT}
    NEXT_PUBLIC_NODE_ENV=${NODE_ENV}

    # firebase public
    NEXT_PUBLIC_FIREBASE_API_KEY=''
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=''
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=''
    NEXT_PUBLIC_FIREBASE_APP_ID=''
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=''
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=''

    FIREBASE_STORAGE_BUCKET=''

    # firebase admin
    FIREBASE_PROJECT_ID=''
    FIREBASE_PRIVATE_KEY_ID=''
    FIREBASE_PRIVATE_KEY=''
    FIREBASE_CLIENT_EMAIL=''
    FIREBASE_CLIENT_ID=''
    FIREBASE_AUTH_URI=''
    FIREBASE_TOKEN_URI=''
    FIREBASE_AUTH_PROVIDER_CERT_URL=''
    FIREBASE_CLIENT_CERT_URL=''
```

5\. Start the development server:
```bash
   npm run dev
```

6\. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## API Endpoints

Here are the key API routes used in this application:

- **Authentication**:

  - `/api/auth/signin`: User sign-in.

  - `/api/auth/signup`: User registration.

- **User Profile**:

  - `/api/user/me`: Fetch the authenticated user's profile details.

- **Link Management**:

  - `/api/link/create`: Create a new link.

  - `/api/link/update`: Update an existing link.

  - `/api/link/delete`: Remove a link.

## How It Works

1\. **User Authentication**: Users can sign up and log in using Firebase authentication, which securely handles user credentials and session management.

2\. **Link Management**: Authenticated users can add and customize their profile links by selecting a platform (e.g., GitHub, LinkedIn, YouTube) and providing the link URL. The preview on the left updates in real-time to show what the final profile will look like on a mobile device.

3\. **Routing & Security**: The app uses dynamic routing with protected routes (`/link`, `/profile`, `/preview`) only accessible to authenticated users. The `/auth/signin` and `/auth/signup` routes are public.

4\. **Firebase Integration**: Firebase Firestore is used to store user profile and link information, while Firebase Storage manages profile images. Firebase Authentication ensures secure access control.

## Future Improvements

- **Link Ordering**: Drag-and-drop functionality for users to reorder their links.

- **Dark Mode**: Add support for a dark theme toggle.

- **Social Sharing**: Add a feature for users to share their customized profile page via social media.

- **Analytics**: Track link clicks and provide analytics for users.

## Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1\. Fork the Project.

2\. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).

3\. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).

4\. Push to the Branch (`git push origin feature/AmazingFeature`).

5\. Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Feel free to customize this template according to your needs. It covers all the essential details that would help a company or developer understand the purpose of your project, its structure, and how to get started.
