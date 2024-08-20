count:
	@rm -rf g.zip dist/ .parcel-cache/
	@npx eslint
	@npx parcel build game/index.html --no-source-maps
	@cd dist/ && zip ../g.zip index.html
	@cd ..
	@ZIPSIZE=$$(wc -c < g.zip); echo "$${ZIPSIZE} / 13312"
	@mv dist/index.html /tmp/index.html
	@open /tmp/index.html
	@rm -rf dist/ .parcel-cache/
	@rm -rf g.zip
