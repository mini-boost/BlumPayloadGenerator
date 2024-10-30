
echo Check updates from github.
call git pull
echo Check updates from node modules.
call npm i
echo Start server.
call npm start
pause