# NexusNotes 📂

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🎯 Overview

This is a modern, real-time, collaborative note-taking application. It leverages a powerful tech stack to provide a seamless and secure experience for users to create, share, and edit notes together.

## 🎥 Live Demo & Showcase

A live version of the application is deployed and can be accessed here:

**[Link to Live Demo]()**

### Application Showcase

To give you a better feel for the application, here is a short video demonstrating the core features.

<div align="center">

![Demo]()

</div>

## ✨ Features

- **Secure User Authentication:** Powered by Clerk for robust and easy-to-use user management.
- **Real-time Collaboration:** Firestore and Liveblocks ensures that notes and changes are synced across all users in real-time.
- **Role-Based Permissions:** Share notes with others using 'editor' or 'viewer' roles to control access.
- **Page Management:** Users can create, update, and delete pages with proper authorization.
- **Responsive Design:** A seamless experience across all devices.

## 🛠️ Tech Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (v15 with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Rich text editor:** [Blocknote](https://www.blocknotejs.org/)

### Backend & Database

- **Backend:** Next.js API Routes & Server Actions & [Liveblocks](https://liveblocks.io/docs/get-started/nextjs)
- **Database:** Firebase Firestore

### Authentication

- **Provider:** [Clerk](https://clerk.com/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js** and **npm** (or yarn/pnpm) installed on your machine.
- A **Firebase Project**. If you don't have one, follow the [official setup guide](https://firebase.google.com/docs/web/setup).
- A **Clerk Application**. If you don't have one, follow the [official setup guide](https://clerk.com/docs/quickstarts/setup-clerk).
- A **Liveblocks Project**. If you don't have one, follow the [official setup guide](https://liveblocks.io/docs/platform/projects)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/T-S-dev/NexusNotes.git
    
    cd NexusNotes
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

3.  **Configure Environment**

    <details> 
    <summary><strong>Set up Environment Variables</strong></summary>

    - Create a file named `.env.local` in the root of the project and add the following, replacing the values with your own keys from your Clerk and Firebase dashboards.

        ```env
        # Clerk Environment Variables
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
        CLERK_SECRET_KEY=
        
        NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
        NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

        # Liveblocks Environment Variables
        LIVEBLOCKS_SECRET_KEY=

        # Firebase Environment Variables
        NEXT_PUBLIC_FIREBASE_API_KEY=
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
        NEXT_PUBLIC_FIREBASE_APP_ID=
        ```

    </details>

    <details> 
    <summary><strong>Set up Firebase Admin Service Account</strong></summary>
    
    1.  In your Firebase Project Console, go to **Project settings** ⚙️ -> **Service accounts**.

    2.  Click **"Generate new private key"** and rename the downloaded file to `firebase_service_key.json`.
    3.  Place this file in the **root directory** of your project.
        > ⚠️ CRITICAL: This file is a secret and should NEVER be committed to Git. It has already been added to `.gitignore`

    </details>

    <details> 
    <summary><strong>Clerk - Firebase Integration</strong></summary>

    - Enable Firebase Integration with Clerk, walkthrough can be found at [Official Clerk Firebase Integration Guide](https://clerk.com/docs/integrations/databases/firebase)

    </details>

4.  **Set Up Firebase Security Rules:**

    <details> 
    <summary><strong>Firestore Rules</strong></summary>
    
    1.  Navigate to the **Firestore Database** section in your Firebase console, then select the **Rules** tab.

    2.  Paste the following rules into the editor and click **Publish**.
        ```
        rules_version = '2';

        service cloud.firestore {
          match /databases/{database}/documents {

            match /pages/{pageId} {

              // Page document rules
              
              // Allow any authenticated user who has a permission document to read the page.
              allow read: if request.auth != null && exists(/databases/$(database)/documents/pages/$(pageId)/pagePermissions/$(request.auth.uid));
              
              // DENY direct writes from the client. All mutations must go through server actions.
              allow write: if false;

              // Rules for the pagePermissions subcollection (for direct access)
              match /pagePermissions/{userId} {
                allow read: if request.auth != null && 
                              exists(/databases/$(database)/documents/pages/$(pageId)/pagePermissions/$(request.auth.uid));
                
                // DENY direct writes to permissions. Let server actions handle invites, role changes, etc.
                allow write: if false;
              }
            }

            // --- Rule for the "pagePermissions" COLLECTION GROUP ---
            match /{path=**}/pagePermissions/{permissionDocId} {
              allow read: if request.auth != null && request.auth.uid == resource.data.userId;
            }
          }
        }
        ```

    </details>

5.  **Run the development server:**

    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with
