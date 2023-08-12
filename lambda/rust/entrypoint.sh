#!/bin/sh
default_dir=$PWD/$1
dir_name=$(basename "$default_dir")

echo "-----------------------------------"
ls
cd $PWD/$1
ls
cargo lambda build --release --arm64
ls
cd $PWD/target/lambda/$dir_name
zip -r function.zip bootstrap
mv function.zip $default_dir
echo "Moved function.zip to $default_dir"