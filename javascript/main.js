// api voor mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoia2F5bGVpZ2h2cCIsImEiOiJja21rbDd5b3IxMXViMnBueng2MW9tY3Y3In0.d9R98pcd-YliMirpTFoMUA';

// map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [-118.327981, 33.920432], //spaceX voorbeeld
    zoom: 12, // zoomt in
	pitch: 45 // geeft diepte weer
});
// navigatie knoppen toevoegen aan map
map.addControl(new mapboxgl.NavigationControl());

//----------popups voor de markers------------
var headquarter = new mapboxgl.Popup().setHTML('<strong>SpaceX headquarter</strong><p> 1 Rocket Rd, Hawthorne, CA 90250, US. <br/> The place where it all started and made it possible that humans can visit Mars.</p>');
var landingSpot = new mapboxgl.Popup().setHTML('<h3>Searles Lake </h3><p>This is a dry lake bed, its 19 km long and 13 km at its widest point. A safe environment that is chosen by the launching and landing control of SpaceX.');
var landingSpot2 = new mapboxgl.Popup().setHTML('<h3>Coyote Lake</h3><p>This is a dry lake bed in the Mojava Desert of San Bernardion, California, 24km northeast of Barstow. Its 10km long and 6km at its widest point. A safe environment that is chosen by the launching and landing control of SpaceX.</p>');
var hotelSpot1 = new mapboxgl.Popup().setHTML('<h3>901 N China Lake Blvd, Ridgecrest, CA, 93555, US</h3><p>Clarion Inn, 3 star hotel. It is 36 minutes from landingspot 1 to the hotel. The costs and transport are reimbursed by SpaceX for 2 days. </p>');
var hotelSpot2 = new mapboxgl.Popup().setHTML('<h3>1984 E Main St, Barstow, CA 92311, USA</h3><p>Best Western Desert Villa Inn,3 star hotel. It is 1 hour and 24 minutes from landing spot 2 to the hotel. The costs and transport are reimbursed by SpaceX for 2 days.</p>');

//----------markers---------------------------
var marker1 = new mapboxgl.Marker({color: '#61D9CC'})
  .setLngLat([-118.327981, 33.920432]) //SpaceX headquarter
  .setPopup(headquarter)
  .addTo(map);
  
var marker2 = new mapboxgl.Marker({color: '#FF9234'})
  .setLngLat([-117.329143, 35.731575]) // Searles Lake
  .setPopup(landingSpot)
  .addTo(map);

var marker3 = new mapboxgl.Marker({color: '#FF9234'})
  .setLngLat([-116.754700, 35.070200]) //Coyote Lake
  .setPopup(landingSpot2)
  .addTo(map);

var marker4 = new mapboxgl.Marker({color: '#57BCFF'})
  .setLngLat([-117.6700772, 35.6377037]) //Clarion Inn hotel
  .setPopup(hotelSpot1)
  .addTo(map);
  
var marker5 = new mapboxgl.Marker({color: '#57BCFF'})
  .setLngLat([-116.994155883789, 34.8871116638184]) //Best Western Desert Villa Inn hotel
  .setPopup(hotelSpot2)
  .addTo(map);

//------------Onclicks voor de knoppen naar de markers----------------
document.getElementById('knop1').onclick = function() {

	map.flyTo({
		center: [-118.327981, 33.920432], //SpaceX headquarter
			speed: 0.4,
		essential: true
	});
};

document.getElementById('knop2').onclick = function() {
	map.flyTo({
		center: [-117.329143, 35.731575], // Searles Lake
			speed: 0.4,
		essential: true
	});
};

document.getElementById('knop3').onclick = function() {
    map.flyTo({
		center: [-116.754700, 35.070200], //Coyote Lake
			speed: 0.4,
		essential: true
	});
};
document.getElementById('knop4').onclick = function() {
    map.flyTo({
		center: [-117.6700772 , 35.6377037], //Clarion Inn hotel
			speed: 0.4,
		essential: true
	});
};
document.getElementById('knop5').onclick = function() {
    map.flyTo({
		center: [-116.994155883789, 34.8871116638184], //Best Western Desert Villa Inn hotel
			speed: 0.4,
		essential: true
	});
};
// popup wordt nog niet getoond voordat je muis eroverheen gaat
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

//-----informeren over activiteiten via iconen-------------
map.on('load', function () {
map.addSource('activiteiten', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': mijnActiviteitenLijst
    }
  });

// een laag toevoegen die de activiteiten op een aantal locaties tonen
map.addLayer({
    'id': 'activiteiten',
    'type': 'symbol',
    'source': 'activiteiten',
    'layout': {
      'icon-image': '{icon}-15',
      'icon-allow-overlap': true
    }
  });
 
//zodra je muis over een activiteit icoon gaat wordt de popup getoond
  map.on('mouseenter', 'activiteiten', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // zorgt dat de cordinaten en beschrijving van activiteiten.js op de map te zien zijn
    popup.setLngLat(coordinates)
         .setHTML(description)
         .addTo(map);
  });
//zodra je met je muis weg van een activiteit icoon gaat wordt de popup weggehaald
  map.on('mouseleave', 'activiteiten', function () {
    popup.remove();
  });
});

//------------Geocoder werkend met weer API--------------
 
var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
types: 'country,region,place,postcode,locality,neighborhood'
});

geocoder.addTo('#geocoder');

geocoder.on('result', function(response) {

 map.flyTo({
center: [response.result.center[0], response.result.center[1]],
zoom: 12,
speed: 0.5,
essential: true
});

// dit deel kan je ook bij onclick zetten
 var request = 'https://api.openweathermap.org/data/2.5/weather?lat=' + response.result.center[1] + '&lon=' + response.result.center[0] + '&appid=a7321f08d6dd89a6b0eef9cd85d11153'
// get current weather
fetch(request)
// parse response to JSON format
.then(function(responseWeather) {
return responseWeather.json();
})
// do something with response
.then(function(responseWeather) {
// show full JSON object
var weatherBox = document.getElementById('weather');
var degC = Math.floor(responseWeather.main.temp - 273.15);
var wind = responseWeather.wind.speed;
var feelsLike = Math.floor(responseWeather.main.feels_like - 273.15);
weatherBox.innerHTML = '<img src="https://openweathermap.org/img/wn/' + responseWeather.weather[0].icon + '@2x.png">'+ '<p>Temperature:'+ degC + '&#176;C<br/>'+'Feels like:'+ feelsLike + '&#176;C <br/>'+ 'Wind speed:' + wind + 'm/s</p>' ;
});
});
function startTijd() {
  var tijdmoment = new Date();
  var uren = tijdmoment.getHours();
  var minuten = tijdmoment.getMinutes();
  var secondes = tijdmoment.getSeconds();
  
  var tijdTekst = 'AM';
	if(uren == 0){
		uren = 12;
	}
	if(uren > 12){
		// uren = uren + 12;
		tijdTekst = 'PM'; // dagverschil aanduiding door gebruik van AM en PM.
	}
	minuten = checkTijd(minuten);
   secondes = checkTijd(secondes);

document.getElementById('tijd').innerHTML = uren + ':' + minuten + ':' + secondes + tijdTekst; //actuele tijd weergave.
} 
startTijd();
setInterval(startTijd, 1000);

function checkTijd(i) {
	if (i < 10) {i = '0' + i};  
	return i;
};