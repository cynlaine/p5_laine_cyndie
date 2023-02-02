// requête les données de l'API
function getProductFromApi(urlAPI) {
    fetch(urlAPI)
        .then((res) => res.json())
        .then((products) => displayProducts(products))
        .catch((error) => console.log("No product found"));
}

//affichage des cards : 1 produit = 1 card
function displayProducts(products) {
    for (let product of products) {
        displayProduct(product);
    }
}

//création de la card
function displayProduct(product) {
    if (product == [] || product == null) {
        return;
    }
    //intégration DOM a > article > img, h3, p
    //ajout a
    let a = document.createElement("a");
    document.getElementById("items").appendChild(a);
    a.setAttribute("href", "product.html?id=" + product._id);

    //ajout article
    let article = document.createElement("article");
    a.appendChild(article);

    // ajout image, titre, description
    let img = document.createElement("img");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    article.append(img, h3, p);
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.altTxt);
    h3.textContent = product.name;
    h3.className = "productName";
    p.textContent = product.description;
    p.className = "productDescription";
}

// --------------------------------------------------- FONCTION EXECUTEES AU CHARGEMENT --------------------------------------------------- //

function main() {
    const urlAPI = "http://localhost:3000/api/products/";
    getProductFromApi(urlAPI);
}
main();
