OUTPUT=cascade-windows@lytol.com.zip
FILES=metadata.json stylesheet.css $(wildcard *.js) schemas/gschemas.compiled $(wildcard schemas/*.xml)

build: $(FILES)
	mkdir -p build
	zip build/$(OUTPUT) $(FILES)

clean:
	rm -rf build
