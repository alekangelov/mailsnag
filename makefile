DOCKER_IMAGE = "alekangelov/mailsnag"


dev.client:
	cd apps/client && npm run dev

dev.server:
	cd apps/server && air run .

dev:
	make -j 2 dev.client dev.server

docker.build:
	docker build -f Dockerfile -t $(DOCKER_IMAGE) .

docker.run:
	docker run -it --rm -p 2525:2525 -p 3333:3333 $(DOCKER_IMAGE)