var map = L.map('map').setView([51.505, -0.09], 13);                                                    //Creates the map.  A unique Mapbox token is required to initialize the map.
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
    'Size of tracks (if applicable):' +
    '<fieldset>' +
      '<p>' +
          '<input type="radio" id="Size_Tracks_Less" name="Size_Tracks" value="Less">' +
          '<label for="Size_Tracks_Less">Less than 2.5 inches long</label>' +
      '</p>' +
      '<p>' +
          '<input type="radio" id="Size_Tracks_About" name="Size_Tracks" value="About">' +
          '<label for="Size_Tracks_About">About 2.5 inches long</label>' +
      '</p>' +
      '<p>' +
        '<label for="Size_Tracks">' +
          '<input type="radio" id="Size_Tracks_Greater" name="Size_Tracks" value="Greater">' +
        '<label for="Size_Tracks_Greater">Greater than 2.5 inches long</label>' +
      '</p>' +
    '</fieldset>' +
    'Fisher fur in hair snare? (Scientists only):' +
    '<fieldset>' +
      '<p>' +
          '<input type="radio" id="Fur_Snare_Yes" name="Fur_Snare" value="Yes">' +
          '<label for="Fur_Snare_Yes">Yes</label>' +
      '</p>' +
      '<p>' +
          '<input type="radio" id="Fur_Snare_No" name="Fur_Snare" value="No">' +
          '<label for="Fur_Snare_No">No</label>' +
      '</p>' +
      '<p>' +
          '<input type="radio" id="Fur_Snare_Other" name="Fur_Snare" value="Other">' +
          '<label for="Fur_Snare_Other">Fur other than Fisher (Enter name of animal here):<input type="text" id="input_animal"></label>' +
      '</p>' +
    '</fieldset>' +
    'Shape of scat (if applicable):' +
    '<fieldset>' +
      '<p>'
          '<input type="radio" id="Shape_Scat_Tap" name="Shape_Scat" value="Tapered">' +
          '<label for="Shape_Scat_Tap">Tapered at one end</label>' +
      '</p>' +
      '<p>' +
          '<input type="radio" id="Shape_Scat_Not_Tap" name="Shape_Scat" value="Not_Tapered">' +
          '<label for="Shape_Scat_Not_Tap">Not tapered at one end</label>' +
      '</p>' +
    '</fieldset>' +
    'Size of scat (if applicable):' +
    '<fieldset>' +
      '<p>' +
          '<input type="radio" id="Size_Scat_Less" name="Size_Scat" value="Less">' +
          '<label for="Size_Scat_Less">Less than 3/8 of an inch in width</label>' +
      '</p>' +
      '<p>' +
          '<input type="radio" id="Size_Scat_Between" name="Size_Scat" value="Between">' +
          '<label for="Size_Scat_Between">Between 3/8 inch and 5/8 inch in width</label>' +
      '</p>' +
      '<p>' +
          '<input type="radio" id="Size_Scat_Greater" name="title" value="Greater">' +
          '<label for="Size_Scat_Greater">Greater than 5/8 of an inch in width</label>' +
      '</p>' +
    '</fieldset>' +
    'Photo(s) of the tracks, scat, or other signs:' +
    '<br><input type="file" id="Photo" name= "Photo" accept="image/png", "image/jpeg"><br>' +
    'Describe the location of the sign(s) (Type of surrounding vegetation, nearby land features, open or closed canopy, etc.):<br><input type="text" id="input_desc"><br>' +
    'Date sign was observed:<br><input type="datetime-local" id="Observation_time"' +
           'name="Observation_time" value="2022-02-14T15:30"' +
           'min="2022-02-14T15:30" max="2200-02-14T15:30"> <br></input>' +
    'Your Name, Nickname, or Alias (If you are filling out multiple forms, please use the same name, nickname, or alias for each form):<br><input type="text" id="input_name"><br>' +
    '<input type="button" value="Submit" id="submit">' +
    '</form>'
    drawnItems.bindPopup(popupContent).openPopup();
}

map.addEventListener("draw:created", function(e) {    //This is the event listener that is activated when a new feature has been drawn on the map (point, line, or polygon).  This event listener adds this feature to the layers "items" that have already been drawn and also causes the createFormPopup function to run: When a layer is created (point, line, or polygon) add and open a pop-up.
    e.layer.addTo(drawnItems);
    createFormPopup();
    });

function setData(e) {
  if(e.target && e.target.id == "submit") {     //When you hit the submit button on a pop-up...
    // Get user name and description
    var enteredUsername = document.getElementById("input_name").value;
    var enteredDescription = document.getElementById("input_desc").value;
    //print user name and description
    console.log(enteredUsername);
    console.log(enteredDescription);
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
