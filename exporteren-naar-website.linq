<Query Kind="Statements">
  <Namespace>System.Data.Odbc</Namespace>
</Query>

// to use the ODBC assembly you have to press F4 then click on tab "Additional Namespace Imports"
// in the list of imports add "System.Data.Odbc" and click OK
// you have to escape any slashes "\" in the full path to the database using an additional slash "\\"

string connectionString = ("Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=E:\\db.mdb;");

// create a connection to the database by giving the connection string to OdbcConnection
using(OdbcConnection myconnection = new OdbcConnection(connectionString)) {
	
	// create an adapter with OdbcDataAdapter to execute your query
	// and provide the query and your OdbcConnection to the database.
    // id,geboren,overleden,achternaam,geboorteplaats,voorvoegsel,voornaam,rustplaats	
	
	string query = "SELECT Id, Format (Geboren, 'yyyy/mm/dd'), Format (Overleden, 'yyyy/mm/dd')" +
	     ", iif(isnull(Familienaam),'',Familienaam)" +
		 ", iif(isnull(Geboorteplaats),'',Geboorteplaats)" + 
		 ", iif(isnull(voorvoegsel),'',voorvoegsel)" +
		 ", iif(isnull(voornamen),'',voornamen)" +
		 ", iif(isnull([plaats overlijden]),'',[plaats overlijden])" +
		 " FROM [Tabel bidprentjes DEZE NIET BEWERKEN]";

	OdbcDataAdapter myadapter = new OdbcDataAdapter(query, myconnection);
	// create an empty dataset (myCustomersDS) to put all the returned results of your query into
	DataSet myCustomersDS = new DataSet();
	
	// using the adapter.fill({empty dataset}, {from what table?}) to fill your empty dataset
	// with the returned records from your query
	myadapter.Fill(myCustomersDS, "bidprentjes");
	// now display your records from your dataset in a grid
	myCustomersDS.Dump();
}