#! /usr/bin/env sh

. ./.env.test

docker run -d \
    --name fleet-db \
    -e POSTGRES_PASSWORD=${DB_PWD} \
    -v ./db-data:/var/lib/postgresql/data \
    -p ${DB_PORT}:${DB_PORT} \
    ${DB_USER}

# connect to the contenairized db using
# $ psql -h localhost -p ${DB_PORT} -d ${DB_NAME} -U ${DB_USER${DB_USER} --password

