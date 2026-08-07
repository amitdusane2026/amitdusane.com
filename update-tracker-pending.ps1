# Pending tracker update for Consent and Tag Management (M06 s8) and ECID (M07 s5).
# Could not be applied on 7 Aug 2026 because completion-tracker.tsv was open in Excel.
# Close Excel, then run this file once. It is safe to run twice; it only sets values.

$p = "C:\Users\amitd\OneDrive\Documents\Claude Code\Adobe Analytics\completion-tracker.tsv"
$b = "C:\Users\amitd\OneDrive\Documents\Claude Code\Adobe Analytics\amitdusane-site-complete\content\adobe-analytics-learning\collect"

$map = @{
  'consent-and-tag-management' = "$b\adobe-launch-tags\08-consent-and-tag-management.html"
  'experience-cloud-id-ecid'   = "$b\tracking-calls\05-experience-cloud-id-ecid.html"
}

try { $f = [System.IO.File]::Open($p,'Open','Write','None'); $f.Close() }
catch { Write-Host "STILL LOCKED. Close Excel and run again."; exit 1 }

$lines = [System.IO.File]::ReadAllLines($p)
foreach ($slug in $map.Keys) {
  $i = (1..($lines.Count-1)) | Where-Object { $lines[$_] -match ("/" + $slug + "/") }
  $src  = [System.IO.File]::ReadAllText($map[$slug])
  $desc = [regex]::Match($src,'description: "(.*)"').Groups[1].Value
  $seo  = [regex]::Match($src,'seotitle: "(.*)"').Groups[1].Value
  if ($desc -match "`t" -or $seo -match "`t") { Write-Host "ABORT: tab inside a field"; exit 1 }
  $r = $lines[$i].Split("`t")
  $r[6]  = $seo
  $r[7]  = 'Yes'
  $r[8]  = $desc
  $r[9]  = 'Yes'
  $r[10] = $seo.Length
  $r[11] = $desc.Length
  $r[12] = 'Yes'          # content created. QA and Final stay No, pending Amit's review.
  $lines[$i] = ($r -join "`t")
  Write-Host ("row {0,3}  {1,-32} created=Yes  qa={2}  final={3}" -f $i, $r[3], $r[13], $r[14])
}
[System.IO.File]::WriteAllLines($p, $lines)

$c = [System.IO.File]::ReadAllLines($p)
Write-Host ("integrity -> lines: {0} (expect 184); distinct cols: {1}" -f $c.Count, (($c | ForEach-Object { $_.Split("`t").Count } | Sort-Object -Unique) -join ','))
