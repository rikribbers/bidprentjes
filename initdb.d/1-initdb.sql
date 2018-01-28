CREATE TABLE bidprentjes (
    id integer NOT NULL,
    geboren date NOT NULL,
    overleden date NOT NULL,
    achternaam character varying(255) NOT NULL,
    geboorteplaats character varying(255) NOT NULL
);

CREATE SEQUENCE bidprentjes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE bidprentjes_id_seq OWNED BY bidprentjes.id;

COPY bidprentjes(id,achternaam,geboren,overleden,geboorteplaats) FROM '/docker-entrypoint-initdb.d/0-bidprentjes-data.csv' DELIMITER ',' CSV;