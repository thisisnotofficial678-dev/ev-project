@echo off
REM smoke-tests.bat — basic checks for local backend (Windows)

REM ---- Configure these two values ----
set API=http://localhost:5000
set TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRlc3RVc2VyIiwiaWQiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc1NzAzNzEyNCwiZXhwIjoxNzU3NjQxOTI0fQ.k-R5DIZZx6nWsPLz11tE-vYpafONiUy514MZEZCIYNw

echo.
echo ===========================
echo SMOKE TESTS — %API%
echo ===========================
echo.

echo 1) Check Swagger / API docs (health)
echo ---------------------------
curl -i %API%/api-docs
echo.
echo.

echo 2) List stations
echo ---------------------------
curl "%API%/stations"
echo.
echo.

echo 3) ETA between two points (public)
echo ---------------------------
curl "%API%/eta?fromLat=12.9716&fromLng=77.5946&toLat=12.9352&toLng=77.6245"
echo.
echo.

echo 4) Nearest stations (requires auth)
echo ---------------------------
if "%TOKEN%"=="<PASTE_YOUR_JWT_HERE>" (
  echo WARNING: TOKEN not set. Edit this file and set TOKEN before running nearest/payments tests.
) else (
  curl -H "Authorization: Bearer %TOKEN%" "%API%/stations/nearest?lat=12.9716&lng=77.5946"
)
echo.
echo.

echo 5) Get my payments (requires auth)
echo ---------------------------
if "%TOKEN%"=="<PASTE_YOUR_JWT_HERE>" (
  echo Skipping payments test because TOKEN not set.
) else (
  curl -H "Authorization: Bearer %TOKEN%" "%API%/payments"
)
echo.
echo.

echo 6) (Optional) Create a test booking/payment flow - example (requires a valid bookingId)
echo ---------------------------
echo NOTE: Example only. Edit bookingId and other values as needed and uncomment to run.
REM curl -X POST "%API%/payments" -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"bookingId\":1,\"amount\":100}"
echo.
echo.

echo All tests finished.
pause
