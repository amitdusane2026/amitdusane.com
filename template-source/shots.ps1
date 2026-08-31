param(
  [Parameter(Mandatory=$true)][string]$Spec,   # TSV: book<TAB>sheet<TAB>range<TAB>outname<TAB>comment
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$Zoom = 200
)
$ErrorActionPreference = "Stop"
$T = "C:\Users\amitd\OneDrive\Documents\Claude Code\Adobe Analytics\amitdusane-site-complete\static\templates"
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir -Force | Out-Null }

$rows = @()
foreach ($line in (Get-Content -LiteralPath $Spec -Encoding UTF8)) {
  if ($line -match '^\s*$' -or $line -match '^#') { continue }
  $f = $line -split "`t"
  $cm = ""; $an = ""; $hd = ""
  if ($f.Count -gt 4) { $cm = $f[4].Trim() }
  if ($f.Count -gt 5) { $an = $f[5].Trim() }
  if ($f.Count -gt 6) { $hd = $f[6].Trim() }
  $wd = ""; $hr = ""
  if ($f.Count -gt 7) { $wd = $f[7].Trim() }
  if ($f.Count -gt 8) { $hr = $f[8].Trim() }
  $rows += [pscustomobject]@{ Book=$f[0]; Sheet=$f[1]; Range=$f[2]; Name=$f[3]; Comment=$cm; Anchor=$an; Hide=$hd; Widths=$wd; HideRows=$hr }
}

# CopyPicture goes through the clipboard, so a stray Excel left behind by an
# earlier failed run will fight this one for it and every capture fails with
# "Unable to get the CopyPicture property". Six of them had accumulated before
# this line existed.
Get-Process EXCEL -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

$xl = New-Object -ComObject Excel.Application
$xl.Visible = $true
$xl.DisplayAlerts = $false
# No comment indicators unless a shot is deliberately about a comment. A red
# corner triangle on every header reads as a warning to somebody who does not
# know Excel, and it is the first thing that makes a workbook look broken.
$xl.DisplayCommentIndicator = 0   # xlNoIndicator
# Kill the green error triangles at the application level too. The workbooks
# no longer carry any, but a machine with different error-checking settings
# should still produce identical captures.
try {
  foreach ($book in ($rows | Select-Object -ExpandProperty Book -Unique)) {
    $path = Join-Path $T $book
    $wb = $xl.Workbooks.Open($path, 0, $true)
    foreach ($r in ($rows | Where-Object { $_.Book -eq $book })) {
      $ws = $wb.Worksheets.Item($r.Sheet)
      $ws.Activate()
      $xl.ActiveWindow.Zoom = $Zoom
      $xl.ActiveWindow.DisplayGridlines = $true
      $xl.ActiveWindow.DisplayHeadings = $false
      if ($r.Comment -ne "") {
        $xl.DisplayCommentIndicator = -1  # xlCommentIndicatorOnly: triangles on every
        # header, but only the one balloon opened below is shown. Setting this
        # to 1 (xlCommentAndIndicator) opens EVERY comment on the sheet, which
        # put four truncated balloons across the headers of the first attempt.
        $c = $ws.Range($r.Comment)
        if ($c.Comment) {
          $c.Comment.Visible = $true
          # The balloon defaults to up-and-right of its cell, which puts it
          # outside a capture anchored on that cell. Park it inside instead.
          $anchor = $ws.Range($r.Anchor)
          $sh = $c.Comment.Shape
          $sh.Left   = $anchor.Left
          $sh.Top    = $anchor.Top
          $sh.Width  = $anchor.Width
          $sh.Height = $anchor.Height
        }
      }
      # Collapse columns that are not the subject. A wide sheet cannot be shown
      # legibly in a 700px reading column, and hiding the middle is what a
      # person actually does when reading one.
      if ($r.Hide -ne "") {
        foreach ($h in ($r.Hide -split ',')) { $ws.Columns.Item($h.Trim()).Hidden = $true }
      }
      # Collapse rows in the middle, so a header and a distant row can appear
      # together. Excel draws a doubled gridline where rows are hidden, which
      # is the honest signal that the sheet continues.
      if ($r.HideRows -ne "") {
        foreach ($h in ($r.HideRows -split ',')) { $ws.Rows.Item($h.Trim()).Hidden = $true }
      }
      # Narrow a long text column so it re-wraps taller instead of running off
      # the side. Nothing is hidden by this; the cell just reflows, which is
      # what the same sheet does on a smaller screen.
      $restore = @{}
      if ($r.Widths -ne "") {
        foreach ($pair in ($r.Widths -split ',')) {
          $kv = $pair -split '='
          $col = $kv[0].Trim()
          $restore[$col] = $ws.Columns.Item($col).ColumnWidth
          $ws.Columns.Item($col).ColumnWidth = [double]$kv[1]
        }
        $ws.Range($r.Range).Rows.AutoFit() | Out-Null
      }
      $rng = $ws.Range($r.Range)
      $ws.Range("A1").Select() | Out-Null
      Start-Sleep -Milliseconds 200
      # CopyPicture is flaky when another process touches the clipboard, and a
      # single failure kills a 34-shot run. Retry rather than restart.
      $copied = $false
      for ($try = 1; $try -le 5 -and -not $copied; $try++) {
        try { $rng.CopyPicture(1, 2) | Out-Null; $copied = $true }
        catch { Start-Sleep -Milliseconds (400 * $try) }
      }
      if (-not $copied) { throw ("CopyPicture failed five times for {0} ({1}!{2})" -f $r.Name, $r.Sheet, $r.Range) }
      $co = $ws.ChartObjects().Add(10, 10, $rng.Width + 6, $rng.Height + 6)
      $ch = $co.Chart
      $ch.Parent.Border.LineStyle = 0
      Start-Sleep -Milliseconds 200
      $ch.Paste()
      Start-Sleep -Milliseconds 200
      $out = Join-Path $OutDir ($r.Name + ".png")
      $null = $ch.Export($out, "PNG")
      $co.Delete()
      if ($r.Comment -ne "") {
        $c = $ws.Range($r.Comment)
        if ($c.Comment) { $c.Comment.Visible = $false }
        $xl.DisplayCommentIndicator = 0
      }
      if ($r.Hide -ne "") {
        foreach ($h in ($r.Hide -split ',')) { $ws.Columns.Item($h.Trim()).Hidden = $false }
      }
      foreach ($k in $restore.Keys) { $ws.Columns.Item($k).ColumnWidth = $restore[$k] }
      if ($r.HideRows -ne "") {
        foreach ($h in ($r.HideRows -split ',')) { $ws.Rows.Item($h.Trim()).Hidden = $false }
      }
      "  {0}  {1}!{2}" -f $r.Name, $r.Sheet, $r.Range
    }
    $wb.Close($false)
  }
}
finally {
  $xl.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($xl) | Out-Null
  [GC]::Collect(); [GC]::WaitForPendingFinalizers()
}
"done"
