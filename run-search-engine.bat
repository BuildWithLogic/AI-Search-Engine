@echo off
echo.
echo ========================================
echo    AI Search Engine - Starting...
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start /B node server.js
timeout /t 3 /nobreak >nul

echo [2/2] Opening Search Engine Interface...
start launch.html

echo.
echo ✅ AI Search Engine is now running!
echo.
echo 📊 Backend API: http://localhost:3001
echo 🎨 Search Interface: Opening in browser
echo.
echo Features Active:
echo   ✓ Cross-Platform AI Crawlers (5 platforms)
echo   ✓ Multi-Stage Ranking System
echo   ✓ Real-Time Analytics
echo   ✓ Explainable Search Results
echo   ✓ Sub-200ms Response Optimization
echo.
echo Press any key to exit...
pause >nul