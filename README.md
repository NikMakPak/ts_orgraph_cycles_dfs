## commands for install deps
```sh
npm init
tsc --init
npm i nodemon concurrently
```

## add to package.json
```sh
"start": "node dist/main.js",
"dev:ts": "tsc -w",
"dev:js": "nodemon dist/main.js",
"dev": "concurrently npm:dev:*",
```
