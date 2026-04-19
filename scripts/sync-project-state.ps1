param()

$repoRoot = Split-Path -Parent $PSScriptRoot
$outputPath = Join-Path $repoRoot 'docs\project-state.md'
$packageJsonPath = Join-Path $repoRoot 'package.json'
$docsRoot = Join-Path $repoRoot 'docs'
$miniprogramRoot = Join-Path $repoRoot 'miniprogram'

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Args
  )

  $output = & git @Args 2>$null

  if ($LASTEXITCODE -ne 0) {
    return $null
  }

  if ($output -is [array]) {
    return (($output | ForEach-Object { $_.ToString() }) -join "`n").Trim()
  }

  return ([string]$output).Trim()
}

function Get-ChildNames {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Directory
  )

  if (-not (Test-Path -LiteralPath $Directory)) {
    return @()
  }

  return Get-ChildItem -LiteralPath $Directory |
    Where-Object { $_.PSIsContainer -or $_.PSIsContainer -eq $false } |
    Sort-Object Name |
    Select-Object -ExpandProperty Name
}

function Format-Bullets {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Items,
    [Parameter(Mandatory = $true)]
    [string]$EmptyText
  )

  if ($Items.Count -eq 0) {
    return @("- $EmptyText")
  }

  return $Items | ForEach-Object { "- $_" }
}

$packageJson = Get-Content -Raw -Encoding UTF8 $packageJsonPath | ConvertFrom-Json
$updatedAt = Get-Date -Format 'yyyy年M月d日dddd HH:mm:ss'
$branch = Invoke-Git @('symbolic-ref', '--short', 'HEAD')
if (-not $branch) { $branch = 'unknown' }
$head = Invoke-Git @('rev-parse', '--short', 'HEAD')
if (-not $head) { $head = 'no-commit-yet' }
$dirtyFiles = Invoke-Git @('status', '--short')
if ($dirtyFiles) {
  $dirtyFiles = $dirtyFiles -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ }
} else {
  $dirtyFiles = @()
}

$docsFeatures = Get-ChildNames (Join-Path $docsRoot 'features') | ForEach-Object { "docs/features/$_" }
$docsExecPlans = Get-ChildNames (Join-Path $docsRoot 'exec-plans') | ForEach-Object { "docs/exec-plans/$_" }
$pages = Get-ChildNames (Join-Path $miniprogramRoot 'pages')
$baseComponents = Get-ChildNames (Join-Path (Join-Path $miniprogramRoot 'components') 'base')
$coreServices = Get-ChildNames (Join-Path (Join-Path $miniprogramRoot 'services') 'core')
$stores = Get-ChildNames (Join-Path $miniprogramRoot 'stores')
$types = Get-ChildNames (Join-Path $miniprogramRoot 'types')

$pagesText = if ($pages.Count -gt 0) { [string]::Join(', ', $pages) } else { '无' }
$baseComponentsText = if ($baseComponents.Count -gt 0) { [string]::Join(', ', $baseComponents) } else { '无' }
$coreServicesText = if ($coreServices.Count -gt 0) { [string]::Join(', ', $coreServices) } else { '无' }
$storesText = if ($stores.Count -gt 0) { [string]::Join(', ', $stores) } else { '无' }
$typesText = if ($types.Count -gt 0) { [string]::Join(', ', $types) } else { '无' }

$knowledgeItems = @(
  'docs/PRODUCT.md'
  'docs/ARCHITECTURE.md'
  'docs/CHECKLISTS.md'
  'docs/harness-engineering-guide.md'
  'docs/harness-engineering-team-playbook.md'
)
$knowledgeItems += $docsFeatures
$knowledgeItems += $docsExecPlans

$projectState = @(
  '# 项目状态快照'
  ''
  "- 更新时间：$updatedAt"
  "- 分支：$branch"
  "- HEAD：$head"
  "- 包管理器：$($packageJson.packageManager)"
  "- 同步命令：``npm run sync:state``"
  ''
  '## 当前工作树'
  (Format-Bullets -Items $dirtyFiles -EmptyText '工作树干净，没有未提交修改')
  ''
  '## 当前模块'
  (Format-Bullets -Items @(
      "pages: $pagesText"
      "components/base: $baseComponentsText"
      "services/core: $coreServicesText"
      "stores: $storesText"
      "types: $typesText"
    ) -EmptyText '暂无模块信息')
  ''
  '## 知识库索引'
  (Format-Bullets -Items $knowledgeItems -EmptyText '暂无索引项')
  ''
  '## 协作提醒'
  "- 新增或跨模块改动后先运行 ``npm run sync:state``。"
  "- 复杂需求先写 ``docs/exec-plans/`` 或 ``docs/features/``，再动代码。"
  '- AI 输出必须包含改动文件、验证结果和残余风险。'
  ''
) -join "`n"

[System.IO.File]::WriteAllText($outputPath, $projectState, [System.Text.UTF8Encoding]::new($false))

# Keep the generated markdown aligned with the repo's formatting rules.
& npm exec -- prettier --write $outputPath | Out-Null

Write-Host "Updated $(Resolve-Path -LiteralPath $outputPath)"
