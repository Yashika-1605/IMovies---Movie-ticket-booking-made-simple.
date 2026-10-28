@echo off
title Push IMovies to GitHub
color 0A
cd /d "%~dp0"

echo ================================================================
echo           IMOVIES - PUSH CODEBASE TO GITHUB
echo ================================================================
echo Repository: https://github.com/Yashika-1605/IMovies---Movie-ticket-booking-made-simple.
echo Branch:     main
echo ================================================================
echo.
echo Choose authentication method:
echo   [1] Standard Git Push (Browser Login via Git Credential Manager)
echo   [2] Push using GitHub Personal Access Token (PAT)
echo   [3] Exit
echo.
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" goto standard_push
if "%choice%"=="2" goto token_push
if "%choice%"=="3" goto end
goto standard_push

:standard_push
echo.
echo [INFO] Running: git push -u origin main...
echo [INFO] If a browser window opens, please authorize GitHub.
echo.
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo [SUCCESS] IMovies codebase successfully pushed to GitHub!
    echo ================================================================
    goto end
) else (
    echo.
    echo [WARNING] Push failed or was cancelled.
    echo You can retry with a Personal Access Token (Option 2).
    goto retry_token
)

:retry_token
echo.
set /p retry="Would you like to try pushing with a GitHub Personal Access Token now? (Y/N): "
if /i "%retry%"=="Y" goto token_push
goto end

:token_push
echo.
echo ----------------------------------------------------------------
echo Tip: Generate a token at https://github.com/settings/tokens (classic)
echo with 'repo' scope.
echo ----------------------------------------------------------------
set /p ghtoken="Paste your GitHub Personal Access Token: "
if "%ghtoken%"=="" (
    echo [ERROR] Token cannot be empty.
    goto end
)

echo.
echo [INFO] Pushing with provided Personal Access Token...
git push https://%ghtoken%@github.com/Yashika-1605/IMovies---Movie-ticket-booking-made-simple.git main
if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo [SUCCESS] IMovies codebase successfully pushed to GitHub!
    echo ================================================================
) else (
    echo.
    echo [ERROR] Push failed. Please check your token validity and repository permissions.
)
goto end

:end
echo.
echo Press any key to exit...
pause >nul
