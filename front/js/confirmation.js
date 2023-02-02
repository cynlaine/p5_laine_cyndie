//recupère l'order id de l'url
function getIdFromUrl() {
    let params = new URLSearchParams(document.location.search);
    return params.get("orderId");
}
//affiche l'order id 
function displayOrderId() {
    let orderId = getIdFromUrl();
    document.getElementById("orderId").textContent = orderId;
}

// --------------------------------------------------- FONCTION EXECUTEES AU CHARGEMENT --------------------------------------------------- //

function main() {
    displayOrderId();
}
main();