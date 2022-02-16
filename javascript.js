var map = L.map('map').setView([47.410552, -122.399484], 7);                                                    //Creates the map.  A unique Mapbox token is required to initialize the map.
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoidGJyYWRlIiwiYSI6ImNremYwdmR0YzJsdnAydXBxaTA4ZHEwaWcifQ.D9N_XkNLhPDIX2e41dviEA'
}).addTo(map);
var drawnItems = L.featureGroup().addTo(map);   //Creates a variable which allows polygons, polylines, and points to be added to the map.  The disabled options will not be available to put on the map.  You are allowed to create "draw" the features that have not been disabled, and you are also allowed to edit these features.
new L.Control.Draw({
    draw : {
        polygon : true,
        polyline : true,
        rectangle : false,     // Rectangles disabled
        circle : false,        // Circles disabled
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);

//add this
function createFormPopup() {     //Create a form pop-up with the following information (The content inside the form is written in HTML).
    var popupContent =
    '<form>' +
          '<label for="size_tracks">Size of Tracks (if applicable):</label><br>' +
          '<select id="size_tracks" name="size_tracks">' +
             '<option value="NA"></option>' +
             '<option value="Less than 2.5 inches long">Less than 2.5 inches long</option>' +
             '<option value="About 2.5 inches long">About 2.5 inches long</option>' +
             '<option value="Greater than 2.5 inches long">Greater than 2.5 inches long</option>' +
          '</select><br>' +
          '<label for="fur_snare">Fisher fur in hair snare? (If you are not a scientist, leave blank)</label><br>' +  //Source for Hair Snare: https://www.fs.fed.us/rm/wildlife-terrestrial/docs/genetics/reports-protocols/Fisher_Survey_Protocol.pdf
          '<select id="fur_snare" name="fur_snare">' +
             '<option value="NA"></option>' +
             '<option value="Yes">Yes</option>' +
             '<option value="No">No</option>' +
             '<option value="Other_Fur">Other Fur</option>' +
          '</select><br>' +
          'If you answered "Other Fur" to the question above, type the name of the animal the fur belongs to below (If you are not a scientist, write "NA" in the text box below):<input type="text" id="description_other_fur">' +
          '</label><br>' +
          '<label for="shape_scat">Shape of scat (if applicable):</label><br>' +
          '<select id="shape_scat" name="shape_scat">' +
             '<option value="NA"></option>' +
             '<option value="Tapered at one end">Tapered at one end</option>' +
             '<option value="Not tapered at one end">Not tapered at one end</option>' +
          '</select><br>' +
          '<label for="size_scat">Size of scat (if applicable):</label><br>' +
          '<select id="size_scat" name="size_scat">' +
             '<option value="NA"></option>' +
             '<option value="Less than 3/8 of an inch in width">Less than 3/8 of an inch in width</option>' +
             '<option value="Between 3/8 inch and 5/8 inch in width">Between 3/8 inch and 5/8 inch in width</option>' +
             '<option value="Greater than 5/8 of an inch in width">Greater than 5/8 of an inch in width</option>' +
          '</select><br>' +
    'Describe the location of the sign(s) (Type of surrounding vegetation, nearby land features, open or closed canopy, etc.):<br><input type="text" id="input_desc"><br>' +
    'Date sign was observed:<br><input type="datetime-local" id="observation_time"' +
           'name="Observation_time" value="2022-02-14T15:30"' +
           'min="2022-02-14T15:30" max="2200-02-14T15:30"> <br></input>' +
    'Enter your name, nickname, or alias (If you are filling out multiple forms, please use the same name, nickname, or alias for each form):<br><input type="text" id="input_name"><br>' +
    '<center><input type="button" value="Submit" id="submit"></center>' +
    '</form>'
    drawnItems.bindPopup(popupContent, {maxHeight:340, minWidth:900}).openPopup();
}

map.addEventListener("draw:created", function(e) {    //This is the event listener that is activated when a new feature has been drawn on the map (point, line, or polygon).  This event listener adds this feature to the layers "items" that have already been drawn and also causes the createFormPopup function to run: When a layer is created (point, line, or polygon) add and open a pop-up.
    e.layer.addTo(drawnItems);
    createFormPopup();
    });

function setData(e) {
  if(e.target && e.target.id == "submit") {     //When you hit the submit button on a pop-up...
    // Get the values of the questions/variables
    var size_tracks = document.getElementById("size_tracks").value;
    var fur_snare = document.getElementById("fur_snare").value;
    var description_other_fur = document.getElementById("description_other_fur").value;
    var shape_scat = document.getElementById("shape_scat").value;
    var size_scat = document.getElementById("size_scat").value;
    var description = document.getElementById("input_desc").value;
    var observation_time = document.getElementById("observation_time").value;
    var name = document.getElementById("input_name").value;
    //prints the value of the questions/variables in the Google Chrome console
    console.log(size_tracks);
    console.log(fur_snare);
    console.log(description_other_fur);
    console.log(shape_scat);
    console.log(size_scat);
    console.log(description);
    console.log(observation_time);
    console.log(name);
    //Get and print GeoJSON for each drawn layer
    drawnItems.eachLayer(function(layer) {
      var drawing = JSON.stringify(layer.toGeoJSON().geometry);
      console.log(drawing);
    });
    // Clear drawn items layer
    drawnItems.closePopup();
    drawnItems.clearLayers();
  }
}

document.addEventListener("click", setData);          //This is an event listener that references the function setData from above.  It is attached to the document because the document is always present, unlike the pop-up which closes and opens at the whim of the user (If the event listener was bound to the pop-up it would need to be re-instated each time a pop-up opened).

    map.addEventListener("draw:editstart", function(e) {      //The following lines of code add event listeners that activate when an edit session has been opened or closed or when a delete session has been opened or closed.  These event listeners prevent the pop-ups from displaying during the editing and deletion sessions and open the pop-ups back up when the sessions are done.  If all of the shapes have been deleted, the pop-up will not appear again.
      drawnItems.closePopup();
    });
    map.addEventListener("draw:deletestart", function(e) {
      drawnItems.closePopup();
    });
    map.addEventListener("draw:editstop", function(e) {
      drawnItems.openPopup();
    });
    map.addEventListener("draw:deletestop", function(e) {
      if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
      }
    });
