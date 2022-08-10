// si le localStorage est vide alors on redirige sur la page d'accueil du site
if(localStorage.getItem("produit") === null){
    window.location.href = "index.html";
 }
 else{
// Fonction pour afficher le numéro de commande
function displayOrderId(){
    // Récupération de la chaîne de requête dans l'URL et Extraction de l'orderId (numéro de commande) de l'URL
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    console.log(orderId);
    const idCommande = document.getElementById("orderId");
    idCommande.innerText = orderId;
    console.log(idCommande);
    localStorage.clear();
}
displayOrderId();
}