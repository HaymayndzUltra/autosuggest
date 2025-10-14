# Start Local ASR Service for Interview Assistant
Write-Host "Starting Local ASR Service..." -ForegroundColor Green

# Check if Docker is running
$dockerRunning = docker info 2>&1 | Select-String -Pattern "Server Version"
if (-not $dockerRunning) {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if container exists and is running
$containerStatus = docker ps -a --filter "name=interview-assistant-asr" --format "{{.Status}}"

if ($containerStatus -match "Up") {
    Write-Host "Local ASR is already running!" -ForegroundColor Yellow
    exit 0
}

if ($containerStatus) {
    Write-Host "Starting existing container..." -ForegroundColor Yellow
    docker start interview-assistant-asr
} else {
    Write-Host "Creating new container from docker-compose..." -ForegroundColor Yellow
    docker-compose up -d
}

# Wait for health check
Write-Host "Waiting for ASR service to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:9001/health" -TimeoutSec 2 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "Local ASR is ready!" -ForegroundColor Green
            exit 0
        }
    } catch {
        $attempt++
        Start-Sleep -Seconds 2
    }
}

Write-Host "Timeout waiting for ASR service. Check Docker logs." -ForegroundColor Red
exit 1

