# 💬 MessageHub

A modern real-time messaging application built with **Next.js**, **TypeScript**, **MongoDB**, **Prisma**, **NextAuth**, and **Pusher**.

Designed with performance, scalability, and a smooth user experience in mind.

---

## 🚀 Live Demo

**Application:** https://message-hub-9sj2.vercel.app/

---

## 📸 Screenshots

> Add screenshots of:

<img width="885" height="632" alt="image" src="https://github.com/user-attachments/assets/abae0aff-59d9-486d-b231-e353d23d6bc8" />
<img width="1364" height="643" alt="image" src="https://github.com/user-attachments/assets/eeebda13-63f2-4973-a7b7-f2db875676c3" />
<img width="1362" height="642" alt="image" src="https://github.com/user-attachments/assets/9df0858d-b6d3-40d1-acff-51a7b267360e" />
<img width="1352" height="633" alt="image" src="https://github.com/user-attachments/assets/ab1f455f-22eb-4f3c-861c-d3fdde80e869" />
<img width="1362" height="634" alt="image" src="https://github.com/user-attachments/assets/a381153c-ee96-4208-8580-826faef94cc1" />
<img width="962" height="640" alt="image" src="https://github.com/user-attachments/assets/cffbd48f-9c36-4fd3-bfec-267c1302c098" />


---

## ✨ Features

* 🔐 Authentication

  * Google Login
  * GitHub Login
  * Credentials Login

* 💬 Real-time Messaging

  * Instant messaging with Optimistic UI
  * Real-time updates using Pusher
  * Read receipts
  * Conversation updates without refresh

* 👥 Conversations

  * One-to-one chat
  * Group conversations
  * Create new conversations
  * Search users

* 🖼️ Media Sharing

  * Upload images
  * Cloudinary integration
  * Image preview

* ⚡ Performance

  * Optimized Prisma queries
  * Optimized Pusher payloads
  * Responsive UI
  * Fast navigation

* 📱 Responsive Design

  * Mobile
  * Tablet
  * Desktop

---

## 🛠️ Tech Stack

### Frontend

* Next.js 14
* React 18
* TypeScript
* Tailwind CSS
* React Hook Form
* Zustand

### Backend

* Next.js Route Handlers
* Prisma ORM
* MongoDB Atlas
* NextAuth.js

### Real-Time

* Pusher Channels

### Media

* Cloudinary

### Deployment

* Vercel

---

## 📂 Project Structure

```
app/
├── actions/
├── api/
├── components/
├── conversations/
├── hooks/
├── libs/
├── users/
└── types/

prisma/
public/
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Amit81082/MessageHub.git

cd MessageHub
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
DATABASE_URL=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_ID=
GITHUB_SECRET=

PUSHER_APP_ID=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run locally

```bash
npm run dev
```

---


## 📌 Future Improvements

* Voice Messages
* Emoji Picker
* Message Reactions
* Typing Indicator
* Online/Offline Status
* Message Editing
* Message Deletion
* Push Notifications
* Infinite Scroll
* File Sharing

---

## 📖 What I Learned

Building MessageHub helped me gain hands-on experience with:

* Building full-stack applications using Next.js App Router
* Authentication using NextAuth
* Database design with Prisma & MongoDB
* Real-time communication using Pusher
* Optimistic UI updates
* Performance optimization
* Responsive UI development
* Deploying production applications on Vercel

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is licensed under the MIT License.
