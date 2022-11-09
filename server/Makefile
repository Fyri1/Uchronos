setup: install db-migrate

install:
	npm install

db-migrate:
	npx knex migrate:latest

start:
	npm run start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'