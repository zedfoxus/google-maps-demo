    /*
    This Javascript file allows creation of point on Google Maps and then 
    immediately draws a circle of known radius, also called buffer, around the
    point
    */

    // declare variables that will be used in this example
    var myMap;                  // holds the map object
    var centerpoint;            // center point of the map
    var markers = [];           // array to hold markers
    var kmRadius = 20;          // draw 20 km radius

    /**
     * Initialization function that sets up the map
     */
    function initialize() {
        // build the map's center poiint
        centerpoint = new google.maps.LatLng(45.00495,-90.00052);

        // assign map the options of zoom, center point and set the map to
        // SATELLITE
        var mapOptions = {
            zoom: 10, 
            center: centerpoint
        };

        // on our web page should be a <div> or <p> tag with id map-canvas
        // show the map in that element with the options listed above
        myMap = new google.maps.Map(
            document.getElementById('map-canvas'), 
            mapOptions
        );

        // add listener
        google.maps.event.addDomListener(
            myMap, 
            'click', 
            function(event) { createMarker(event.latLng); }
        );
    }


    /**
     * Create a marker when map is clicked
     */
    function createMarker(coord) {
        var pos = new google.maps.LatLng(coord.lat(), coord.lng());
        var marker = new google.maps.Marker({
            position: pos,
            map: myMap
        });
        markers.push(marker);

        marker = new google.maps.Circle({
            center: pos,
            map: myMap,
            strokeColor: '#000',
            strokeWeight: 2,
            strokeOpacity: 0.5,
            fillColor: '#f0f0f0',
            fillOpacity: 0.5,
            radius: kmRadius * 1000
        });
        markers.push(marker);
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