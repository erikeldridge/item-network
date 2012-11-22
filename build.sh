rm -rf public/*
mkdir public/js public/css
cp src/js/require.js public/js/require.js
cp -R src/img public/img
r.js -o mainConfigFile=src/js/main.js name=main out=public/js/main.js
r.js -o cssIn=src/css/app.css out=public/css/app.css
