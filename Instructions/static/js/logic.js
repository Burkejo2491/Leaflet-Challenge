var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//var earthquakes = new.L.LayerGroup();

var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 5
  });

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })

  streetmap.addTo(myMap);

  d3.json(earthquakesURL).then(function(data) {
    function circleStyle(feature){
        return {
        radius: circleRadius(feature.properties.mag),
        fillColor: circleColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
    };
    
    function circleRadius(magnitude){
        return magnitude *4;
    }

    function circleColor(depth){
        if (depth > 90){
            return "red";
        } 
        else if (depth > 70){
            return "orange";
        }
        else if (depth > 50){
            return "yellow";
        }
        else if (depth > 30){
            return "blue";
        }
        else if (depth > 10){
            return "purple"
        }
        else {
            return "white"
        }
    };


    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        }, 
        style: circleStyle,
        onEachFeature: function(feature,layer){
            layer.bindPopup("magnitude " +feature.properties.mag +"<br> depths "+ feature.geometry.coordinates[2])
        }
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];
        colors = ["white", "purple", "blue", "yellow", "orange", "red"]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
  });



