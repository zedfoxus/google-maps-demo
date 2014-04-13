    var myMap;
    var myObject = new Array();
    var myPolygon = new Array();
    var myInterval;
    var intervalCounter = 0;
    var myPolygonCount = 0;
    var myInfoWindow;
    var centerpoint;

    // although we are using a static data source consisting of 4 pairs of
    // lat/lon/elevation, we could have used an Ajax call to get such data
    // from a database or a middleware or API. This array is just to show
    // an example of polygon data source
    var dataSource = [
    "-90.00012,45.00045,0 -90.00012,45.00046,0 -89.99988,45.00046,0 -89.99988,45.00045,0",
    "-89.99919,45.00111,0 -89.99919,45.00119,0 -89.99896,45.00119,0 -89.99896,45.00111,0",
    "-89.99826,45.00197,0 -89.99826,45.00206,0 -89.99803,45.00206,0 -89.99803,45.00197,0",
    "-89.99733,45.00283,0 -89.99733,45.00292,0 -89.99710,45.00292,0 -89.99710,45.00283,0",
    "-89.99641,45.00370,0 -89.99641,45.00379,0 -89.99617,45.00379,0 -89.99617,45.00370,0",
    "-89.99965,45.00068,0 -89.99965,45.00076,0 -89.99942,45.00076,0 -89.99942,45.00068,0",
    "-89.99872,45.00154,0 -89.99872,45.00163,0 -89.99849,45.00163,0 -89.99849,45.00154,0",
    "-89.99780,45.00240,0 -89.99780,45.00249,0 -89.99757,45.00249,0 -89.99757,45.00240,0",
    "-89.99687,45.00327,0 -89.99687,45.00335,0 -89.99664,45.00335,0 -89.99664,45.00327,0",
    "-89.99594,45.00358,0 -89.99594,45.00349,0 -89.99617,45.00349,0 -89.99617,45.00358,0",
    "-90.00012,45.00271,0 -90.00012,45.00279,0 -89.99988,45.00279,0 -89.99988,45.00271,0",
    "-89.99594,45.00453,0 -89.99594,45.00444,0 -89.99617,45.00444,0 -89.99617,45.00453,0",
    "-89.99647,45.00944,0 -89.99644,45.00942,0 -89.99666,45.00938,0 -89.99668,45.00937,0",
    "-89.99687,45.00936,0 -89.99687,45.00928,0 -89.99710,45.00928,0 -89.99710,45.00936,0"
    ];

    // set up the map by creating map options (which contains a center point)
    function initialize() {
        centerpoint = new google.maps.LatLng(45.00495,-90.00052);
        var mapOptions = {
            zoom: 16,
            center: centerpoint,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        }
        myMap = new google.maps.Map(
            document.getElementById('map-canvas'), 
            mapOptions
        );
        
        // initialize an information window that can be constantly reused
        myInfoWindow = new google.maps.InfoWindow();

        // draw the button to try again
        createSelectionControl();

        // start the animation to display each polygon
        myInterval = setInterval(function() { drawPolygon(); }, 500);
    }
    
    // if this script is invoked from the <body>, invoke the initialize 
    // function now
    //(function(){ initialize(); })();
    // jQuery method
    $(document).ready(function() {
        initialize();
    });

    // use the code below if you are using this script in <head></head> tag
    // google.maps.event.addDomListener(window, 'load', initialize);


    // --------------------------

    /**
     * Make sure that the input box is set a control centered on the map
     */
    function createSelectionControl() {
        var dd = document.getElementById('drawagain');
        myMap.controls[google.maps.ControlPosition.TOP_CENTER].push(dd);
    }

    /**
     * Clear the map by removing all polygons
     */
    function clearMap() {
        var objects = myObject.length;
        for(var i = 0; i < objects; i++) {
            myObject[i].setMap(null);
        }
        myObject.length = 0;
    }

    /**
     * Draw the polygons again
     */
    function drawAgain() {
        intervalCounter = 0;
        clearMap();
        clearInterval(myInterval);
        myInterval = setInterval(function() { drawPolygon(); }, 500);   
    }


    /**
     * Draw polygons on the map
     */
    function drawPolygon() {
        // get an item from the array, parse information and then have the
        // parser display the polygon on the map
        parseInformation(dataSource[intervalCounter]);

        // if we have gone through all of our array items, let's stop
        // the interval
        intervalCounter++;
        if (intervalCounter >= dataSource.length) {
            clearInterval(myInterval);
        }
    }

    /**
     * Parse information that's available in the array and draw it on the
     * screen; also populate it in myObject array
     * 
     * @param string data 4 pairs of Lat/Lon/Elev information as string
     */
    function parseInformation(data) {
        var polygon = setupPolygon(data);
        myObject.push(
            new google.maps.Polygon({
                paths: polygon,
                strokeColor: '#00ff00',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#00ff00',
                fillOpacity: 0.35
            })
        );
        var obj = myObject[myObject.length - 1];
        obj.setMap(myMap);
        google.maps.event.addListener(obj, 'click', showInformation);
    }

    /**
     * Given 4 pairs of lat/lon/elev information, split each pair by space
     * and from each pair, split by a comma to get lat, lon and elevation.
     * Use that information to draw a polygon
     * 
     * @param string latlonstr 4 pairs of Lat/Lon/Elev information as string
     *
     * @returns array Google Map lat lon for each pair of lat/lon/elev
     */
    function setupPolygon(latlonstr) {
        var latlonstr = latlonstr.trim();
        var individualPoints = latlonstr.split(' ');
        var individualPointsLength = individualPoints.length;
        var point = new Array();
        var returnData = new Array();
        for (var i = 0; i < individualPointsLength; i++) {
            point = individualPoints[i].split(',');
            returnData[i] = new google.maps.LatLng(
                parseFloat(point[1]), 
                parseFloat(point[0])
            );
        }
        return returnData;
    }

    /**
     * Show information box when a polygon is clicked
     */
    function showInformation(event) {
        var message = getMessage(this, false);
        myInfoWindow.setOptions({ content: message });
        myInfoWindow.setPosition(event.latLng);
        myInfoWindow.open(myMap);
    }

    /**
     * Get appropriate message for a given polygon
     * 
     * @param polygon polygon Google Map polygon object
     * 
     * @return Message appropriate for the polygon
     */
    function getMessage(polygon) {
        var coordinates = polygon.getPath().getArray();

        var message = '<div>This polygon has ' + coordinates.length 
            + ' points</div>' + '<div>Area is ' + GetArea(polygon) 
            + ' acres</div>';

        var coordinateMessage = '<p>My coordinates are: <br>';
        var consoleCoordinates = '';
        for (var i = 0; i < coordinates.length; i++) {
            coordinateMessage += coordinates[i].lat() + ', ' + coordinates[i].lng() + '<br>';
            consoleCoordinates += 'new google.maps.LatLng(' + coordinates[i].lat() + ', ' + coordinates[i].lng() + '),\n';
        }
        message += coordinateMessage;

        return message;
    }

    /**
     * Get area of a polygon in acres
     */
    function GetArea(poly) {
        var result = parseFloat(google.maps.geometry.spherical.computeArea(
            poly.getPath()
        )) * 0.000247105;
        return result.toFixed(4);
    }