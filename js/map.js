class GMap {
    constructor(map){
        this.map=map;
    }
    getUserPosition(){
        // geolocation du user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=> { 
            // récupération de la lat et long pour enregistrer la position
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            this.map.setCenter(pos);
            let infoWindow = new google.maps.InfoWindow;
            infoWindow.setPosition(pos);
            infoWindow.setContent('Tu es là !');
            infoWindow.open(this.map);              
            }, function() {
            this.handleLocationError(true, infoWindow, this.GMap.getCenter());
            });   
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, infoWindow, this.GMap.getCenter());
            }
    }
    handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    }
} 

