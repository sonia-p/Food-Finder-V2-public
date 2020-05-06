// générer le script google map en cachant la clé api dans gitignore
function loadScript(){
    var script = document.createElement("script");
    script.async= true;
    script.defer=true;
    script.src=`https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=init` ;
    document.body.appendChild(script);
} 

// au chargement de la page lance le script pour google map api
window.onload = loadScript;
let restaurants=[];
let newRestLat, newRestLng, newRestAddress, newComment, newRestName;
let ListWithNewRestaurants=[];
//initialise la carte
function init(){
    // insert la carte dans le div map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.6833, lng: 4.2},
        zoom: 15,
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
    // créer un objet GMap
    let myMap= new GMap(map);
    // récupère la position de l'utilisateur pour centrer la map
    myMap.getUserPosition(); 

    // traitement pour chaque restaurant
    data.forEach(data=>{
        restaurants.push(new Restaurant(data.restaurantName, data.address, data.lat, data.long, data.ratings,""));
    });
    console.log(restaurants);
    restaurants.forEach(restaurant=>{
        // enregistre la position avec la lat et long
        let restPosition = new google.maps.LatLng(restaurant.lat,restaurant.long);    
        // composant bootstrap pour la liste des restaurants     
        $('.result').append(`
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-md-4">
                    <img src="https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${restaurant.lat},${restaurant.long}&key=${streetViewApiKey}" class="card-img" alt="image google street view">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${restaurant.restaurantName}</h5>
                            <p class="card-text">${restaurant.address}</p>
                            <p class="card-text">Note Moyenne : ${restaurant.averageRating}</p>                     
                        </div>
                    </div>
                </div>
            </div>
        `)        
        // marqueur à la position du restaurant
        var marker = new google.maps.Marker({
            position:restPosition, 
            icon: "/images/restaurant.png",
            map:map
        }); 
        marker.setMap(map);
        // au clique sur le marqueur affiche une fenetre avec les avis
        let content=`<h3>${restaurant.restaurantName}</h3>`;
        for(let i=0; i<restaurant.ratings.length; i++){
            content += `<p>Note : ${restaurant.ratings[i].stars}</p>`
            + `<p>Commentaire : ${restaurant.ratings[i].comment}</p>`
        }
        content += `<button type="button" id="addCommentBtn" class="btn btn-secondary" data-toggle="modal" data-target="#addCommentModal">Ajouter un avis</button>`;
        var infoWindowOptions = {
            content: content
        };
        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        google.maps.event.addListener(marker, 'click', function() {
            restaurantN = restaurant.restaurantName;
            infoObj = infoWindow;
            $("#addCommentModalLabel").text(restaurantN);
            infoWindow.open(map, marker);
        });
    })// fin for each


    let restaurantN, infoObj, markerObj;

    //au clique sur le bouton filter
    $('.filter-btn').click(function(){
        // récupère valeur des champs mini et maxi
        let noteMini= document.getElementById('noteMini');
        let mini = noteMini.options[noteMini.selectedIndex].value;
        console.log(mini);
        let noteMaxi= document.getElementById('noteMaxi');
        let maxi = noteMaxi.options[noteMaxi.selectedIndex].value;
        console.log(maxi);
        // message d'erreur si mauvaise sélection des notes
        if (mini=="Note Mini" || maxi=="Note Maxi" || mini>maxi){
            alert('vous devez selectionner une note mini et maxi et/ou la note mini doit être inférieur à la note maxi');
        } else {
            // vide la liste des restaurants
            $('.result').empty();
            // vide la map
            $('#map').empty();
            // génère à nouveau la map
            // insert la carte dans le div map
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 43.6833, lng: 4.2},
                zoom: 15,
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
            // créer un objet GMap
            let myMap= new GMap(map);
            // récupère la position de l'utilisateur pour centrer la map
            myMap.getUserPosition();
            // génère la liste en fonction des notes sélectionnées
            restaurants.forEach(restaurant=>{

                // affiche les restaurants contenus dans la sélection
                if (restaurant.averageRating >=mini && restaurant.averageRating <= maxi){
                    $('.result').append(`
                    <div class="card mb-3">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                            <img src="https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${restaurant.lat},${restaurant.long}&key=${streetViewApiKey}" class="card-img" alt="image google street view">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${restaurant.restaurantName}</h5>
                                    <p class="card-text">${restaurant.address}</p>
                                    <p class="card-text">Note Moyenne : ${restaurant.averageRating}</p>                     
                                </div>
                            </div>
                        </div>
                    </div>
                `)   
                let restPosition = new google.maps.LatLng(restaurant.lat,restaurant.long);     
                // marqueur à la position du restaurant
                var marker = new google.maps.Marker({
                    position:restPosition, 
                    icon: "/images/restaurant.png",
                    map:map
                }); 
                marker.setMap(map);

                // au clique sur le marqueur =>fenetre avec les avis
                let content=`<h3>${restaurant.restaurantName}</h3>`;
                for(let i=0; i<restaurant.ratings.length; i++){
                    content += `<p>Note : ${restaurant.ratings[i].stars}</p>`
                    + `<p>Commentaire : ${restaurant.ratings[i].comment}</p>`
                }
                content += `<button type="button" id="addCommentBtn" class="btn btn-secondary" data-toggle="modal" data-target="#addCommentModal">Ajouter un avis</button>`;
                var infoWindowOptions = {
                    content: content
                };
                var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                google.maps.event.addListener(marker, 'click', function() {
                    restaurantN = restaurant.restaurantName;
                    infoObj = infoWindow;
                    markerObj = marker;
                    $("#addCommentModalLabel").text(restaurantN);
                    infoWindow.open(map, marker);
                });
            }// fin if
            }) // fin for each            
        }// fin else        
    }); // fin $('.filter-btn').click

    //// AJOUT D'UN RESTAURANT ////
    let newRestAddress, newRestLat, newRestLng;
    // Configuration du click listener
    map.addListener('click', function(mapsMouseEvent) {
        // Creation d'une fenetre avec les coordonnées du clique
        infoWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng});
        infoWindow.setContent(`<button type="button" id="addRestaurantBtn" class="btn btn-secondary" data-toggle="modal" data-target="#addRestaurantModal">Ajouter un nouveau restaurant ici !</button>`);
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
                let marker = new google.maps.Marker({
                position: latlng,
                map: map
                });
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
        $('#newRestPublishBtn').click(function(){
            let newRestName=$('#restToAdd').val();
            //ajout des données dans le tableau des restaurants
            let newRestaurantToPublish = new Restaurant(
                this.restaurantName =newRestName,
                this.address=newRestAddress,
                this.lat=newRestLat,
                this.long=newRestLng,
                this.ratings=[]
            );
            console.log(newRestaurantToPublish);
            console.log(restaurants);
            restaurants.unshift(newRestaurantToPublish);// l'ajoute au début
            console.log(restaurants);
            // vide la liste des restaurants
            $('.result').empty();
            // vide la map
            $('#map').empty();
            // regénérer la map 
            // insert la carte dans le div map
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 43.6833, lng: 4.2},
                zoom: 15,
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
            // créer un objet GMap
            let myMap= new GMap(map);
            // récupère la position de l'utilisateur pour centrer la map
            myMap.getUserPosition();
            //regébere la liste des restaurants
            restaurants.forEach(restaurant=>{
                // enregistre la position avec la lat et long
                let restPosition = new google.maps.LatLng(restaurant.lat,restaurant.long);    
                // composant bootstrap pour la liste des restaurants     
                $('.result').append(`
                    <div class="card mb-3">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                            <img src="https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${restaurant.lat},${restaurant.long}&key=${streetViewApiKey}" class="card-img" alt="image google street view">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${restaurant.restaurantName}</h5>
                                    <p class="card-text">${restaurant.address}</p>
                                    <p class="card-text">Note Moyenne : ${restaurant.averageRating}</p>                     
                                </div>
                            </div>
                        </div>
                    </div>
                `)        
                // marqueur à la position du restaurant
                var marker = new google.maps.Marker({
                    position:restPosition, 
                    icon: "/images/restaurant.png",
                    map:map
                }); 
                marker.setMap(map);
                // au clique sur le marqueur affiche une fenetre avec les avis
                let content=`<h3>${restaurant.restaurantName}</h3>`;
                for(let i=0; i<restaurant.ratings.length; i++){
                    content += `<p>Note : ${restaurant.ratings[i].stars}</p>`
                    + `<p>Commentaire : ${restaurant.ratings[i].comment}</p>`
                }
                content += `<button type="button" id="addCommentBtn" class="btn btn-secondary" data-toggle="modal" data-target="#addCommentModal">Ajouter un avis</button>`;
                var infoWindowOptions = {
                    content: content
                };
                var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                google.maps.event.addListener(marker, 'click', function() {
                    restaurantN = restaurant.restaurantName;
                    infoObj = infoWindow;
                    $("#addCommentModalLabel").text(restaurantN);
                    infoWindow.open(map, marker);
                });
            })// fin for each
            //ferme le modal
            $('#addRestaurantModal').modal('hide');
        });// fin #newRestPublishBtn.click

    }); // fin map.addlistener



    //// AJOUT D'UN NOUVEAU COMMENTAIRE ////
    // clique sur le bouton publier
    $('#publishCommentBtn').click(function(){
        // récupération des données
        console.log(restaurantN);
        console.log(restaurants);
        let noteToPublish=document.getElementById('note');
        noteToPublish=noteToPublish.options[noteToPublish.selectedIndex].value;
        let commentToPublish=document.getElementById('commentToAdd').value;  
        console.log(noteToPublish);
        console.log(commentToPublish);
        // vérification de la saisie

        // ajouter le commentaire à l'objet Restaurant
        for (let i=0;i<restaurants.length;i++){
            console.log(restaurants[i].restaurantName);
            console.log(restaurantN);
            console.log(restaurants[i].restaurantName==restaurantN);
            if (restaurants[i].restaurantName==restaurantN){
                restaurants[i].ratings.unshift({"stars":parseInt(noteToPublish),"comment":commentToPublish});
                console.log(restaurants[i].ratings);
                break;
            }
        }
        // vide la liste des restaurants
        $('.result').empty();
        // vide la map
        $('#map').empty();
        // regénérer la map 
       // insert la carte dans le div map
       map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.6833, lng: 4.2},
        zoom: 15,
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
    // créer un objet GMap
    let myMap= new GMap(map);
    // récupère la position de l'utilisateur pour centrer la map
    myMap.getUserPosition();
    //regébere la liste des restaurants
    restaurants.forEach(restaurant=>{
        // enregistre la position avec la lat et long
        let restPosition = new google.maps.LatLng(restaurant.lat,restaurant.long);    
        // composant bootstrap pour la liste des restaurants     
        $('.result').append(`
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-md-4">
                    <img src="https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${restaurant.lat},${restaurant.long}&key=${streetViewApiKey}" class="card-img" alt="image google street view">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${restaurant.restaurantName}</h5>
                            <p class="card-text">${restaurant.address}</p>
                            <p class="card-text">Note Moyenne : ${restaurant.averageRating}</p>                     
                        </div>
                    </div>
                </div>
            </div>
        `)        
        // marqueur à la position du restaurant
        var marker = new google.maps.Marker({
            position:restPosition, 
            icon: "/images/restaurant.png",
            map:map
        }); 
        marker.setMap(map);
        // au clique sur le marqueur affiche une fenetre avec les avis
        let content=`<h3>${restaurant.restaurantName}</h3>`;
        for(let i=0; i<restaurant.ratings.length; i++){
            content += `<p>Note : ${restaurant.ratings[i].stars}</p>`
            + `<p>Commentaire : ${restaurant.ratings[i].comment}</p>`
        }
        content += `<button type="button" id="addCommentBtn" class="btn btn-secondary" data-toggle="modal" data-target="#addCommentModal">Ajouter un avis</button>`;
        var infoWindowOptions = {
            content: content
        };
        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        google.maps.event.addListener(marker, 'click', function() {
            restaurantN = restaurant.restaurantName;
            infoObj = infoWindow;
            $("#addCommentModalLabel").text(restaurantN);
            infoWindow.open(map, marker);
        });
    })// fin for each
       
        // close modal
        $('#addCommentModal').modal('hide');
        // générer la carte a nouveau

    }); // fin $('#publishCommentBtn').click

} // fin function init




//rend la fonction init dans le scope global
window.init=init;