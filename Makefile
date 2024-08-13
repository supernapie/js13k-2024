count:
	@rm -rf g.zip dist/ .parcel-cache/
	@npx parcel build game/index.html --no-source-maps
	@cd dist/ && zip ../g.zip index.html
	@cd ..
	@stat -f%z/13312 g.zip
	@mv dist/index.html /tmp/index.html
	@open /tmp/index.html
	@rm -rf dist/ .parcel-cache/
	@rm -rf g.zip
