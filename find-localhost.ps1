Write-Host "Searching for 'localhost' in the project..." -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow

# پیدا کردن تمام فایل‌های پروژه (پوشه‌های node_modules، dist و .git نادیده گرفته می‌شوند تا جستجو سریع و دقیق باشد)
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\dist\\' -and
    $_.FullName -notmatch '\\\.git\\'
}

# جستجوی کلمه localhost داخل فایل‌ها
$results = $files | Select-String -SimpleMatch "env.APP_PORT"

$count = 0
foreach ($match in $results) {
    # ساختاربندی مسیر برای اینکه در VS Code قابل کلیک باشد (Path:LineNumber)
    $clickablePath = "$($match.Path):$($match.LineNumber)"
    
    # گرفتن کدی که کلمه localhost در آن پیدا شده
    $codeSnippet = $match.Line.Trim()

    # چاپ نتیجه در ترمینال
    Write-Host $clickablePath -ForegroundColor Cyan
    Write-Host "   > $codeSnippet" -ForegroundColor Gray
    Write-Host "---------------------------------------------------" -ForegroundColor DarkGray
    
    $count++
}

Write-Host "Total '127.0.0.1' occurrences found: $count" -ForegroundColor Green
