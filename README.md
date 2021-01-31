# firebase-learning
Houses all code for written learning guides.

firebase emulators:start --import=data \
firebase emulators:start --only hosting \
npm init \
npm install eslint --save-dev \
npx eslint --init

firebase emulators:export data

git remote -v

https://stackoverflow.com/questions/39632667/how-do-i-kill-the-process-currently-using-a-port-on-localhost-in-windows
```shell
$> netstat -ano | findstr :<PORT>
$> taskkill /PID <PID> /F
```