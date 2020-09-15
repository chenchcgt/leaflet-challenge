// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson", (jsondata) => {
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", (jsondata) => {
    console.log(jsondata)

function getColor(d) {
  return d <1 ? "#33ff33":
  d<2 ? "#ccff33":
  d<3 ? "#ffff33":
  d<4 ? "#ffcc33":
  d<5 ? "#ff9933":
  "#ff3333";
}


    function markerSize(mag) {
  return mag * 25000;
}

 // Pull the "stations" property off of response.data
 var earthquakes = jsondata.features;
 // Initialize an array to hold bike markers
 var earthquakes_circles = [];
 // Loop through the stations array
 for (var i = 0; i < earthquakes.length; i++) {
   var earthquake = earthquakes[i];
   // For each station, create a marker and bind a popup with the station's name
   var earthquakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
    fillOpacity: 0.75,
    fillColor: getColor(earthquake.properties.mag),
    color: "white",
     radius: markerSize(earthquake.properties.mag)
   })
     .bindPopup("<h3>Magnitude: " + earthquake.properties.mag + "<h3><h3>Place: " + earthquake.properties.place + "</h3>");
   // Add the marker to the bikeMarkers array
   earthquakes_circles.push(earthquakeMarker);
 }


//  var legend = L.control({position: 'bottomright'});
// legend.onAdd = function (map) {

// var div = L.DomUtil.create('div', 'info legend');
// labels = ['<strong>Categories</strong>'],
// categories = ['0-1','1-2','2-3','3-4','4-5','+5'];

// for (var i = 0; i < categories.length; i++) {

//         div.innerHTML += 
//         labels.push(
//             '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
//         (categories[i] ? categories[i] : '+'));

//     }
//     div.innerHTML = labels.join('<br>');
// return div;
// };
// legend.addTo(map);



 // Create a layer group made from the bike markers array, pass it into the createMap function
 earthquakeLocations = L.layerGroup(earthquakes_circles);

 // Create the tile layer that will be the background of our map
 var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 18,
   id: "light-v10",
   accessToken: API_KEY
 });

 // Create a baseMaps object to hold the lightmap layer
 var baseMaps = {
   "Light Map": lightmap
 };

 // Create an overlayMaps object to hold the earthquake layer
 var overlayMaps = {
   "Earthquake Locations": earthquakeLocations
 };

 // Create the map object with options
 var map = L.map("map", {
  //  center: [40.73, -74.0059],
  //  zoom: 12,
  center: [15.5994, -28.6731],
  zoom: 3,
   layers: [lightmap, earthquakeLocations]
 });

 // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
 L.control.layers(baseMaps, overlayMaps, {
   collapsed: false
 }).addTo(map);


})