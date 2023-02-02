// --------------------------------------------------- REQUETE PRODUITS --------------------------------------------------- //

//requête l'id du produit dans l'URL
function getIdFromUrl() {
    let params = new URLSearchParams(document.location.search);
    return params.get("id");
}

// requête les infos du produit sur l'API
function getProductFromApi(urlAPI, id) {
    fetch(urlAPI + id)
        .then((res) => res.json())
        .then((product) => displayProduct(product))
        .catch((error) => noProduct());
}

// supprime les infos si pas de produit trouvé et affiche un msg d'erreur
function noProduct() {
    document.getElementsByTagName("article")[0].style.display = "none";
    let p = document.createElement("p");
    document.getElementsByClassName("item")[0].appendChild(p);
    p.innerHTML = "Erreur : aucun produit trouvé";
    p.setAttribute("class", "item__content__description__title");
}

// --------------------------------------------------- AFFICHAGE PRODUIT --------------------------------------------------- //


//requête et affiche les infos produits
function displayProduct(product) {
    if (product == [] || product == null) {
        return;
    }

    //ajout titre page
    document.title = product.name;

    //ajout image
    let img = document.createElement("img");
    document.getElementsByClassName("item__img")[0].appendChild(img);
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.altTxt);

    //ajout nom, prix, description
    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price;
    document.getElementById("description").textContent = product.description;

    //ajout options couleurs, 1 couleur = 1 option créée
    for (let color of product.colors) {
        let option = document.createElement("option");
        document.getElementById("colors").appendChild(option);
        option.setAttribute("value", color);
        option.textContent = color;
    }
}


// --------------------------------------------------- AJOUT AU PANIER --------------------------------------------------- //


//affiche un message temporaire sous le bouton "Ajouter au panier"
function alertMsg(msg, color) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    document.getElementsByClassName("item__content")[0].appendChild(div);
    div.appendChild(p);
    p.innerHTML = msg;
    p.style.color = color;
    div.style.borderRadius = "25px";
    div.style.backgroundColor = "white";
    div.style.marginTop = "10px";
    div.style.textAlign = "center";
    setTimeout(function () {
        p.innerHTML = "";
        div.style.display = "none";
    }, 2000);
}

// exécute addToCart au clic sur "Ajouter au panier"
function cartButton() {
    let cartButton = document.getElementById("addToCart");
    cartButton.addEventListener("click", addToCart);
}

//définit l'objet "item"
function createItem(quantity, color) {
    let id = getIdFromUrl();
    let item = {
        id: id,
        quantity: Number(quantity),
        color: color,
    };
    return item;
}

//vérifie la quantité et les options saisies
function getItem() {
    let quantity = document.getElementById("quantity").value;
    let color = document.getElementById("colors").value;
    if (quantity == 0 || color == "") {
        alertMsg("Merci de sélectionner une quantité et un coloris", "red");
        return;
    } else if (quantity > 100) {
        alertMsg("Commande possible de 100 canapés maximum", "red");
        return;
    } else {
        let item = createItem(quantity, color);
        return item;
    }
}

//récupère le panier du LS, si LS vide => créé un tableau, sinon return le tableau parsé
function getCartFromLS() {
    let cart = localStorage.getItem("cart");
    return cart == null ? [] : JSON.parse(cart);
}

//ajout au panier de l'item généré
function addToCart() {
    let item = getItem();
    if (item === undefined) {
        return;
    }
    let cart = getCartFromLS();
    if (cart.length > 0) {
        let sameItemInCart = cart.find(
            (i) => i.id === item.id && i.color === item.color
        );
        if (sameItemInCart != undefined) {
            let newQty = Number(sameItemInCart.quantity) + item.quantity;
            if (newQty > 100) {
                alertMsg("Quantité maximale atteinte : 100 produits", "black");
            }
            alertMsg("Kanap ajouté au panier !", "green");
            sameItemInCart.quantity = newQty > 100 ? 100 : newQty;
        } else {
            cart.push(item);
            alertMsg("Kanap ajouté au panier !", "green");
        }
    } else {
        cart.push(item);
        alertMsg("Kanap ajouté au panier !", "green");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

// --------------------------------------------------- FONCTION EXECUTEES AU CHARGEMENT --------------------------------------------------- //

function main() {
    const urlAPI = "http://localhost:3000/api/products/";
    let id = getIdFromUrl();
    getProductFromApi(urlAPI, id);
    cartButton();
}
main();
