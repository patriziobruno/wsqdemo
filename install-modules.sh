#!/usr/bin/env sh

for d in authenticatedws broker collector dispatcher publisher subscriber; do
    printf "=== Installing %s\n" "$d"
	cd $d && npm install
	cd ..
	printf "=== Installation exit code: %s for %s\n" $? "$d"
done

