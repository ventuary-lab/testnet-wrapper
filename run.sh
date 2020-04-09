#!/bin/bash

port=8009

if [ -n "$1" ]
then
    port=$1
fi

node index.js --port "$port"