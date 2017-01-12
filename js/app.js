var map;
var infowindow;
var foursquareCredentials = {
	CLIENT_ID: 'JL1XI0M0BJUBQ1UY1UU3IQDYXARODAJSLYHY5YL05U3N4HDX',
	CLIENT_SECRET: 'NTKTYTMUQHGLY23MAQ0IPEVC0BUU2JEANK25EDPT2OU4QITA'
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 28.6139, lng: 77.2090},
		zoom:11
	});
	infowindow = new google.maps.InfoWindow({
          content: ""
    });
    //initialize view model after map gets loaded
	ko.applyBindings(new ViewModel());
}

// var locations = [];
var getLocations = function(callback){
	$.getJSON("js/metro.json", function(json) {
    	callback(json); // this will show the info it in firebug console
    });	
}


var Location = function(data) {
	this.name = ko.observable(data.name);
	var details = ko.observable(data.details);
	this.line = ko.observable(details().line);
	this.layout = ko.observable(details().layout);
	this.longitude = ko.observable(details().longitude);
	this.latitude = ko.observable(details().latitude);
	this.marker = new google.maps.Marker({
		position: {lng: details().longitude,lat: details().latitude},
		animation: google.maps.Animation.DROP,
		map: map,
		clickable: true,
		title: data.name
	});
	
}

var ViewModel = function(){
	var self = this;
	

	this.locationList = ko.observableArray([]);
	this.inputLocation = ko.observable('');

	self.addMarkerListner = function(location) {
		infowindow.setContent(location.name());
        location.marker.addListener('click', function() {
          infowindow.open(location.marker.get('map'), location.marker);
        });
	}

	this.filteredList = ko.computed(function(){
		var filter = this.inputLocation().toLowerCase();
		if (!filter) {
			ko.utils.arrayFilter(this.locationList(), function(location) {
				location.marker.setMap(map);
				location.marker.setAnimation(google.maps.Animation.DROP);
				location.marker.setIcon(null);
				self.addMarkerListner(location)
				
			});
			return this.locationList();
		} else {
			return ko.utils.arrayFilter(this.locationList(), function(location) {
				location.marker.setMap(null);
				if (location.name().toLowerCase().startsWith(filter)) {
					location.marker.setMap(map);
					location.marker.setAnimation(google.maps.Animation.DROP);
				}
				return ko.utils.stringStartsWith(location.name().toLowerCase(), filter);
			});
		}
	},this)

	this.setFilterLocation = function(location){
		location.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
		location.marker.info.open(map, location.marker);
		self.inputLocation(location.name());
	}
	this.getLocationImage = function(name,longitude,latitude,callback){
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/explore?' +
                                'client_id=' + foursquareCredentials.CLIENT_ID +
                                '&client_secret=' + foursquareCredentials.CLIENT_SECRET +
                                '&ll=' + latitude + ',' + longitude +
                                '&query=' + name +
                                '&v=20140806%20' +
                                '&m=foursquare',
			method: "GET",
			dataType: "json",
			success: function(result){
        		console.log(result);
    		},
    		error: function(data){
    			console.log(data);
    		}
    	});
	}
	
	this.getLocationImage('delhi',28.7041, 77.1025, function(data){

	});
	getLocations(function(locations){
		locations.forEach(function(location){
			self.locationList.push(new Location(location));
		});
	});
}
