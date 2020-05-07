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
    // créer un objet GMap
    let myMap= new GMap(map,15, 43.6833,4.2); 
    // récupère la position de l'utilisateur 
    myMap.getUserPosition();
    // insert la carte dans le div map
    map = new google.maps.Map(document.getElementById('map'), {
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

    // récupère les données et crée un objet Restaurant pour chaque restaurant
    data.forEach(data=>{
        restaurants.push(new Restaurant(data.restaurantName, data.address, data.lat, data.long, data.ratings,""));
    });
    console.log(restaurants);

    // traitement pour chaque restaurant
    restaurants.forEach(restaurant=>{            
        // composant bootstrap pour la liste des restaurants     
        restaurant.addCard();
        // marqueur à la position du restaurant
        restaurant.addMarker();       
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
        google.maps.event.addListener(restaurant.marker, 'click', function() {
            $("#addCommentModalLabel").text(restaurant.restaurantName);
            infoWindow.open(map, restaurant.marker);
        });
    })// fin for each

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
            // génère la liste en fonction des notes sélectionnées
            restaurants.forEach(restaurant=>{
                console.log(restaurant);
                // affiche les restaurants contenus dans la sélection
                if (restaurant.averageRating >=mini && restaurant.averageRating <= maxi){                   
                    console.log("le restaurant va être affiché :" + restaurant);
                    restaurant.addCard();
                    restaurant.addMarker();                               
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
                    google.maps.event.addListener(restaurant.marker, 'click', function() {
                        $("#addCommentModalLabel").text(restaurant.restaurantName);
                        infoWindow.open(map, restaurant.marker);
                    });
                } else {
                    console.log("n'affiche pas ce restaurant : "+ restaurant);
                    restaurant.marker.setMap(null);
                }
            }) // fin for each            
        }// fin else        
    }); // fin $('.filter-btn').click

    //// AJOUT D'UN RESTAURANT ////
    //let newRestAddress, newRestLat, newRestLng;
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
                let newRestAddress=results[0].formatted_address;
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
            // créer un objet GMap
            let myMap= new GMap(map,15, 43.6833,4.2); 
            // insert la carte dans le div map
            map = new google.maps.Map(document.getElementById('map'), {
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
            // récupère la position de l'utilisateur pour centrer la map
            myMap.getUserPosition();
            //regénère la liste des restaurants
            restaurants.forEach(restaurant=>{            
                // composant bootstrap pour la liste des restaurants     
                restaurant.addCard();
                // marqueur à la position du restaurant
                restaurant.addMarker();       
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
                google.maps.event.addListener(restaurant.marker, 'click', function() {
                    $("#addCommentModalLabel").text(restaurant.restaurantName);
                    infoWindow.open(map, restaurant.marker);
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
        console.log(restaurants);
        let noteToPublish=document.getElementById('note');
        noteToPublish=noteToPublish.options[noteToPublish.selectedIndex].value;
        let commentToPublish=document.getElementById('commentToAdd').value;  
        console.log(noteToPublish);
        console.log(commentToPublish);
        // vérification de la saisie

        // ajouter le commentaire à l'objet Restaurant        
        for (let i=0;i<restaurants.length;i++){
            if (restaurants[i].restaurantName==$("#addCommentModalLabel").text()){
                restaurants[i].addComment(noteToPublish,commentToPublish);
                break;
            }
        } 
        // vide la liste des restaurants
        $('.result').empty();
        // vide la map
        $('#map').empty();
        // regénérer la map
        let myMap= new GMap(map,15, 43.6833,4.2);
        map = new google.maps.Map(document.getElementById('map'), {
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

    
    //regénère la liste des restaurants
    restaurants.forEach(restaurant=>{            
        // restaurant.add();
        // composant bootstrap pour la liste des restaurants     
        restaurant.addCard();
        // marqueur à la position du restaurant
        restaurant.addMarker();       
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
        google.maps.event.addListener(restaurant.marker, 'click', function() {
            $("#addCommentModalLabel").text(restaurant.restaurantName);
            infoWindow.open(map, restaurant.marker);
        });
    })// fin for each      
    // close modal
    $('#addCommentModal').modal('hide');
    // générer la carte a nouveau

    }); // fin $('#publishCommentBtn').click

} // fin function init




//rend la fonction init dans le scope global
window.init=init;