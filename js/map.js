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
        let infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) { //si la géolocalisation est activé          
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
            self.handleLocationError(true, infoWindow, this.map.getCenter());
            });   
        } else {
            // géolocalisation ne fonctionne pas
            self.handleLocationError(false, infoWindow, this.map.getCenter());
            }
    }
    handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(this.position);
    
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        //alert('position sur montpellier');
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    }

} 


