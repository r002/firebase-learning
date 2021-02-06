# firebase-learning
Houses all code for written learning guides.

firebase emulators:start --import=data \
firebase emulators:start --only hosting \
npm init \
npm install eslint --save-dev \
npx eslint --init

firebase emulators:export data\lab03

git remote -v

git log origin/main..HEAD

https://stackoverflow.com/questions/39632667/how-do-i-kill-the-process-currently-using-a-port-on-localhost-in-windows
https://stackoverflow.com/questions/65586212/how-to-shutdown-firebase-emulator-properly-on-windows-10
```shell
$> netstat -ano | findstr :8080
$> taskkill /PID <PID> /F
```

# Misc Links
- https://mariusschulz.com/blog/declaring-global-variables-in-typescript
- https://stackoverflow.com/questions/52100103/getting-all-documents-from-one-collection-in-firestore