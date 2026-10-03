# יוצר מחדש את תמונות השיתוף (og/*.png) ואת עמודי ההפניה של תוצאות המבחן (og/<id>.html).
# הרצה מתיקיית האתר:  powershell -ExecutionPolicy Bypass -File scripts\make-og.ps1
# אופציונלי: -SiteUrl https://USER.github.io/REPO/  כדי שתמונות התצוגה המקדימה יקבלו כתובת מלאה
# (וואטסאפ ופייסבוק עובדים הכי טוב עם כתובת מלאה ל-og:image).
param([string]$SiteUrl = '')

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$og = Join-Path $root 'og'
$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge not found' }

$results = [ordered]@{
  pan = 'מחבת'; whisk = 'מטרפה'; peeler = 'קולפן'; ladle = 'מצקת'; colander = 'מסננת'; spoon = 'כף עץ'
}
if ($SiteUrl -and -not $SiteUrl.EndsWith('/')) { $SiteUrl += '/' }

$ErrorActionPreference = 'Continue' # Edge כותב רעש ל-stderr
$cardUri = ([Uri](Join-Path $og 'card.html')).AbsoluteUri
foreach ($id in @('home') + $results.Keys) {
  $out = Join-Path $og "$id.png"
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
    --virtual-time-budget=4000 --window-size=1200,630 "--screenshot=$out" "$cardUri`?r=$id" 2>$null | Out-Null
  Write-Host "og/$id.png"
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
foreach ($id in $results.Keys) {
  $name = $results[$id]
  $img = if ($SiteUrl) { "${SiteUrl}og/$id.png" } else { "$id.png" }
  $html = @"
<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>יצא לי: $name! | לחץ כאן ואל תלחץ כאן</title>
  <meta property="og:title" content="יצא לי: $name! איזה כלי מטבח אתה?">
  <meta property="og:description" content="שש שאלות מדעיות לחלוטין. בוא לגלות איזה כלי מטבח מסתתר בתוכך.">
  <meta property="og:image" content="$img">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta http-equiv="refresh" content="0; url=../quiz.html?r=$id">
</head>
<body><a href="../quiz.html?r=$id">לתוצאה: $name</a></body>
</html>
"@
  [IO.File]::WriteAllText((Join-Path $og "$id.html"), $html, $utf8)
  Write-Host "og/$id.html"
}
