// Pull data from earthquake website
// dataset is for all month and all magnitudes
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", (jsondata) => {
  console.log(jsondata)

  function getColor(d) {
    return d < 1 ? "#33ff33" :
      d < 2 ? "#ccff33" :
        d < 3 ? "#ffff33" :
          d < 4 ? "#ffcc33" :
            d < 5 ? "#ff9933" :
              "#ff3333";
  }

  // create function to adjust size of the markers
  function markerSize(mag) {
    return mag * 25000;
  }

  // Pull features data
  var earthquakes = jsondata.features;

  // Initialize earthquakes markers
  var earthquakes_circles = [];

  // Loop through the earthquakes array
  for (var i = 0; i < earthquakes.length; i++) {
    var earthquake = earthquakes[i];

    // For each earthquake, create marker based on coordinates, and bind popup with magnitude and location's info
    var earthquakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      fillOpacity: 0.75,
      fillColor: getColor(earthquake.properties.mag),
      color: "white",
      radius: markerSize(earthquake.properties.mag)
    })
      .bindPopup("<h3>Magnitude: " + earthquake.properties.mag + "<h3><h3>Place: " + earthquake.properties.place + "</h3>");

    // Add the marker to the earthquakes_circles array
    earthquakes_circles.push(earthquakeMarker);
  }


  // Create a layer group from earthquake_circles array
  earthquakeLocations = L.layerGroup(earthquakes_circles);

  // Create the tile with map background
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps for lightmap layer >> enhancing apart from requirement
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the earthquake layer >> enhancing apart from requirement
  var overlayMaps = {
    "Earthquake Locations": earthquakeLocations
  };

  // Create the map object with options
  var map = L.map("map", {

    center: [15.5994, -28.6731],
    zoom: 3,
    layers: [lightmap, earthquakeLocations]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Add legend with color of earthquake magnitude

  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    labels = [],
    categories = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
    colors = ["#33ff33", "#ccff33", "#ffff33", "#ffcc33", "#ff9933", "#ff3333"];

    // loop through each category and assign the correspondent color
    for (var i = 0; i < categories.length; i++) {
      var color = colors[i];
      div.innerHTML +=
        labels.push(

          '<i class="circle" style="background:' + color + '"></i> ' +
          (categories[i] ? categories[i] : '+'));

    }
    div.innerHTML = labels.join('<br>');
    return div;
  };
  legend.addTo(map);
})