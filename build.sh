rm -rf build/*
mkdir build/{js,css,img}
cp src/js/require.js build/js/require.js
cp src/img/* build/img
r.js -o mainConfigFile=src/js/main.js name=main out=build/js/main.js
r.js -o cssIn=src/css/app.css out=build/css/app.css
