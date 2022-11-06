CREATE TABLE users (
	id varchar(255) PRIMARY KEY UNIQUE NOT NULL,
	login varchar(255) UNIQUE NOT NULL,
	password varchar(255) NOT NULL,
	full_name varchar(255) DEFAULT 'ANONIMUS',
	email varchar(255) UNIQUE NOT NULL,
	database_email_activ boolean DEFAULT false,
	login_user boolean DEFAULT false,
	profile_picture varchar(255) NULL,
	rating bigint NOT NULL DEFAULT 0,
	role varchar(255) NOT NULL,
	token varchar(512) DEFAULT NULL
);

CREATE TABLE categories (
	id varchar(255) PRIMARY KEY UNIQUE NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL
);

CREATE TABLE posts (
	id varchar(255) PRIMARY KEY UNIQUE NOT NULL,
	author_id varchar(255) REFERENCES users (id) ON DELETE CASCADE,
	title varchar(255) NOT NULL,
	categories_id text ARRAY,
	publish_date DATE NOT NULL,
	status boolean NOT NULL,
	content text NOT NULL
);

CREATE TABLE comments (
	id varchar(255) PRIMARY KEY UNIQUE NOT NULL,
	author_id varchar(255) REFERENCES users (id) ON DELETE CASCADE,
	post_id varchar(255) REFERENCES posts (id) ON DELETE CASCADE,
	publish_date timestamp NOT NULL,
	content text NOT NULL
);

CREATE TABLE like_post (
	id varchar(255) PRIMARY KEY UNIQUE NOT NULL,
	author_id varchar(255) REFERENCES users (id) ON DELETE CASCADE,
	entity_id varchar(255) NOT NULL,
	type boolean NOT NULL
);

