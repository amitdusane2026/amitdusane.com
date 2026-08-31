param([Parameter(Mandatory=$true)][string]$File, [Parameter(Mandatory=$true)][string]$Title)
# Document properties, written into docProps directly.
# $wb.BuiltinDocumentProperties.Item(name).Value throws on this machine for
# every field, so nothing but the inherited dc:creator was ever landing. The
# XML is the same thing Excel would have written and it cannot fail quietly.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Esc($s) { $s -replace '&','&amp;' -replace '<','&lt;' -replace '>','&gt;' }

$author   = 'Amit G Dusane'
$company  = 'amitdusane.com'
$subject  = 'Adobe Analytics implementation documentation'
$keywords = 'Adobe Analytics, SDR, Solution Design Reference, BRD, TSD, validation report, implementation, amitdusane.com'
$descr    = 'Created by Amit G Dusane for amitdusane.com. Free to use, adapt and share. If it is useful, a link back to amitdusane.com is appreciated.'
$category = 'Template'

$zip = [System.IO.Compression.ZipFile]::Open($File, 'Update')

function Rewrite($entryName, $content) {
  $e = $zip.Entries | Where-Object { $_.FullName -eq $entryName }
  if (-not $e) { return $false }
  $s = $e.Open(); $s.SetLength(0)
  $w = New-Object System.IO.StreamWriter($s, (New-Object System.Text.UTF8Encoding($false)))
  $w.Write($content); $w.Flush(); $w.Close()
  return $true
}

# --- core.xml -------------------------------------------------------------
$e = $zip.Entries | Where-Object { $_.FullName -eq 'docProps/core.xml' }
$sr = New-Object System.IO.StreamReader($e.Open()); $core = $sr.ReadToEnd(); $sr.Close()
$created  = if ($core -match '(<dcterms:created[^>]*>[^<]*</dcterms:created>)')   { $matches[1] } else { '' }
$modified = if ($core -match '(<dcterms:modified[^>]*>[^<]*</dcterms:modified>)') { $matches[1] } else { '' }
$newCore = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
'<dc:title>' + (Esc $Title) + '</dc:title>' +
'<dc:subject>' + (Esc $subject) + '</dc:subject>' +
'<dc:creator>' + (Esc $author) + '</dc:creator>' +
'<cp:keywords>' + (Esc $keywords) + '</cp:keywords>' +
'<dc:description>' + (Esc $descr) + '</dc:description>' +
'<cp:lastModifiedBy>' + (Esc $author) + '</cp:lastModifiedBy>' +
$created + $modified +
'<cp:category>' + (Esc $category) + '</cp:category>' +
'</cp:coreProperties>'
[void](Rewrite 'docProps/core.xml' $newCore)

# --- app.xml : Company and Manager ---------------------------------------
$e2 = $zip.Entries | Where-Object { $_.FullName -eq 'docProps/app.xml' }
if ($e2) {
  $sr2 = New-Object System.IO.StreamReader($e2.Open()); $app = $sr2.ReadToEnd(); $sr2.Close()
  if ($app -match '<Company>.*?</Company>') { $app = $app -replace '<Company>.*?</Company>', ('<Company>' + (Esc $company) + '</Company>') }
  elseif ($app -match '<Company/>')          { $app = $app -replace '<Company/>',            ('<Company>' + (Esc $company) + '</Company>') }
  else { $app = $app -replace '(</Properties>)', ('<Company>' + (Esc $company) + '</Company>$1') }
  if ($app -match '<Manager>.*?</Manager>')  { $app = $app -replace '<Manager>.*?</Manager>', ('<Manager>' + (Esc $author) + '</Manager>') }
  elseif ($app -match '<Manager/>')          { $app = $app -replace '<Manager/>',             ('<Manager>' + (Esc $author) + '</Manager>') }
  else { $app = $app -replace '(<Company>)', ('<Manager>' + (Esc $author) + '</Manager>$1') }
  [void](Rewrite 'docProps/app.xml' $app)
}
$zip.Dispose()
"{0,-62} metadata written" -f (Split-Path -Leaf $File)
