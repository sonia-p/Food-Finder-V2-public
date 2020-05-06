class Restaurant {
    constructor (restaurantName, address, lat, long,ratings,averageRating){
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long= long;
        this.ratings = ratings;
        this.averageRating = averageRating;
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
}