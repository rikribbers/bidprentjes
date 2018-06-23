ALTER TABLE bidprentjes ADD CONSTRAINT unieke_id UNIQUE (id);

CREATE TABLE search (
    id integer NOT NULL,
    value character varying(1024),
    FOREIGN KEY (id) REFERENCES bidprentjes(id)
);


ALTER TABLE search ADD CONSTRAINT idunique UNIQUE (id);