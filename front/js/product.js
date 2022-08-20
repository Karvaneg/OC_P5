// Récupération de la chaîne de requête dans l'URL
    /*const queryStringUrl = window.location.search;
    console.log(queryStringUrl);*/
//Extraction de l'ID de l'URL
/*const urlId = new URLSearchParams(queryStringUrl);
console.log(urlId);
const productId = urlId.get("id");*/

// Récupération de la chaîne de requête dans l'URL du navigateur et Extraction de l'ID de l'URL
const productId = new URLSearchParams(window.location.search).get("id");
console.log(productId);

// Si on a bien récupéré un id on récupère les données de l'API correspondant à cet id
if (productId !== null){
fetch(`http://localhost:3000/api/products/${productId}`)
  .then(response => response.json())
  .then(selectProduct => {
    console.log(selectProduct);

//Affichage sur la page product.html du canapé sélectionné sur la page d'accueil, à partir de l'id de l'URL
    // Ajout du nom du produit dans la balise title du navigateur
    document.title = selectProduct.name;
    // Création d'une balise img manquante
    const img = document.createElement("img");
    // Récupération des données de l'API et destination des éléments
    img.src = selectProduct.imageUrl;
    img.alt = selectProduct.altTxt;
    document.getElementsByClassName("item__img")[0].appendChild(img);
    document.getElementById("title").innerText = selectProduct.name;
    document.getElementById("price").innerText = selectProduct.price + " ";
    document.getElementById("description").innerText = selectProduct.description;

    // Boucle forEach pour ajouter toutes les couleurs en option du select en HTML
    selectProduct.colors.forEach(function (color) {
        const option = document.createElement("option");
        const select = document.getElementById("colors");
    
        // Récupération des données de l'API
        option.value = color;
        option.innerText = color;
    
        // Ajout de l'option à la sélection (select en HTML)
        select.appendChild(option);
    })

// Récupération des données sélectionnées par l'utilisateur pour l'envoi vers le panier

    //Sélection du bouton Ajouter au panier puis.....
    const selectBoutonPanier = document.querySelector("#addToCart");
    // .....Ecoute du bouton Panier pour envoyer les choix de l'utilisateur
        selectBoutonPanier.addEventListener("click", (event)=>{
            event.preventDefault();
            // Sélection de l'id pour le choix de la couleur et....
            const colorId = document.querySelector("#colors");
            // .....insertion de la couleur choisie par l'utilisateur dans une variable
            choiceColor = colorId.value;
            // Sélection de l'id pour le choix de la quantité et insertion de la quantité choisie par l'utilisateur dans une variable
            const quantity = document.querySelector("#quantity");
            choiceQuantity = Number(quantity.value);
            console.log(choiceQuantity);

           // Récupération des données (id, couleur et quantité) après les choix faits par l'utilisateur,....
           //..... à condition que la couleur soit bien sélectionnée,.... 
           //......que la quantité indiquée par l'utilisateur soit comprise entre 1 et 100.....
           //......et que la quantité entrée par l'utilisateur soit un nombre entier
            if (choiceColor !== "" && choiceQuantity > 0 && choiceQuantity <= 100 && Number.isInteger(choiceQuantity)) {
                let optionsProduct = {
                    idProduct: selectProduct._id ,
                    colorProduct: choiceColor ,
                    quantityProduct: choiceQuantity
                }
                console.log(optionsProduct);
                //-------------------------------Le Local Storage--------------------------------------------
                // On cré une variable pour afficher un message lors de l'ajout d'1 produit dans le localStorage
                let messageLocalStorageUpdating = false;
                //Fonction ajouter dans le localStorage un produit sélectionné par l'utilisatueur, avec ses options (id, couleur, quantité)
                const addProductLocalStorage = () => {
                    
                    // Si le produit et la couleur choisis existent déjà dans le localStorage alors on incrémente uniquement la quantité
                    let findProduct = produitEnregistreDansLocalStorage.find((x) => {return x.idProduct === optionsProduct.idProduct && x.colorProduct === optionsProduct.colorProduct});
                    if(findProduct){
                        const total = Number(findProduct.quantityProduct) + Number(optionsProduct.quantityProduct);
                        if(total <= 100){
                            // On met la variable message sur false pour pouvoir afficher un message plus approprié
                            messageLocalStorageUpdating = false;
                            findProduct.quantityProduct = Number(findProduct.quantityProduct) + Number(optionsProduct.quantityProduct);
                            alert(`La quantité du produit ${selectProduct.name} de couleur ${choiceColor} a bien été mise à jour.`);
                        }
                        else{
                            // On met la variable message sur false pour pouvoir afficher un message plus approprié
                            messageLocalStorageUpdating = false;
                            alert("La quantité d'un article (même référence et même couleur) ne peut pas dépasser 100. Merci de rectifier la quantité choisie.");
                        }
                    }
                    // Si le produit et la couleur choisis n'existent pas encore dans le localStorage alors on ajoute le produit et les options choisies
                    else{
                        // On met la variable message sur true car c'est bien ce message là qu'on veut afficher
                        messageLocalStorageUpdating = true;
                         // on met les options du produit choisi dans une variable "produitEnregistreDansLocalStorage"
                        produitEnregistreDansLocalStorage.push(optionsProduct);
                    }
                    
                    // Transformation en format JSON et envoi des infos dans la clé "produit" du localStorage
                    localStorage.setItem("produit", JSON.stringify(produitEnregistreDansLocalStorage))
                }// Fin fonction addProductLocalStorage

                //Déclaration de la variable "produitEnregistreDansLocalStorage" dans laquelle on récupère les keys et les values....
                //..... qui sont dans le localStorage afin de contrôler si le localStorage est vide ou non
                let produitEnregistreDansLocalStorage = JSON.parse(localStorage.getItem("produit"));
                //----JSON.parse c'est pour convertir les données au format JSON qui sont dans le localStorage en objet javascript

                 // si le localStorage contient déjà une clé "produit"
                if(produitEnregistreDansLocalStorage){
                    addProductLocalStorage();
                    console.log(produitEnregistreDansLocalStorage);
                }
                // si le localStorage est vide
                else{
                    produitEnregistreDansLocalStorage = [];
                    addProductLocalStorage();
                    console.log(produitEnregistreDansLocalStorage);
                    // On met la variable message sur false pour pouvoir afficher un message plus approprié
                    messageLocalStorageUpdating = false;
                    alert(`Félicitations !! Vous venez d'ajouter votre premier produit dans le panier ! `);
                }
                // si la variable messageLocalStorageUpdating est vrai alors on affiche ce message :
                if(messageLocalStorageUpdating){
                    alert(`Le produit ${selectProduct.name} de couleur ${choiceColor} a bien été ajouté au panier.`);
                    }

            }
            // si la couleur n'est pas sélectionnée ou la quantité non comprise entre 1 et 100 alors on affiche un message d'alerte
            else {
                alert(`La couleur n'est pas sélectionnée et/ou la quantité n'est pas comprise entre 1 et 100 ou n'est pas un nombre entier. Veuillez vérifier !`);
            }
        });
    })
    .catch((err) => {
        console.log("Erreur Fetch product.js : l'id du produit est incorrect.", err);
        alert(`Le produit sélectionné n'a pas été trouvé !`);
        window.location.href = "index.html";
    })
}
else{
    console.log("L'id du produit n'a pas été indiqué dans l'url.");
    alert(`Le produit sélectionné n'a pas été trouvé !`);
    window.location.href = "index.html";
 }