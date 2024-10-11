.PHONY: network build up deploy-build deploy deploy-down deploy-stack deploy-stack-rm deploy-network deploy-push deploy-tag deploy-pull

default:
	docker compose up

network:
	docker network create -d bridge devlink-network

build:
	docker compose -f docker-compose.yaml build

up:
	docker compose -f docker-compose.yaml up

down:
	docker compose -f docker-compose.yaml down

deploy-network:
	docker network create -d overlay devlink-app-network

deploy-build:
	docker build --platform linux/amd64 . -t deploy-devlink-app -f ./deploy/Dockerfile

deploy-tag:
	docker tag deploy-devlink-app:latest asadanik/devlink:latest

deploy-push:
	docker login
	docker push asadanik/devlink:latest

deploy-pull:
	docker login
	docker pull --platform linux/amd64 asadanik/devlink:latest

deploy:
	docker compose -f deploy/docker-compose-test.yaml up -d

deploy-down:
	docker compose -f deploy/docker-compose-test.yaml down

deploy-stack:
	docker stack deploy -c deploy/docker-compose.yaml devlink-app-stack

deploy-stack-rm:
	docker stack rm devlink-app-stack