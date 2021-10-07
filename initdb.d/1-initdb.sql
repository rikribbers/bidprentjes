CREATE TABLE bidprentjes (
    id integer NOT NULL,
    geboren date,
    overleden date,
    achternaam character varying(255),
    geboorteplaats character varying(255),
    voorvoegsel character varying(255),
    voornaam character varying(255),
    rustplaats character varying(255)
);

CREATE SEQUENCE bidprentjes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE bidprentjes_id_seq OWNED BY bidprentjes.id;
