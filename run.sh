#!/bin/bash

port=8009
cwd=$(pwd)

while [ -n "$1" ]
do
    case "$1" in
        --pwd) cwd=$2 ;;
        --port) port=$2 ;;
    esac
    shift
done

node "$cwd/index.js" --port "$port"