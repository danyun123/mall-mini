param()

$repoRoot = Split-Path -Parent $PSScriptRoot
$outputPath = Join-Path $repoRoot 'docs\project-state.md'
$packageJsonPath = Join-Path $repoRoot 'package.json'
$docsRoot = Join-Path $repoRoot 'docs'
$miniprogramRoot = Join-Path $repoRoot 'miniprogram'

function Get-ChildNames {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Directory
  )

  if (-not (Test-Path -LiteralPath $Directory)) {
    return @()
  }

  # .gitkeep 只用于保留空目录，不代表真实业务模块或知识库文档。
  return Get-ChildItem -LiteralPath $Directory |
    Where-Object { $_.PSIsContainer -or $_.PSIsContainer -eq $false } |
    Where-Object { $_.Name -ne '.gitkeep' } |
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

$baseKnowledgeItems = @(
  'docs/PRODUCT.md'
  'docs/ARCHITECTURE.md'
  'docs/CHECKLISTS.md'
  'docs/LESSONS_LEARNED.md'
  'docs/harness-engineering-guide.md'
  'docs/harness-engineering-team-playbook.md'
)
# 固定知识入口也必须以当前仓库事实为准，避免已删除文档被重新写回项目状态快照。
$knowledgeItems = $baseKnowledgeItems | Where-Object { Test-Path -LiteralPath (Join-Path $repoRoot $_) }
$knowledgeItems += $docsFeatures
$knowledgeItems += $docsExecPlans

$projectState = @(
  '# 项目状态快照'
  ''
  # 共享快照只写入稳定项目索引；本地时间、分支、HEAD 和工作树状态会导致无意义合并冲突。
  "- 包管理器：$($packageJson.packageManager)"
  "- 同步命令：``npm run sync:state``"
  ''
  '## 本地状态'
  '- 本文件不记录本地更新时间、分支、HEAD 或工作树状态。'
  '- 查看本地状态请运行 `git status --short --branch`。'
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
  '- 需要提交信息时使用 `git rev-parse --short HEAD`，不要把本地瞬时状态写入共享文档。'
  "- 复杂需求先写 ``docs/exec-plans/`` 或 ``docs/features/``，再动代码。"
  '- AI 输出必须包含改动文件、验证结果和残余风险。'
  ''
) -join "`n"

[System.IO.File]::WriteAllText($outputPath, $projectState, [System.Text.UTF8Encoding]::new($false))

# Keep the generated markdown aligned with the repo's formatting rules.
& npm exec -- prettier --write $outputPath | Out-Null

Write-Host "Updated $(Resolve-Path -LiteralPath $outputPath)"
