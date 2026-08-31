BEGIN{FS="\t";OFS="\t"}
{
  # strip leading empty fields, then re-pad to exactly 4 lead columns for continuation rows
  n=NF
  if ($1=="") {
    i=1; while (i<=NF && $i=="") i++
    out=""
    for (j=i;j<=NF;j++) out = out OFS $j
    line = "" OFS "" OFS "" OFS "" out
  } else {
    line=$0
  }
  split(line,a,OFS)
  cnt=0; for (k in a) cnt++
  # rebuild to exactly 15 fields
  res=""
  for (k=1;k<=15;k++) { v=(k in a)?a[k]:""; res = (k==1)? v : res OFS v }
  print res
}
