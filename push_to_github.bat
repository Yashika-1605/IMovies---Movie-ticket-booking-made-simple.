@echo off
title Push IMovies to GitHub
color 0A
cd /d "%~dp0"
echo ================================================================
echo           IMOVIES - PUSH CODEBASE TO GITHUB
echo ================================================================
echo Repository: https://github.com/Yashika-1605/IMovies---Movie-ticket-booking-made-simple.
echo Branch:     main
echo.
echo Launching Git Push... If prompted, sign in via your browser.
echo ================================================================
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Code pushed successfully to GitHub!
) else (
    echo [NOTICE] If authentication failed, please verify your GitHub login or token.
)
echo ================================================================
pause
