BEGIN{FS="\t"}
{
  if ($1!="") sol=$1
  v=$5
  if (v=="") next
  gsub(/ *\(.*\)/,"",v)
  if (!(v in seen) || seen[v] !~ ("(^|,)" sol "$") ) {}
  if (used[v]=="") used[v]=sol
  else if (index(used[v], sol)==0) used[v]=used[v] ", " sol
  if (name[v]=="") name[v]=$6
}
END{ for (v in used) printf "%s\t%s\t%s\n", v, name[v], used[v] }
