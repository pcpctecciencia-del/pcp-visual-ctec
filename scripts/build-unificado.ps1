# =============================================================================
# Script de Build: Gera um arquivo HTML unico (standalone) a partir da
# estrutura modular em src/ para compartilhamento rapido (WhatsApp / E-mail).
# Uso: powershell -ExecutionPolicy Bypass -File .\scripts\build-unificado.ps1
# =============================================================================
$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$rootDir = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $rootDir "dist"
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

$html = [System.IO.File]::ReadAllText((Join-Path $rootDir "index.html"), [System.Text.Encoding]::UTF8)

# 1. Inline <link rel="stylesheet" href="...">
$html = [regex]::Replace($html, '<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>', {
    param($m)
    $relPath = $m.Groups[1].Value -replace '/', '\'
    $fullPath = Join-Path $rootDir $relPath
    $cssContent = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
    return "<style>`r`n$cssContent`r`n</style>"
})

# 2. Inline local <script src="src/...">
$html = [regex]::Replace($html, '<script\s+src="(src/[^"]+)"\s*></script>', {
    param($m)
    $relPath = $m.Groups[1].Value -replace '/', '\'
    $fullPath = Join-Path $rootDir $relPath
    $jsContent = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
    return "<script>`r`n$jsContent`r`n</script>"
})

$outFile = Join-Path $distDir "PCP_Visual_CTEC_V106_UNIFICADO.html"
[System.IO.File]::WriteAllText($outFile, $html, $utf8NoBom)
Write-Host "Build unificado gerado com sucesso em: $outFile"
