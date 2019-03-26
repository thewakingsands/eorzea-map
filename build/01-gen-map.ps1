$scriptpath = $MyInvocation.MyCommand.Path
$dir = Split-Path $scriptpath
cd $dir
. .\variables.ps1

$gameVersion = Get-Content "$map\generated\gameVersion.txt"

cd $map

echo "Converting csv ..."
node "$map\bin\convertcsv.js"

echo "Generating map ..."

$maps = Get-Content "$map\generated\$gameVersion\newMaps.txt"
Foreach ($m in $maps) {
    if ($m -ne "-") {
        node "$map\bin\gentile.js" "generated\webroot\maps\$m"
    }
}
