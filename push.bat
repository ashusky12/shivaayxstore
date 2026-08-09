@echo off
title ShivaayXStore Auto Push
echo =======================================
echo 🚀 UPLOADING CHANGES TO GITHUB...
echo =======================================
echo.

:: Initialize Git if not already done
if not exist .git (
    echo [1/4] Initializing local Git repository...
    git init
    git branch -M main
)

echo [2/4] Linking to your GitHub repository...
:: Update remote origin to point to user's repo
git remote remove origin >nul 2>&1
git remote add origin https://github.com/ashusky12/shivaayxstore.git

echo [3/4] Adding files and creating commit...
git add .
git commit -m "Auto-update from ShivaayXStore"

echo [4/4] Pushing to GitHub...
git push -u origin main

echo.
echo =======================================
echo ✅ UPLOAD COMPLETED SUCCESSFULLY!
echo =======================================
echo.
pause
