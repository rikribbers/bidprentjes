CREATE TABLE bidprentjes (
    id integer NOT NULL,
    geboren date,
    overleden date,
    achternaam character varying(255),
    geboorteplaats character varying(255),
    voorvoegsel character varying(255),
    voornaam character varying(255)
);

CREATE SEQUENCE bidprentjes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE bidprentjes_id_seq OWNED BY bidprentjes.id;

COPY bidprentjes(id,geboren,overleden,achternaam,geboorteplaats,voorvoegsel,voornaam) FROM '/docker-entrypoint-initdb.d/0-bidprentjes-data.csv' DELIMITER ';' CSV;