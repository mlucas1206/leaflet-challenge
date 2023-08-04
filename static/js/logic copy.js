// Create function that loads map
function createMap(mapMarkers) {
    // Create tile layer for the map background
    let mainTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Set variable to hold tileLayer (for control)


    // Create Map object (options to follow)
    let map = L.map('map',{
        center: [33.112414, -172.357943], // Ring of Fire
        zoom: 3,
        layers: [mainTile, mapMarkers]
    });

    // Create legend
    const colorArray = [
        "#00FF00", // Bright Green
        "#80C000", // Light Green
        "#C0C000", // Yellow-Green
        "#FF8000", // Orange
        "#FF4000", // Red-Orange
        "#FF0000"  // Red
      ];
      
    let legend = L.control({position: 'bottomright'});
      
      legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'leaflet-control-legend');
        let levels = [-10, 10, 30, 50, 70, 90];
        let labels = ['-10 to 10', '10 to 30', '30 to 50', '50 to 70', '70 to 90', '90+'];
      
        for (let i = 0; i < levels.length; i++) {
            div.innerHTML += `<div>
            <i style="background: ${colorArray[i]}"></i>
            <span>${labels[i]}</span>
          </div>`;
          }
          
          return div;
    }

    legend.addTo(map);
}
// Create function to create markers
function createMarkers(response) {
    console.log(response);
    // Extract marker data from file
    let eqData = response.features;
    // Create an array to hole markers
    let eqMarkers = [];

    const colorArray = [
        "#00FF00", // Bright Green
        "#80C000", // Light Green
        "#C0C000", // Yellow-Green
        "#FF8000", // Orange
        "#FF4000", // Red-Orange
        "#FF0000"  // Red
      ];
    // Loop through array to add Popup (if needed)
    for (let i = 0; i < eqData.length; i++){

        let long = eqData[i].geometry.coordinates[0];
        let lat = eqData[i].geometry.coordinates[1];
        let depth = eqData[i].geometry.coordinates[2];// To make a new circle marker
        let mag = eqData[i].properties.mag;
        

        // Set color variable for depth
        const levels = [90, 70, 50, 30, 10, -10];
        let color='';
        for (let a = 0; a < levels.length; a++) {
            if (depth > levels[a]) {
                color = colorArray[5-a]
                break
    }
  }

        // let eqMark = L.marker([lat,long]);

        let eqMark = L.circle([lat, long], {
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            radius: mag*25000
        });


        // Add bindpopup
        let popupContent = `
        <b>Place:</b> ${eqData[i].properties.place}<br>
        <b>Latitude:</b> ${lat}<br>
        <b>Longitude:</b> ${long}<br>
        <b>Magnitude:</b> ${mag}<br>
        <b>Depth:</b> ${depth}`;

      eqMark.bindPopup(popupContent);

        // Add to array
        eqMarkers.push(eqMark);
    }
    // Run the this through the map function
    createMap(L.layerGroup(eqMarkers));
}


// API call using d3
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson').then(createMarkers)
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson').then(createMarkers)