ADOC	=	asciidoctor --require=asciidoctor-diagram
DOCU	=	docs/README.adoc
INDEX	=	docs/index.html

CONTAINER_POST	=	our-postgresql
CONTAINER_BACK	=	our-backend
CONTAINER_FRONT	=	our-frontend
VOLUME_DATA		=	our-volume
VOLUME_IMAGES	= 	our-images

start: env
	docker compose up

stop:
	docker compose down

build: build-front build-back

build-front:
	docker run \
	--rm \
	--name front_build \
	--volume $(shell pwd)/frontend:/app \
	our-frontend-image \
	npm run build

build-back:
	docker run \
	--rm \
	--name back_build \
	--volume $(shell pwd)/backend:/app \
	our-backend-image \
	npm run build

env:
	@if [ ! -e .env ]; then \
		printf "$(GREEN)Generate environment variables\n$(DEFAULT)"; \
		sh scripts/create-env.sh; \
	fi

format:
	docker run \
	--rm \
	--volume $(shell pwd):/app tgrivel/prettier \
	--write backend \
	--write frontend \
	--config .prettierrc \
	--ignore-path .prettierignore

cmd-back:
	docker exec -it $(CONTAINER_BACK) sh

cmd-front:
	docker exec -it $(CONTAINER_FRONT) sh

doc:
	@printf "$(YELLOW)Generating documentations..$(DEFAULT)\n"
	@$(ADOC) $(DOCU) -o $(INDEX)

docdocker:
	@printf "$(YELLOW)launch the asciidoctor/docker-asciidoctor docker image..$(DEFAULT)\n"
	@docker run \
	--rm \
	--volume $(shell pwd):/documents/ \
	asciidoctor/docker-asciidoctor \
	make doc

clean-container: clean-postgresql clean-front clean-back

clean-image:
	@docker image rm our-frontend-image || true
	@docker image rm our-backend-image || true

clean-database: clean-postgresql
	@docker volume rm $(VOLUME_DATA) || true

clean-profil-images: clean-back
	@docker volume rm $(VOLUME_IMAGES) || true

clean-postgresql:
	@docker container rm $(CONTAINER_POST) || true

clean-front:
	@docker container rm $(CONTAINER_FRONT) || true

clean-back:
	@docker container rm $(CONTAINER_BACK) || true

kill-your-work:
	docker container prune -f
	docker image prune -a -f
	docker compose down --volumes
	rm -rf ./frontend/node_modules
	rm -rf ./backend/node_modules
	rm -rf ./backend/dist

.PHONY: env

# Colors
RED     = \033[1;31m
GREEN   = \033[1;32m
YELLOW  = \033[1;33m
CYAN    = \033[1;36m
DEFAULT = \033[0m
