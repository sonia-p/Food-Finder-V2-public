class Restaurant {
    constructor (restaurantName, address, lat, long,ratings,averageRating,position,marker){
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long= long;
        this.ratings = ratings;
        this.averageRating = averageRating;
        this.position = position;
        this.marker=marker;
        this.generateAverageRating()

    }
    generateAverageRating(){
        // calcul la moyenne des notes
        let sumRatings=0;
        for(let i=0; i< this.ratings.length; i++){
            sumRatings = sumRatings + this.ratings[i].stars;
        }
        this.averageRating=Math.round((sumRatings/(this.ratings.length+1)));  
    }
    addCard(){
        $('.result').append(`
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-xs-4 col-sm-4 col-md-4">
                    <img src="https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${this.lat},${this.long}&key=${streetViewApiKey}" class="card-img" alt="image google street view">
                    </div>
                    <div class="col-xs-8 col-sm-8 col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${this.restaurantName}</h5>
                            <p class="card-text">${this.address}</p>
                            <p class="card-text">Note Moyenne : ${this.averageRating}</p>                     
                        </div>
                    </div>
                </div>
            </div>
        `)        
    }
    addMarker(){
        this.position = new google.maps.LatLng(this.lat,this.long); 
        this.marker = new google.maps.Marker({
            position:this.position, 
            icon: "/images/restaurant.png",
            map:map
        }); 
        this.marker.setMap(map);
    }
    addComment(noteToPublish,commentToPublish){
        
        this.ratings.unshift({"stars":parseInt(noteToPublish),"comment":commentToPublish});
        console.log(this.ratings);
        this.generateAverageRating();
        console.log(this.averageRating);    
        
    }
/*     add(){
        // composant bootstrap pour la liste des restaurants     
        this.addCard();
        // marqueur à la position du restaurant
        this.addMarker();       
        // au clique sur le marqueur affiche une fenetre avec les avis
        let content=`<h3>${this.restaurantName}</h3>`;
        for(let i=0; i<this.ratings.length; i++){
            content += `<p>Note : ${this.ratings[i].stars}</p>`
            + `<p>Commentaire : ${this.ratings[i].comment}</p>`
        }
        content += `<button type="button" id="addCommentBtn" class="btn btn-secondary" data-toggle="modal" data-target="#addCommentModal">Ajouter un avis</button>`;
        var infoWindowOptions = {
            content: content
        };
        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        google.maps.event.addListener(this.marker, 'click', function() {
            $("#addCommentModalLabel").text(this.restaurantName);
            infoWindow.open(map, this.marker);
        });
    } */
}