param(
  [Parameter(Mandatory=$true)][string]$Path,
  [string]$Sheet = "",
  [int]$MaxRows = 0,
  [int]$MaxCell = 400,
  [switch]$ListOnly
)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
function Get-Entry($name) {
  $e = $zip.Entries | Where-Object { $_.FullName -eq $name }
  if (-not $e) { return $null }
  $sr = New-Object System.IO.StreamReader($e.Open())
  $t = $sr.ReadToEnd(); $sr.Close(); return $t
}
# shared strings
$sst = @()
$sstXml = Get-Entry "xl/sharedStrings.xml"
if ($sstXml) {
  $x = [xml]$sstXml
  foreach ($si in $x.sst.si) {
    if ($si.t -is [string]) { $sst += $si.t }
    elseif ($si.t.'#text') { $sst += $si.t.'#text' }
    elseif ($si.r) { $sst += (($si.r | ForEach-Object { if ($_.t -is [string]) { $_.t } else { $_.t.'#text' } }) -join '') }
    else { $sst += "" }
  }
}
$wb = [xml](Get-Entry "xl/workbook.xml")
$rels = [xml](Get-Entry "xl/_rels/workbook.xml.rels")
$map = @{}
foreach ($r in $rels.Relationships.Relationship) { $map[$r.Id] = $r.Target }
$sheets = @()
foreach ($s in $wb.workbook.sheets.sheet) {
  $rid = $s.id
  if (-not $rid) { $rid = $s.GetAttribute("r:id") }
  $tgt = $map[$rid]
  if ($tgt -notmatch '^xl/') { $tgt = "xl/" + ($tgt -replace '^/','') }
  $sheets += [pscustomobject]@{ Name=$s.name; State=$s.state; Target=$tgt }
}
if ($ListOnly) {
  foreach ($s in $sheets) { "{0}`t{1}`t{2}" -f $s.Name, $s.State, $s.Target }
  $zip.Dispose(); exit
}
function ColNum($ref) {
  $letters = ($ref -replace '\d','')
  $n = 0
  foreach ($ch in $letters.ToCharArray()) { $n = $n * 26 + ([int][char]$ch - 64) }
  return $n
}
foreach ($s in $sheets) {
  if ($Sheet -ne "" -and $s.Name -ne $Sheet) { continue }
  "===== SHEET: $($s.Name) [$($s.State)] ====="
  $xml = Get-Entry $s.Target
  if (-not $xml) { "  (no data)"; continue }
  $doc = [xml]$xml
  $rowN = 0
  foreach ($row in $doc.worksheet.sheetData.row) {
    $rowN++
    if ($MaxRows -gt 0 -and $rowN -gt $MaxRows) { "  ... (truncated at $MaxRows rows)"; break }
    $cells = @{}
    $maxc = 0
    foreach ($c in $row.c) {
      $v = ""
      if ($c.t -eq "s") { $i = [int]$c.v; if ($i -lt $sst.Count) { $v = $sst[$i] } }
      elseif ($c.t -eq "inlineStr") { $v = $c.is.t }
      elseif ($c.v -ne $null) { $v = [string]$c.v }
      if ($v -ne "") {
        $v = $v -replace "`r`n"," | " -replace "`n"," | " -replace "`t"," "
        if ($v.Length -gt $MaxCell) { $v = $v.Substring(0,$MaxCell) + "…" }
        $n = ColNum $c.r
        $cells[$n] = $v
        if ($n -gt $maxc) { $maxc = $n }
      }
    }
    if ($maxc -eq 0) { continue }
    $out = @()
    for ($i=1; $i -le $maxc; $i++) { if ($cells.ContainsKey($i)) { $out += $cells[$i] } else { $out += "" } }
    "$($row.r)|" + ($out -join "`t")
  }
}
$zip.Dispose()
