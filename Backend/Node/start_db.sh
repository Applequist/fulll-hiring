#! /usr/bin/env sh

docker run -d \
    --name fleet-db \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -v ./db-data:/var/lib/postgresql/data \
    -p 5432:5432 \
    postgres

# connect to the contenairized db using
# $ psql -h localhost -p 5432 -U postgres

