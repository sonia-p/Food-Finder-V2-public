class Restaurant {
    constructor (identifiant,restaurantName, address, lat, long,picture, open, ratings,averageRating,position,marker,infoWindow, star,commentHtml){
        this.identifiant=identifiant,
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long= long;
        this.picture= picture,
        this.open= open,
        this.ratings = ratings;
        this.averageRating = averageRating;
        this.position = position;
        this.marker=marker;
        this.infoWindow=infoWindow;
        this.star=star;
        this.commentHtml= commentHtml;
        this.generateAverageRating()
        this.addStar()
        this.generateCommentHtml()
        this.addCard()
        this.addMarker()

    }
    generateAverageRating(){
        //console.log(!!this.ratings.length);
        //this.averageRating=0;
        // calcul la moyenne des notes
        console.log(this);
        console.log(this.ratings);
        
        if(!!this.ratings.length){
            let sumRatings=0;
            for(let i=0; i< this.ratings.length; i++){
                sumRatings = sumRatings + this.ratings[i].rating;
            }
            this.averageRating=Math.round((sumRatings/(this.ratings.length))); 
            console.log(this.averageRating);
        }
        
    }
    addCard(){
        console.log(this.picture);
        $('.result').append(`
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-xs-4 col-sm-4 col-md-4">
                    <img src="${this.picture}" class="card-img" alt="image google street view">                   
                    </div>
                    <div class="col-xs-8 col-sm-8 col-md-8">
                        <div  class="card-body">
                            <h5 class="card-title">${this.restaurantName}</h5>
                            <p class="card-text">${this.star}</p>
                            <p class="card-text">${this.address}</p>
                            <button type="button" id="readCommentBtn${this.identifiant}" class="btn btn-light">Lire les avis</button> 
                            <button type="button" id="addCommentBtn${this.identifiant}" class="btn btn-light">Ecrire un avis</button>      
                            <button type="button" id="${this.identifiant}" class="publishCommentBtn btn btn-light">Visiter</button>                               
                        </div>                       
                    </div>                   
                </div>
                <div id="comment${this.identifiant}" class="text-muted">
                ${this.commentHtml}
                </div>  
                <form id="addComment${this.identifiant}">
                    <div class="form-group">
                        <select class="note custom-select custom-select-sm">
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
                        <button type="button" id="${this.identifiant}" class="publishCommentBtn btn btn-light">Publier</button>
                    </div>
                </form>
            </div>
        `)   
        if (this.star==="<i><small>Aucun commentaire</small></i>"){
            $(`#readCommentBtn${this.identifiant}`).hide();
        }
        // cache les sections "ajout d'un avis" et "lis les avis" par default
        $(`#comment${this.identifiant}`).hide();
        $(`#addComment${this.identifiant}`).hide();
        // au clique sur "lis les avis"
        $(`#readCommentBtn${this.identifiant}`).on('click',()=>{
            $(`#addComment${this.identifiant}`).hide();           
            $(`#comment${this.identifiant}`).toggle();
        })

        // au clique sur "ecris un avis"
        $(`#addCommentBtn${this.identifiant}`).on('click',()=>{
            $(`#comment${this.identifiant}`).hide();        
            $(`#addComment${this.identifiant}`).toggle();
        })
        
        // au clique sur visiter
        $(`#${this.identifiant}`).on('click',()=>{
            this.generatePanorama();
        });
        
    }
    addMarker(){
        this.position = new google.maps.LatLng(this.lat,this.long); 
        this.marker = new google.maps.Marker({
            position:this.position, 
            icon: new google.maps.MarkerImage('images/restaurant.png'),
            map:map,
            title: this.restaurantName
        }); 
        this.marker.setMap(map);
        
        // au clique sur le marqueur affiche une fenetre avec les avis
        let content=
        `<div class="row">
        <div class="col-xs-6 col-sm-6 col-md-6">
            <img src="https://maps.googleapis.com/maps/api/streetview?size=250x250&location=${this.lat},${this.long}&key=${streetViewApiKey}" class="card-img" alt="image google street view">                   
        </div>
        <div class="col-xs-6 col-sm-6 col-md-6">
            <h6>${this.restaurantName}</h6>
            <p>${this.star}</p>
            <p>${this.address}</p>
        
            </div>    </div>`
        
                       // ${this.commentHtml};
        //content += `<button type="button" id="addCommentBtn" class="btn btn-secondary" data-toggle="modal" data-target="#addCommentModal">Ajouter un avis</button>`;
        let infoWindowOptions = {
            content: content
        };
        this.infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        // marqueur et infowindow à la position du restaurant
        this.marker.addListener('click', ()=> {           
            this.infoWindow.open(map, this.marker);

        });
    }
    addComment(noteToPublish,commentToPublish){ 
        console.log(this.averageRating);   
        this.ratings.unshift({"rating":parseInt(noteToPublish),"text":commentToPublish});
        this.generateAverageRating();
        console.log(this.averageRating);
        this.generateCommentHtml();
        console.log(this.star);
        this.addStar();  
        
    }
    addStar(){
        //this.star="";
        if (this.averageRating>0){
            this.star="";
            for (let i=0; i<this.averageRating; i++){
                this.star+=`&nbsp;<img src="images/star.png" alt="star ou étoile">&nbsp;`;
            }
        } else {
            this.star=`<i><small>Aucun commentaire</small></i>`;
           
        }
    }
    generateCommentHtml(){
        let content="";
        for(let i=0; i<this.ratings.length; i++){
            content += `<p><b>${this.ratings[i].author_name}</b>&nbsp;&nbsp;Note : ${this.ratings[i].rating}&nbsp;&nbsp;<small><i> ${this.ratings[i].relative_time_description}</small></i></p>`
            + `<p>${this.ratings[i].text}<hr></p>`
        }
        this.commentHtml=content;
    }
    generatePanorama(){
        let pano= new google.maps.StreetViewPanorama(document.getElementById('pano'),{
            position: {lat: this.lat, lng: this.long},
            pov: {
                heading: 34,
                pitch: 10
              }
        });
        pano.setPosition({lat: this.lat, lng: this.long});
        $('#map').hide();
        $('#pano').show();
        $('#backToMapBtn').show();
        $('#resetMapBtn').hide();
        $('#backToMapBtn').on('click',()=>{
            $('#pano').hide();
            $('#map').show();
            $('#resetMapBtn').show();
            $('#backToMapBtn').hide();
        });

    }

    

}