function ajaxGet(url, callback) {   
    var req = new XMLHttpRequest(); // création objet XMLHttpRequest
    req.open("GET", url);  // initialisation de la requete (methode + URL de destination + requête asynchrone ou pas : true par default)
    req.addEventListener("load", function () { 
        if (req.status >= 200 && req.status < 400) { 
            callback(req.responseText);// format de retour
        } else {
            console.error(req.status + " " + req.statusText + " " + url); 
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}


// Exécute un appel AJAX POST
// Prend en paramètres l'URL cible, la donnée à envoyer et la fonction callback appelée en cas de succès
function ajaxPost(url, data, callback, isJson) {
    var req = new XMLHttpRequest();
    req.open("POST", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
            console.log(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    if (isJson) {
        // Définit le contenu de la requête comme étant du JSON
        req.setRequestHeader("Content-Type", "application/json");
        // Transforme la donnée du format JSON vers le format texte avant l'envoi
        data = JSON.stringify(data);
        console.log(data);
    }
    req.send(data);
}