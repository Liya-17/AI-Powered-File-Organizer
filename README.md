# FileOrganizerAI - Professional AI-Powered File Management

A modern, professional file organization application built with React, TypeScript, and Tailwind CSS. Features AI-powered file categorization, intelligent search, duplicate detection, and cloud backup integration.

## 🚀 Features

### Core Functionality
- **AI-Powered Organization**: Automatically categorize files by type, content, or date
- **Intelligent Search**: Find files using natural language queries
- **Duplicate Detection**: Identify and remove duplicate files to save space
- **Smart Suggestions**: Get recommendations for file organization and cleanup
- **Drag & Drop Upload**: Easy file upload with progress tracking

### User Interface
- **Modern Design**: Clean, professional interface with dark/light theme support
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live file organization and status updates
- **Interactive Dashboard**: Comprehensive overview of your file storage

### Advanced Features
- **AI Chatbot**: Get help with file organization through conversational AI
- **Cloud Backup**: Integration with Google Drive, Dropbox, and OneDrive
- **File Sharing**: Share files with others with customizable permissions
- **Storage Analytics**: Detailed insights into your storage usage
- **Batch Operations**: Perform actions on multiple files simultaneously

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Dropzone** - File upload with drag & drop
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library

### State Management
- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic

### API Integration
- **Axios** - HTTP client for API requests
- **Custom API Layer** - Organized service layer
- **Error Handling** - Comprehensive error management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-file-organizer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Header.tsx      # Top header bar
│   ├── FileUpload.tsx  # File upload component
│   ├── FileList.tsx    # File listing component
│   └── Chatbot.tsx     # AI chatbot component
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Files.tsx       # File management
│   ├── Recent.tsx      # Recent files
│   ├── Starred.tsx     # Starred files
│   ├── Trash.tsx       # Deleted files
│   ├── Shared.tsx      # Shared files
│   └── Settings.tsx    # User settings
├── contexts/           # React contexts
│   └── AppContext.tsx  # Global app state
├── services/           # API services
│   └── api.ts         # API client and endpoints
├── hooks/              # Custom React hooks
│   └── useApi.ts      # API-related hooks
├── utils/              # Utility functions
│   ├── helpers.ts     # Helper functions
│   └── constants.ts   # Application constants
└── types/              # TypeScript type definitions
```

## 🎨 Design System

### Color Palette
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #a855f7 (Purple)
- **Success**: #22c55e (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Consistent input styling with focus states
- **Navigation**: Clean sidebar with active states

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_ENABLE_AI=true
REACT_APP_ENABLE_BACKUP=true
REACT_APP_ENABLE_SHARING=true
```

### API Integration
The application is designed to work with a Node.js/Express backend. Key API endpoints include:

- `GET /api/files` - Get all files
- `POST /api/files/upload` - Upload files
- `POST /api/ai/chat` - AI chatbot interaction
- `GET /api/ai/suggestions` - Get AI suggestions
- `POST /api/files/organize` - Organize files with AI

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full sidebar navigation with all features
- **Tablet**: Collapsible sidebar with touch-friendly interface
- **Mobile**: Bottom navigation with essential features

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📈 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized file thumbnails
- **Bundle Analysis**: Built-in bundle size analysis

## 🔒 Security

- **Input Validation**: Client-side validation for all inputs
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based request validation
- **Secure Headers**: Security headers configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [React Dropzone](https://react-dropzone.js.org/) - File upload
- [React Hot Toast](https://react-hot-toast.com/) - Notifications

## 📞 Support

For support, email support@fileorganizerai.com or join our Slack channel.

---

Built with ❤️ by the FileOrganizerAI team
