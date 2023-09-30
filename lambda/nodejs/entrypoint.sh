#!/bin/sh -l

cd $PWD/$1 && ls
npm install --production && zip -r function.zip *