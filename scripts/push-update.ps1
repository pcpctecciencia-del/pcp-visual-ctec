param(
  [string]$Message = "chore: atualizacao do sistema PCP Visual C-TEC"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# 1. Reconstruir versao unificada automaticamente antes do commit
& "$PSScriptRoot\build-unificado.ps1"

# 2. Localizar executavel do Git
$gitExe = "git"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  if (Test-Path "C:\Program Files\Git\cmd\git.exe") {
    $gitExe = "C:\Program Files\Git\cmd\git.exe"
  } elseif (Test-Path "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe") {
    $gitExe = "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
  }
}

# 3. Adicionar, commitar e enviar para o GitHub
& $gitExe add -A
$status = & $gitExe status --porcelain
if ($status) {
  & $gitExe commit -m $Message
  & $gitExe push origin main
  Write-Host "Alteracoes enviadas com sucesso para o GitHub!" -ForegroundColor Green
} else {
  Write-Host "Nenhuma alteracao pendente para envio." -ForegroundColor Yellow
}
