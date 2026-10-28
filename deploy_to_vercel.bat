@echo off
title Deploy IMovies to Vercel
color 0B
cd /d "%~dp0"
set "PATH=%~dp0node-v20.18.0-win-x64;%PATH%"

echo ================================================================
echo           IMOVIES - INSTANT DEPLOYMENT TO VERCEL
echo ================================================================
echo This script will build and deploy IMovies frontend directly
echo to Vercel to generate your live public demo website link!
echo ================================================================
echo.

cd client
echo [1/2] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Please inspect the logs above.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Deploying to Vercel...
echo If prompted, log in with GitHub or your email in the browser.
echo.
call npx --yes vercel --prod
echo.
echo ================================================================
echo [DONE] Your live production link is displayed above!
echo Copy the link and share it with your mentor.
echo ================================================================
pause
