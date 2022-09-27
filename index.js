let basketIcon = document.querySelector(".basket");
let addToCardSection = document.querySelector(".addToCardSection");
let closeBtn = document.querySelector(".closeBtn");
let productsContainer = document.querySelector(".productsContainer");
let addToCardBtn = document.querySelectorAll(".addToCardBtn");
let CardTotalPrice = document.querySelector(".CardTotalPrice");
let addToCartQuantity = document.querySelector(".addToCartQuantity");
let CardItems = document.querySelector(".CardItems");
let addToCardContainer = document.querySelector(".addToCardContainer");
let clearCard = document.querySelector(".clearCard");
let trashProductsInCard = document.querySelector(".trash");
import { products } from "./products.js";

/*  get product */
class Products {
  getProducts() {
    return products;
  }
}

let Card = [];
let Buttons = [];
/* showProduct */
class UiProducts {
  uiProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
        <div
            class="truncate rounded-lg shadow-lg bg-white flex flex-col justify-start items-start text-center border-indigo-300"
          >
            <div class="h-[200px] !max-h-[200px] w-full">
            <img
              class="w-full h-full"
              src="${product.imageUrl}"
              alt="product-one"
            />
            </div>
            <div
              class="py-3 w-full item-center text-center flex flex-col md:flex-row justify-around"
            >
              <span>${product.price}</span>
              <h4>${product.name}</h4>
            </div>
            <div class="w-full pb-3" >
              <button
              style="background-color: #A596F4"
                class="addToCardBtn mb-2"
                data-id = "${product.id}"
              >
                Add To Card
              </button>
            </div>
          </div>
      `;
      productsContainer.innerHTML = result;
    });
  }

  /*  AddToCard Btn */
  getAddToCardBtn() {
    let addToCardBtn = [...document.querySelectorAll(".addToCardBtn")];
    Buttons = addToCardBtn;
    Buttons.forEach((btn) => {
      let btnId = btn.dataset.id;
      let inCart = Card.find((product) => product.id === +btnId);
      if (inCart) {
        btn.innerText = "In Cart";
        btn.style.background = "rgb(20 184 166)";
        btn.style.padding = "0 20px";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        btn.style.background = "rgb(20 184 166)";
        btn.style.padding = "0 20px";
        e.target.disabled = true;
        /* save localStorage*/
        let productAddedToCard = {
          ...SaveLocalStorage.getProduct(btnId),
          quantity: 1,
        };
        Card = [...Card, productAddedToCard];
        SaveLocalStorage.saveCard(Card);
        this.setCartValue(Card);
        this.addedCardItems(productAddedToCard);
      });
    });
  }

  addedCardItems(ProductsInBasket) {
    const section = document.createElement("section");
    section.className =
      "flex justify-between items-center text-center bg-indigo-100 px-1 shadow mb-2";
    section.innerHTML = `
    <div>
              <img
                class="trash w-5 h-5 cursor-pointer"
                data-id = ${ProductsInBasket.id}
                src="./src/icon/garbage.png"
                alt="trash"
              />
            </div>
            <div class="flex flex-col justify-center items-center text-center">
                <img
                data-id = ${ProductsInBasket.id}
                  class="increment w-5 h-5 cursor-pointer"
                  src="./src/icon/arrowhead-up.png"
                  alt="increment"
                />
              <span class="quantity font-medium">1</span>
                <img
                data-id = ${ProductsInBasket.id}
                  class="decrement w-5 h-5 cursor-pointer rotate-180 cursor-pointer"
                  src="./src/icon/arrowhead-up.png"
                  alt="decrement"
                />
            </div>
            <div class="flex flex-col space-y-1">
              <h4>${ProductsInBasket.name}</h4>
              <span>$ ${ProductsInBasket.price}</span>
            </div>
            <span>
              <img
                src="${ProductsInBasket.imageUrl}"
                alt="addToCart-Product-1"
                class="object-fill w-20 h-10 rounded"
              />
            </span>
    `;
    addToCardContainer.appendChild(section);
  }

  setCartValue(card) {
    let tempCarDItems = 0;
    const totalPriceCard = card.reduce((acc, curr) => {
      tempCarDItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    CardTotalPrice.innerText = `$ ${totalPriceCard.toFixed(2)}`;
    addToCartQuantity.innerText = tempCarDItems;
    CardItems.innerText = tempCarDItems;
  }

  setupApplication() {
    Card = SaveLocalStorage.getCardItems() || [];
    Card.forEach((cardItemsInBasket) => {
      this.addedCardItems(cardItemsInBasket);
    });
    this.setCartValue(Card);
  }

  cardTools() {
    clearCard.addEventListener("click", () => this.clearCard());

    addToCardContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("increment")) {
        this.incrementBtn(e);
      } else if (e.target.classList.contains("trash")) {
        this.trashProductsInCard(e);
      } else if (e.target.classList.contains("decrement")) {
        this.decrementBtn(e);
      }
    });
  }

  trashProductsInCard(event) {
    const removeProductsInBasket = event.target;
    const removed = Card.find(
      (item) => +item.id === +removeProductsInBasket.dataset.id
    );
    this.removeProductsInCard(removed.id);
    SaveLocalStorage.saveCard(Card);
    addToCardContainer.removeChild(
      removeProductsInBasket.parentElement.parentElement
    );
  }

  incrementBtn(event) {
    const addQuantity = event.target;
    const addedItems = Card.find((item) => item.id == addQuantity.dataset.id);
    addedItems.quantity++;
    this.setCartValue(Card);
    SaveLocalStorage.saveCard(Card);
    addQuantity.nextElementSibling.innerText = addedItems.quantity;
  }

  decrementBtn(event) {
    const subQuantity = event.target;
    const subtractedItems = Card.find(
      (item) => item.id == subQuantity.dataset.id
    );
    if (subtractedItems.quantity === 1) {
      this.removeProductsInCard(subtractedItems.id);
      addToCardContainer.removeChild(subQuantity.parentElement.parentElement);
    }
    subtractedItems.quantity--;
    this.setCartValue(Card);
    SaveLocalStorage.saveCard(Card);
    subQuantity.previousElementSibling.innerText = subtractedItems.quantity;
  }

  clearCard() {
    Card.forEach((cart) => {
      this.removeProductsInCard(cart.id);
      while (addToCardContainer.children.length) {
        addToCardContainer.removeChild(addToCardContainer.children[0]);
      }
    });
  }

  removeProductsInCard(id) {
    Card = Card.filter((cardProducts) => cardProducts.id !== id);
    this.setCartValue(Card);
    SaveLocalStorage.saveCard(Card);
    this.buttonsSingle(id);
  }

  buttonsSingle(id) {
    const removeBtn = Buttons.find((btn) => +btn.dataset.id === +id);
    removeBtn.innerText = "Add To Card";
    removeBtn.disabled = false;
    removeBtn.style.backgroundColor = "#A596F4";
  }
}

/* saveProduct in localStorage */
class SaveLocalStorage {
  static saveLocal(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((product) => product.id === +id);
  }

  static saveCard(card) {
    localStorage.setItem("card", JSON.stringify(card));
  }

  static getCardItems() {
    return JSON.parse(localStorage.getItem("card"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let products = new Products();
  let ProductsData = products.getProducts();
  let showProducts = new UiProducts();
  showProducts.setupApplication();
  showProducts.uiProducts(ProductsData);
  showProducts.getAddToCardBtn();
  showProducts.cardTools();
  SaveLocalStorage.saveLocal(ProductsData);
});

basketIcon.addEventListener("click", () => {
  if (addToCardSection.style.display === "none") {
    addToCardSection.style.display = "block";
  } else if (addToCardSection.style.display === "block") {
    addToCardSection.style.display = "none";
  }
});
closeBtn.addEventListener("click", () => {
  addToCardSection.style.display = "none";
});
