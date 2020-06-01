// générer le script google map en cachant la clé api dans gitignore
function loadScript(){
    var script = document.createElement("script");
    script.async= true;// se charge sans attendre que tous les scripts soient chargés
    script.defer=true;
    script.src=`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=init` ;
    document.body.appendChild(script);
} 

// au chargement de la page lance le script pour google map api
window.onload = loadScript;
let restaurants=[];
let newRestLat, newRestLng, newRestAddress, newComment, newRestName;
//initialise la carte
function init(){
    $('#resetMapBtn').hide();
    $('#pano').hide();
    $('#backToMapBtn').hide();
    let myMap= new GMap(map,15, 43.6112422,3.8767337); // créer un objet GMap    
    myMap.getUserPosition(); // récupère la position de l'utilisateur 
    map = new google.maps.Map(document.getElementById('map'), { // insert la carte dans le div map
        center: {lat: myMap.lat, lng: myMap.lng},
        zoom: myMap.zoom,
        // personnalisation de la map
        styles :
    [
        {"elementType": "geometry","stylers": [{"color": "#ebe3cd"}]},
        {"elementType": "labels.text.fill","stylers": [{"color": "#523735"}]},
        {"elementType": "labels.text.stroke","stylers": [{"color": "#f5f1e6"}]},
        {"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#c9b2a6"}]},
        {"featureType": "administrative.land_parcel","elementType": "geometry.stroke","stylers": [{ "color": "#dcd2be"}]},
        {"featureType": "administrative.land_parcel","elementType": "labels.text.fill","stylers": [{"color": "#ae9e90"}]},
        { "featureType": "landscape.natural","elementType": "geometry","stylers": [{"color": "#dfd2ae"}]},
        {"featureType": "poi","elementType": "geometry","stylers": [{"color": "#dfd2ae"}]},
        { "featureType": "poi","elementType": "labels.text.fill","stylers": [{"color": "#93817c"}]},
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
            {
                "color": "#a5b076"
            }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#447530"
            }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#f5f1e6"
            }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#fdfcf8"
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#f8c967"
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
            {
                "color": "#e9bc62"
            }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#e98d58"
            }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
            {
                "color": "#db8555"
            }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#806b63"
            }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#dfd2ae"
            }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#8f7d77"
            }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
            {
                "color": "#ebe3cd"
            }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#dfd2ae"
            }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
            {
                "color": "#b9d3c2"
            }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#92998d"
            }
            ]
        }
        ]
    });    
    let userPosition = new google.maps.LatLng(myMap.lat,myMap.lng);
    // paramètre de la requête à google place
    let request = {
        location: userPosition,
        radius: '2000',
        type: ['restaurant']
    };
    // 
    let service = new google.maps.places.PlacesService(map);
    // récupère les données dans la variable result et crée un objet Restaurant pour chaque restaurant 
    service.nearbySearch(request, callback); //Nearby Search returns a list of nearby places based on a user's location.
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            console.log(results.length);
                for (var i = 0; i < results.length; i++) {  
                    console.log(results[i]);                  
                    service.getDetails({ //Place Details requests return more detailed information about a specific place, including user reviews.
                        placeId: results[i].place_id,
                        fields: ['name', 'rating', 'user_ratings_total', 'photo', 'place_id', 'formatted_address', 'type',
                            'geometry', 'review']                        
                    },(res) => {
                            //if (res){
                                console.log(res);
                                restaurants.push(new Restaurant(restaurants.length+1,res.name, res.formatted_address, res.geometry.location.lat(), res.geometry.location.lng(),res.photos[0].getUrl(), res.reviews));                           
                            //}                                                        
                        });  
                }// fin for
        }// fin if
    }// fin callback    

    //// FILTRER ////
    $('.filter-btn').click(()=>{
        // récupère valeur des champs mini et maxi
        let nbrestau=0;
        let mini= $('#noteMini').val();
        let maxi= $('#noteMaxi').val();
        $('#noteMaxi').prop('selectedIndex',0);
        $('#noteMini').prop('selectedIndex',0);
        // message d'erreur si mauvaise sélection des notes
        if (mini=="Note Mini" || maxi=="Note Maxi" || mini>maxi){
            alert('vous devez selectionner une note mini et maxi et/ou la note mini doit être inférieur à la note maxi');
        } else {
            // vide la liste des restaurants
            $('.result').empty();            
            // génère la liste en fonction des notes sélectionnées
            restaurants.forEach(restaurant=>{
                console.log(restaurant);
                // affiche les restaurants contenus dans la sélection
                if (restaurant.averageRating >=mini && restaurant.averageRating <= maxi){                                      
                    nbrestau+=1;
                    console.log(nbrestau);
                    restaurant.addCard();
                    // marqueur et infowindow à la position du restaurant
                    restaurant.addMarker();       
                } else {
                    console.log("n'affiche pas ce restaurant : "+ restaurant);
                    restaurant.marker.setMap(null);
                }
            }) // fin for each           
        }// fin else  
        if (nbrestau==0){
            alert("il n'y a aucun résultat, veuillez réinitialiser la carte");
        }
        $('#resetMapBtn').show(); 
    }); // fin $('.filter-btn').click
    $('#resetMapBtn').on('click',()=>{
        // vide la liste des restaurants
        $('.result').empty();
        restaurants.forEach(restaurant=>{            
                restaurant.addCard();
                restaurant.addMarker();  
        }) // fin for each   
    })
    //// AJOUT D'UN RESTAURANT ////
    map.addListener('dblclick', (mapsMouseEvent)=> { // au clique droit
        // Creation d'une fenetre avec les coordonnées du clique
        infoWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng});
        infoWindow.setContent(`<button type="button" id="addRestaurantBtn" class="btn btn-light" data-toggle="modal" data-target="#addRestaurantModal">Ajouter un nouveau restaurant ici !</button>`);
        // sauvegarde de la position
        let newRestLat = mapsMouseEvent.latLng.lat();
        let newRestLng = mapsMouseEvent.latLng.lng();
        infoWindow.open(map);
        // récupérer l'adresse du point cliqué
        let geocoder = new google.maps.Geocoder(); 
        let latlng = {lat: newRestLat, lng: newRestLng};
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
            if (results[0]) {
                // mettre dans champs Adresse l'adresse récupérée 
                $('#adressToAdd').val(results[0].formatted_address);
                newRestAddress=results[0].formatted_address;
                console.log(newRestAddress);
            } else {
                window.alert('No results found');
            }
            } else {
            window.alert('Geocoder failed due to: ' + status);
            }
        });
        $('#newRestPublishBtn').click(()=>{ //au clique sur le bouton publie           
            if ($('#restToAdd').val().length<=0){
                event.preventDefault();
                event.stopPropagation();
                $(`#addRestaurantModal`).addClass('was-validated')
            } else {
                newRestName=$('#restToAdd').val();// récupère la valeur de l'input du nom
                //créé un nouvel objet Restaurants
                console.log(restaurants.length);
                let newRestaurantToPublish = new Restaurant(
                    this.id = (restaurants.length+1),
                    this.restaurantName =newRestName,
                    this.address=newRestAddress,
                    this.lat=newRestLat,
                    this.long=newRestLng,
                    this.picture=`https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${this.lat},${this.long}&key=${streetViewApiKey}" class="card-img" alt="image google street view`,
                    ratings=[]
                );
                console.log(newRestaurantToPublish);
                console.log(restaurants);
                restaurants.push(newRestaurantToPublish);// l'ajoute au tableau des restaurants                        
                // rétablie la valeur par défault de la modal
                newRestName=$('#restToAdd').val("");
                //ferme le modal
                $('#addRestaurantModal').modal('hide');
                // ferme infowindow
                infoWindow.close();
            }           
        });// fin #newRestPublishBtn.click
    }); // fin map.addlistener ajout d'un restau

    //// AJOUT D'UN NOUVEAU COMMENTAIRE ////    
    $('.result').on('click','.publishCommentBtn',(event)=>{ // clique sur le bouton publier
        console.log('je clique sur le bouton publies')
        let id=parseInt(event.target.id); // je récupère l'id du bouton cliqué j'enlève 1 pour avoir son indice dans le tableau des rest
        console.log(id);
        console.log($('#validationCustom01').val().length<0);
        console.log($('#validationCustom01').val().length);
        console.log($('#validationCustom01').val());
        console.log($('#validationCustom03').val().length<0);
        console.log($('#validationCustom03').val().length);
        console.log($('#validationCustom03').val());
        console.log($('#validationCustom02').val() == 'Note');
        console.log($('#validationCustom02').val());
        $(`#addComment${id}`).addClass('was-validated');
        // vérification de la saisie
        if ($('#validationCustom01').val().length<0 || $('#validationCustom02').val().length== 'Note' || $('#validationCustom03').val()<0 ){
            console.log('je ne valide pas le form');
            event.preventDefault();
            event.stopPropagation();
        } else {
            // récupération des données
            let noteToPublish = $('.note').eq(id-1).val();
            let commentToPublish=$('.commentToAdd').eq(id-1).val();
            let pseudoToPublish=$('.pseudo').eq(id-1).val();
            console.log(noteToPublish);
            console.log(commentToPublish);
            // ajouter le commentaire à l'objet Restaurant        
            restaurants[id-1].addComment(noteToPublish,commentToPublish,pseudoToPublish);
            console.log(restaurants[id-1].ratings);
            // vide la liste des restaurants
            $('.result').empty();
            //regénère la liste des restaurants
            restaurants.forEach(restaurant=>{           
                restaurant.addCard();    
                // marqueur et infowindow à la position du restaurant
                restaurant.addMarker();       
            })// fin for each      
        }
    }); // fin $('#publishCommentBtn').click   
} // fin function init

//rend la fonction init dans le scope global
window.init=init;