// si le localStorage est vide alors on revient sur la page d'accueil du site
if(localStorage.getItem("orderId") === null){
    window.location.href = "index.html";
 }
 else{
function main(){
    const idNode = document.getElementById("orderId");
    idNode.innerText = localStorage.getItem("orderId");
    console.log(localStorage.getItem("orderId"));
    localStorage.clear();
}
main();
}