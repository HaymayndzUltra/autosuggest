# Local ASR Setup - First Time

## Prerequisites
1. Install Docker Desktop for Windows
2. Ensure Docker service is running

## Setup Steps

1. **Pull Docker Image (first time only)**
   ```bash
   docker-compose pull
   ```
   Note: This downloads ~2GB, may take 5-10 minutes

2. **Start the service**
   ```bash
   npm run asr:start
   ```
   First run downloads Whisper model (~500MB)
   Wait 1-2 minutes for initialization

3. **Verify setup**
   ```bash
   npm run asr:verify
   ```
   All tests should pass ✅

4. **Configure the app**
   - Start Interview Assistant
   - Go to Settings → ASR Provider Settings
   - Set mode to "Auto" or "Local ASR only"
   - Click "Re-test Connectivity"
   - Verify Local ASR shows "Healthy"

5. **Test recording**
   - Go to Interview page
   - Click "Start Recording"
   - Speak into microphone
   - Verify transcripts appear

## Daily Use

The service starts automatically when you launch the app.

To manually control:
- Start: `npm run asr:start`
- Stop: `npm run asr:stop`
- View logs: `npm run asr:logs`
- Restart: `npm run asr:restart`

