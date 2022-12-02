## commands
npm init
tsc --init
npm i nodemon concurrently

## add to package.json
"start": "node dist/main.js",
"dev:ts": "tsc -w",
"dev:js": "nodemon dist/main.js",
"dev": "concurrently npm:dev:*",