# Local ASR Setup Verification Checklist

## Automated Verification
Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-local-asr.ps1`

Expected output: All 4 tests pass (✅)

## Manual Verification Steps

### 1. Docker Container Check
```bash
docker ps --filter "name=interview-assistant-asr"
```
Expected: Status shows "Up X minutes"

### 2. Health Check
```bash
curl http://127.0.0.1:9001/health
```
Expected: `{"status":"ok"}` or similar

### 3. Model Info
```bash
curl http://127.0.0.1:9001/
```
Expected: API documentation response

### 4. App Integration Test

**Step 4.1:** Start the Interview Assistant app

**Step 4.2:** Go to Settings → ASR Provider Settings

**Step 4.3:** Click "Re-test Connectivity"

**Expected Results:**
- Local ASR: Healthy (green dot) ✅
- Latency shown (e.g., "42ms")

**Step 4.4:** Set ASR Provider Mode to "Local ASR only"

**Step 4.5:** Click "Save Settings"

**Step 4.6:** Go to Interview page

**Step 4.7:** Click "Start Recording"

**Expected Results:**
- Start button works ✅
- Provider pill shows "ASR: Local" ✅
- No errors in console ✅

**Step 4.8:** Speak into microphone

**Expected Results:**
- Transcripts appear in real-time ✅
- Text updates as you speak ✅
- No "Deepgram" messages in console ✅

### 5. Failover Test

**Step 5.1:** While recording, stop the Docker container:
```bash
docker stop interview-assistant-asr
```

**Expected Results:**
- Console shows: "❌ Local ASR failure #1, #2, #3"
- After 3 failures: "🔄 ASR Provider switched: local → deepgram (errors)"
- Provider pill changes to "ASR: Deepgram" ✅
- Toast notification appears ✅
- Transcripts continue (from Deepgram) ✅

**Step 5.2:** Restart Docker container:
```bash
docker start interview-assistant-asr
```

**Expected Results:**
- App detects local ASR is healthy again
- On next Start Recording, uses Local (if mode is Auto) ✅

## Acceptance Criteria - ALL MUST PASS

- [ ] Automated test script passes 4/4 tests
- [ ] Docker container starts automatically with app
- [ ] Health endpoint responds in <500ms
- [ ] App Settings shows Local ASR as "Healthy"
- [ ] Recording works with Local ASR only (no Deepgram key)
- [ ] Provider pill correctly shows "ASR: Local"
- [ ] Transcripts appear in real-time
- [ ] Failover to Deepgram works after 3 local failures
- [ ] No TypeScript compilation errors
- [ ] No console errors during normal operation

## Troubleshooting

### Container won't start
```bash
docker-compose down
docker-compose up -d
docker logs interview-assistant-asr
```

### Health check fails
- Wait 30-60 seconds for model download on first run
- Check port 9001 is not in use: `netstat -ano | findstr :9001`

### No transcripts
- Check microphone permissions
- Verify audio routing in DevTools console
- Check Docker logs: `docker logs -f interview-assistant-asr`

