# Comprehensive Local ASR Verification Script
Write-Host "`n=== LOCAL ASR VERIFICATION TEST ===" -ForegroundColor Cyan

$testResults = @{
    DockerRunning = $false
    ContainerRunning = $false
    HealthCheck = $false
    TranscriptionTest = $false
}

# Test 1: Docker Running
Write-Host "`n[1/4] Checking Docker..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info 2>&1 | Select-String -Pattern "Server Version"
    if ($dockerInfo) {
        $testResults.DockerRunning = $true
        Write-Host "✅ Docker is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Docker is not running" -ForegroundColor Red
}

# Test 2: Container Running
Write-Host "`n[2/4] Checking container status..." -ForegroundColor Yellow
$containerStatus = docker ps --filter "name=interview-assistant-asr" --format "{{.Status}}"
if ($containerStatus -match "Up") {
    $testResults.ContainerRunning = $true
    Write-Host "✅ Container is running: $containerStatus" -ForegroundColor Green
} else {
    Write-Host "❌ Container is not running" -ForegroundColor Red
}

# Test 3: Service Endpoint (API Documentation)
Write-Host "`n[3/4] Testing service endpoint..." -ForegroundColor Yellow
try {
    $serviceResponse = Invoke-WebRequest -Uri "http://127.0.0.1:9001/docs" -TimeoutSec 5
    if ($serviceResponse.StatusCode -eq 200) {
        $testResults.HealthCheck = $true
        Write-Host "✅ Service endpoint responding" -ForegroundColor Green
        Write-Host "   Status: $($serviceResponse.StatusCode)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Service endpoint failed: Status $($serviceResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Service endpoint failed: $_" -ForegroundColor Red
}

# Test 4: Transcription Endpoint (Mock Test)
Write-Host "`n[4/4] Testing transcription endpoint..." -ForegroundColor Yellow
try {
    # Create a minimal WAV file header (silent audio for testing)
    $wavHeader = [byte[]](0x52,0x49,0x46,0x46,0x24,0x00,0x00,0x00,0x57,0x41,0x56,0x45,0x66,0x6D,0x74,0x20,0x10,0x00,0x00,0x00,0x01,0x00,0x01,0x00,0x40,0x1F,0x00,0x00,0x40,0x1F,0x00,0x00,0x01,0x00,0x08,0x00,0x64,0x61,0x74,0x61,0x00,0x00,0x00,0x00)
    $tempWav = [System.IO.Path]::GetTempFileName() + ".wav"
    [System.IO.File]::WriteAllBytes($tempWav, $wavHeader)
    
    $response = curl.exe -X POST -F "audio_file=@$tempWav" http://127.0.0.1:9001/asr?task=transcribe 2>&1
    
    Remove-Item $tempWav -ErrorAction SilentlyContinue
    
    if ($response -match "text") {
        $testResults.TranscriptionTest = $true
        Write-Host "✅ Transcription endpoint responding" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Transcription endpoint available but response unclear" -ForegroundColor Yellow
        Write-Host "   Response: $response" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Transcription test failed: $_" -ForegroundColor Red
}

# Summary
Write-Host "`n=== VERIFICATION SUMMARY ===" -ForegroundColor Cyan
$passedTests = ($testResults.Values | Where-Object { $_ -eq $true }).Count
$totalTests = $testResults.Count

Write-Host "Passed: $passedTests / $totalTests tests" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

foreach ($test in $testResults.GetEnumerator()) {
    $status = if ($test.Value) { "✅" } else { "❌" }
    Write-Host "$status $($test.Key)" -ForegroundColor $(if ($test.Value) { "Green" } else { "Red" })
}

if ($passedTests -eq $totalTests) {
    Write-Host "`n🎉 LOCAL ASR IS FULLY OPERATIONAL!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️ Some tests failed. Check the output above." -ForegroundColor Yellow
    exit 1
}

