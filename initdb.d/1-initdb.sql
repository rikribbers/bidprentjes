CREATE TABLE bidprentjes (
    id integer NOT NULL,
    geboren date NOT NULL,
    gestorven date NOT NULL,
    naam character varying(255) NOT NULL,
    geboorteplaats character varying(255) NOT NULL
);

CREATE SEQUENCE bidprentjes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE bidprentjes_id_seq OWNED BY bidprentjes.id;

COPY bidprentjes(id,naam,geboren,gestorven,geboorteplaats) FROM '/docker-entrypoint-initdb.d/0-bidprentjes-data.csv' DELIMITER ',' CSV;