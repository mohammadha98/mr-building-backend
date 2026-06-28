# ============================================================
#  Fix Redis config for node-redis v4 (cache-manager-redis-store)
#    host/port  ->  socket: { host, port, tls }
#    password   ->  ternary (no bare "&& false" in dev mode)
#  Skips the @nestjs-modules/ioredis module (its flat format is correct).
#  Backs up every file it changes.
#  >> Run from the project root (the folder that contains "src").
# ============================================================

$root   = ".\src"
$DryRun = $false     # اول با $true اجرا کن تا لیست رو ببینی، بعد بذار $false و دوباره اجرا کن

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = ".\redis-fix-backup-$timestamp"

# --- host + port (تخت) -> بلوک socket ---
$hostPortPattern = '(?<ind>[ \t]*)host:[ \t]*process\.env\.REDIS_HOST[ \t]*,[ \t]*\r?\n[ \t]*port:[ \t]*parseInt\([^)]*\)[ \t]*,'
$hostPortReplace = @'
${ind}socket: {
${ind}  host: process.env.REDIS_HOST,
${ind}  port: parseInt(process.env.REDIS_PORT || '6379', 10),
${ind}  ...(process.env.REDIS_TLS === 'true' && { tls: true }),
${ind}},
'@

# --- password (عبارت &&) -> ternary ---
$passPattern = '(?<ind2>[ \t]*)password:[ \t]*\r?\n[ \t]*process\.env\.APP_MODE[ \t]*!==[ \t]*"development"[ \t]*&&[ \t]*process\.env\.REDIS_PASSWORD[ \t]*,'
$passReplace = @'
${ind2}password:
${ind2}  process.env.APP_MODE !== 'development'
${ind2}    ? process.env.REDIS_PASSWORD
${ind2}    : undefined,
'@

# فقط فایل‌های cache-manager-redis-store (فایل ioredis به‌صورت خودکار حذف می‌شه)
$files = Get-ChildItem -Path $root -Recurse -Filter *.ts | Where-Object {
    Select-String -Path $_.FullName -SimpleMatch -Pattern 'redisStore.redisStore' -Quiet
}

$changed = 0; $skipped = 0

foreach ($file in $files) {
    $original = Get-Content -LiteralPath $file.FullName -Raw

    # محافظت در برابر اجرای دوباره: اگه از قبل socket داره، رد شو
    if ($original -match 'socket:\s*\{') {
        Write-Host "SKIP (already fixed): $($file.FullName)" -ForegroundColor DarkYellow
        $skipped++; continue
    }

    $updated = [regex]::Replace($original, $hostPortPattern, $hostPortReplace)
    $updated = [regex]::Replace($updated,  $passPattern,     $passReplace)

    if ($updated -eq $original) {
        Write-Host "NO MATCH: $($file.FullName)" -ForegroundColor DarkGray
        $skipped++; continue
    }

    if ($DryRun) {
        Write-Host "WOULD FIX: $($file.FullName)" -ForegroundColor Yellow
        $changed++; continue
    }

    # backup با حفظ ساختار پوشه‌ها
    $relative   = (Resolve-Path -LiteralPath $file.FullName -Relative) -replace '^\.\\',''
    $backupPath = Join-Path $backupDir $relative
    New-Item -ItemType Directory -Path (Split-Path $backupPath) -Force | Out-Null
    Copy-Item -LiteralPath $file.FullName -Destination $backupPath

    # نوشتن بدون BOM (سازگار با هر نسخه PowerShell)
    [System.IO.File]::WriteAllText($file.FullName, $updated, [System.Text.UTF8Encoding]::new($false))
    Write-Host "FIXED: $($file.FullName)" -ForegroundColor Green
    $changed++
}

Write-Host ""
if ($DryRun) {
    Write-Host "DRY RUN. Would fix: $changed   Skipped: $skipped" -ForegroundColor Cyan
    Write-Host "حالا `$DryRun` رو بذار `$false` و دوباره اجرا کن." -ForegroundColor Cyan
} else {
    Write-Host "Done. Fixed: $changed   Skipped: $skipped" -ForegroundColor Cyan
    if ($changed -gt 0) { Write-Host "Backups: $backupDir" -ForegroundColor Cyan }
}