.DEFAULT_GOAL := dev
.PHONY: init dev build

init:
	(cd data && yarn && node export_data.js)
	(cd frontend && yarn)

dev: init
	(cd frontend && yarn dev)

build: init
	(cd frontend && yarn build)
