#!/bin/sh -l

cd $1 && ls
npm install --production && zip -r function.zip *