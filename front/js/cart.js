// Modification de la balise title du navigateur cart --> Page Panier (plus compréhensible par l'utilisateur)
document.title = "Page Panier";

//_______________________________________Déclaration des variables________________________________________________________________

//Déclaration de la variable "productRegisterInLocalStorage" dans laquelle on met les keys et les values qui sont dans le local Storage
let productRegisterInLocalStorage = JSON.parse(localStorage.getItem("produit"));
//----JSON.parse c'est pour convertir les données au format JSON qui sont dans le local storage en objet javascript
console.log(productRegisterInLocalStorage);

let compositionProduitsPanier = [];
// On déclare les 2 variables globales pour pouvoir calculer la quantité total d'articles et le prix total du panier
let totalPrice = 0;  
let totalQuantity = 0;
let quantityProductPanier = 0;
let priceProductPanier = 0;
let totalProductPricePanier = 0;
const boutonCommander = document.getElementById("order");



//_______________________________________________Fonctions__________________________________________________________________________________

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
        item.addEventListener("change", () => {
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
                            location.reload();
                            
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
            selectSupprimer[j].addEventListener("click" , () => {
               // event.preventDefault();
                console.log(selectSupprimer.length);
                //Selection de l'element à supprimer en fonction de son id ET sa couleur
                let idDelete = productRegisterInLocalStorage[j].idProduct;
                let colorDelete = productRegisterInLocalStorage[j].colorProduct;
                console.log(idDelete);
                console.log(colorDelete);
            
                productRegisterInLocalStorage = productRegisterInLocalStorage.filter
                ( element => element.idProduct !== idDelete || element.colorProduct !== colorDelete );
               
                localStorage.setItem("produit", JSON.stringify(productRegisterInLocalStorage));
                //Alerte produit supprimé et refresh
                alert("Ce produit va être supprimé du panier");
                location.reload();
            })
        }
    }

//----------------------------------Fonction pour afficher la phrase "Le panier est vide !"--------------------------------------------------
function messagePanierVide() {
    compositionProduitsPanier = 'Le panier est vide !';
    let newH2 = document.createElement('h2');
    productsPositionHtml.appendChild(newH2);
    newH2.innerText = compositionProduitsPanier;
}


//--------------------------------------------Affichage des produits du LocalStorage---------------------------------------------------------

// Sélection de la balise de la page product.html dans laquel on va insérer les produits et leurs infos
const productsPositionHtml = document.getElementById("cart__items");



//-----Si le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide), on affiche "Le panier est vide"-------------------------------------------------------------------
if(productRegisterInLocalStorage === null || productRegisterInLocalStorage.length == 0){
    messagePanierVide(); 
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
totaux();


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


        }//for
//___________________________________________Appel de la fonction Supprimer un produit__________________________________________________________
deleteProduct();
//_____________________________________Appel de le fonction Modifier la quantité d'un produit____________________________________________________
changeQuantity();


       }); //then
   

//Instauration formulaire avec regex
function getForm() {
    // Ajout des Regex
    let form = document.querySelector(".cart__order__form");

    //Création des expressions régulières
    let emailRegExp = new RegExp("^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$");
    let charRegExp = new RegExp("^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
    let addressRegExp = new RegExp("^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");

    // Ecoute de la modification du prénom
    form.firstName.addEventListener('change', function() {
        validFirstName(this);
    });

    // Ecoute de la modification du prénom
    form.lastName.addEventListener('change', function() {
        validLastName(this);
    });

    // Ecoute de la modification du prénom
    form.address.addEventListener('change', function() {
        validAddress(this);
    });

    // Ecoute de la modification du prénom
    form.city.addEventListener('change', function() {
        validCity(this);
    });

    // Ecoute de la modification du prénom
    form.email.addEventListener('change', function() {
        validEmail(this);
    });

    //validation du prénom
    const validFirstName = function(inputFirstName) {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (charRegExp.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = '';
        } else {
            firstNameErrorMsg.innerHTML = 'Veuillez indiquer un prénom.';
        }
    };

    //validation du nom
    const validLastName = function(inputLastName) {
        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (charRegExp.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = '';
        } else {
            lastNameErrorMsg.innerHTML = 'Veuillez indiquer un nom de famille.';
        }
    };

    //validation de l'adresse
    const validAddress = function(inputAddress) {
        let addressErrorMsg = inputAddress.nextElementSibling;

        if (addressRegExp.test(inputAddress.value)) {
            addressErrorMsg.innerHTML = '';
        } else {
            addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };

    //validation de la ville
    const validCity = function(inputCity) {
        let cityErrorMsg = inputCity.nextElementSibling;

        if (charRegExp.test(inputCity.value)) {
            cityErrorMsg.innerHTML = '';
        } else {
            cityErrorMsg.innerHTML = 'Veuillez indiquer le nom d\'une ville.';
        }
    };

    //validation de l'email
    const validEmail = function(inputEmail) {
        let emailErrorMsg = inputEmail.nextElementSibling;

        if (emailRegExp.test(inputEmail.value)) {
            emailErrorMsg.innerHTML = '';
        } else {
            emailErrorMsg.innerHTML = 'Veuillez renseigner un email correct.';
        }
    };
    }
getForm();

//Envoi des informations client au localstorage
function postForm(){
  //  const btn_commander = document.getElementById("order");

//Récupération des coordonnées du formulaire client
let inputName = document.getElementById('firstName');
let inputLastName = document.getElementById('lastName');
let inputAdress = document.getElementById('address');
let inputCity = document.getElementById('city');
let inputMail = document.getElementById('email');


    //Ecouter le panier
    boutonCommander.addEventListener("click", (event)=>{
        event.preventDefault();
        if(
            !inputName.value ||
            !inputLastName.value ||
            !inputCity.value ||
            !inputAdress.value ||
            !inputMail.value
        ) {
            alert("Vous devez renseigner tous les champs !");
            event.preventDefault();
        }
        else{
        

        //Construction d'un array depuis le local storage
        let idProducts = [];
        for (let i = 0; i<productRegisterInLocalStorage.length;i++) {
            idProducts.push(productRegisterInLocalStorage[i].idProduct);
        }
        console.log(idProducts);

        const order = {
            contact: {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAdress.value,
                city: inputCity.value,
                email: inputMail.value,
            },
            products: idProducts,
        } 

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(order)
        };

        fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            localStorage.clear();
            localStorage.setItem("orderId", data.orderId);

            document.location.href = "confirmation.html";
        })
        .catch((err) => {
            alert ("Problème avec fetch : " + err.message);
        });
    }
        })
    }
    postForm();
}; //else