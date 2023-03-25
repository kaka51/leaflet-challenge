var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

var osm = L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
});

var map = L.map('map', {
    center: [40.7, -94.5],
    zoom: 3
});

osm.addTo(map);
d3.json(url).then(function (data) {
    function styleinfo(features) {
        return {
            fillColor: markercolor(features.geometry.coordinates[2]),
            radius: markerRadius(features.properties.mag),
            color: "#037ffc",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }
    }
    function markercolor(depth){
        switch(true){
            case depth > 90 : return "#3d03fc" ;
            case depth > 70 : return "#0324fc" ;
            case depth > 50: return "#0356fc" ;
            case depth > 30: return "#0384fc" ;
            case depth > 10 : return "#03a5fc" ;
            default : return "#03cefc" ;
        }
    }

    function markerRadius(mag) {
        if (mag == 0) {
            return 1;
        }
        return mag * 4;
    }
    console.log(data.features)

    L.geoJson(data, {
        pointToLayer: function (features, coords) {
            return L.circleMarker(coords);
        },
        style : styleinfo, 
        onEachFeature : function(features, layer) {
            layer.bindPopup("Magnitude: " + features.properties.mag + " <br> Depth : " + features.geometry.coordinates[2] + "<br> Location : " + features.properties.place);
        }
    })
        .addTo(map);

        // add legend 
        var legend = L.control({ position: "bottomleft" });
        legend.onAdd = function(map) {
            var div = L.DomUtil.create("div", "legend");
            div.innerHTML += "<h4>Depth</h4>";
            div.innerHTML += '<i style="background: #3d03fc" ></i><span>90+</span><br>';
            div.innerHTML += '<i style="background: #0324fc"></i><span>70 - 90</span><br>';
            div.innerHTML += '<i style="background: #0356fc"></i><span>50 - 70</span><br>';
            div.innerHTML += '<i style="background: #0384fc"></i><span>30 - 50</span><br>';
            div.innerHTML += '<i style="background: #03a5fc"></i><span>10 - 30</span><br>';
            div.innerHTML += '<i style="background: #03cefc"></i><span>less than 10</span><br>';
          
            return div;
          };
          
          legend.addTo(map);
          
});

