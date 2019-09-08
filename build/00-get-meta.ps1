$scriptpath = $MyInvocation.MyCommand.Path
$dir = Split-Path $scriptpath
cd $dir
. .\variables.ps1

cd $sc

echo "Dumping game csv data ..."

$commandLine = "n
lang chs
exd Map MapMarker MapMarkerRegion MapSymbol
exit
"
$commandLine | & $sc\SaintCoinach.Cmd.exe $game | Tee-Object -Variable saintResult
$saintResult[0] -match "Game version: (.+)$"
$gameVersion = $Matches[1]

echo $gameVersion | Set-Content "$map\generated\gameVersion.txt"

echo "Coping csv data ..."

Foreach ($name in ("Map", "MapMarker", "MapMarkerRegion", "MapSymbol")) {
    Copy-Item "$sc\$gameVersion\exd\$name.csv" "$map\generated\$name.csv"
}

Remove-Item "$sc\$gameVersion\exd" -Recurse -Force

$mapDir = "$sc\$gameVersion\ui\map\"

echo "Dumping maps ..."

$commandLine = "n
lang chs
maps
exit"
$commandLine | & $sc\SaintCoinach.Cmd.exe $game | Tee-Object -Variable saintResult

$mapFiles = Get-ChildItem $mapDir

echo "Coping maps ..."

New-Item "$map\generated\$gameVersion" -ItemType Directory -ErrorAction SilentlyContinue
$newMapsFile = "$map\generated\$gameVersion\newMaps.txt"
echo "-" | Add-Content $newMapsFile

Foreach ($mapFile in $mapFiles) {
    $mapFilename = $mapFile.Name -replace "\d+\.(.*)\.(.*)\.png", '$1.png'
    $destName = "$map\generated\webroot\maps\$mapFilename"
    if (!(Test-Path $destName)) {
        Copy-Item $mapFile.FullName $destName
        echo $mapFilename
        echo $mapFilename | Add-Content $newMapsFile
    }
}
