#!/usr/bin/env sh
set -eu

usage() {
  cat <<'USAGE'
Usage:
  ./scripts/new-content.sh
  ./scripts/new-content.sh post <section> <title> [tags]
  ./scripts/new-content.sh note <section> <title> [tags]
  ./scripts/new-content.sh diary [date] [tags]

Examples:
  ./scripts/new-content.sh post tutorial "Zola 使用笔记" "zola,blog"
  ./scripts/new-content.sh post proj "我的新项目" "project,rust"
  ./scripts/new-content.sh note llm "注意力机制复习" "llm,ai,learning"
  ./scripts/new-content.sh diary 2026-07-08 "life,thinking"
USAGE
}

ask() {
  prompt="$1"
  default="${2:-}"
  if [ -n "$default" ]; then
    printf "%s [%s]: " "$prompt" "$default"
  else
    printf "%s: " "$prompt"
  fi
  read -r answer
  if [ -z "$answer" ]; then
    printf "%s" "$default"
  else
    printf "%s" "$answer"
  fi
}

iso_now() {
  offset="$(date +%z)"
  printf "%s%s:%s" "$(date +"%Y-%m-%dT%H:%M:%S")" "${offset%??}" "${offset#???}"
}

slugify() {
  printf "%s" "$1" | sed 's/[\/:]/-/g; s/[[:space:]]\+/-/g; s/^-//; s/-$//'
}

toml_array() {
  value="${1:-}"
  if [ -z "$value" ]; then
    printf "[]"
    return
  fi

  old_ifs="$IFS"
  IFS=","
  set -- $value
  IFS="$old_ifs"

  output=""
  for item in "$@"; do
    trimmed="$(printf "%s" "$item" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
    [ -z "$trimmed" ] && continue
    if [ -z "$output" ]; then
      output="\"$trimmed\""
    else
      output="$output, \"$trimmed\""
    fi
  done
  printf "[%s]" "$output"
}

write_file() {
  file="$1"
  body="$2"

  if [ -e "$file" ]; then
    printf "Refusing to overwrite existing file: %s\n" "$file" >&2
    exit 1
  fi

  mkdir -p "$(dirname "$file")"
  printf "%s\n" "$body" > "$file"
  printf "Created %s\n" "$file"
}

kind="${1:-}"

if [ "$kind" = "-h" ] || [ "$kind" = "--help" ]; then
  usage
  exit 0
fi

if [ -z "$kind" ]; then
  kind="$(ask "Type: post, note, diary" "post")"
fi

case "$kind" in
  post)
    section="${2:-}"
    title="${3:-}"
    tags="${4:-}"

    [ -z "$section" ] && section="$(ask "Post section" "tutorial")"
    [ -z "$title" ] && title="$(ask "Title")"
    [ -z "$tags" ] && tags="$(ask "Tags, comma-separated" "")"

    filename="$(slugify "$title")"
    file="content/posts/$section/$filename.md"
    date_value="$(iso_now)"
    tag_array="$(toml_array "$tags")"

    write_file "$file" "+++
title = \"$title\"
date = $date_value
draft = false
path = \"p/$title\"

[taxonomies]
categories = [\"$section\"]
tags = $tag_array

[extra]
math = false
hide_from_home = false
+++

> 摘要或开场写在这里。

## 背景

## 正文
"
    ;;

  note)
    section="${2:-}"
    title="${3:-}"
    tags="${4:-}"

    [ -z "$section" ] && section="$(ask "Note section: learning, llm, rust" "learning")"
    [ -z "$title" ] && title="$(ask "Title")"
    [ -z "$tags" ] && tags="$(ask "Tags, comma-separated" "learning")"

    filename="$(slugify "$title")"
    if [ "$section" = "llm" ] || [ "$section" = "rust" ]; then
      file="content/notes/learning/$section/$filename.md"
    else
      file="content/notes/learning/$filename.md"
    fi
    date_value="$(iso_now)"
    tag_array="$(toml_array "$tags")"

    write_file "$file" "+++
title = \"$title\"
date = $date_value
draft = false
path = \"notes/$title\"

[taxonomies]
tags = $tag_array

[extra]
math = false
hide_from_home = false
+++

> 笔记摘要写在这里。

## 核心概念

## 细节
"
    ;;

  diary)
    entry_date="${2:-}"
    tags="${3:-}"

    [ -z "$entry_date" ] && entry_date="$(ask "Diary date" "$(date +"%Y-%m-%d")")"
    [ -z "$tags" ] && tags="$(ask "Tags, comma-separated" "life")"

    file="content/diary/journal/$entry_date.md"
    date_value="$(iso_now)"
    tag_array="$(toml_array "$tags")"

    write_file "$file" "+++
title = \"$entry_date\"
date = $date_value
draft = false
path = \"diary/$entry_date\"

[taxonomies]
categories = [\"journal\"]
tags = $tag_array

[extra]
math = false
professional_report = false
hide_from_home = true
+++

## 记录
"
    ;;

  *)
    printf "Unknown type: %s\n\n" "$kind" >&2
    usage >&2
    exit 1
    ;;
esac
