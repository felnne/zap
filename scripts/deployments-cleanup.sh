#!/bin/bash

deployments_dir="/users/felnne/public_html/apps/zap"

before_size=$(du -sh $deployments_dir/)
echo "Deployments dir: $deployments_dir"

target_dirs=$(find -L "$deployments_dir" -maxdepth 1 -xtype l)
printf "\nTarget dirs:\n"
for dir in $target_dirs; do
  echo "-  $dir"
done

source_dirs=$(find -L "$deployments_dir" -maxdepth 1 -xtype l -exec readlink {} \;)
printf "\nSource dirs:\n"
for dir in $source_dirs; do
  echo "-  $dir"
done

# combine and deduplicate the two lists
retain_dirs=$(echo "$target_dirs $source_dirs" | tr ' ' '\n' | sort | uniq)
printf "\nDirectories to keep:\n"
for dir in $retain_dirs; do
  echo "-  $dir"
done

printf "\nDeleting:\n"
for dir in $deployments_dir/*; do
  if [ -d "$dir" ]; then
    # If the directory not in $retain_dirs, delete it
    if ! echo "$retain_dirs" | grep -q "$dir"; then
      echo "- $dir"
      rm -rf "$dir"
    fi
  fi
done

after_size=$(du -sh $deployments_dir/)

echo ""
echo "Deployments dir size before: $before_size"
echo "Deployments dir size after : $after_size"
