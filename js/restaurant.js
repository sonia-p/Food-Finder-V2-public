class Restaurant {
    constructor (identifiant,restaurantName, address, lat, long,ratings,averageRating,position,marker, star,commentHtml){
        this.identifiant=identifiant,
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long= long;
        this.ratings = ratings;
        this.averageRating = averageRating;
        this.position = position;
        this.marker=marker;
        this.star=star;
        this.commentHtml= commentHtml;
        this.generateAverageRating()
        this.addStar()
        this.generateCommentHtml()

    }
    generateAverageRating(){
        // calcul la moyenne des notes
        let sumRatings=0;
        for(let i=0; i< this.ratings.length; i++){
            sumRatings = sumRatings + this.ratings[i].stars;
        }
        this.averageRating=Math.round((sumRatings/(this.ratings.length)));  
    }
    addCard(){
        $('.result').append(`
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-xs-4 col-sm-4 col-md-4">
                    <img src="https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${this.lat},${this.long}&key=${streetViewApiKey}" class="card-img" alt="image google street view">
                    </div>
                    <div class="col-xs-8 col-sm-8 col-md-8">
                        <div  class="card-body">
                            <h5 class="card-title">${this.restaurantName}</h5>
                            <p class="card-text">${this.address}</p>
                            <p class="card-text">Note Moyenne &nbsp;  ${this.star}</p> 
                            <button type="button" id="readCommentBtn${this.identifiant}" class="btn btn-secondary">Lis les avis</button> 
                            <button type="button" id="addCommentBtn${this.identifiant}" class="btn btn-secondary">Ecris un avis</button>                                     
                        </div>                       
                    </div>                   
                </div>
                <div id="${this.identifiant}" class="text-muted">
                ${this.commentHtml}
                </div>  
                <form class="${this.identifiant}">
                    <div class="form-group">
                        <select  class="note custom-select custom-select-sm">
                            <option  selected>Note</option>
                            <option value="1">1 étoile</option>
                            <option value="2">2 étoiles</option>
                            <option value="3">3 étoiles</option>
                            <option value="4">4 étoiles</option>
                            <option value="5">5 étoiles</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <textarea class="commentToAdd form-control" rows="3" placeholder="Commentaire"></textarea>
                    </div>
                    <div class="form-group">
                        <button type="button" id="${this.identifiant}" class="publishCommentBtn btn btn-secondary">Publies</button>
                    </div>
                </form>
            </div>
        `)   
        if (this.star==="Aucun commentaire"){
            $(`#readCommentBtn${this.identifiant}`).hide();
        }

        
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
        this.generateAverageRating();
        this.generateCommentHtml();
        this.addStar();  
        
    }
    addStar(){
        if (this.averageRating>0){
            this.star="";
            for (let i=0; i<this.averageRating; i++){
                this.star+=`&nbsp;<img src="images/star.png" alt="star ou étoile">&nbsp;`;
            }
        } else {
            this.star=`Aucun commentaire`;
           
        }
    }
    generateCommentHtml(){
        let content="";
        for(let i=0; i<this.ratings.length; i++){
            content += `<p>Note : ${this.ratings[i].stars}</p>`
            + `<p>Commentaire : ${this.ratings[i].comment}</p>`
        }
        this.commentHtml=content;
    }
/*     generateList(){           
        // composant bootstrap pour la liste des restaurants     
        this.addCard();
        $(`#${this.identifiant}`).hide();
        let bouton= document.getElementById(`readCommentBtn${this.identifiant}`);
        bouton.addEventListener('click', function(){           
            $(`#${this.identifiant}`).toggle();
        });
        // marqueur à la position du restaurant
        this.addMarker();       
        // au clique sur le marqueur affiche une fenetre avec les avis
        let content=`<h3>${this.restaurantName}</h3>
                        ${this.commentHtml}`;
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