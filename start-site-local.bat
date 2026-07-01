@echo off
cd /d "%~dp0"
echo Starting Jenny ^& David site at http://localhost:8080
start "" "http://localhost:8080"
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8080
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8080
  goto :end
)
echo Python was not found. Please install Python or use another local web server.
pause
:end
