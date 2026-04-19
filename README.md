# 🗂️ AI-Powered File Organizer

> A modern, intelligent file management web application built with React, TypeScript, and Tailwind CSS — featuring AI-driven categorization, smart search, duplicate detection, and cloud backup integration.

![TypeScript](https://img.shields.io/badge/TypeScript-54.2%25-3178C6?style=flat&logo=typescript&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-42.2%25-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-2.7%25-1572B6?style=flat&logo=css3&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Features

### 🤖 AI-Powered
- **Automatic Categorization** — Organizes files by type, content, or date using AI
- **Natural Language Search** — Find any file using plain English queries
- **Smart Suggestions** — Proactive recommendations for cleanup and organization
- **AI Chatbot** — Conversational assistant to help manage and navigate your files

### 📁 File Management
- **Drag & Drop Upload** — Intuitive file upload with real-time progress tracking
- **Duplicate Detection** — Identify and remove redundant files to reclaim space
- **Batch Operations** — Perform actions on multiple files at once
- **Starred & Trash** — Quick access to important files; safe delete with restore

### ☁️ Cloud & Collaboration
- **Cloud Backup** — Integration with Google Drive, Dropbox, and OneDrive
- **File Sharing** — Share files with granular permission controls
- **Storage Analytics** — Visual insights into storage usage and file distribution

### 🎨 UI/UX
- **Dark / Light Theme** — Toggle between themes for comfortable viewing
- **Fully Responsive** — Optimized for desktop, tablet, and mobile
- **Real-time Updates** — Live status for uploads, organization, and sync
- **Interactive Dashboard** — At-a-glance overview of all your files

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 (Hooks & Functional Components) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Routing | React Router |
| File Upload | React Dropzone |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| HTTP Client | Axios |
| State Management | React Context API + Custom Hooks |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── Header.tsx       # Top header bar
│   ├── FileUpload.tsx   # Drag & drop upload component
│   ├── FileList.tsx     # File listing & actions
│   └── Chatbot.tsx      # AI assistant chatbot
├── pages/               # Page-level components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── Files.tsx        # File browser
│   ├── Recent.tsx       # Recently accessed files
│   ├── Starred.tsx      # Bookmarked files
│   ├── Trash.tsx        # Deleted files with restore
│   ├── Shared.tsx       # Shared files management
│   └── Settings.tsx     # User preferences
├── contexts/
│   └── AppContext.tsx   # Global application state
├── services/
│   └── api.ts           # API client & endpoint definitions
├── hooks/
│   └── useApi.ts        # Reusable API hooks
├── utils/
│   ├── helpers.ts       # Utility functions
│   └── constants.ts     # App-wide constants
└── types/               # TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Liya-17/AI-Powered-File-Organizer.git
cd AI-Powered-File-Organizer

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp env.example .env
# Edit .env with your API URL and feature flags

# 4. Start the development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:3000
```

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_ENABLE_AI=true
REACT_APP_ENABLE_BACKUP=true
REACT_APP_ENABLE_SHARING=true
```

---

## 🔌 API Endpoints (Backend)

This frontend is designed to connect with a Node.js/Express backend. Key expected endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/files` | Fetch all files |
| `POST` | `/api/files/upload` | Upload new files |
| `POST` | `/api/files/organize` | Trigger AI organization |
| `POST` | `/api/ai/chat` | Send message to AI chatbot |
| `GET` | `/api/ai/suggestions` | Fetch AI-generated suggestions |

---

## 📦 Build & Deployment

```bash
# Production build
npm run build

# Deploy to Vercel
npx vercel --prod

# Deploy to Netlify
npm run build
# Upload the dist/ folder to Netlify dashboard
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#6366f1` (Indigo) |
| Secondary | `#a855f7` (Purple) |
| Success | `#22c55e` (Green) |
| Warning | `#f59e0b` (Amber) |
| Error | `#ef4444` (Red) |
| Font | Inter (300, 400, 500, 600, 700) |

---

## 🔒 Security

- Client-side input validation on all forms
- XSS protection with sanitized user inputs
- CSRF token-based request validation
- Secure HTTP headers configuration

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [React](https://reactjs.org/) — UI library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Vite](https://vitejs.dev/) — Fast build tool
- [Lucide](https://lucide.dev/) — Beautiful open-source icons
- [React Dropzone](https://react-dropzone.js.org/) — File upload handling
- [React Hot Toast](https://react-hot-toast.com/) — Notification system

---

<p align="center">Built with ❤️ by <a href="https://github.com/Liya-17">Liya Manusree Yarlagadda</a></p>
