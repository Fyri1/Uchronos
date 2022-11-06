CREATE TABLE users (
	id varchar(255) PRIMARY KEY UNIQUE NOT NULL,
	login varchar(255) UNIQUE NOT NULL,
	password varchar(255) NOT NULL,
	full_name varchar(255) DEFAULT 'ANONIMUS',
	email varchar(255) UNIQUE NOT NULL,
	email_activated boolean DEFAULT false,
	profile_picture varchar(255) NOT NULL DEFAULT 'avatar.png',
	rating bigint NOT NULL DEFAULT 0,
	online boolean DEFAULT false,
	role varchar(255) NOT NULL,
	token varchar(512) DEFAULT NULL
);
