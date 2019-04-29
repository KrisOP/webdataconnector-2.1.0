(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        
        //definiendo columnas en la tabla del dataset https://api.openaq.org/v1/measurements
        var cols = [{
            id: "city",
            dataType: tableau.dataTypeEnum.string
        },{
            id:"parameter",
            dataType: tableau.dataTypeEnum.String
        },{
            id:"value",
            dataType: tableau.dataTypeEnum.float    
        }, {
            id:"unit",
            dataType: tableau.dataTypeEnum.String
        }, {
            id:"date",
            dataType: tableau.dataTypeEnum.datatime
        },{
            id:"latitude",
            dataType: tableau.dataTypeEnum.float
        },{
            id:"longitude",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "openaqsea",//asignamos un identificador a la tabla
            alias: "Open AQ Seattle",//Agregamos un Alias
            columns: cols
        };

        schemaCallback([tableSchema]);//se ha obtenido la esquema, y listos para obtener la proxima esquema
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].id,
                    "mag": feat[i].properties.mag,
                    "title": feat[i].properties.title,
                    "lon": feat[i].geometry.coordinates[0],
                    "lat": feat[i].geometry.coordinates[1]
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
