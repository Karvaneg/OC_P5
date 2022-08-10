// Modification de la balise title du navigateur cart --> Page Panier (plus compréhensible par l'utilisateur)
document.title = "Page Panier";

//_______________________________________Déclaration des variables________________________________________________________________

//Déclaration de la variable "productRegisterInLocalStorage" dans laquelle on met les keys et les values qui sont dans le local Storage
let productRegisterInLocalStorage = JSON.parse(localStorage.getItem("produit"));
//----JSON.parse c'est pour convertir les données au format JSON qui sont dans le local storage en objet javascript
console.log(productRegisterInLocalStorage);

// Sélection de la balise de la page product.html dans laquel on va insérer les produits et leurs infos
const productsPositionHtml = document.getElementById("cart__items");

let compositionProduitsPanier = [];
// On déclare les 2 variables globales pour pouvoir calculer la quantité total d'articles et le prix total du panier
let totalPrice = 0;  
let totalQuantity = 0;
let newTotalQuantity = 0;
let quantityProductPanier = 0;
let priceProductPanier = 0;
let totalProductPricePanier = 0;
let errorFormulaire = true;
const boutonCommander = document.getElementById("order");
const validFirstName = [];
const validLastName = [];
const validAddress = [];
const validCity = [];
const validEmail = [];



//_____________________________________________________________Fonctions_____________________________________________________________________

//--------------------------------Fonction Calcul de la quantité total d'articles dans le panier--------------------------------------------
function totalProductsQuantity(){
    totalQuantity += parseInt(quantityProductPanier);
    console.log(totalQuantity);
    document.getElementById("totalQuantity").innerText = totalQuantity;
}

//----------------------------------Fonction Calcul du montant total du panier----------------------------------------------------
function totalProductsPrice (){
    // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
    totalProductPricePanier = quantityProductPanier * priceProductPanier;
    console.log(totalProductPricePanier);
    // Calcul du prix total du panier
    totalPrice += totalProductPricePanier;
    console.log(totalPrice);
    document.getElementById("totalPrice").innerText = totalPrice; 
    }

function totaux (){
    totalProductsQuantity();
    totalProductsPrice();
}

//----------------------------------Fonction Modifier la quantité d'un article du panier--------------------------------------------------
let messageErrorQuantity = false;
function changeQuantity() {
    let changeQuantity = document.querySelectorAll(".itemQuantity");
    changeQuantity.forEach((item) => {
        item.addEventListener("change", (event) => {
            event.preventDefault();
                for (let i in productRegisterInLocalStorage){
                    if (productRegisterInLocalStorage[i].id == item.dataset.id && productRegisterInLocalStorage[i].color == item.dataset.color){
                        if(changeQuantity[i].value > 0 && changeQuantity[i].value <= 100){
                        productRegisterInLocalStorage[i].quantityProduct = parseInt(changeQuantity[i].value);
                        localStorage.setItem("produit", JSON.stringify(productRegisterInLocalStorage));
                        window.location.href = "cart.html";
                        messageErrorQuantity = false;
                        }
                        else if (changeQuantity[i].value == 0){
                            let idDelete = productRegisterInLocalStorage[i].idProduct;
                            let colorDelete = productRegisterInLocalStorage[i].colorProduct;
                            console.log(idDelete);
                            console.log(colorDelete);
                            productRegisterInLocalStorage = productRegisterInLocalStorage.filter
                            ( element => element.idProduct !== idDelete || element.colorProduct !== colorDelete );
                            localStorage.setItem("produit", JSON.stringify(productRegisterInLocalStorage));
                            messageErrorQuantity = false;
                            //Alerte produit supprimé et refresh
                            alert("Ce produit a bien été supprimé du panier");
                          //  totaux();
                            
                        }
                        else{
                            changeQuantity[i].value = productRegisterInLocalStorage[i].quantityProduct;
                            messageErrorQuantity = true;
                        }
                    } 
                    if(messageErrorQuantity){       
                        alert("La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100. Merci de rectifier la quantité choisie.");
                    } 
                } 
                
        });
        
    });
    
}

//----------------------------------Fonction Suppression d'un article du panier--------------------------------------------------

/*function deleteProduct() {
    let selectSupprimer = document.querySelectorAll(".deleteItem");
    for (let j = 0; j < selectSupprimer.length; j++){
        selectSupprimer[j].addEventListener("click" , (event) => {
           event.preventDefault();
           // On pointe le parent hiérarchique <article> du lien "supprimer"
           let myArticle = selectSupprimer[j].closest('article');

           // Sélection de l'élément à supprimer en fonction de son id ET sa couleur
           // Préparation à la suppression du localStorage-miroir (nettoyage du panier)
           productRegisterInLocalStorage = productRegisterInLocalStorage.filter(
            el => myArticle.dataset.id !== el.idProduct &&
                  myArticle.dataset.color !== el.colorProduct
           );
            // Reconstruction du localStorage (écrasement)
            localStorage.setItem('produit', JSON.stringify(productRegisterInLocalStorage));

            // Supprimer physiquement le bloc-produit du panier
            // On supprime cette balise <article> depuis son parent
            myArticle.parentNode.removeChild(myArticle);
            setTimeout( () => {totaux() }, 500);
            setTimeout( () => { alert("Ce produit a bien été supprimé du panier")}, 800);
            console.log(totaux());
        })
        }
}*/

function deleteProduct() {
    
    let selectSupprimer = document.querySelectorAll(".deleteItem");
        for (let j = 0; j < selectSupprimer.length; j++){
            selectSupprimer[j].addEventListener("click" , (event) => {
                event.preventDefault();

                //Selection de l'element à supprimer en fonction de son id ET sa couleur
                let idDelete = productRegisterInLocalStorage[j].idProduct;
                let colorDelete = productRegisterInLocalStorage[j].colorProduct;
                console.log(idDelete);
                console.log(colorDelete);
                productRegisterInLocalStorage = productRegisterInLocalStorage.filter
                ( element => element.idProduct !== idDelete || element.colorProduct !== colorDelete );
                localStorage.setItem("produit", JSON.stringify(productRegisterInLocalStorage));
                //Alerte produit supprimé
                alert("Ce produit va être supprimé du panier");



                fetch("http://localhost:3000/api/products")
                .then(response => response.json())
                .then(data => {
                // on récupère la couleur, la quantité et l'id de tous les produits contenus dans le localstorage et on les met dans des variables
                for(let k = 0; k < productRegisterInLocalStorage.length; k++){
                  //  let colorProductPanier = productRegisterInLocalStorage[k].colorProduct;
                    let idProductPanier = productRegisterInLocalStorage[k].idProduct;
                    quantityProductPanier = productRegisterInLocalStorage[k].quantityProduct;
                    console.log(quantityProductPanier);
                  
                //on ne récupère que les données des canapés dont _id (de l'api) correspondent à l'id dans le localStorage
                const newcompositionProduitsPanier = data.find((element) => element._id === idProductPanier);
                console.log(newcompositionProduitsPanier);
                // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
                priceProductPanier = newcompositionProduitsPanier.price;

                newTotalProductPricePanier = quantityProductPanier * priceProductPanier;
                console.log(totalProductPricePanier);
             //   totaux();

                }
                });

               
                // On pointe le parent hiérarchique <article> du lien "supprimer"
                let myArticle = selectSupprimer[j].closest('article');
                console.log(myArticle);
                // Supprimer physiquement le bloc-produit du panier
                // On supprime cette balise <article> depuis son parent
                myArticle.parentNode.removeChild(myArticle);
              //  setTimeout( () => {totaux() }, 500);
              //  setTimeout( () => { alert("Ce produit a bien été supprimé du panier")}, 800);
             //   console.log(totaux());


               
                    
                
                                
                 /*   // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
                    totalProductPricePanier = quantityProductPanier * priceProductPanier;
                    console.log(totalProductPricePanier);
                    // Calcul du prix total du panier
                    totalPrice -= totalProductPricePanier;
                    console.log(totalPrice);
                    document.getElementById("totalPrice").innerText = totalPrice; */
                    



            });
        }
            /*    // Et on réaffiche le "nouveau" contenu du localStorage
                productRegisterInLocalStorage = JSON.parse(localStorage.getItem("produit"));
                console.log(productRegisterInLocalStorage);
               
                fetch("http://localhost:3000/api/products")
                .then(response => response.json())
                .then(data => {
                // on récupère la couleur, la quantité et l'id de tous les produits contenus dans le localstorage et on les met dans des variables
                for(let i = 0; i < productRegisterInLocalStorage.length; i++){
                    let colorProductPanier = productRegisterInLocalStorage[i].colorProduct;
                    let idProductPanier = productRegisterInLocalStorage[i].idProduct;
                    console.log(idProductPanier);
                    console.log(colorProductPanier);
                    quantityProductPanier = productRegisterInLocalStorage[i].quantityProduct;
                    console.log(quantityProductPanier);
                    //on ne récupère que les données des canapés dont _id (de l'api) correspondent à l'id dans le localStorage
                    const compositionProduitsPanier = data.find((element) => element._id === idProductPanier);
                    console.log(compositionProduitsPanier);
                    // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
                    priceProductPanier = compositionProduitsPanier.price;
                    console.log(priceProductPanier);
                    const elementH2 = document.getElementsByTagName('h2');
                    elementH2.textContent = compositionProduitsPanier.name;
                    console.log(elementH2.textContent);



                }
               
                });*/
               
               
                // affichagePanier();
             //   const elementH2 = document.getElementsByTagName('h2');
              //  elementH2.textContent = productRegisterInLocalStorage[j].name;

                // Et on recalcule la quantité et le prix total du panier
              //  totalProductsQuantity();
               // totaux();
               

        }
   // const elementTotal = document.getElementById('totalPrice');
  //  elementTotal.textContent = "test";




//----------------------------------Fonction pour afficher la phrase "Le panier est vide !"--------------------------------------------------
function messagePanierVide() {
    compositionProduitsPanier = 'Le panier est vide !';
    let newH2 = document.createElement('h2');
    productsPositionHtml.appendChild(newH2);
    newH2.innerText = compositionProduitsPanier;
    document.getElementById("totalQuantity").innerText = 0;
    document.getElementById("totalPrice").innerText = 0;
}


//--------------------------------------------Affichage des produits du LocalStorage---------------------------------------------------------



//-----Si le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide), on affiche "Le panier est vide"-------------------------------------------------------------------
if(productRegisterInLocalStorage === null || productRegisterInLocalStorage.length == 0){
    messagePanierVide(); 
    //Si le client clique quand même sur le bouton commander, on lui rappelle que le panier est vide
    boutonCommander.addEventListener("click", (event)=>{
            alert("Votre panier est vide !");
            event.preventDefault();
        });

 }


//-------------------Si le panier n'est pas vide alors, on affiche le contenu du localStorage------------------------------------------------

 else {
    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(data => {
        // on récupère la couleur, la quantité et l'id de tous les produits contenus dans le localstorage et on les met dans des variables
        for(let i = 0; i < productRegisterInLocalStorage.length; i++){
            let colorProductPanier = productRegisterInLocalStorage[i].colorProduct;
            let idProductPanier = productRegisterInLocalStorage[i].idProduct;
            quantityProductPanier = productRegisterInLocalStorage[i].quantityProduct;
          
          
        //on ne récupère que les données des canapés dont _id (de l'api) correspondent à l'id dans le localStorage
        const compositionProduitsPanier = data.find((element) => element._id === idProductPanier);
        console.log(compositionProduitsPanier);
        // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
        priceProductPanier = compositionProduitsPanier.price;
        
 /*   fetch(`http://localhost:3000/api/products/${(productRegisterInLocalStorage[i]._id)}`)
        .then(response => response.json())
        .then(data => {
          //on ne récupère que les données des canapés dont _id (de l'api) correspondent à l'id dans le localStorage
          const compositionProduitsPanier = data.find((element) => element._id === idProductPanier);
          console.log(compositionProduitsPanier);
          // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
          priceProductPanier = compositionProduitsPanier.price;*/

//________________________Insertion dans le html de la quantité total d'articles et du prix total du panier________________________________
//--------------Appel des fonctions pour calculer la quantité totale d'articles et le prix total du panier-------------------------
//totalProductsPrice(); 
//totalProductsQuantity();



//--On cré les éléments html manquants de la page cart.html, dans la <section id="cart__items"> et on y insère les infos du localstorage----
//_________________________________________Début Ajout Balises html_________________________________________________________________________
//-----------Création de la balise article avec comme classe cart__item---------------------------------------------------------------------
let newArticle = document.createElement('article');
newArticle.setAttribute("class","cart__item");
newArticle.setAttribute("data-id",`${idProductPanier}`);
newArticle.setAttribute("data-color",`${colorProductPanier}`);
productsPositionHtml.appendChild(newArticle);

    //---------------Création de la div avec pour classe cart__item__img----------------------------------------------
    let newDivImg = document.createElement('div');
    newDivImg.setAttribute("class", "cart__item__img");
    newArticle.appendChild(newDivImg);

        //-----------------------Création de la balise image qui contiendra la photo de chaque canapé---------------
        let newImg = document.createElement('img');
        newImg.setAttribute("src", compositionProduitsPanier.imageUrl);
        newImg.setAttribute("alt", compositionProduitsPanier.altTxt);
        newDivImg.appendChild(newImg);

    //---------------Création de la div avec pour classe cart__item__content-----------------------------------------
    let newDivContent = document.createElement('div');
    newDivContent.setAttribute("class", "cart__item__content");
    newArticle.appendChild(newDivContent);   

        //---------------Création de la div avec pour classe cart__item__content__description-------------------------
        let newDivContentDescription = document.createElement('div');
        newDivContentDescription.setAttribute("class", "cart__item__content__description");
        newDivContent.appendChild(newDivContentDescription);

            //----------------Création d'une balise titre h2 qui indique le nom du produit choisi par l'utilisateur---
            let newH2 = document.createElement('h2');
            newH2.textContent = compositionProduitsPanier.name;
            newDivContentDescription.appendChild(newH2);

            //----------------Création d'une balise p qui indique la couleur choisie par l'utilisateur----------------
            let newPColor = document.createElement('p');
            newPColor.textContent = colorProductPanier;
            newDivContentDescription.appendChild(newPColor);

            //----------------Création d'une balise p qui indique le prix du canapé----------------
            let newPPrice = document.createElement('p');
            newPPrice.textContent = compositionProduitsPanier.price + " €";
            newDivContentDescription.appendChild(newPPrice);

        //---------------Création de la div avec pour classe cart__item__content__settings-------------------------
        let newDivContentSettings = document.createElement('div');
        newDivContentSettings.setAttribute("class", "cart__item__content__settings");
        newDivContent.appendChild(newDivContentSettings);

            //---------------Création de la div avec pour classe cart__item__content__settings__quantity-------------------------
            let newDivContentSettingsQuantity = document.createElement('div');
            newDivContentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
            newDivContentSettings.appendChild(newDivContentSettingsQuantity);

                //----------------Création d'une balise p qui indique le texte "Qté :"----------------
                let newPQuantite = document.createElement('p');
                newPQuantite.textContent = "Qté :";
                newDivContentSettingsQuantity.appendChild(newPQuantite);

                //----------------Création d'une balise input avec la classe "itemQuantity" qui permet de modifier la quantité---
                let newPInput = document.createElement('input');
                newPInput.setAttribute("type", "number");
                newPInput.setAttribute("class", "itemQuantity");
                newPInput.setAttribute("name", "itemQuantity");
                newPInput.setAttribute("min", "1");
                newPInput.setAttribute("max", "100");
                newPInput.setAttribute("value", `${quantityProductPanier}`);
                newDivContentSettingsQuantity.appendChild(newPInput);

            //---------------Création de la div avec pour classe cart__item__content__settings__delete-------------------------
            let newDivContentSettingsDelete = document.createElement('div');
            newDivContentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
            newDivContentSettings.appendChild(newDivContentSettingsDelete);


                //----------------Création d'une balise p qui indique le prix du canapé----------------
                let newPDelete = document.createElement('p');
                newPDelete.setAttribute("class", "deleteItem");
                newPDelete.textContent = "Supprimer";
                newDivContentSettingsDelete.appendChild(newPDelete);
                
//_________________________________________________Fin Ajout Balises html__________________________________________________________________
 totaux();

        }//for



        
   //___________________________________________Appel de la fonction Supprimer un produit__________________________________________________________
   deleteProduct();
   //_____________________________________Appel de le fonction Modifier la quantité d'un produit____________________________________________________
   changeQuantity(); 
   
  // totaux();
   



}); //then   

//__________________________________________Gestion du formulaire de contact et validation de la commande________________________________________
//___________________________________Contrôle des infos avec Regex et Récupération des données du formulaire_______________________

    // Sélection de l'élément form et déclaration d'une variable
  //  let form = document.querySelector(".cart__order__form");

    //Création des expressions régulières pour contrôler les infos entrées par l'utilisateur
    let textRegex = new RegExp("^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
    let addressRegex = new RegExp("^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
    let emailRegex = new RegExp("^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$");

//Récupération des coordonnées du formulaire client et mise en variable
    let inputFirstName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAddress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputEmail = document.getElementById('email');
    let checkValueFirstName;
    let checkValueLastName;
    let checkValueAddress;
    let checkValueCity;
    let checkValueEmail;
  
    // Ecoute du contenu du champ "prénom", Vérification du prénom et affichage d'un message si celui-ci n'est pas correct
    inputFirstName.addEventListener('change', function() {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;
        checkValueFirstName = textRegex.test(inputFirstName.value);
        if (checkValueFirstName) {
            firstNameErrorMsg.innerHTML = '';
            errorFormulaire = false;
        } else {
            firstNameErrorMsg.innerHTML = 'Veuillez indiquer un prénom.';
            errorFormulaire = true;
        }
    });

    // Ecoute du contenu du champ "nom", Vérification du nom et affichage d'un message si celui-ci n'est pas correct
    inputLastName.addEventListener('change', function() {
        let lastNameErrorMsg = inputLastName.nextElementSibling;
        checkValueLastName = textRegex.test(inputLastName.value);
        if (checkValueLastName) {
            lastNameErrorMsg.innerHTML = '';
            errorFormulaire = false;
        } else {
            lastNameErrorMsg.innerHTML = 'Veuillez indiquer un nom de famille.';
            errorFormulaire = true;
        }
    });

    // Ecoute du contenu du champ "adresse", Vérification de l'adresse et affichage d'un message si celle-ci n'est pas correcte
    inputAddress.addEventListener('change', function() {
        let addressErrorMsg = inputAddress.nextElementSibling;
        checkValueAddress = addressRegex.test(inputAddress.value);
        if (checkValueAddress) {
            addressErrorMsg.innerHTML = '';
            errorFormulaire = false;
        } else {
            addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
            errorFormulaire = true;
        }
    });

    // Ecoute du contenu du champ "ville", Vérification de la ville et affichage d'un message si celle-ci n'est pas correcte
    inputCity.addEventListener('change', function() {
        let cityErrorMsg = inputCity.nextElementSibling;
        checkValueCity = textRegex.test(inputCity.value);
        if (checkValueCity) {
            cityErrorMsg.innerHTML = '';
            errorFormulaire = false;
        } else {
            cityErrorMsg.innerHTML = 'Veuillez indiquer le nom d\'une ville.';
            errorFormulaire = true;
        }
    });

    // Ecoute du contenu du champ "email", Vérification de l'email et affichage d'un message si celui-ci n'est pas correct
    inputEmail.addEventListener('change', function() {
        let emailErrorMsg = inputEmail.nextElementSibling;
        checkValueEmail = emailRegex.test(inputEmail.value);
        if (checkValueEmail) {
            emailErrorMsg.innerHTML = '';
            errorFormulaire = false;
        } else {
            emailErrorMsg.innerHTML = 'Veuillez renseigner un email correct.';
            errorFormulaire = true;
        }
    });
    
    //Ecoute du bouton Commander 
    boutonCommander.addEventListener("click", (event)=>{
        event.preventDefault();// Empêche le rechargement de la page
        // On vérifie que tous les champs sont bien renseignés, sinon on indique un message à l'utilisateur
        // On vérifie qu'aucun champ n'est vide
        if(
            !inputFirstName.value ||
            !inputLastName.value ||
            !inputAddress.value ||
            !inputCity.value ||
            !inputEmail.value
        ) {
            alert("Vous devez renseigner tous les champs !");
            event.preventDefault();
        }
        // On vérifie que les champs sont correctements remplis suivant les regex mises en place
        else if(
            errorFormulaire === true
        ){
            alert("Veuillez vérifier les champs du formulaire et les remplir correctement !");
            event.preventDefault();
        }
        else{

        //Récupération des id des produits du panier, dans le localStorage
        let idProducts = [];
        for (let i = 0; i<productRegisterInLocalStorage.length;i++) {
            idProducts.push(productRegisterInLocalStorage[i].idProduct);
        }
        console.log(idProducts);
        // On cré un objet dans lequel on met les infos "Contact" et les infos "Produits du panier" (l'id)
        const order = {
            contact: {
                firstName: inputFirstName.value,
                lastName: inputLastName.value,
                address: inputAddress.value,
                city: inputCity.value,
                email: inputEmail.value,
            },
            products: idProducts,
            
        } 
        console.log(order);
        // On indique la méthode d'envoi des données
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(order)
        };
        console.log(options);
        // on envoie les données Contact et l'id des produits à l'API et on efface le localStorage
        fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
          //  localStorage.clear();
            // on redirige vers la page de confirmation de commande en passant l'orderId (numéro de commande) dans l'URL
            document.location.href = `confirmation.html?orderId=${data.orderId}`;
        })
        .catch((err) => {
            alert ("Problème avec fetch : " + err.message);
        });
    }
        })
}; //else