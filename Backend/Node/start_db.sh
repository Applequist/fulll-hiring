#! /usr/bin/env sh

. ./.env.test

docker run -d \
    --name fleet-db \
    -e POSTGRES_PASSWORD=${DB_PWD} \
    -v ./db-data:/var/lib/postgresql/data \
    -p 5432:5432 \
    postgres

# connect to the contenairized db using
# $ psql -h localhost -p 5432 -U postgres

