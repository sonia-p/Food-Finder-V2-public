class GMap {
    constructor(map,zoom,position){
        this.map = map;
        this.zoom = zoom;
        this.position=position
        this.getUserPosition()        
    }
    getUserPosition(){
        const self = this;        
        // geolocation du user
        let infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) { //si la géolocalisation est activé      
            navigator.geolocation.getCurrentPosition(onSuccess, onError);  
        } else {
            alert("La position n'est pas supportée ou a été desactivée. Vous serez localisé à Montpellier."); 
            // enregistrement des coordonnées de Montpellier
            self.position = {
                lat: 43.6112422,
                lng: 3.8767337
            };
            map.setCenter(self.position);
            infoWindow.setPosition(self.position);
            infoWindow.setContent('Tu es là !');
            infoWindow.open(map);
            self.nearbySearchRestaurant();
        }
        function onSuccess(pos){// en cas de succès de la géolocalisation
            // récupération de la lat et long pour enregistrer la position
            self.position = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            map.setCenter(self.position);
            infoWindow.setPosition(self.position);
            infoWindow.setContent('Tu es là !');
            infoWindow.open(map);
            self.nearbySearchRestaurant();
        }
        function onError(){// en cas d'erreur de la géolocalisation
            alert("La position n'est pas supportée ou a été desactivée. Vous serez localisé à Montpellier.");
            // enregistrement des coordonnées de Montpellier
            self.position = {
                lat: 43.6112422,
                lng: 3.8767337
            };
            map.setCenter(self.position);
            infoWindow.setPosition(self.position);
            infoWindow.setContent('Tu es là !');
            infoWindow.open(map);
            self.nearbySearchRestaurant();
        }       
    }
    nearbySearchRestaurant(){    
        // paramètre de la requête à google place
        let request = {
            location: this.position,
            radius: '2000',
            type: ['restaurant']
        };
        // 
        let service = new google.maps.places.PlacesService(map);
        // récupère les données dans la variable result et crée un objet Restaurant pour chaque restaurant 
        service.nearbySearch(request, nearbySearchCallback); //Nearby Search returns a list of nearby places based on a user's location.         
        function nearbySearchCallback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {                  
                    service.getDetails({ //Place Details requests return more detailed information about a specific place, including user reviews.
                        placeId: results[i].place_id,
                        fields: ['name', 'rating', 'user_ratings_total', 'place_id', 'formatted_address', 'type',
                            'geometry', 'review']                        
                    },(res) => {
                            if (res){
                                restaurants.push(new Restaurant(restaurants.length+1,res.name, res.formatted_address, res.geometry.location.lat(), res.geometry.location.lng(),`https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${res.geometry.location.lat()},${res.geometry.location.lng()}&key=${streetViewApiKey}`, res.reviews || [] ));                           
                            }                                                        
                        });  
                }
            }
        } 
    }
    

 
    }

