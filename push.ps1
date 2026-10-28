# Push IMovies codebase to GitHub repository
param(
    [string]$Token = ""
)

$repoUrl = "https://github.com/Yashika-1605/IMovies---Movie-ticket-booking-made-simple..git"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "             IMOVIES - PUSH TO GITHUB REPOSITORY                " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Repository: $repoUrl"
Write-Host "Branch:     main"
Write-Host ""

if ($Token -ne "") {
    Write-Host "[INFO] Pushing with provided token..." -ForegroundColor Yellow
    $authUrl = "https://${Token}@github.com/Yashika-1605/IMovies---Movie-ticket-booking-made-simple..git"
    git push $authUrl main
} else {
    Write-Host "Choose authentication method:" -ForegroundColor Green
    Write-Host "  [1] Standard Git Push (Browser Login via Git Credential Manager)"
    Write-Host "  [2] Push with GitHub Personal Access Token"
    $choice = Read-Host "Enter choice (1 or 2)"

    if ($choice -eq "2") {
        $pat = Read-Host "Paste your GitHub Personal Access Token (PAT)"
        if ($pat -ne "") {
            $authUrl = "https://${pat}@github.com/Yashika-1605/IMovies---Movie-ticket-booking-made-simple..git"
            git push $authUrl main
        } else {
            Write-Host "[ERROR] Token cannot be empty." -ForegroundColor Red
        }
    } else {
        Write-Host "[INFO] Running git push -u origin main..." -ForegroundColor Yellow
        git push -u origin main
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "[SUCCESS] IMovies codebase pushed to GitHub!" -ForegroundColor Green
    Write-Host "View repository: https://github.com/Yashika-1605/IMovies---Movie-ticket-booking-made-simple." -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[NOTICE] If push failed, generate a PAT at https://github.com/settings/tokens (classic) with 'repo' scope." -ForegroundColor Yellow
}
