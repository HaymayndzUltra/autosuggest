# 🎤 Interview Assistant

> An intelligent desktop application that helps developers prepare for technical interviews using real-time transcription and AI-powered assistance with Filipino-English hybrid language support.

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

Interview Assistant is an Electron-based desktop application designed to revolutionize how developers prepare for technical interviews. By combining **dual-provider ASR system** with **300ms ultra-low latency batching**, **Filipino-English hybrid language support**, and **intelligent failover**, it provides contextual, intelligent responses that help candidates present their best selves during interviews.

### Key Capabilities

- **🎙️ Dual-Provider ASR System**: Auto-failover between Local ASR (Docker Whisper) and Deepgram with intelligent health monitoring
- **⚡ Ultra-Low Latency**: 300ms batching with 24KB byte threshold for near real-time transcription
- **🇵🇭 Filipino Language Support**: Intent detection with Filipino keywords (ano, paano, bakit, proyekto, etc.) for Barok English interviews
- **🤖 AI-Powered Assistance**: Context-aware responses using OpenAI GPT-4 with 350ms streaming suggestions
- **📊 Performance Metrics**: Session logging, provider switch tracking, and health check monitoring
- **📄 Document Analysis**: PDF parsing and image analysis for comprehensive preparation
- **🎭 Customizable Personas**: Tailored behavior, language, and response styles
- **💾 Knowledge Management**: Persistent storage of conversations and context

## ✨ Features

### 🎤 Dual-Provider ASR System

- **Intelligent Provider Selection**: Auto mode prefers local ASR, falls back to Deepgram
- **Health Monitoring**: Real-time status indicators with latency tracking (3s local, 5s Deepgram)
- **Automatic Failover**: 3 consecutive failures trigger provider switch
- **Three Provider Modes**:
  - **Auto**: Prefer local, fallback to Deepgram (recommended)
  - **Local**: Local ASR only (requires Docker service)
  - **Deepgram**: Deepgram only (requires API key)

### 🐳 Local ASR Integration

- **Docker-Based Whisper**: Offline-capable speech recognition using OpenAI Whisper
- **300ms Ultra-Low Latency Batching**: Responsive real-time transcription
- **24KB Byte Threshold**: ~0.35s of 16kHz audio for optimal word boundaries
- **Guarded Processing**: Prevents race conditions with do-while drain mechanism
- **GPU Support**: Optional NVIDIA GPU acceleration for faster processing
- **Auto-Start**: Service starts automatically with application launch

### 🇵🇭 Filipino Language Support

- **Intent Detection**: Recognizes Filipino keywords for better context understanding
- **Question Words**: ano, paano, bakit, kailan, saan, pwede, maaari bang
- **Technical Terms**: arkitektura, disenyo, sistema, teknolohiya
- **Experience Terms**: karanasan, nagtrabaho, proyekto, nakaraan
- **Problem-Solving**: suliranin, hamon, isyu, solusyon
- **Process Terms**: proseso, paraan, daloy, metodolohiya
- **Barok English Support**: Natural Filipino-English hybrid conversation patterns

### 🤖 Intelligent Suggestion System

- **Reasoning Engine**: Intent-based suggestion generation with 350ms streaming
- **Real-Time Suggestions**: 300ms trigger window for responsive assistance
- **Duplicate Detection**: Prevents repetitive suggestions using key phrase analysis
- **Context-Aware**: Suggestions based on resume, job postings, and conversation history
- **Streaming Responses**: Live suggestion updates as AI generates responses
- **Auto-GPT Mode**: Automatic question answering with configurable delay

### 📊 Performance Metrics & Monitoring

- **Session Logging**: Comprehensive metrics tracking with JSON export
- **Provider Switch Tracking**: Monitor failover events and reasons
- **Health Check Monitoring**: Real-time provider status and latency tracking
- **Utterance Metrics**: Mic-to-ASR and ASR-to-suggestion latency measurement
- **Export Capabilities**: Session logs available in JSON format

### 🔧 Advanced Transcript Processing

- **Unicode Word Boundaries**: Proper handling of multilingual text with regex detection
- **React Refs Integration**: Real-time updates without stale closure issues
- **Smart Merging**: Intelligent transcript segment combination to prevent duplicates
- **Word Boundary Detection**: Prevents splitting words across audio chunks
- **Normalized Processing**: Consistent text formatting and spacing

### 📚 Knowledge Base Management

- **PDF Document Parsing**: Resumes, technical documents with text extraction
- **Image Analysis**: Processing capabilities for visual content
- **File Upload Support**: Multiple formats with automatic parsing
- **Persistent Conversation History**: Markdown rendering with search capabilities
- **Interactive Chat Interface**: Document Q&A with context preservation

### 🎯 Context Management System

- **Resume Storage**: Professional experience editing with templates
- **Job Post Analysis**: Requirements tracking and skill matching
- **Skills & Knowledge Database**: Technical expertise management
- **Development Workflow Documentation**: Process methodology tracking
- **Discovery Questions Preparation**: Common interview Q&A management

### ⚙️ Advanced Configuration

- **Behavior Rules Customization**: First-person perspective, confidence levels
- **Language Guide Configuration**: "Barok English" Filipino-English style support
- **Response Style Templates**: Structured 3-part responses for natural speech
- **Individual Prompt Component Toggles**: Granular control over AI behavior
- **ASR Provider Settings**: Mode selection, health check configuration, failover thresholds

### 🔧 Settings & API Management

- **OpenAI API Key Management**: Proxy support and custom base URL configuration
- **Model Selection**: GPT-3.5, GPT-4, and other available models
- **Deepgram API Configuration**: Optional for local ASR fallback
- **Language Preferences**: Primary/secondary language settings
- **Regional Settings**: Timezone and locale configuration

## 📋 Prerequisites

### System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: 500MB free space

### Optional Requirements

- **Docker Desktop**: For local ASR functionality (recommended for offline capability)
- **NVIDIA GPU**: Optional but recommended for faster local ASR processing
- **Internet Connection**: Required for Deepgram fallback and OpenAI API calls

### API Keys

- **OpenAI API Key**: For AI-powered responses
  - Get from: [OpenAI Platform](https://platform.openai.com/api-keys)
  - Required for: GPT-4/GPT-3.5 integration
- **Deepgram API Key**: For real-time transcription (optional if using local ASR)
  - Get from: [Deepgram Console](https://console.deepgram.com/)
  - Required for: Speech-to-text functionality when local ASR is unavailable

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

### Local ASR Setup (Recommended)

1. **Install Docker Desktop**
   - Download from: [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Ensure Docker service is running

2. **Start Local ASR Service**
   ```bash
   npm run asr:start
   ```
   - Downloads ~2GB Whisper model (first time only)
   - Wait 1-2 minutes for initialization

3. **Verify Setup**
   ```bash
   npm run asr:verify
   ```
   - All 4 tests should pass ✅

4. **Configure Application**
   - Start Interview Assistant
   - Go to Settings → ASR Provider Settings
   - Set mode to "Auto" (recommended)
   - Click "Re-test Connectivity"
   - Verify Local ASR shows "Healthy"

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
| `npm run asr:start` | Start local ASR Docker service |
| `npm run asr:stop` | Stop local ASR Docker service |
| `npm run asr:logs` | View ASR service logs |
| `npm run asr:verify` | Run 4 verification tests |
| `npm run asr:restart` | Restart ASR service |

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
| **Local ASR** | Docker Whisper | Latest | Offline speech recognition |
| **HTTP Client** | Axios | 1.7.7 | API communication |
| **Transformers** | @xenova/transformers | 2.17.2 | Local ML model support |
| **Audio Processing** | FFmpeg | 5.2.0 | Audio format conversion |
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
│   │   ├── asrHealthCheck.ts        # Health monitoring with latency tracking
│   │   ├── localASRClient.ts        # 300ms batching, 24KB threshold, guarded processing
│   │   ├── providerController.ts    # Intelligent provider selection and failover
│   │   ├── metricsLogger.ts         # Session metrics and performance tracking
│   │   ├── reasoningEngine.ts       # Filipino keyword intent detection (350ms)
│   │   ├── suggestionPromptBuilder.ts # Optimized prompt construction
│   │   └── languageOptions.ts       # Language configuration
│   ├── assets/             # Application assets
│   │   ├── icon.icns
│   │   ├── icon.ico
│   │   └── icon.png
│   ├── App.tsx             # Main application component
│   ├── index.ts            # Main process entry point
│   ├── preload.ts          # Preload script
│   └── renderer.tsx        # Renderer process entry point
├── scripts/                # ASR management scripts
│   ├── start-local-asr.bat
│   ├── start-local-asr.ps1
│   └── verify-local-asr.ps1
├── docs/                   # Documentation
│   └── LOCAL_ASR_SETUP.md
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
├── whisper-models/         # Local Whisper model storage
│   └── small.pt
├── docker-compose.yml      # Local ASR service configuration
├── SETUP_LOCAL_ASR.md      # Local ASR setup guide
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── forge.config.ts         # Electron Forge configuration
└── webpack.*.config.ts     # Webpack configurations
```

### ASR Provider Architecture

The application implements a sophisticated dual-provider ASR system with intelligent failover:

#### Provider Selection Logic

```
┌─────────────────┐
│   Auto Mode     │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │ Local ASR │ ◄─── Preferred (300ms batching)
    │ Healthy?  │
    └─────┬─────┘
          │ Yes
    ┌─────▼─────┐
    │ Use Local │
    └───────────┘
          │ No
    ┌─────▼─────┐
    │ Deepgram  │ ◄─── Fallback (API required)
    │ Key Set?  │
    └─────┬─────┘
          │ Yes
    ┌─────▼─────┐
    │ Use       │
    │ Deepgram  │
    └───────────┘
          │ No
    ┌─────▼─────┐
    │ No ASR    │
    │ Available │
    └───────────┘
```

#### Batching Architecture

**Local ASR Client (300ms Ultra-Low Latency)**:
- **Batch Interval**: 300ms for responsive real-time feedback
- **Byte Threshold**: 24KB (~0.35s of 16kHz mono audio)
- **Guarded Processing**: `isProcessingBatch` + `pendingProcess` flags prevent race conditions
- **Do-While Drain**: Efficiently processes buffered audio in batches
- **Word Boundary Optimization**: Flushes at optimal points to avoid splitting words

**Performance Characteristics**:
- **Mic-to-ASR Latency**: ~300ms average
- **ASR-to-Suggestion Latency**: ~350ms average
- **Total Response Time**: ~650ms end-to-end

#### Failover Mechanism

1. **Failure Detection**: Monitors connection health and response times
2. **Failure Counting**: Tracks consecutive failures (threshold: 3)
3. **Automatic Switch**: Triggers provider change on failure threshold
4. **Health Recovery**: Monitors failed provider for recovery
5. **Switch Back**: Returns to preferred provider when healthy

### Filipino Language Support

The reasoning engine includes comprehensive Filipino keyword detection:

#### Intent Categories

**Question Detection**:
- English: what, how, why, when, where, can you, could you, would you
- Filipino: ano, paano, bakit, kailan, saan, pwede, maaari bang

**Technical Discussion**:
- English: architecture, design, system, framework, technology, stack, microservice, infrastructure
- Filipino: arkitektura, disenyo, sistema, teknolohiya

**Experience Inquiry**:
- English: experience, background, worked, project, previous, before
- Filipino: karanasan, nagtrabaho, proyekto, nakaraan

**Problem Solving**:
- English: problem, challenge, issue, difficult, trouble, solve
- Filipino: suliranin, hamon, isyu, solusyon

**Process Inquiry**:
- English: process, method, approach, workflow, how do you, methodology
- Filipino: proseso, paraan, daloy, metodolohiya

### Context Providers Architecture

The application uses React Context API for state management across different features:

- **InterviewContext**: Manages transcription text, AI responses, and suggestion history
- **KnowledgeBaseContext**: Handles document storage and conversation history
- **PromptContext**: Controls system prompts and context data
- **ErrorContext**: Centralized error handling and display

### IPC Communication Flow

```
Renderer Process (React) ↔ Preload Script ↔ Main Process (Electron)
```

- **Audio Capture**: System audio → ASR Provider → Transcription → UI
- **AI Requests**: User input → OpenAI API → Response → UI
- **File Processing**: File upload → PDF/Image parsing → Storage → UI
- **Configuration**: Settings → electron-store → Persistent storage
- **Metrics**: Performance data → MetricsLogger → JSON export

## ⚙️ Configuration

### Initial Setup

1. **Launch the application** and navigate to Settings
2. **Configure API Keys**:
   - Enter your OpenAI API key
   - Enter your Deepgram API key (optional if using local ASR)
   - Test the configuration using the "Test API Configuration" button

3. **ASR Provider Configuration**:
   - Set provider mode (Auto/Local/Deepgram)
   - Configure local ASR URL (default: http://127.0.0.1:9001)
   - Test connectivity with "Re-test Connectivity" button

4. **Language Configuration**:
   - Set primary language (e.g., "en" for English)
   - Optionally set secondary language for mixed-language interviews

### ASR Provider Configuration

#### Provider Modes

**Auto Mode (Recommended)**:
```typescript
{
  "asr_provider": "auto",
  "local_asr_url": "http://127.0.0.1:9001",
  "deepgram_api_key": "your-deepgram-key" // Optional fallback
}
```

**Local ASR Only**:
```typescript
{
  "asr_provider": "local",
  "local_asr_url": "http://127.0.0.1:9001"
  // No Deepgram key required
}
```

**Deepgram Only**:
```typescript
{
  "asr_provider": "deepgram",
  "deepgram_api_key": "your-deepgram-key"
  // Local ASR not used
}
```

#### Batching Configuration

**Local ASR Settings**:
- **Batch Interval**: 300ms (fixed for optimal performance)
- **Byte Threshold**: 24KB (~0.35s of 16kHz audio)
- **Health Check Timeout**: 3 seconds
- **Failure Threshold**: 3 consecutive failures

**Deepgram Settings**:
- **Health Check Timeout**: 5 seconds
- **Model**: nova-2 (latest)
- **Language**: Auto-detect with primary/secondary support

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
   - Verify ASR provider status (Local ASR: Healthy/Deepgram: Ready)
   - Check prompt settings are enabled if desired
3. **Start Recording**:
   - Click "Start Recording" button
   - Grant microphone/system audio permissions
   - Begin speaking - transcription will appear in real-time

### Choosing ASR Provider Mode

**Auto Mode (Recommended)**:
- Automatically selects the best available provider
- Prefers local ASR for lower latency and privacy
- Falls back to Deepgram if local ASR fails
- Provides seamless failover without user intervention

**Local ASR Only**:
- Uses only Docker-based Whisper service
- Requires Docker Desktop to be running
- Provides offline capability and data privacy
- Best for consistent, low-latency performance

**Deepgram Only**:
- Uses only cloud-based Deepgram service
- Requires internet connection and API key
- Provides high accuracy and multiple language support
- Best for online interviews with reliable internet

### Monitoring ASR Health

**Real-Time Status Indicators**:
- **Green Dot**: Provider is healthy and responding
- **Red Dot**: Provider is unhealthy or unavailable
- **Latency Display**: Shows response time in milliseconds
- **Provider Pill**: Shows current active provider (Local/Deepgram)

**Health Check Information**:
- **Local ASR**: Connection status, response time, error messages
- **Deepgram**: API key validity, connection status, quota information
- **Last Checked**: Timestamp of most recent health check

### Real-time Suggestions

**Auto-GPT Mode**:
1. **Enable Auto-GPT** by checking the checkbox
2. **Configure Auto-submission**:
   - Set delay timer (default: 300ms for faster response)
   - AI will automatically respond to transcribed questions
3. **Monitor Responses**:
   - AI responses appear in the right panel
   - Conversation history is maintained
   - Clear responses as needed

**Suggestion Features**:
- **300ms Trigger Window**: Fast response to new transcript content
- **Intent Detection**: Recognizes Filipino keywords for better context
- **Duplicate Prevention**: Avoids repetitive suggestions
- **Streaming Updates**: Live suggestion generation as AI responds

### Filipino-English Interviews

**Supported Keywords**:
- **Questions**: "Ano ang experience mo sa React?" (What's your experience with React?)
- **Technical**: "Paano mo i-architect ang microservice?" (How do you architect microservices?)
- **Experience**: "May proyekto ka ba na gumamit ng Node.js?" (Do you have projects using Node.js?)
- **Problems**: "Ano ang pinakamahirap na suliranin mo?" (What's the most difficult problem you've faced?)

**Natural Conversation Flow**:
- Mix English and Filipino naturally
- Use "Barok English" patterns
- Technical terms can be in English
- Questions and responses flow naturally

### Performance Metrics

**Session Monitoring**:
- **Provider Switches**: Track when and why providers change
- **Latency Metrics**: Monitor mic-to-ASR and ASR-to-suggestion times
- **Health Check Results**: Track provider availability over time
- **Utterance Count**: Number of successful transcriptions

**Exporting Session Logs**:
1. Navigate to Settings
2. Click "Export Metrics" button
3. Download JSON file with complete session data
4. Analyze performance patterns and optimization opportunities

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

### ASR Management Scripts

**Local ASR Control**:
```bash
npm run asr:start    # Start local ASR (auto-starts with app)
npm run asr:stop     # Stop local ASR Docker container
npm run asr:logs     # View ASR service logs
npm run asr:verify   # Run 4 verification tests
npm run asr:restart  # Restart ASR service
```

**Verification Tests**:
1. Docker container status check
2. Health endpoint response test
3. Model info retrieval test
4. Application integration test

### Performance Tuning

**Batching Optimization**:
- **300ms Interval**: Balance between latency and efficiency
- **24KB Threshold**: Optimal for word boundary detection
- **Guarded Processing**: Prevents race conditions with concurrent requests
- **Do-While Drain**: Efficiently processes buffered audio

**React Optimization**:
- **Refs Integration**: Prevents stale closures in real-time updates
- **Unicode Word Boundaries**: Proper multilingual text handling
- **Smart Merging**: Reduces duplicate transcript processing

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

#### ASR Provider Problems

**Problem**: "No ASR provider available"
- **Solution**: Check Docker Desktop is running (for local ASR) or Deepgram API key is valid
- **Check**: Provider mode setting in Settings
- **Test**: Use "Re-test Connectivity" button

**Problem**: Local ASR shows "Unhealthy"
- **Solution**: Restart Docker container with `npm run asr:restart`
- **Check**: Port 9001 is not in use by another service
- **Verify**: Docker logs with `npm run asr:logs`

**Problem**: Provider keeps switching between Local and Deepgram
- **Solution**: Check network stability and Docker container health
- **Monitor**: Failure count in console logs
- **Adjust**: Failover threshold if needed

#### Local ASR Issues

**Problem**: Connection refused to local ASR
- **Solution**: Ensure Docker container is running: `docker ps --filter "name=interview-assistant-asr"`
- **Check**: Container status shows "Up X minutes"
- **Restart**: Use `npm run asr:restart` if needed

**Problem**: ASR timeout or slow processing
- **Solution**: Check system resources (CPU, memory)
- **Optimize**: Reduce batch size or increase timeout
- **GPU**: Enable NVIDIA GPU support in docker-compose.yml

**Problem**: Model download fails
- **Solution**: Check internet connection and Docker storage space
- **Retry**: Restart container to retry model download
- **Manual**: Download model manually to whisper-models/ directory

#### Docker Container Issues

**Problem**: Container won't start
- **Solution**: Check Docker Desktop is running and has sufficient resources
- **Logs**: View container logs with `docker logs interview-assistant-asr`
- **Restart**: Use `docker-compose down && docker-compose up -d`

**Problem**: Port 9001 already in use
- **Solution**: Stop conflicting service or change port in docker-compose.yml
- **Check**: `netstat -ano | findstr :9001` (Windows) or `lsof -i :9001` (macOS/Linux)

**Problem**: GPU support not working
- **Solution**: Install NVIDIA Docker runtime and enable GPU in docker-compose.yml
- **Verify**: `docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi`

#### Provider Failover Problems

**Problem**: Failover not triggering after failures
- **Solution**: Check failure count threshold (default: 3)
- **Monitor**: Console logs for failure counting
- **Manual**: Force provider switch in Settings

**Problem**: Health check failures
- **Solution**: Check network connectivity and API key validity
- **Timeout**: Increase health check timeout if needed
- **Test**: Use individual provider health checks

#### Transcript Quality Issues

**Problem**: Words being split across chunks
- **Solution**: Adjust byte threshold or batch interval
- **Check**: Unicode word boundary detection is working
- **Optimize**: Use silence detection for better word boundaries

**Problem**: Duplicate transcript segments
- **Solution**: Check transcript merging logic
- **Monitor**: Console logs for duplicate detection
- **Adjust**: Similarity threshold in reasoning engine

**Problem**: Filipino keywords not detected
- **Solution**: Check reasoning engine keyword list
- **Update**: Add missing keywords to intent detection
- **Test**: Use Filipino phrases in test interviews

#### Metrics Export Issues

**Problem**: Cannot export session logs
- **Solution**: Check file permissions in temp directory
- **Location**: Windows: `%APPDATA%/autosuggest-metrics/`
- **Manual**: Access logs directly from file system

**Problem**: Metrics not being logged
- **Solution**: Check MetricsLogger initialization
- **Verify**: Console logs show metrics logging
- **Restart**: Restart application to reinitialize logger

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
- **Solution**: Verify Deepgram API key is valid (if using Deepgram)
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
- **Metrics**: `%APPDATA%/autosuggest-metrics/` (Windows)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Dependencies

This project uses several open-source libraries:

- **Electron**: Cross-platform desktop application framework
- **React**: User interface library
- **OpenAI**: AI language model integration
- **Deepgram**: Real-time speech recognition
- **Docker**: Containerization platform for local ASR
- **Whisper**: OpenAI's speech recognition model
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: TailwindCSS component library

### Acknowledgments

- **OpenAI** for providing the GPT-4 API and Whisper model
- **Deepgram** for real-time transcription services
- **Electron** team for the desktop application framework
- **React** team for the UI library
- **TailwindCSS** and **DaisyUI** for styling components
- **Docker** team for containerization platform

---

**Author**: nohairblingbling  
**Email**: duskandwine@gmail.com  
**Version**: 1.0.0

For support, feature requests, or bug reports, please open an issue on the GitHub repository.