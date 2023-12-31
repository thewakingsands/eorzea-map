$scriptpath = $MyInvocation.MyCommand.Path
$dir = Split-Path $scriptpath
cd $dir
. .\variables.ps1

cd $map

echo "Generating zone data ..."
node "$map\bin\genmap.js"

echo "Uploading tiles ..."
node "$map\huiji\upload.js" tile update

echo "Uploading data ..."
node "$map\huiji\upload.js" data
