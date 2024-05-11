// Navbar Functionality
const navbarToggle = document.getElementById("navbarToggle");
const navbarLinks = document.getElementById("navbarLinks");
// Home page item display
const itemDisplay = document.getElementById("itemDisplay");
let cardData = [];

navbarToggle.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});

async function retrieveCardData() {
  const localCardData = sessionStorage.getItem("cardData");
  if (localCardData) {
    console.log("Local Cache Loaded");
    cardData = [...JSON.parse(localCardData)];
  } else {
    console.log("External Cache Loaded");
    const cardPromise = await fetch("scripts/data/one-piece.json");
    const inventoryData = await cardPromise.json();
    cardData = [...inventoryData]
    sessionStorage.setItem("cardData", JSON.stringify(inventoryData));
  }
  return cardData;
}
