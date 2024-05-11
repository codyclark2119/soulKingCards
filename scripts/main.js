const itemModal = document.getElementById('cardModal')
const modalToggle = document.getElementById("modalToggle");

function addToCart(qty, cardId) {
  const intQty = parseInt(qty);
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    const pos = cart.map((item) => item.cardId).indexOf(cardId);
    if (pos >= 0) {
      cart[pos].qty = parseInt(cart[pos].qty) + intQty;
      localStorage.setItem("cart", JSON.stringify([...cart]));
    } else {
      localStorage.setItem(
        "cart",
        JSON.stringify([...cart, { qty: intQty, cardId }])
      );
    }
  } else {
    localStorage.setItem("cart", JSON.stringify([{ qty: intQty, cardId }]));
  }
}
// Home page item display
const itemSearch = document.getElementById("itemSearch");
itemSearch.nextSibling.addEventListener("click", async () => {
  const term = itemSearch.value.toLowerCase();
  const cardData = await retrieveCardData();
  // Filter the array based on fuzzy matching
  const searchData = cardData.filter((card) => {
    // Convert each object value to lowercase for case-insensitive comparison
    const matchesTerm = value => {
      if (typeof value === "string") {
        const lowercasedValue = value.toLowerCase();
        // Check if the value contains the search term
        return lowercasedValue.includes(term);
      } else if (Array.isArray(value)) {
        // If the value is an array, check each element for a match
        return value.some(subValue => matchesTerm(subValue));
      }
      // If the value is not a string, skip it
      return false;
    };
    return Object.values(card).some(value => matchesTerm(value));
  });
  console.log(searchData)
  itemDisplay.innerHTML = "";
  displayCards(searchData);
});

function populateModal(cardId){
  const card = cardData.find((data) => data.cardId === cardId);
  document.querySelector('.modalImg').setAttribute('src', card.imageUrl)
  document.querySelector('.modalTitle').textContent = card.name;
  document.querySelector('.modalPrice').textContent = card.costUsd;
  document.querySelector('.modalCardId').textContent = `Card ID: ${card.cardId}`;
  document.querySelector('.modalCardId').textContent = card.color.length > 0 ? `Color: ${card.color.join('/')}` : '';
  document.querySelector('.modalCardType').textContent = `Type: ${card.type}`;
  document.querySelector('.modalCardRarity').textContent = `Rarity: ${card.rarity}`;
  document.querySelector('.modalCardEffect').textContent = card.effectText ? `Effect: ${card.effectText}` : '';
  document.querySelector('.modalCardSubType').textContent = card.subtype.length ? `SubType: ${card.subtype.join('/')}` : '';
  const modalSelect = document.querySelector('.itemSelect select')
  modalSelect.innerHTML = ''
  for (let x = 1; x < card.stock + 1; x++) {
    const selectOption = document.createElement("option");
    selectOption.textContent = x;
    selectOption.setAttribute("value", x);
    modalSelect.appendChild(selectOption);
  }
  document.querySelector('.addToCart').setAttribute('cardId', card.cardId)
  itemModal.classList.remove('hidden')
}

async function displayCards(cards) {
  for (let i = 0; i < (cards.length > 25 ? 25 : cards.length); i++) {
    const card = cards[i];
    const cardDisplay = document.createElement("div");
    cardDisplay.classList.add("item");
    cardDisplay.setAttribute('cardId', card.cardId)
    // Card Image
    const cardImage = document.createElement("img");
    cardImage.setAttribute("src", card.imageUrl);
    cardImage.setAttribute("alt", card.name);
    cardDisplay.appendChild(cardImage);
    // Text display
    // const cardDescription = document.createElement("div");
    // cardDescription.classList.add("itemDescription");
    const cardText = document.createElement("div");
    cardText.classList.add("itemText");
    const cardTitle = document.createElement("h1");
    cardTitle.classList.add("itemTitle");
    cardTitle.textContent = card.name;
    const cardCost = document.createElement("h3");
    cardCost.classList.add("itemCost");
    cardCost.textContent = `$${card.costUsd}`;
    cardText.appendChild(cardTitle);
    cardText.appendChild(cardCost);
    cardDisplay.appendChild(cardText);
    itemDisplay.appendChild(cardDisplay);
    cardDisplay.addEventListener("click", function (event) {
      event.stopPropagation();
      console.log(event.target.parentElement.getAttribute('cardId'))
      if (event.target.parentElement.getAttribute('cardId')){
        populateModal(event.target.parentElement.getAttribute('cardId'));
      } else if (event.target.parentElement.parentElement.getAttribute('cardId')){
        populateModal(event.target.parentElement.parentElement.getAttribute('cardId'));
      }
    });
  }
}

window.addEventListener("load", async function () {
  const cardData = await retrieveCardData();
  displayCards(cardData);
});

modalToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  itemModal.classList.add('hidden')
});

document.querySelector('.addToCart').addEventListener("click", function (event) {
  event.stopPropagation();
  addToCart(
    event.target.previousSibling.value,
    event.target.attributes.getNamedItem("cardId").value
  );
  itemModal.classList.add('animate');
  setTimeout(() => {
    itemModal.classList.remove('animate');
    itemModal.classList.add('hidden');
  }, 1750)
});