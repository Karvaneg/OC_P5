// Sélection de l'emplacement dans lequel on va afficher nos produits, sur la page d'accueil. Ici dans la section avec l'id items.
const sectionItems = document.querySelector('#items');
// On récupère toutes les données de l'api
fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(data => {
    for (const listProducts of data){
      console.log(listProducts);
      // on cré les éléments html manquants de la page index.html et on y insère les données de l'api
      let newA = document.createElement('a');
      newA.setAttribute("href", `./product.html?id=${listProducts._id}`);
      sectionItems.appendChild(newA);

      let newArticle = document.createElement('article');
      newA.appendChild(newArticle);

      let newImg = document.createElement('img');
      newImg.setAttribute("src", listProducts.imageUrl);
      newImg.setAttribute("alt", listProducts.altTxt);
      newArticle.appendChild(newImg);

      let newH3 = document.createElement('h3');
      newH3.setAttribute("class","productName");
      newH3.textContent = listProducts.name;
      newArticle.appendChild(newH3);
      
      let newP = document.createElement('p');
      newP.setAttribute("class","productDescription");
      newP.textContent = listProducts.description;
      newArticle.appendChild(newP);
    }
   })
   .catch(err => {
    alert(`Les produits n'ont pas pu être affichés. Pensez à lancer le serveur local !`);
    console.log("Erreur Fetch script.js", err);
   })