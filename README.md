# 🎤 Interview Assistant

> An intelligent desktop application that helps developers prepare for technical interviews using real-time transcription and AI-powered assistance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-32.1.0-blue.svg)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🎯 Overview

Interview Assistant is an Electron-based desktop application designed to revolutionize how developers prepare for technical interviews. By combining real-time speech transcription with AI-powered assistance, it provides contextual, intelligent responses that help candidates present their best selves during interviews.

### Key Capabilities

- **🎙️ Real-time Transcription**: Live audio capture and transcription using Deepgram
- **🤖 AI-Powered Assistance**: Context-aware responses using OpenAI GPT-4
- **📄 Document Analysis**: PDF parsing and image analysis for comprehensive preparation
- **🎭 Customizable Personas**: Tailored behavior, language, and response styles
- **💾 Knowledge Management**: Persistent storage of conversations and context

## ✨ Features

### 🎤 Real-time Interview Transcription
- Live audio capture using system audio streams
- Automatic transcription with Deepgram SDK
- Multi-language support with configurable primary/secondary languages
- Real-time text display with automatic formatting

### 🤖 AI-Powered Interview Assistant
- OpenAI GPT-4 integration for intelligent responses
- Context-aware suggestions based on resume and job postings
- Auto-GPT mode for automatic question answering
- Customizable system prompts with behavior rules, language guides, and response styles

### 📚 Knowledge Base Management
- PDF document parsing (resumes, technical documents)
- Image analysis and processing capabilities
- File upload support for multiple formats
- Persistent conversation history with markdown rendering
- Interactive chat interface for document Q&A

### 🎯 Context Management System
- Resume storage and editing with templates
- Job post analysis and requirements tracking
- Skills & knowledge database management
- Development workflow documentation
- Discovery questions preparation

### ⚙️ Advanced Configuration
- Behavior rules customization (first-person perspective, confidence levels)
- Language guide configuration (supports "Barok English" Filipino-English style)
- Response style templates (structured 3-part responses)
- Individual prompt component toggles

### 🔧 Settings & API Management
- OpenAI API key management with proxy support
- Custom API base URL configuration
- Model selection (GPT-3.5, GPT-4, etc.)
- Deepgram API configuration
- Language preferences and regional settings

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: 500MB free space

### API Keys Required
- **OpenAI API Key**: For AI-powered responses
  - Get from: [OpenAI Platform](https://platform.openai.com/api-keys)
  - Required for: GPT-4/GPT-3.5 integration
- **Deepgram API Key**: For real-time transcription
  - Get from: [Deepgram Console](https://console.deepgram.com/)
  - Required for: Speech-to-text functionality

## 🚀 Installation

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/interview-assistant.git
   cd interview-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

### Development Setup

1. **Install development dependencies**
   ```bash
   npm install --save-dev
   ```

2. **Run in development mode**
   ```bash
   npm run start
   ```

3. **Build for production**
   ```bash
   npm run make
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the application in development mode |
| `npm run package` | Package the application for distribution |
| `npm run make` | Build installers for the current platform |
| `npm run publish` | Publish the application to distribution channels |

## 🏗️ Architecture

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Electron | 32.1.0 | Desktop application framework |
| **Frontend** | React | 18.3.1 | User interface library |
| **Routing** | React Router | 6.26.2 | Client-side routing |
| **Styling** | TailwindCSS + DaisyUI | 3.4.11 + 4.12.10 | CSS framework and components |
| **Language** | TypeScript | 5.6.2 | Type-safe JavaScript |
| **Build Tool** | Webpack | Via Electron Forge | Module bundling |
| **State Management** | React Context API | Built-in | Application state |
| **AI Integration** | OpenAI SDK | 4.60.0 | GPT-4/GPT-3.5 integration |
| **Transcription** | Deepgram SDK | 3.6.0 | Real-time speech-to-text |
| **Storage** | electron-store | 10.0.0 | Persistent configuration |
| **PDF Processing** | pdf-parse | 1.1.1 | Document parsing |
| **Image Processing** | Sharp | 0.33.5 | Image analysis |

### Project Structure

```
Interview-Assistant/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ErrorDisplay.tsx
│   │   ├── Navigation.tsx
│   │   └── Timer.tsx
│   ├── contexts/           # React Context providers
│   │   ├── ErrorContext.tsx
│   │   ├── InterviewContext.tsx
│   │   ├── KnowledgeBaseContext.tsx
│   │   └── PromptContext.tsx
│   ├── pages/              # Main application pages
│   │   ├── InterviewPage.tsx
│   │   ├── KnowledgeBase.tsx
│   │   ├── Context.tsx
│   │   ├── Settings.tsx
│   │   └── Prompts.tsx
│   ├── utils/              # Utility functions
│   │   └── languageOptions.ts
│   ├── assets/             # Application assets
│   │   ├── icon.icns
│   │   ├── icon.ico
│   │   └── icon.png
│   ├── App.tsx             # Main application component
│   ├── index.ts            # Main process entry point
│   ├── preload.ts          # Preload script
│   └── renderer.tsx        # Renderer process entry point
├── context/                # Context data files
│   ├── current_job.md
│   ├── discovery_questions.md
│   ├── resume.md
│   ├── skills_knowledge.md
│   └── workflow_method.md
├── prompts/                # Prompt configuration files
│   ├── behavior_rules.md
│   ├── language_guide.md
│   └── response_style.md
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── forge.config.ts         # Electron Forge configuration
└── webpack.*.config.ts     # Webpack configurations
```

### Context Providers Architecture

The application uses React Context API for state management across different features:

- **InterviewContext**: Manages transcription text and AI responses
- **KnowledgeBaseContext**: Handles document storage and conversation history
- **PromptContext**: Controls system prompts and context data
- **ErrorContext**: Centralized error handling and display

### IPC Communication Flow

```
Renderer Process (React) ↔ Preload Script ↔ Main Process (Electron)
```

- **Audio Capture**: System audio → Deepgram → Transcription → UI
- **AI Requests**: User input → OpenAI API → Response → UI
- **File Processing**: File upload → PDF/Image parsing → Storage → UI
- **Configuration**: Settings → electron-store → Persistent storage

## ⚙️ Configuration

### Initial Setup

1. **Launch the application** and navigate to Settings
2. **Configure API Keys**:
   - Enter your OpenAI API key
   - Enter your Deepgram API key
   - Test the configuration using the "Test API Configuration" button

3. **Language Configuration**:
   - Set primary language (e.g., "en" for English)
   - Optionally set secondary language for mixed-language interviews

### API Configuration

#### OpenAI Setup
```typescript
// Example configuration
{
  "openai_key": "sk-your-openai-api-key",
  "gpt_model": "gpt-4o",
  "api_base": "https://api.openai.com/v1", // or custom proxy URL
  "api_call_method": "direct" // or "proxy"
}
```

#### Deepgram Setup
```typescript
// Example configuration
{
  "deepgram_api_key": "your-deepgram-api-key",
  "primaryLanguage": "en",
  "secondaryLanguage": "fil" // Optional
}
```

### Prompt Customization

The application supports three types of customizable prompts:

#### 1. Behavior Rules
Controls how the AI responds during interviews:
- First-person perspective ("I" statements)
- Confidence levels and tone
- Context awareness and adaptation
- Technical honesty and transparency

#### 2. Language Guide
Defines the speaking style and language patterns:
- "Barok English" Filipino-English hybrid style
- Vocabulary preferences and complexity
- Tone and politeness balance
- Technical language usage

#### 3. Response Style
Structures the format of AI responses:
- 3-part structure (Summary → Explanation → Closing)
- Sentence length and paragraph organization
- Natural speech patterns for teleprompter use

### File-based Context Loading

The application can load context from markdown files in the `context/` directory:

- **resume.md**: Your professional resume and experience
- **current_job.md**: Target job posting and requirements
- **skills_knowledge.md**: Technical skills and knowledge areas
- **workflow_method.md**: Development methodology and processes
- **discovery_questions.md**: Common interview questions and answers

## 📖 Usage Guide

### Starting an Interview Session

1. **Navigate to the Interview Page** (main window)
2. **Check Configuration Status**:
   - Ensure API keys are configured (green indicator)
   - Verify prompt settings are enabled if desired
3. **Start Recording**:
   - Click "Start Recording" button
   - Grant microphone/system audio permissions
   - Begin speaking - transcription will appear in real-time

### Using Auto-GPT Mode

1. **Enable Auto-GPT** by checking the checkbox
2. **Configure Auto-submission**:
   - Set delay timer (default: 2 seconds)
   - AI will automatically respond to transcribed questions
3. **Monitor Responses**:
   - AI responses appear in the right panel
   - Conversation history is maintained
   - Clear responses as needed

### Managing Knowledge Base

1. **Navigate to Knowledge Base** page
2. **Upload Documents**:
   - Click "Upload" button
   - Select PDF files or images
   - Documents are automatically parsed and stored
3. **Chat with Documents**:
   - Type questions about uploaded content
   - AI provides context-aware responses
   - Conversation history is preserved

### Editing Context Files

1. **Navigate to Context** page
2. **Select Context Type**:
   - Resume, Job Post, Skills, Workflow, or Discovery Questions
3. **Edit Content**:
   - Click "Edit" to modify content
   - Use templates for quick setup
   - Save changes to persist updates
4. **Reset to Files**:
   - Use "Reset to File" to reload from markdown files

### Customizing Prompts

1. **Navigate to Prompts** page
2. **Configure Prompt Components**:
   - Toggle individual prompt types on/off
   - Edit content using the built-in editor
   - Preview changes before saving
3. **Save Configuration**:
   - Changes are automatically saved to electron-store
   - Configuration persists across application restarts

## 🛠️ Development

### Building for Production

```bash
# Package the application
npm run package

# Create installers
npm run make

# Build for specific platform
npm run make -- --platform=win32
npm run make -- --platform=darwin
npm run make -- --platform=linux
```

### Development Workflow

1. **Make Changes** to source code
2. **Test Locally** using `npm start`
3. **Build and Test** using `npm run package`
4. **Create Distribution** using `npm run make`

### Adding New Features

1. **Create Components** in `src/components/`
2. **Add Context Providers** in `src/contexts/` if needed
3. **Create Pages** in `src/pages/`
4. **Update Navigation** in `src/components/Navigation.tsx`
5. **Add Routes** in `src/App.tsx`

### IPC Handler Development

Add new IPC handlers in `src/index.ts`:

```typescript
ipcMain.handle("your-handler-name", async (event, data) => {
  try {
    // Your logic here
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

Expose in `src/preload.ts`:

```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing methods
  yourHandlerName: (data: any) => ipcRenderer.invoke('your-handler-name', data),
});
```

## 🔧 Troubleshooting

### Common Issues

#### API Configuration Problems

**Problem**: "API configuration test failed"
- **Solution**: Verify API keys are correct and have sufficient credits
- **Check**: API base URL format (should end with `/v1`)
- **Test**: Use the "Test API Configuration" button in Settings

#### Audio/Transcription Issues

**Problem**: No audio being captured
- **Solution**: Grant microphone permissions in browser/system settings
- **Check**: System audio capture permissions
- **Alternative**: Try different audio sources in system settings

**Problem**: Transcription not working
- **Solution**: Verify Deepgram API key is valid
- **Check**: Internet connection and API quotas
- **Test**: Try with different language settings

#### Application Performance

**Problem**: Slow response times
- **Solution**: Check API response times and network connection
- **Optimize**: Reduce prompt complexity or disable unused features
- **Monitor**: Check system resources and memory usage

#### File Upload Issues

**Problem**: PDF parsing fails
- **Solution**: Ensure PDF files are not password-protected
- **Check**: File size limits (recommended: < 10MB)
- **Format**: Verify PDF is text-based, not image-based

### Debug Mode

Enable debug logging by uncommenting the dev tools line in `src/index.ts`:

```typescript
// Uncomment this line for debugging
mainWindow.webContents.openDevTools();
```

### Log Locations

- **Windows**: `%APPDATA%/interview-assistant/logs/`
- **macOS**: `~/Library/Logs/interview-assistant/`
- **Linux**: `~/.config/interview-assistant/logs/`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Dependencies

This project uses several open-source libraries:

- **Electron**: Cross-platform desktop application framework
- **React**: User interface library
- **OpenAI**: AI language model integration
- **Deepgram**: Real-time speech recognition
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: TailwindCSS component library

### Acknowledgments

- **OpenAI** for providing the GPT-4 API
- **Deepgram** for real-time transcription services
- **Electron** team for the desktop application framework
- **React** team for the UI library
- **TailwindCSS** and **DaisyUI** for styling components

---

**Author**: nohairblingbling  
**Email**: duskandwine@gmail.com  
**Version**: 1.0.0

For support, feature requests, or bug reports, please open an issue on the GitHub repository.
