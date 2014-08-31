    var decoder = new google.maps.Geocoder();
    var information = "";


    /**
     * Initialization
     */
    $(document).ready(function() {
        setup();
    });


    /**
     * Set up the stage to work
     */
    function setup() {
        $("#address").focus();
        $("#geocode").click(function() {
            geocode();
        });
    }

    /**
     * Perform geocoding
     */
    function geocode() {

        information = "";

        var address = $("#address").val();
        if (address.trim().length == 0) {
            alert("No address was entered");
            return;
        }

        decoder.geocode(
            {
                'address': address
            }
            , function(result, status) {
                evalutateStatus(result, status);
            });
    }


    /**
     * Evaluate geocoding status and pass the result forward for display
     * if status is OK
     */
    function evalutateStatus(result, status) {
        switch(status) {
            case google.maps.GeocoderStatus.ZERO_RESULTS:
                populateInformation("No results found;" + status);
                break;
            case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
                populateInformation("Too many requests have been sent already;" 
                    + status);
                break;
            case google.maps.GeocoderStatus.REQUEST_DENIED:
                populateInformation("Google denied the request;" + status);
                break;
            case google.maps.GeocoderStatus.INVALID_REQUEST:
                populateInformation("Request is invalid;" + status);
                break;
            case google.maps.GeocoderStatus.OK:
                displayResults(result);        
                break;
            default:
                populateInformation("No information to provide;" + status);
                break;
        }
    }


    /**
     * Display appropriate results after geocoding succeeded
     */
    function displayResults(results) {
        var resultsCounter = results.length;
        for (var i = 0; i < resultsCounter; i++) {
            information += 
                "<div>" 
                + "<strong>Result " + (i+1) 
                + " of " + resultsCounter + "</strong>"
                + "</div>";
            displayInformation(results[i]);
        }
    }


    /**
     * Display information about each result received
     */
    function displayInformation(result) {

        // show lat/lon and location type
        information += "<div>"
            + "Lat: " + result.geometry.location.lat()
            + "; Lon: " + result.geometry.location.lng() 
            + " (" + locationTypeAsText(result.geometry.location_type) + ")"
            + "</div>";

        // formatted text
        information += "<div>"
            + "Formatted: "  + result.formatted_address 
            + "</div>";

        // show types
        var typesCounter = result.types.length;
        information += "<div>" 
            + "This address has " + typesCounter 
            + " types associated with it: " 
            + typesAsText(typesCounter, result.types)
            + "</div>";

        // bounds
        if (typeof result.geometry.bounds == "undefined") {
            information += "<div"
                + "Boundary for this address is "
                + result.geometry.bounds.toString()
                + "</div>";
        }
        
        // viewport
        information += "<div>"
            + "Viewport is " 
            + result.geometry.viewport.toString()
            + "</div>";

        // partial match
        if (typeof result.partial_match !== "undefined") {
            information += "<div>Partial match: " + result.partial_match 
                + "</div>";
        }

        // postal code localities
        if (typeof result.postalcode_localities !== "undefined") {
            var localitiesCounter = result.postalcode_localities.length;
            information += "<div>"
                + "This address has " + localitiesCounter 
                + " postal code localities: " 
                + typesAsText(localitiesCounter, result.postalcode_localities)
                + "</div>";
        }

        // address components
        var addressComponentsCount = result.address_components.length;
        information += "<div>"
            + "There are " + addressComponentsCount + " address components "
            + "associated</div>";
        information += "<ul>"
        for (var i = 0; i < addressComponentsCount; i++) {
            var typesCounter = result.address_components[i].types.length;
            information += "<li>Long name: " 
                + result.address_components[i].long_name + "<br>"
                + "Short name: " 
                + result.address_components[i].short_name + "<br>"
                + "Types: " 
                + typesAsText(typesCounter, result.address_components[i].types)
                + "</li>";
        }
        information += "</ul>";

        information += "<div>&nbsp;</div>"
        populateInformation(information);

    }


    /**
     * Convert location type to a sentence
     */
    function locationTypeAsText(locationType) {
        var info = "";
        switch (locationType) {
            case google.maps.GeocoderLocationType.ROOFTOP:
                info = "Precisely geocoded";
                break;
            case google.maps.GeocoderLocationType.RANGE_INTERPOLATED:
                info = "Interpolated";
                break;
            case google.maps.GeocoderLocationType.GEOMETRIC_CENTER:
                info = "Obtained from center of street or region";
                break;
            case google.maps.GeocoderLocationType.APPROXIMATE:
                info = "Approximate location noticed";
                break;
            default:
                info = "Quality unknown";
                break;
        }
        return info;
    }


    /**
     * Convert types array to a sentence
     */
    function typesAsText(counter, items) {
        var info = "";
        if (counter == 1) {
            info += items[0];
        } else {
            for (var i = 0; i < counter; i++) {
                if (i == counter - 1) {
                    info += " and " + items[i];
                } else if (i == counter - 2) {
                    info += items[i] + " ";
                } else {
                    info += items[i] + ", ";
                }
            }    
        }
        return info;
    }


    /**
     * Show message in the lat/lon node
     */
    function populateInformation(info) {
        $("#latlon").html(info);
    }