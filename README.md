# 🔖 Link Saver + Auto-Summary App

## 🌐 Live Demo

https://bookmark-buddy-yash.vercel.app/

A sleek, full-stack bookmark manager built with **React (Vite)** and **Firebase**. Users can save, delete, and drag-to-reorder bookmarks — each with an auto-generated summary. Includes **light/dark mode**, authentication, and is fully responsive.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, ShadCN/UI, React Icons  
- **Backend**: Firebase Authentication + Firestore Database  
- **Drag & Drop**: @dnd-kit  
- **Notifications**: Sonner  
- **Hosting**: Vercel  
- **Other**: Light/Dark mode toggle, responsive UI

---

## ⚙️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/link-saver.git
   cd link-saver
Install dependencies

bash
Copy
Edit
npm install
### Set up Firebase

Go to Firebase Console

Create a project and enable:

Email/Password Authentication

Cloud Firestore

Copy your Firebase config and paste it into a .env file:

env
Copy
Edit
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Run the project locally

bash
Copy
Edit
npm run dev
Build for production

bash
Copy
Edit
npm run build
✨ Features
✅ User Registration + Login with Firebase Auth

✅ Save bookmarks with favicon, title & auto-summary

✅ Drag & Drop to reorder bookmarks (DnD Kit)

✅ Light / Dark mode toggle

✅ Fully responsive design (mobile + desktop)

## 💡 What I'd Do Next
🔐 Add OAuth options (Google/GitHub login)

📄 Improve summary generation with AI

🔍 Implement tag-based filtering or search

🧪 Add unit & integration tests with Vitest

📊 Add analytics dashboard for user activity

## ⏱ Time Spent
Approx. 10 Hours (including UI design, Firebase integration, and Everything)


