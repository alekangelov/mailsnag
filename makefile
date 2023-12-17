dev.client:
	cd apps/client && npm run dev

dev.server:
	cd apps/server && air run .

dev:
	make -j 2 dev.client dev.server