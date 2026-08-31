BEGIN{FS="\t";OFS="\t"}
NR==FNR{ nm[$1]=$2; ub[$1]=$3; next }
{ st[$1]=$2 }
END{
  print "#TAB\tgrey"
  print "#TITLE\tVariable Map - 75 props, 250 eVars and 1000 events are the contract maxima. Yours may be fewer. Delete the rows your report suite does not have, so that a free slot on this sheet is genuinely free."
  print "#WIDTHS\t12\t26\t30\t34\t3\t12\t26\t34\t34\t3\t12\t26\t22\t34"
  print "#FREEZE\t5"
  print "#COMMENTS\t\t\t\tSolutions that populate this slot. Empty means the slot is free.\t\t\t\tSolutions that populate this slot. Empty means the slot is free.\t\t\t\t\tSolutions that populate this slot. Empty means the slot is free."
  print "#FILLS\torange\torange\torange\torange\tgrey\torange\torange\torange\torange\tgrey\torange\torange\torange\torange"
  print "Traffic variable\tReport name\tSetting\tUsed by\t\tConversion variable\tReport name\tSetting\tUsed by\t\tEvent\tReport name\tType\tUsed by"
  # build ordered lists
  tn=0; cn=0; en=0
  t[++tn]="pageName"; t[++tn]="channel"
  for (i=1;i<=75;i++) t[++tn]="prop" i
  c[++cn]="campaign"; c[++cn]="products"
  for (i=1;i<=250;i++) c[++cn]="eVar" i
  e[++en]="purchase"; e[++en]="prodView"; e[++en]="scAdd"; e[++en]="scRemove"; e[++en]="scView"; e[++en]="scCheckout"
  for (i=1;i<=1000;i++) e[++en]="event" i
  mx = tn; if (cn>mx) mx=cn; if (en>mx) mx=en
  for (r=1;r<=mx;r++) {
    tv=(r<=tn)?t[r]:""; cv=(r<=cn)?c[r]:""; ev=(r<=en)?e[r]:""
    printf "%s\t%s\t%s\t%s\t\t%s\t%s\t%s\t%s\t\t%s\t%s\t%s\t%s\n", \
      tv, nm[tv], st[tv], ub[tv], \
      cv, nm[cv], st[cv], ub[cv], \
      ev, nm[ev], st[ev], ub[ev]
  }
}
