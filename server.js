var express = require("express");
var app = express();
var connection = require('tedious').Connection;
var sqlrequest = require('tedious').Request;
var apirequest = require('request');
// Integration
app.set('view engine', 'pug');

//set up the connection information
var config = {
    userName: 'sa',
    password: 'Heiligboontje1!',
    server: 'localhost',
    options: {
        database: 'bidprentjes'
    }
}

var server = app.listen(8080, function () {
    console.log("Listening on port %s...", server.address().port);
});

app.get('/api/v1/geboren/:date', function (req, res) {

    var conn = new connection(config);

    conn.on('connect', function (err) {
        if (err) {
            console.log(err);
        } else {
            var date = req.params.date;
            sqlreq = new sqlrequest("SELECT * FROM Bidprentjes WHERE Geboren='" + date + "' FOR JSON AUTO", function (err, rowCount) {
                if (err) {
                    console.log(err);
                }
            });

            sqlreq.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        res.send(column.value);
                    }
                });
            });

            // catch the "no results" 
            sqlreq.on('doneInProc', function (rowCount, more, rows) {
                if (rowCount == 0) {
                    res.send('[]');
                }
            });

            // clean up after yourself
            sqlreq.on('requestCompleted', function () {
                conn.close();
            });

            conn.execSql(sqlreq);
        }
    });

    conn.on('error', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Error called with no err object.");
        }
    });
})

app.get('/api/v1/gestorven/:date', function (req, res) {

    var conn = new connection(config);

    conn.on('connect', function (err) {
        if (err) {
            console.log(err);
        } else {
            var date = req.params.date;
            sqlreq = new sqlrequest("SELECT * FROM Bidprentjes WHERE Gestorven='" + date + "' FOR JSON AUTO", function (err, rowCount) {
                if (err) {
                    console.log(err);
                }
            });

            sqlreq.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        res.send(column.value);
                    }
                });
            });

            // catch the "no results" 
            sqlreq.on('doneInProc', function (rowCount, more, rows) {
                if (rowCount == 0) {
                    res.send('[]');
                }
            });

            // clean up after yourself
            sqlreq.on('requestCompleted', function () {
                conn.close();
            });

            conn.execSql(sqlreq);
        }
    });

    conn.on('error', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Error called with no err object.");
        }
    });
})

app.get('/api/v1/geboorteplaats/:plaatsnaam', function (req, res) {

    var conn = new connection(config);

    conn.on('connect', function (err) {
        if (err) {
            console.log(err);
        } else {
            var name = req.params.plaatsnaam;
            sqlreq = new sqlrequest("SELECT * FROM Bidprentjes WHERE Geboorteplaats='" + name + "' FOR JSON AUTO", function (err, rowCount) {
                if (err) {
                    console.log(err);
                }
            });

            sqlreq.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        res.send(column.value);
                    }
                });
            });

            // catch the "no results" 
            sqlreq.on('doneInProc', function (rowCount, more, rows) {
                if (rowCount == 0) {
                    res.send('[]');
                }
            });

            // clean up after yourself
            sqlreq.on('requestCompleted', function () {
                conn.close();
            });

            conn.execSql(sqlreq);
        }
    });

    conn.on('error', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Error called with no err object.");
        }
    });
})


app.get('/view/geboren/:date', function (req, res) {

    var date = req.params.date;

    apirequest.get('http://localhost:8080/api/v1/geboren/' + date, function (error, response, body) {
        if (error) {
            throw error;
        }
        const data = JSON.parse(body);
        res.render('results', { title: 'Resultaten', rows: data })
    });
})

app.get('/view/gestorven/:date', function (req, res) {

    var date = req.params.date;

    apirequest.get('http://localhost:8080/api/v1/gestorven/' + date, function (error, response, body) {
        if (error) {
            throw error;
        }
        const data = JSON.parse(body);
        res.render('results', { title: 'Resultaten', rows: data })
    });
})

app.get('/view/geboorteplaats/:plaatsnaam', function (req, res) {

    var name = req.params.plaatsnaam;

    apirequest.get('http://localhost:8080/api/v1/geboorteplaats/' + name, function (error, response, body) {
        if (error) {
            throw error;
        }
        const data = JSON.parse(body);
        res.render('results', { title: 'Resultaten', rows: data })
    });
})