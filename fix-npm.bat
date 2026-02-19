@echo off
echo Fixing npm permissions...
echo.

echo Setting npm prefix...
npm config set prefix "C:\Users\%USERNAME%\AppData\Roaming\npm"

echo Setting npm cache...
npm config set cache "C:\Users\%USERNAME%\AppData\Local\npm-cache"

echo Clearing npm cache...
npm cache clean --force

echo.
echo npm configuration fixed!
echo Now try running: npm install
echo.
pause
