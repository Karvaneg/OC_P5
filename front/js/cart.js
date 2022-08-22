//_________________Modification de la balise title du navigateur cart --> Page Panier (plus compréhensible par l'utilisateur)_____________________
document.title = "Page Panier";

//______Déclaration de la variable "productRegisterInLocalStorage" dans laquelle on met les keys et les values qui sont dans le local Storage______
//-----------------JSON.parse c'est pour convertir les données au format JSON qui sont dans le localStorage en objet javascript--------------------
let productRegisterInLocalStorage = JSON.parse(localStorage.getItem("produit"));
    //console.log(productRegisterInLocalStorage);
//--------------------Sélection de la balise de la page product.html dans laquel on va insérer les produits et leurs infos-------------------------
const productsPositionHtml = document.getElementById("cart__items");

//_______________________________________________Déclaration des variables________________________________________________________________________
let compositionProduitsPanier = [];
//-----------On déclare nos variables globales pour pouvoir calculer la quantité total d'articles et le prix total du panier----------------------
let totalPrice = 0;  
let totalQuantity = 0;
let quantityProductPanier = 0;
let priceProductPanier = 0;
let totalProductPricePanier = 0;
let mesProduits = [];
const findProducts = 0;

//---------------------------------------On déclare nos variables utilisées dans le fonction supprimer---------------------------------------------
let idDelete = 0;
let colorDelete = 0;

//--------------------------------------On déclare nos variables utilisées pour la validation du panier--------------------------------------------
const boutonCommander = document.getElementById("order");
let errorFormulaireFirstName = true;
let errorFormulaireLastName = true;
let errorFormulaireAddress = true;
let errorFormulaireCity = true;
let errorFormulaireEmail = true;

//_____________________________________________________________Fonctions_____________________________________________________________________

//----------------------Fonction Calcul de la quantité total d'articles dans le panier, au chargement de la page Panier.html-----------------
function totalProductsQuantity(){
    totalQuantity += parseInt(quantityProductPanier);
    console.log("Total quantité panier",totalQuantity);
    document.getElementById("totalQuantity").innerText = totalQuantity;
}

//-------------------------------Fonction Calcul du montant total du panier, au chargement de la page Panier.html-------------------------------
function totalProductsPrice (){
    // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
    totalProductPricePanier = quantityProductPanier * priceProductPanier;
    // console.log(totalProductPricePanier);
    // Calcul du prix total du panier
    totalPrice += totalProductPricePanier;
    console.log("Total prix panier",totalPrice);
    document.getElementById("totalPrice").innerText = totalPrice; 
    }

function totaux (){
    totalProductsQuantity();
    totalProductsPrice();
}

//---Fonction Recalcul de la quantité total d'articles dans le panier, lors de la modification de la quantité ou de la suppression d'un article---
function recalculTotalQuantity() {
    let newTotalQuantity = 0;
    for (const item of productRegisterInLocalStorage) {
        //On calcul le nombre de quantité total de produits dans le localStorage
        newTotalQuantity += parseInt(item.quantityProduct);
    }
        console.log("Nouvelle quantité totale panier",newTotalQuantity);
    //On affichage la nouvelle quantité totale de produits dans le html
    document.getElementById("totalQuantity").innerText = newTotalQuantity;
}


//----------Fonction Recalcul du montant total du panier, lors de la modification de la quantité ou de la suppression d'un article-------------
function recalculTotalPrice() {
    let newTotalPrice = 0;
    //(1) On fait une boucle sur le productRegisterInLocalStorage et dans cette boucle, 
    for (const item of productRegisterInLocalStorage) {
        const idProductsLocalStorage = item.idProduct;
        const quantityProductsLocalStorage = item.quantityProduct;
        //(2) on vérifie si l'id correspond
        const findProducts = mesProduits.find((element) => element._id === idProductsLocalStorage);
            //console.log(findProducts);
        //(3) et si c'est le cas, on récupère le prix.
        if (findProducts) {
            const newTotalProductPricePanier = findProducts.price * quantityProductsLocalStorage;
            newTotalPrice += newTotalProductPricePanier;
                console.log("Nouveau prix total panier",newTotalPrice);
        }
    //On affichage le nouveau prix total du panier dans le html
    document.getElementById("totalPrice").innerText = newTotalPrice;
    } 
}

//----------------------------------Fonction Modifier la quantité d'un article du panier--------------------------------------------------
let messageErrorQuantity = false;
function changeQuantity() {
    // On sélectionne l'élément html (input) dans lequel la quantité est modifiée
    let changeQuantity = document.querySelectorAll(".itemQuantity");
    changeQuantity.forEach((item) => {
        //On écoute le changement sur l'input "itemQuantity"
        item.addEventListener("change", (event) => {
            event.preventDefault();
            choiceQuantity = Number(item.value);
            // On pointe le parent hiérarchique <article> de l'input "itemQuantity"
            let myArticle = item.closest('article');
                //console.log(myArticle);
            // On récupère dans le localStorage l'élément (même id et même couleur) dont on veut modifier la quantité
            let selectMyArticleInLocalStorage = productRegisterInLocalStorage.find
            ( element => element.idProduct === myArticle.dataset.id && element.colorProduct === myArticle.dataset.color );
            
            // Si la quantité est comprise entre 1 et 100 et que c'est un nombre entier,...
            //...on met à jour la quantité dans le localStorage et le DOM
            if(choiceQuantity > 0 && choiceQuantity <= 100 && Number.isInteger(choiceQuantity)){
                parseChoiceQuantity = parseInt(choiceQuantity);
                selectMyArticleInLocalStorage.quantityProduct = parseChoiceQuantity;
                localStorage.setItem("produit", JSON.stringify(productRegisterInLocalStorage));
                // Et, on recalcule la quantité et le prix total du panier
                recalculTotalQuantity();
                recalculTotalPrice();
                messageErrorQuantity = false;
            }
            // Sinon, on remet dans le DOM la quantité indiquée dans le localStorage et on indique un message d'erreur
            else{
                item.value = selectMyArticleInLocalStorage.quantityProduct;
                messageErrorQuantity = true;
            }
            if(messageErrorQuantity){       
                alert("La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100 et être un nombre entier. Merci de rectifier la quantité choisie.");
            } 
        });
    });
}

//----------------------------------Fonction Suppression d'un article du panier--------------------------------------------------
function deleteProduct() {
    let selectSupprimer = document.querySelectorAll(".deleteItem");
    selectSupprimer.forEach((selectSupprimer) => {
            selectSupprimer.addEventListener("click" , (event) => {
                event.preventDefault();
                            
                // On pointe le parent hiérarchique <article> du lien "supprimer"
                let myArticle = selectSupprimer.closest('article');
                console.log(myArticle);
                // on filtre les éléments du localStorage pour ne garder que ceux qui sont différents de l'élément qu'on supprime
                productRegisterInLocalStorage = productRegisterInLocalStorage.filter
                ( element => element.idProduct !== myArticle.dataset.id || element.colorProduct !== myArticle.dataset.color );
                
                // On met à jour le localStorage
                localStorage.setItem("produit", JSON.stringify(productRegisterInLocalStorage));
                
                //Alerte produit supprimé
                alert("Ce produit va être supprimé du panier.");
                 
                
                // On supprime physiquement la balise <article> du produit que l'on supprime depuis son parent, si elle existe
                if (myArticle.parentNode) {
                    myArticle.parentNode.removeChild(myArticle);
                }
                //-----Si, du coup, le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide),...
                //...on affiche "Le panier est vide"-------------------------------------------------------------------
                if(productRegisterInLocalStorage === null || productRegisterInLocalStorage.length === 0){
                    messagePanierVide();
                }
                else{
                // Et, on recalcule la quantité et le prix total du panier
                recalculTotalQuantity();
                recalculTotalPrice();
                }
            }); 
    })
}

//----------------------------------Fonction pour afficher la phrase "Le panier est vide !"--------------------------------------------------
function messagePanierVide() {
    compositionProduitsPanier = 'Le panier est vide !';
    let newH2 = document.createElement('h2');
    productsPositionHtml.appendChild(newH2);
    newH2.innerText = compositionProduitsPanier;
    // On insère 0 dans le html pour la quantité et le prix du panier
    document.getElementById("totalQuantity").innerText = 0;
    document.getElementById("totalPrice").innerText = 0;
}


//___________________________________Contrôle des infos avec Regex et Récupération des données du formulaire____________________________________
    
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
        //Déclaration des variables pour vérifier la bonne valeur des champs du formulaire
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
                firstNameErrorMsg.innerText = '';
                errorFormulaireFirstName = false;
            } 
            else {
                firstNameErrorMsg.innerText = 'Veuillez indiquer un prénom.';
                errorFormulaireFirstName = true;
            }
        });

        // Ecoute du contenu du champ "nom", Vérification du nom et affichage d'un message si celui-ci n'est pas correct
        inputLastName.addEventListener('change', function() {
            let lastNameErrorMsg = inputLastName.nextElementSibling;
            checkValueLastName = textRegex.test(inputLastName.value);
            if (checkValueLastName) {
                lastNameErrorMsg.innerText = '';
                errorFormulaireLastName = false;
            }
            else {
                lastNameErrorMsg.innerText = 'Veuillez indiquer un nom de famille.';
                errorFormulaireLastName = true;
            }
        });

        // Ecoute du contenu du champ "adresse", Vérification de l'adresse et affichage d'un message si celle-ci n'est pas correcte
        inputAddress.addEventListener('change', function() {
            let addressErrorMsg = inputAddress.nextElementSibling;
            checkValueAddress = addressRegex.test(inputAddress.value);
            if (checkValueAddress) {
                addressErrorMsg.innerText = '';
                errorFormulaireAddress = false;
            }
            else {
                addressErrorMsg.innerText = 'Veuillez indiquer une adresse.';
                errorFormulaireAddress = true;
            }
        });

        // Ecoute du contenu du champ "ville", Vérification de la ville et affichage d'un message si celle-ci n'est pas correcte
        inputCity.addEventListener('change', function() {
            let cityErrorMsg = inputCity.nextElementSibling;
            checkValueCity = textRegex.test(inputCity.value);
            if (checkValueCity) {
                cityErrorMsg.innerText = '';
                errorFormulaireCity = false;
            } else {
                cityErrorMsg.innerText = 'Veuillez indiquer le nom d\'une ville.';
                errorFormulaireCity = true;
            }
        });

        // Ecoute du contenu du champ "email", Vérification de l'email et affichage d'un message si celui-ci n'est pas correct
        inputEmail.addEventListener('change', function() {
            let emailErrorMsg = inputEmail.nextElementSibling;
            checkValueEmail = emailRegex.test(inputEmail.value);
            if (checkValueEmail) {
                emailErrorMsg.innerText = '';
                errorFormulaireEmail = false;
            }
            else {
                emailErrorMsg.innerText = 'Veuillez renseigner un email correct.';
                errorFormulaireEmail = true;
            }
        });

//__________________________________________________Affichage des produits du LocalStorage__________________________________________________________

//--------------Si le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide), on affiche "Le panier est vide"------------
if(productRegisterInLocalStorage === null || productRegisterInLocalStorage.length === 0){
    messagePanierVide(); 
    //Si le client clique quand même sur le bouton commander, on lui rappelle que le panier est vide
    boutonCommander.addEventListener("click", (event)=>{
        alert("Votre panier est vide !");
        event.preventDefault();
    });
}

//-----------------------------------Si le panier n'est pas vide alors, on affiche le contenu du localStorage-------------------------------------

else {
    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(data => {
            mesProduits = data;
            // on récupère la couleur, la quantité et l'id de tous les produits contenus dans le localstorage et on les met dans des variables
            for(let i = 0; i < productRegisterInLocalStorage.length; i++){
                let colorProductPanier = productRegisterInLocalStorage[i].colorProduct;
                let idProductPanier = productRegisterInLocalStorage[i].idProduct;
                quantityProductPanier = productRegisterInLocalStorage[i].quantityProduct;
          
                //on ne récupère que les données des canapés dont _id (de l'api) correspondent à l'id dans le localStorage
                const compositionProduitsPanier = data.find((element) => element._id === idProductPanier);
                    // console.log(compositionProduitsPanier);
                // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
                priceProductPanier = compositionProduitsPanier.price;

                //---------------On cré les éléments html manquants de la page cart.html, dans la <section id="cart__items">...--------------------
                //-----------------------------...et on y insère les infos du localstorage----------------------------------------------------------
                
                //_________________________________________Début Ajout Balises html_______________________________________________________________
                //-------------------------Création de la balise article avec comme classe cart__item--------------------------------------------
                let newArticle = document.createElement('article');
                newArticle.setAttribute("class","cart__item");
                newArticle.setAttribute("data-id",`${idProductPanier}`);
                newArticle.setAttribute("data-color",`${colorProductPanier}`);
                productsPositionHtml.appendChild(newArticle);

                    //----------------------------------Création de la div avec pour classe cart__item__img----------------------------------------------
                    let newDivImg = document.createElement('div');
                    newDivImg.setAttribute("class", "cart__item__img");
                    newArticle.appendChild(newDivImg);

                        //--------------------------Création de la balise image qui contiendra la photo de chaque canapé----------------------------------
                        let newImg = document.createElement('img');
                        newImg.setAttribute("src", compositionProduitsPanier.imageUrl);
                        newImg.setAttribute("alt", compositionProduitsPanier.altTxt);
                        newDivImg.appendChild(newImg);

                    //--------------------------------Création de la div avec pour classe cart__item__content-----------------------------------------
                    let newDivContent = document.createElement('div');
                    newDivContent.setAttribute("class", "cart__item__content");
                    newArticle.appendChild(newDivContent);   

                        //----------------------------Création de la div avec pour classe cart__item__content__description--------------------------------
                        let newDivContentDescription = document.createElement('div');
                        newDivContentDescription.setAttribute("class", "cart__item__content__description");
                        newDivContent.appendChild(newDivContentDescription);

                            //-------------------Création d'une balise titre h2 qui indique le nom du produit choisi par l'utilisateur--------------
                            let newH2 = document.createElement('h2');
                            newH2.innerText = compositionProduitsPanier.name;
                            newDivContentDescription.appendChild(newH2);

                            //--------------------Création d'une balise p qui indique la couleur choisie par l'utilisateur------------------------
                            let newPColor = document.createElement('p');
                            newPColor.innerText = colorProductPanier;
                            newDivContentDescription.appendChild(newPColor);

                            //--------------------------Création d'une balise p qui indique le prix du canapé-------------------------------------
                            let newPPrice = document.createElement('p');
                            newPPrice.innerText = compositionProduitsPanier.price + " €";
                            newDivContentDescription.appendChild(newPPrice);

                        //------------------------Création de la div avec pour classe cart__item__content__settings------------------------------
                        let newDivContentSettings = document.createElement('div');
                        newDivContentSettings.setAttribute("class", "cart__item__content__settings");
                        newDivContent.appendChild(newDivContentSettings);

                            //--------------------Création de la div avec pour classe cart__item__content__settings__quantity--------------------
                            let newDivContentSettingsQuantity = document.createElement('div');
                            newDivContentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
                            newDivContentSettings.appendChild(newDivContentSettingsQuantity);

                                //-----------------------------Création d'une balise p qui indique le texte "Qté :"-------------------------------
                                let newPQuantite = document.createElement('p');
                                newPQuantite.innerText = "Qté :";
                                newDivContentSettingsQuantity.appendChild(newPQuantite);

                                //------------Création d'une balise input avec la classe "itemQuantity" qui permet de modifier la quantité-------
                                let newPInput = document.createElement('input');
                                newPInput.setAttribute("type", "number");
                                newPInput.setAttribute("class", "itemQuantity");
                                newPInput.setAttribute("name", "itemQuantity");
                                newPInput.setAttribute("min", "1");
                                newPInput.setAttribute("max", "100");
                                newPInput.setAttribute("value", `${quantityProductPanier}`);
                                newDivContentSettingsQuantity.appendChild(newPInput);

                            //------------------Création de la div avec pour classe cart__item__content__settings__delete-------------------------
                            let newDivContentSettingsDelete = document.createElement('div');
                            newDivContentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
                            newDivContentSettings.appendChild(newDivContentSettingsDelete);

                                //------------------------Création d'une balise p qui indique le prix du canapé-----------------------------------
                                let newPDelete = document.createElement('p');
                                newPDelete.setAttribute("class", "deleteItem");
                                newPDelete.innerText = "Supprimer";
                                newDivContentSettingsDelete.appendChild(newPDelete);
                
                //_____________________________________________Fin Ajout Balises html____________________________________________________________
  
                //__Appel de la fonction pour calculer la qtité totale de produits & le prix total du panier, au chargement de la page Panier.html______
                totaux();
            }//for
            //___________________________________________Appel de la fonction Supprimer un produit__________________________________________________________
            deleteProduct();
            //_____________________________________Appel de le fonction Modifier la quantité d'un produit____________________________________________________
            changeQuantity(); 

        }); //then   

    //Ecoute du bouton Commander 
    boutonCommander.addEventListener("click", (event)=>{
      event.preventDefault();// Empêche le rechargement de la page
      if(productRegisterInLocalStorage === null || productRegisterInLocalStorage.length === 0){ 
            alert("Votre panier est vide !");
      }
      else{
        

        //__________________________________________Gestion du formulaire de contact et validation de la commande________________________________________
        
        // On vérifie que tous les champs sont bien renseignés, sinon on indique un message à l'utilisateur
        // On vérifie qu'aucun champ n'est vide
        if(!inputFirstName.value || !inputLastName.value || !inputAddress.value || !inputCity.value || !inputEmail.value){
            alert("Vous devez renseigner tous les champs !");
            event.preventDefault();
        }
        // On vérifie que les champs sont correctement remplis suivant les regex mises en place
        else if(errorFormulaireFirstName === true || errorFormulaireLastName === true || errorFormulaireAddress === true
             ||errorFormulaireCity === true || errorFormulaireEmail === true){
            alert("Veuillez vérifier les champs du formulaire et les remplir correctement !");
            event.preventDefault();
        }
        else{
            //Récupération des id des produits du panier, dans le localStorage
            let idProducts = [];
            for (let l = 0; l<productRegisterInLocalStorage.length;l++) {
                idProducts.push(productRegisterInLocalStorage[l].idProduct);
            }
                //console.log(idProducts);
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
               //console.log(order);
            // On indique la méthode d'envoi des données
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(order)
            };
                //console.log(options);
            // on envoie les données Contact et l'id des produits à l'API
            fetch("http://localhost:3000/api/products/order", options)
            .then((response) => response.json())
            .then((data) => {
                    //console.log(data);
                // on redirige vers la page de confirmation de commande en passant l'orderId (numéro de commande) dans l'URL
                document.location.href = `confirmation.html?orderId=${data.orderId}`;
            })
            .catch((err) => {
                console.log("Erreur Fetch product.js", err);
                alert ("Un problème a été rencontré lors de l'envoi du formulaire.");
            });
            //----------------------------------------------On vide le localStorage---------------------------------------------------------------
            localStorage.clear();
        }; //fin else
      }
    }); //fin écoute bouton Commander
}; //fin else