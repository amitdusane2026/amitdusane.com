param([Parameter(Mandatory=$true)][string]$Out, [Parameter(Mandatory=$true)][string[]]$Sheets, [string]$DataDir, [string]$Title = "")
# Provenance. These files are meant to be copied, so the point is not to stop
# that but to make sure the copy still says where it came from. A source line
# gets kept; a copyright notice gets deleted.
$CREDIT = "Template from amitdusane.com  |  Amit G Dusane"
$ErrorActionPreference = "Stop"
$fills = @{ orange = 0x9CC2F4; green = 0x8ED0A9; blue = 0xE0B48E; grey = 0xD9D9D9; red = 0x7A7AE8 }
$tabs  = @{ orange = 0x0DA5ED; green = 0x62B54E; blue = 0xC07000; grey = 0xA6A6A6; red = 0x4646D0 }
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false; $xl.DisplayAlerts = $false
$wb = $xl.Workbooks.Add()
while ($wb.Worksheets.Count -gt 1) { $wb.Worksheets.Item($wb.Worksheets.Count).Delete() }
$idx = 0
foreach ($spec in $Sheets) {
  $parts = $spec -split '\|', 2
  $file = Join-Path $DataDir $parts[0]
  $name = $parts[1]
  $lines = @(Get-Content -LiteralPath $file -Encoding UTF8)
  $meta = @{}
  $rows = @()
  foreach ($ln in $lines) {
    if ($ln -match '^#') { $f = $ln -split "`t"; $meta[$f[0]] = $f[1..($f.Count-1)] }
    else { $rows += ,($ln -split "`t") }
  }
  $idx++
  if ($idx -eq 1) { $ws = $wb.Worksheets.Item(1) } else { $ws = $wb.Worksheets.Add([System.Reflection.Missing]::Value, $wb.Worksheets.Item($wb.Worksheets.Count)) }
  $ws.Name = $name
  if ($meta.ContainsKey('#TAB')) { $ws.Tab.Color = $tabs[$meta['#TAB'][0]] }

  $startRow = 1
  if ($meta.ContainsKey('#TITLE')) {
    $ws.Cells.Item(1,1).Value2 = $meta['#TITLE'][0]
    $ws.Cells.Item(1,1).Font.Bold = $true
    $ws.Cells.Item(1,1).Font.Size = 13
    $startRow = 3
  }
  # Types, not a blanket text format. Forcing "@" on every cell made Excel
  # flag "number stored as text" on every count, position and hour, and a
  # workbook peppered with green error triangles reads as a broken workbook
  # whatever it actually contains. Numbers go in as numbers, dates as dates,
  # and only the columns named in #TEXTCOLS are held as text.
  $ws.Cells.NumberFormat = "General"
  $textCols = @()
  if ($meta.ContainsKey('#TEXTCOLS')) { $textCols = $meta['#TEXTCOLS'] | ForEach-Object { [int]$_ } }
  $dateCols = @()
  if ($meta.ContainsKey('#DATECOLS')) { $dateCols = $meta['#DATECOLS'] | ForEach-Object { [int]$_ } }
  foreach ($tc in $textCols) { $ws.Columns.Item($tc).NumberFormat = "@" }
  foreach ($dc in $dateCols) { $ws.Columns.Item($dc).NumberFormat = "dd mmm yyyy" }

  $nCols = ($rows | ForEach-Object { $_.Count } | Measure-Object -Maximum).Maximum
  for ($r = 0; $r -lt $rows.Count; $r++) {
    for ($c = 0; $c -lt $rows[$r].Count; $c++) {
      $v = $rows[$r][$c]
      if ($v -eq "") { continue }
      $col = $c + 1
      $cell = $ws.Cells.Item($startRow + $r, $col)
      try {
      if ($textCols -contains $col) { $cell.Value2 = $v }
      elseif ($dateCols -contains $col -and $v -match '^\d{4}-\d{2}-\d{2}$') { $cell.Value2 = ([datetime]::ParseExact($v,'yyyy-MM-dd',$null)).ToOADate() }
      elseif ($v -match '^-?\d+$')        { $cell.Value2 = [int]$v }
      elseif ($v -match '^-?\d+\.\d+$')   { $cell.Value2 = [double]$v }
      else                                { $cell.Value2 = $v }
      } catch { throw ("cell R{0}C{1} on sheet '{2}' value '{3}': {4}" -f ($startRow+$r), $col, $name, $v, $_.Exception.Message) }
    }
  }
  $hdrRow = $startRow
  $hdr = $ws.Range($ws.Cells.Item($hdrRow,1), $ws.Cells.Item($hdrRow,$nCols))
  $hdr.Font.Bold = $true
  $hdr.Font.Color = 0x000000
  $hdr.VerticalAlignment = -4108
  $hdr.WrapText = $true
  $hdr.RowHeight = 30
  if ($meta.ContainsKey('#FILLS')) {
    $fl = $meta['#FILLS']
    for ($c = 0; $c -lt $nCols; $c++) {
      $key = if ($c -lt $fl.Count) { $fl[$c] } else { $fl[$fl.Count-1] }
      $ws.Cells.Item($hdrRow, $c+1).Interior.Color = $fills[$key]
    }
  }
  if ($meta.ContainsKey('#COMMENTS')) {
    $cm = $meta['#COMMENTS']
    for ($c = 0; $c -lt $cm.Count -and $c -lt $nCols; $c++) {
      if ($cm[$c] -ne "") {
        $cell = $ws.Cells.Item($hdrRow, $c+1)
        $null = $cell.AddComment($cm[$c])
        $cell.Comment.Shape.TextFrame.AutoSize = $true
      }
    }
  }
  if ($meta.ContainsKey('#WIDTHS')) {
    $w = $meta['#WIDTHS']
    for ($c = 0; $c -lt $w.Count -and $c -lt $nCols; $c++) { $ws.Columns.Item($c+1).ColumnWidth = [double]$w[$c] }
  }
  $lastRow = $startRow + $rows.Count - 1
  $body = $ws.Range($ws.Cells.Item($hdrRow+1,1), $ws.Cells.Item($lastRow,$nCols))
  $body.WrapText = $true
  $body.VerticalAlignment = -4160
  $all = $ws.Range($ws.Cells.Item($hdrRow,1), $ws.Cells.Item($lastRow,$nCols))
  foreach ($b in 7,8,9,10,11,12) { try { $all.Borders.Item($b).LineStyle = 1; $all.Borders.Item($b).Color = 0xBFBFBF } catch {} }
  $all.Font.Name = "Calibri"
  $all.Font.Size = 11
  if ($meta.ContainsKey('#FILTER')) { $null = $all.AutoFilter() }
  if ($meta.ContainsKey('#FREEZE')) {
    $ws.Activate()
    $xl.ActiveWindow.FreezePanes = $false
    $ws.Cells.Item([int]$meta['#FREEZE'][0], 1).Select()
    $xl.ActiveWindow.FreezePanes = $true
  }
  $ws.Rows.Item("$($hdrRow+1):$lastRow").AutoFit() | Out-Null
  # Belt and braces: suppress any error indicator that survives the typing
  # above, such as a version string like "1.0" that has to stay text. The
  # ignore flag is stored in the workbook, so the downloaded file is clean too.
  foreach ($errType in 0,1,2,3,4,5,6) {
    try { $all.Errors.Item($errType).Ignore = $true } catch {}
  }
  # Visible credit, two rows below the data so it is never mistaken for a row
  # of the table, and never inside the bordered range above.
  $creditRow = $lastRow + 2
  $cc = $ws.Cells.Item($creditRow, 1)
  $cc.Value2 = $CREDIT
  $cc.Font.Size = 9
  $cc.Font.Italic = $true
  $cc.Font.Color = 0x808080
  # The print footer is NOT set here. PageSetup is unavailable through COM on
  # this machine -- every property assignment throws, plain strings included,
  # with printers installed and PrintCommunication disabled. footer.ps1 writes
  # it into the saved file's XML instead, which is deterministic anyway.
  $ws.Cells.Item(1,1).Select()
}
$wb.Worksheets.Item(1).Activate()

# File metadata, set deliberately rather than inherited from the Excel licence.
# This is what survives a copy, a rename and a re-save.
$props = @{
  'Title'    = $(if ($Title -ne "") { $Title } else { 'Adobe Analytics project delivery template' })
  'Subject'  = 'Adobe Analytics implementation documentation'
  'Author'   = 'Amit G Dusane'
  'Manager'  = 'Amit G Dusane'
  'Company'  = 'amitdusane.com'
  'Category' = 'Template'
  'Keywords' = 'Adobe Analytics, SDR, Solution Design Reference, BRD, TSD, implementation, amitdusane.com'
  'Comments' = "Created by Amit G Dusane for amitdusane.com. Free to use, adapt and share. If it is useful, a link back to amitdusane.com is appreciated."
}
foreach ($k in $props.Keys) {
  try { $wb.BuiltinDocumentProperties.Item($k).Value = $props[$k] } catch {}
}
$dir = Split-Path -Parent $Out
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
if (Test-Path $Out) { Remove-Item $Out -Force }
$wb.SaveAs($Out, 51)
$wb.Close($false)
$xl.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($xl) | Out-Null
[GC]::Collect()
"WROTE $Out"
