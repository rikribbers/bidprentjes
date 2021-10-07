ALTER TABLE bidprentjes ADD COLUMN scan boolean NOT NULL DEFAULT false;

COPY bidprentjes(id,geboren,overleden,achternaam,geboorteplaats,voorvoegsel,voornaam,rustplaats,scan) FROM '/docker-entrypoint-initdb.d/0-bidprentjes-data.csv' DELIMITER ',' CSV;