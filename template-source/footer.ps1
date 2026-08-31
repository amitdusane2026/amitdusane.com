param([Parameter(Mandatory=$true)][string[]]$Files)
# Adds the print footer to every worksheet by editing the saved xlsx directly.
# Excel's PageSetup object throws on this machine for every property, so the
# footer is written into xl/worksheets/sheetN.xml as <headerFooter>, which is
# what Excel would have produced anyway.
#
# Schema order matters: headerFooter must come AFTER pageMargins/pageSetup and
# BEFORE drawing/legacyDrawing. Insert in the wrong place and Excel calls the
# file corrupt and offers to repair it, which is worse than no footer.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$credit = 'Template from amitdusane.com   |   Amit G Dusane'
$footer = '<headerFooter><oddFooter>&amp;L&amp;"Calibri"&amp;8&amp;K808080' + $credit + '&amp;R&amp;"Calibri"&amp;8&amp;K808080Page &amp;P of &amp;N</oddFooter></headerFooter>'

foreach ($f in $Files) {
  $zip = [System.IO.Compression.ZipFile]::Open($f, 'Update')
  $touched = 0; $skipped = 0
  foreach ($e in @($zip.Entries | Where-Object { $_.FullName -match '^xl/worksheets/sheet\d+\.xml$' })) {
    $sr = New-Object System.IO.StreamReader($e.Open())
    $xml = $sr.ReadToEnd(); $sr.Close()
    if ($xml -match '<headerFooter') { $skipped++; continue }

    $new = $null
    if ($xml -match '(<pageSetup\b[^>]*/>)') {
      $new = $xml -replace [regex]::Escape($matches[1]), ($matches[1] + $footer)
    } elseif ($xml -match '(<pageMargins\b[^>]*/>)') {
      $new = $xml -replace [regex]::Escape($matches[1]), ($matches[1] + $footer)
    } else {
      # No pageMargins at all: add one, then the footer, immediately before
      # whatever comes next in schema order.
      $block = '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>' + $footer
      if ($xml -match '<drawing\b') { $new = $xml -replace '(<drawing\b)', ($block + '$1') }
      elseif ($xml -match '<legacyDrawing\b') { $new = $xml -replace '(<legacyDrawing\b)', ($block + '$1') }
      else { $new = $xml -replace '(</worksheet>)', ($block + '$1') }
    }

    $stream = $e.Open()
    $stream.SetLength(0)
    $sw = New-Object System.IO.StreamWriter($stream, (New-Object System.Text.UTF8Encoding($false)))
    $sw.Write($new); $sw.Flush(); $sw.Close()
    $touched++
  }
  $zip.Dispose()
  "{0,-62} footers added to {1} sheets{2}" -f (Split-Path -Leaf $f), $touched, $(if ($skipped) { ", $skipped already had one" } else { "" })
}
