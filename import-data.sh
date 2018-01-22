#wait for the SQL Server to come up
sleep 10s

#run the setup script to create the DB and the schema in the DB
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Heiligboontje1! -d master -i setup.sql

#import the data from the csv file
/opt/mssql-tools/bin/bcp bidprentjes.dbo.Bidprentjes in "/usr/src/app/bidprentjes_data.csv" -c -t',' -S localhost -U sa -P Heiligboontje1!