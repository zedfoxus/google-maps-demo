    /*
    This Javascript file shows KML on google maps
    */

    // declare variables that will be used in this example
    var myMap;                  // holds the map object drawn on the 
    var myField;                // holds the KML object
    var centerpoint;            // center point of the map

    /**
     * Initialization function that sets up the map
     */
    function initialize() {
        // build the map's center poiint
        centerpoint = new google.maps.LatLng(45.00495,-90.00052);

        // assign map the options of zoom, center point and set the map to
        // SATELLITE
        var mapOptions = {
            zoom: 16, 
            center: centerpoint, 
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };

        // on our web page should be a <div> or <p> tag with id map-canvas
        // show the map in that element with the options listed above
        myMap = new google.maps.Map(
            document.getElementById('map-canvas'), 
            mapOptions
        );

        // show KML
        showKML();
    }

    function showKML()
    {
        myField = new Array();
        myField[0] = new google.maps.KmlLayer({
            url: 'http://zedfox.us/projects/google-maps-demo/show-kml/example.kml'
        });
        myField[0].setMap(myMap);
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