MODULES = src/intro.js src/dispatcher.js src/outro.js

all: caym.js

caym.js: ${MODULES}
	@@echo "Building caym.js"
	@@cat ${MODULES} | \
		sed 's/.function..Caym...{//' | \
		sed 's/}...Caym..;//' | \
		sed 's/@DATE/'"${DATE}"'/' \
		> caym.js;

lint: caym.js
	jsl -stdin < caym.js

clean:
	rm -rf caym.js

.PHONY: all lint clean
