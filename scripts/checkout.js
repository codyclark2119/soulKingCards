const checkoutModal = document.getElementById('checkoutModal')
const checkoutModalText = document.querySelector('.modalText')
const modalToggle = document.getElementById("modalToggle");

function retrieveCart() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const cartDisplayContainer = document.getElementById("cartDisplay");
  if (cart.length) {
    cartDisplayContainer.innerHTML = "";
    let preTaxTotal = 0;
    for (let i = 0; i < cart.length; i++) {
      const card = cardData.find((data) => data.cardId === cart[i].cardId);
      const itemCost = (card.costUsd * cart[i].qty).toFixed(2)
      preTaxTotal += parseFloat(itemCost)
      const cardDisplay = document.createElement("div");
      cardDisplay.classList.add("item");
      // Card Image
      const cardImage = document.createElement("img");
      cardImage.setAttribute("src", card.imageUrl);
      cardImage.setAttribute("alt", card.name);
      cardDisplay.appendChild(cardImage);
      // Text display
      const cardDescription = document.createElement("div");
      cardDescription.classList.add("itemDescription");
      const cardText = document.createElement("div");
      cardText.classList.add("itemText");
      const cardTitle = document.createElement("h1");
      cardTitle.classList.add("itemTitle");
      const itemSelect = document.createElement('select')
      itemSelect.classList.add('itemQty')
      itemSelect.setAttribute('cardId', card.cardId)
      for (let x = 1; x < card.stock + 1; x++) {
        const selectOption = document.createElement("option");
        selectOption.textContent = x;
        selectOption.setAttribute("value", x);
        itemSelect.appendChild(selectOption);
      }
      itemSelect.value = cart[i].qty
      itemSelect.addEventListener('change', function (event) {
        event.stopPropagation();
        const cardToChange = event.target.getAttribute('cardId')
        const cart = JSON.parse(localStorage.getItem("cart"));
        const pos = cart.map((item) => item.cardId).indexOf(cardToChange);
        cart[pos].qty = parseInt(event.target.value);
        localStorage.setItem("cart", JSON.stringify([...cart]));
        retrieveCart();
      })
      cardDisplay.appendChild(itemSelect)
      cardTitle.textContent = `${card.name}`;
      const cardCost = document.createElement("h3");
      cardCost.classList.add("itemCost");
      cardText.appendChild(cardTitle);
      cardText.appendChild(cardCost);
      cardDescription.appendChild(cardText);
      // Add to cart display
      const cartDisplay = document.createElement("div");
      cartDisplay.classList.add("itemSelect");
      cardCost.textContent = `$${(card.costUsd * cart[i].qty).toFixed(2)}`;
      const cartRemove = document.createElement("button");
      cartRemove.textContent = "X";
      cartRemove.classList.add("removeFromCart");
      cartRemove.setAttribute("cardId", card.cardId);
      cartDisplay.appendChild(cartRemove);
      cardDescription.appendChild(cartDisplay);
      cardDisplay.appendChild(cardDescription);
      cartDisplayContainer.appendChild(cardDisplay);
      cartRemove.addEventListener("click", function (event) {
        event.stopPropagation();
        removeFromCart(cartRemove.attributes.getNamedItem("cardId").value);
      });
    }
    const preTaxCost = document.createElement('p');
    preTaxCost.textContent = `Item Total: $${preTaxTotal.toFixed(2)}`
    const tax = document.createElement('p');
    const taxValue = parseFloat((preTaxTotal * .0825).toFixed(2))
    tax.textContent = `Tax: $${taxValue}`
    const totalCost = document.createElement('p');
    totalCost.textContent = `Total: $${(preTaxTotal + taxValue).toFixed(2)}`
    cartDisplayContainer.appendChild(preTaxCost);
    cartDisplayContainer.appendChild(tax);
    cartDisplayContainer.appendChild(totalCost);
  } else {
    cartDisplayContainer.innerHTML = "<h1>No Items in Cart</h1>";
  }
}

function removeFromCart(cardId) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const updatedCart = cart.filter((card) => {
    if (card.cardId !== cardId) {
      return card;
    }
  });
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  retrieveCart();
}

window.addEventListener("load", async function () {
  await retrieveCardData();
  retrieveCart();
});

document.getElementById('reviewOrder').addEventListener('click', function (){
  checkoutModal.classList.remove('hidden')
  const cart = JSON.parse(localStorage.getItem("cart"));
  checkoutModalText.innerHTML = "";
  let preTaxTotal = 0;
  for (let i = 0; i < cart.length; i++) {
    const card = cardData.find((data) => data.cardId === cart[i].cardId);
    const itemCost = (card.costUsd * cart[i].qty).toFixed(2)
    preTaxTotal += parseFloat(itemCost)
    const itemLine = document.createElement('p')
    itemLine.textContent = `${card.name} X ${cart[i].qty} = $${itemCost}`;
    checkoutModalText.appendChild(itemLine)
  }
  const preTaxCost = document.createElement('p');
  preTaxCost.textContent = `Item Total: $${preTaxTotal.toFixed(2)}`
  const tax = document.createElement('p');
  const taxValue = parseFloat((preTaxTotal * .0825).toFixed(2))
  tax.textContent = `Tax: $${taxValue}`
  const totalCost = document.createElement('p');
  totalCost.textContent = `Total: $${(preTaxTotal + taxValue).toFixed(2)}`
  const shippingLabel = document.createElement('h5');
  shippingLabel.textContent = 'Shipping Details'
  const shippingReciever = document.createElement('p');
  shippingReciever.textContent = document.getElementById('nameForm').value
  const shippingEmail = document.createElement('p');
  shippingEmail.textContent = document.getElementById('emailForm').value
  const shippingAddress = document.createElement('p');
  shippingAddress.textContent = document.getElementById('addressForm').value
  const submitButton = document.createElement('input')
  submitButton.setAttribute('type', 'button')
  submitButton.setAttribute('value', 'Submit Order')
  checkoutModalText.appendChild(preTaxCost)
  checkoutModalText.appendChild(tax)
  checkoutModalText.appendChild(totalCost)
  checkoutModalText.appendChild(shippingLabel)
  checkoutModalText.appendChild(shippingReciever)
  checkoutModalText.appendChild(shippingEmail)
  checkoutModalText.appendChild(shippingAddress)
  checkoutModalText.appendChild(submitButton)
})

modalToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  checkoutModal.classList.add('hidden')
});

