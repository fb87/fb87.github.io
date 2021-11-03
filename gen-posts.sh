#!/bin/bash

rm -Rf src/posts/*

for year in $(seq 2020 2021); do
for month in $(seq 1 12); do
day=$((1 + $RANDOM % 31))

date=$(printf "%u-%02u-%02u\n" $year $month $day)
text=$(fortune -l)
file=$(printf "%u-%02u-%02u.md" $year $month $day)
title=$(echo $text | awk '{print $1" "$2" "$3" "$4" "$5}' | sed 's/\"//g')

mkdir -p src/posts/$year

cat <<-EOF > src/posts/$year/$file
---
date: $date
title: "$title"
layout: "base.njk"

channel: $month
---

$text

EOF
done
done

cat <<-EOF > src/posts/posts.json
{
    "tags": [ "posts" ]
}
EOF
