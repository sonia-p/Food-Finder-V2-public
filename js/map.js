class GMap {
    constructor(map,zoom, lat, lng,position){
        this.map = map;
        this.zoom = zoom;
        this.lat = lat;
        this.lng = lng,
        this.position=position
        
    }
    getUserPosition(){
        // geolocation du user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=> { 
            // récupération de la lat et long pour enregistrer la position
            this.position = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(this.position);
            let infoWindow = new google.maps.InfoWindow;
            infoWindow.setPosition(this.position);
            infoWindow.setContent('Tu es là !');
            infoWindow.open(map);              
            }, function() {
            this.handleLocationError(true, infoWindow, this.GMap.getCenter());
            });   
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, infoWindow, this.GMap.getCenter());
            }
    }
    handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(this.position);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    }
} 

