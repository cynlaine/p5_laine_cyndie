// --------------------------------------------------- REQUETE PANIER ET PRODUITS --------------------------------------------------- //

//requête le panier dans le LS
function getCartFromLS() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    return cart;
}

// requête les données du produit de l'API
function getProductFromApi(id) {
    const urlAPI = "http://localhost:3000/api/products/";
    let productFromApi = fetch(urlAPI + id)
        .then((res) => res.json())
        .catch((error) => console.log("No product found"));
    return productFromApi;
}

// --------------------------------------------------- AFFICHAGE DES PRODUITS --------------------------------------------------- //

//affiche chaque produit du panier en requêtant le LS et l'API
async function displayProduct() {
    let cart = getCartFromLS();
    if (cart == [] || cart === null) {
        document.getElementsByClassName("cart")[0].style.display = "none";
        document.getElementsByTagName("h1")[0].textContent =
            "Votre panier est vide";
        return;
    }
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let product = await getProductFromApi(item.id);

        //intégration des items dans le DOM
        let article = document.createElement("article");
        document.getElementById("cart__items").appendChild(article);
        article.setAttribute("class", "cart__item");
        article.setAttribute("data-id", item.id);
        article.setAttribute("data-color", item.color);

        //img
        let divImg = document.createElement("div");
        let img = document.createElement("img");
        article.appendChild(divImg);
        divImg.appendChild(img);
        divImg.className = "cart__item__img";
        img.setAttribute("src", `${product.imageUrl}`);
        img.setAttribute("alt", `${product.altTxt}`);

        //content
        let divItemContent = document.createElement("div");
        article.appendChild(divItemContent);
        divItemContent.className = "cart__item__content";

        //content > description
        let divItemDescription = document.createElement("div");
        divItemContent.appendChild(divItemDescription);
        divItemDescription.className = "cart__item__content__description";
        let h2 = document.createElement("h2");
        let pColor = document.createElement("p");
        let pPrice = document.createElement("p");
        divItemDescription.append(h2, pColor, pPrice);
        h2.textContent = product.name;
        pColor.textContent = item.color;
        pPrice.textContent = product.price + " €";

        //content > settings
        let divItemSettings = document.createElement("div");
        divItemContent.appendChild(divItemSettings);
        divItemSettings.className = "cart__item__content__settings";

        //content > settings > quantity
        let divQuantity = document.createElement("div");
        let pQty = document.createElement("p");
        let input = document.createElement("input");
        divItemSettings.appendChild(divQuantity);
        divQuantity.className = "cart__item__content__settings__quantity";
        divQuantity.appendChild(pQty);
        pQty.textContent = "Qté :";
        divQuantity.appendChild(input);
        Object.assign(input, {
            type: "number",
            className: "itemQuantity",
            name: "itemQuantity",
            min: "1",
            max: "100",
            value: `${item.quantity}`,
        });

        //content > settings > delete
        let divDelete = document.createElement("div");
        let pDelete = document.createElement("p");
        divItemSettings.appendChild(divDelete);
        divDelete.className = "cart__item__content__settings__delete";
        divDelete.appendChild(pDelete);
        pDelete.className = "deleteItem";
        pDelete.textContent = "Supprimer";
    }
    getTotal();
    changeQuantity(cart);
    deleteItem(cart);
}

// --------------------------------------------------- GESTION QUANTITE, PRIX & TOTAL --------------------------------------------------- //

//calcul de la quantité totale et du prix total
async function getTotal() {
    //calcul quantité totale
    const itemQuantity = document.querySelectorAll(".itemQuantity");
    let totalQuantity = 0;
    for (let i = 0; i < itemQuantity.length; i++) {
        let value = itemQuantity[i].value;
        totalQuantity += Number(value);
    }
    document.getElementById("totalQuantity").textContent = totalQuantity;

    //calcul prix total
    let totalPrice = 0;
    let cart = getCartFromLS();
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let product = await getProductFromApi(item.id);
        totalPrice += itemQuantity[i].value * product.price;
    }
    document.getElementById("totalPrice").textContent = totalPrice;
}

//pour modifier la quantité d'un produit
function changeQuantity(cart) {
    document.querySelectorAll(".itemQuantity").forEach((input) => {
        input.addEventListener("change", (e) => {
            let newQty = e.target.value;
            if (newQty > 0 && newQty <= 100) {
                let id = e.target.closest("article").dataset.id;
                let color = e.target.closest("article").dataset.color;
                let itemInCart = cart.find(
                    (i) => i.id === id && i.color === color
                );
                itemInCart.quantity = Number(newQty);
                localStorage.setItem("cart", JSON.stringify(cart));
                getTotal();
            } else if (newQty > 100) {
                alertMsg(input, "100 articles maximum !", "red");
            } else {
                alertMsg(input, "Merci de renseigner une quantité valide !","red");
            }
        });
    });
}

//pour supprimer produit du panier
function deleteItem(cart) {
    document.querySelectorAll(".deleteItem").forEach((button) => {
        button.addEventListener("click", (e) => {
            let id = e.target.closest("article").dataset.id;
            let color = e.target.closest("article").dataset.color;
            let index = cart.findIndex((i) => i.id === id && i.color === color);
            cart.splice(index, 1);
            if (cart.length === 0) {
                localStorage.clear();
            } else {
                localStorage.setItem("cart", JSON.stringify(cart));
            }
            document.getElementById("cart__items").innerHTML = "";
            displayProduct();
        });
    });
}

//affiche un message d'alerte si qté non valide
function alertMsg(input, msg, color) {
    let p = document.createElement("p");
    let container = input.closest("div");
    container.appendChild(p);
    p.innerHTML = msg;
    p.style.color = color;
    p.style.marginLeft = "5px";
    setTimeout(function () {
        p.innerHTML = "";
        p.style.display = "none";
    }, 2000);
}

// --------------------------------------------------- GESTION FORMULAIRE --------------------------------------------------- //

// exécute checkField au chargement de la page pour écouter les changements sur le formulaire
function formControl() {
    checkField(true, "firstName", 1);
    checkField(true, "lastName", 1);
    checkField(true, "address", 2);
    checkField(true, "city", 1);
    checkField(true, "email", 3);
}

// initialise les paramètres pour vérifier la saisie et exécute la fonction fieldControl
// event "true" = utilisé au chargement de la page pour écouter les changements
// event "false" = permet de vérifier les champs à la demande - utilisé lors du clic sur "commander"
function checkField(event, field, test) {
    let regex = "";
    let input = document.getElementById(field);
    switch (test) {
        case 1:
            regex = /^[a-zA-Zàâäéèêëïîôöùûüç ,'-]+$/; // lettres et ,'- 
            break;
        case 2:
            regex = /^[a-zA-Zàâäéèêëïîôöùûüç0-9 ,'-]+$/; // lettres, chiffres et ,'-  
            break;
        case 3:
            regex = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/; // format adresse mail 
            break;
        default:
            regex = /^[a-zA-Zàâäéèêëïîôöùûüç ,'-]+$/;
            break;
    }
    if (event) {
        input.addEventListener("change", () => {
            fieldControl(input, regex, field);
        });
    } else {
        return fieldControl(input, regex, field);
    }
}

//vérifie la saisie et affiche un message d'erreur si vide ou invdalide
function fieldControl(input, regex, field) {
    let errorMsg = document.getElementById(field + "ErrorMsg");
    if (regex.test(input.value) && input.value !== "") {
        errorMsg.textContent = "";
        return true;
    }
    errorMsg.textContent = "Merci de saisir une donnée valide";
    return false;
}

// --------------------------------------------------- ENVOI COMMANDE --------------------------------------------------- //


// contrôle les champs avant d'exécuter la requête à l'API
function checkBeforeOrder() {
    if (
        !checkField(false, "firstName", 1) ||
        !checkField(false, "lastName", 1) ||
        !checkField(false, "address", 2) ||
        !checkField(false, "city", 2) ||
        !checkField(false, "email", 3)
    ) { 
        return;
    }
    sendOrder(getOrder());
}

//initialise la requête à envoyer à l'API
function getOrder() {
    let cart = getCartFromLS();
    let products = cart.map((cart) => cart.id);
    return {
        contact: {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value,
        },
        products: products,
    };
}

// envoie la requête à l'API et renvoie vers la page confirmation avec l'order id
function sendOrder(order) {
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(order),
    })
        .then((res) => res.json())
        .then((confirmation) => {
            document.location.href = "confirmation.html?orderId=" + confirmation.orderId;
            localStorage.clear();
        })
        .catch((error) => console.log("Erreur"));
}

//exécute checkOrder au clic sur "commander"
function orderButton() {
    let orderButton = document.getElementById("order");
    orderButton.addEventListener("click", (e) => {
        e.preventDefault();
        checkBeforeOrder();
    });
}

// --------------------------------------------------- FONCTION EXECUTEES AU CHARGEMENT --------------------------------------------------- //

function main() {
    displayProduct();
    formControl();
    orderButton();
}
main();
