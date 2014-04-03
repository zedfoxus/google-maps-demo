    /*
    This Javascript file allows creation of polygon on Google Maps using API v3
    I have used this script in <body></body> of an HTML page, but you could use
    it in the <head></head> for better effects. Should you desire to do that, 
    scroll way at the bottom of the page and change the anonymous function 
    */

    // declare variables that will be used in this example
    var myMap;                  // holds the map object drawn on the 
    var myDrawingManager;       // holds drawing tools
    var myField;                // holds the polygon we draw using drawing tools
    var myInfoWindow;           // when our polygon is clicked, a dialog box 
                                // will open up. This variable holds that info
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

        // create a dialog box but don't bind it to anything yet
        myInfoWindow = new google.maps.InfoWindow();

        // show drawing tools
        DrawingTools();
    }

    /**
     * Show drawing tools
     */
    function DrawingTools() {

        // drawingMode of NULL, which means that the map drawing tools will
        // have no default drawing tool selected. If drawingMode was set to 
        // google.maps.drawing.OverlayType.POLYGON, polygon would be auto-
        // selected
        // drawingModes can have multiple information. Over here only the
        // polygon capability is added along with the default of hand icon
        // Moreover, polygonOptions are specified as defaults
        myDrawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT,
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON
                ]
            },
            polygonOptions: {
                draggable: true,
                editable: true,
                fillColor: '#cccccc',
                fillOpacity: 0.5,
                strokeColor: '#000000',
            }
        });
        myDrawingManager.setMap(myMap);

        // when polygon drawing is complete, an event is raised by the map
        // this function will listen to the event and work appropriately
        FieldDrawingCompletionListener();
    }

    /**
     * Using the drawing tools, when a polygon is drawn an event is raised. 
     * This function catches that event and hides the drawing tool. It also
     * makes the polygon non-draggable and non-editable. It adds custom 
     * properties to the polygon and generates a listener to listen to click
     * events on the created polygon
     */
    function FieldDrawingCompletionListener() {
        // capture the field, set selector back to hand, remove drawing
        google.maps.event.addListener(
            myDrawingManager,
            'polygoncomplete',
            function(polygon) {
                myField = polygon;
                ShowDrawingTools(false);
                PolygonEditable(false);
                AddPropertyToField();
                FieldClickListener();
            }
        );
    }

    /**
     * Show or hide drawing tools
     */
    function ShowDrawingTools(val) {
        myDrawingManager.setOptions({
            drawingMode: null,
            drawingControl: val
        });
    }

    /**
     * Allow or disallow polygon to be editable and draggable 
     */
    function PolygonEditable(val) {
        myField.setOptions({
            editable: val,
            draggable: val
        });
        myInfoWindow.close();
        return false;
    }

    /**
     * Add custom property to the polygon
     */
    function AddPropertyToField() {
        var obj = {
            'id':5,
            'grower':'Joe',
            'farm':'Dream Farm'
        };
        myField.objInfo = obj;
    }

    /**
     * Attach an event listener to the polygon. When a user clicks on the 
     * polygon, get a formatted message that contains links to re-edit the 
     * polygon, mark the polygon as complete, or delete the polygon. The message
     * appears as a dialog box
     */
    function FieldClickListener() {
        google.maps.event.addListener(
            myField,
            'click',
            function(event) {
                var message = GetMessage(myField);
                myInfoWindow.setOptions({ content: message });
                myInfoWindow.setPosition(event.latLng);
                myInfoWindow.open(myMap);
            }
        );
    }

    /**
     * Delete the polygon and show the drawing tools so that new polygon can be
     * created
     */
    function DeleteField() {
        myInfoWindow.close();
        myField.setMap(null);
        ShowDrawingTools(true);
    }

    /**
     * Get coordinates of the polygon and display information that should 
     * appear in the polygon's dialog box when it is clicked
     */
    function GetMessage(polygon) {
        var coordinates = polygon.getPath().getArray();
        var message = '';

        if (typeof myField != 'undefined') {
            message += '<h1 style="color:#000">Grower: ' 
                + myField.objInfo.grower + '<br>'
                + 'Farm: ' + myField.objInfo.farm + '</h1>';
        }

        message += '<div style="color:#000">This polygon has ' 
            + coordinates.length + ' points<br>'
            + 'Area is ' + GetArea(polygon) + ' acres</div>';

        var coordinateMessage = '<p style="color:#000">My coordinates are:<br>';
        for (var i = 0; i < coordinates.length; i++) {
            coordinateMessage += coordinates[i].lat() + ', ' 
                + coordinates[i].lng() + '<br>';
        }
        coordinateMessage += '</p>';

        message += '<p><a href="#" onclick="PolygonEditable(true);">Edit</a> '
            + '<a href="#" onclick="PolygonEditable(false);">Done</a> '
            + '<a href="#" onclick="DeleteField(myField)">Delete</a></p>'
            + coordinateMessage;

        return message;
    }

    /**
     * Get area of the drawn polygon
     */
    function GetArea(poly) {
        var result = parseFloat(google.maps.geometry.spherical.computeArea(poly.getPath())) * 0.000247105;
        return result.toFixed(4);
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