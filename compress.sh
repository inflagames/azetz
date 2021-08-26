#!/bin/bash

GAME_ZIP_FILE_NAME="azetz.zip"

delFile() {
  if [ -f "$1" ]; then
    rm $1
  fi
}
export -f delFile

delFile ${GAME_ZIP_FILE_NAME}
delFile "dist/.gitkeep"
ls dist | grep -P ".*map$" | xargs bash -c 'for arg; do delFile "dist/$arg"; done' _

zip -r -9 $GAME_ZIP_FILE_NAME dist

FILE_SIZE=$(($(du -b azetz.zip | cut -f1) / 1024))

if (( $FILE_SIZE > 13 )); then
  echo "-----------------------------------------"
  echo "| FILE NOT VALID FOR JS13KGAMES CONTEST (${FILE_SIZE}KB) |"
  echo "-----------------------------------------"
  exit 27
else
  echo "----------------------------"
  echo "| ${FILE_SIZE}KB FILE UNDER 13KB, GAME ON |"
  echo "----------------------------"
fi
