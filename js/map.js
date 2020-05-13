class GMap {
    constructor(map,zoom, lat, lng,position){
        this.map = map;
        this.zoom = zoom;
        this.lat = lat;
        this.lng = lng,
        this.position=position
        
    }
    getUserPosition(){
        const self = this;
        // geolocation du user
        if (navigator.geolocation) {
            let infoWindow = new google.maps.InfoWindow;
            navigator.geolocation.getCurrentPosition((position)=> { 
            // récupération de la lat et long pour enregistrer la position
            this.position = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(this.position);
            infoWindow.setPosition(this.position);
            infoWindow.setContent('Tu es là !');
            infoWindow.open(map);              
            }, function() {
            self.handleLocationError(true, infoWindow, this.GMap.getCenter());
            });   
        } else {
            // Browser doesn't support Geolocation
            self.handleLocationError(false, infoWindow, this.GMap.getCenter());
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

