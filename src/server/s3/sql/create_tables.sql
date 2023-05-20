CREATE TABLE paths
(
	hash      TEXT              NOT NULL
		CONSTRAINT paths_pk
			PRIMARY KEY,
	path      TEXT              NOT NULL,
	is_dir    INTEGER DEFAULT 0 NOT NULL,
	name      TEXT              NOT NULL,
	size      INT     DEFAULT 0 NOT NULL,
	mime_type TEXT,
	update_at INTEGER,
	root      TEXT
		REFERENCES paths
			ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE delete_paths
(
	hash        TEXT NOT NULL
		CONSTRAINT delete_paths_pk
			PRIMARY KEY
		REFERENCES paths
			ON UPDATE CASCADE ON DELETE CASCADE,
	delete_time INT  NOT NULL
);

CREATE UNIQUE INDEX delete_paths_hash_uindex
	ON delete_paths (hash);

CREATE TABLE favorite_paths
(
	hash TEXT NOT NULL
		REFERENCES paths
			ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE UNIQUE INDEX favorite_paths_hash_uindex
	ON favorite_paths (hash);

CREATE TABLE log_paths
(
	hash        TEXT NOT NULL
		REFERENCES paths
			ON UPDATE CASCADE ON DELETE CASCADE,
	author_uuid TEXT NOT NULL,
	create_at   TEXT NOT NULL,
	comment     TEXT NOT NULL
);

CREATE UNIQUE INDEX paths_path_uindex
	ON paths (path);

CREATE UNIQUE INDEX paths_paths_uindex
	ON paths (hash);

CREATE TABLE share_paths
(
	hash      TEXT    NOT NULL
		CONSTRAINT share_paths_pk
			PRIMARY KEY
		REFERENCES paths
			ON UPDATE CASCADE ON DELETE CASCADE,
	expire_at INTEGER NOT NULL,
	token     TEXT
);

CREATE UNIQUE INDEX share_paths_hash_uindex
	ON share_paths (hash);
