#!/bin/sh

alias pwgen="docker run \
	--rm \
	--interactive \
	backplane/pwgen \
	--ambiguous \
	--capitalize \
	--secure 20 1"

is_environement_file_already_exist () {
	if [ -e ".env" ]
	then
		echo the ".env" file already exist
		echo you need to delete it to recreate a new one
		exit 0
	fi
}

generate_all_variables () {
	POSTGRES_USER=$(whoami)
	POSTGRES_PASSWORD=$(pwgen)
	POSTGRES_NAME="our-data"
}

ask_42_api_credentials () {
	printf "42 UID   : "; read -r FT_UUID
	printf "42 SECRET: "; read -r FT_SECRET
}

create_the_environment_file () {
	cat > .env <<- environment_file
	# Cosmic Pong
	# > all secret and environment data

	# File created the $(date +"%Y.%m.%d") by $(whoami)

	# 42 credentials
	FT_UUID=${FT_UUID}
	FT_SECRET=${FT_SECRET}

	# PostgreSQL
	POSTGRES_USER=${POSTGRES_USER}
	POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
	POSTGRES_DB=${POSTGRES_NAME}

	# NestJS
	DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_NAME}
	PORT=3000
	environment_file

}

main () {
	is_environement_file_already_exist

	ask_42_api_credentials
	generate_all_variables
	create_the_environment_file
}

main
