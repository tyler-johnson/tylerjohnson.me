BIN = ./node_modules/.bin
SRC = $(wildcard src/*.js)

build: index.js cli.js styles.css

index.js: src/index.js $(SRC)
	TARGET=node $(BIN)/rollup $< -c -f cjs > $@

cli.js: src/cli.js $(SRC)
	echo "#!/usr/bin/env node" > $@
	TARGET=node $(BIN)/rollup $< -c -f cjs >> $@

styles.css: src/styles.scss $(wildcard src/*.scss)
	$(BIN)/node-sass $< | $(BIN)/postcss --use autoprefixer --autoprefixer.browsers "ie >= 8,> 1%" | $(BIN)/cleancss > $@

clean:
	rm -rf index.js cli.js styles.css

.PHONY: build
