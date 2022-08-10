//_______________________________Si le localStorage est vide alors on redirige sur la page d'accueil du site_____________________________________
if(localStorage.getItem("produit") === null){
    window.location.href = "index.html";
 }
 else{
    //_______________________________________Fonction pour afficher le numéro de commande_______________________________________________________
    function displayOrderId(){
        // Récupération de la chaîne de requête dans l'URL et Extraction de l'orderId (numéro de commande) de l'URL
        const orderId = new URLSearchParams(window.location.search).get("orderId");
        console.log(orderId);
        // Sélection de l'élément html dans lequel on veut afficher le numéro de commande
        const idCommande = document.getElementById("orderId");
        // On insère le numéro de commande dans le html
        idCommande.innerText = orderId;
        console.log(idCommande); 
    }
    //----------------------------On appelle la fonction pour afficher le numéro de commande------------------------------------------------
    displayOrderId();
    //-----------------------------------------On vide le localStorage--------------------------------------------------------------------
    localStorage.clear();
}