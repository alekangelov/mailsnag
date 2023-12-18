DOCKER_IMAGE = "alekangelov/mailsnag"


dev.client:
	cd apps/clientx && npm run dev

dev.server:
	cd apps/server && air run .

dev:
	make -j 2 dev.client dev.server

docker.build:
	docker build -f Dockerfile -t $(DOCKER_IMAGE) .

docker.run:
	docker run -it --rm -e SERVER_PORT=3334 -p 2525:2525 -p 3334:3334 $(DOCKER_IMAGE)