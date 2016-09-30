#!/usr/bin/env sh

for d in authenticatedws broker collector dispatcher publisher subscriber; do
	cd $d && npm install
	cd ..
done

