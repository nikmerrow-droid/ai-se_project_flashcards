import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const deckTemplate = document.querySelector("#deck-template")?.content;
const deckList = document.querySelector(".decks__list");
const homeSection = document.querySelector("#home");
const aboutSection = document.querySelector("#about");
const notFoundSection = document.querySelector("#not-found");
const carouselSection = document.querySelector("#carousel");
const mainContent = document.querySelector(".page__main-content");

function createDeckEl(deckData) {
  if (!deckTemplate) {
    return null;
  }

  const deckEl = deckTemplate.cloneNode(true);
  const titleEl = deckEl.querySelector(".deck__title");
  const countEl = deckEl.querySelector(".deck__count");
  const deleteBtn = deckEl.querySelector(".deck__delete-btn");
  const linkEl = deckEl.querySelector(".deck__link");
  const deckLi = deckEl.querySelector(".deck");
  const colorName = hexToString(deckData.color) || "green";

  titleEl.textContent = deckData.name;
  const cardCount = Array.isArray(deckData.cards) ? deckData.cards.length : 0;
  countEl.textContent = String(cardCount);
  linkEl.href = `carousel.html?deck=${deckData.id}`;
  linkEl.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `carousel.html?deck=${deckData.id}`;
  });

  deleteBtn.addEventListener("click", () => {
    // Remove the actual list item element (not the DocumentFragment)
    if (deckLi) deckLi.remove();
  });

  if (deckLi) {
    removeColorClasses(deckLi);
    deckLi.classList.add(`deck_color_${colorName}`);
  }

  return deckEl;
}

function renderDeckEl(deckData) {
  const deckEl = createDeckEl(deckData);

  if (!deckEl || !deckList) {
    return;
  }

  deckList.prepend(deckEl);
}

function renderHomeView() {
  if (homeSection) homeSection.style.display = "flex";
  if (aboutSection) aboutSection.style.display = "none";
  if (notFoundSection) notFoundSection.style.display = "none";
  if (carouselSection) carouselSection.style.display = "none";
  mainContent.classList.remove("page__main-content_location_carousel");
}

function renderAboutView() {
  if (homeSection) homeSection.style.display = "none";
  if (aboutSection) aboutSection.style.display = "block";
  if (notFoundSection) notFoundSection.style.display = "none";
  if (carouselSection) carouselSection.style.display = "none";
  mainContent.classList.remove("page__main-content_location_carousel");
}

function renderNotFoundView() {
  if (homeSection) homeSection.style.display = "none";
  if (aboutSection) aboutSection.style.display = "none";
  if (notFoundSection) notFoundSection.style.display = "block";
  if (carouselSection) carouselSection.style.display = "none";
  if (mainContent)
    mainContent.classList.remove("page__main-content_location_carousel");
}

function initDecks() {
  if (!deckList || !deckTemplate) {
    return;
  }

  deckList.innerHTML = "";
  decks.forEach(renderDeckEl);
}

function router() {
  const hash = window.location.hash;

  if (hash === "#home" || hash === "") {
    renderHomeView();
  } else if (hash === "#about") {
    renderAboutView();
  } else if (hash.startsWith("#carousel/")) {
    const deckId = hash.replace("#carousel/", "");
    const deck = decks.find((d) => d.id === deckId);

    if (deck) {
      renderCarouselView(deck);
    } else {
      renderNotFoundView();
    }
  } else {
    renderNotFoundView();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initDecks();
    router();
  });
} else {
  initDecks();
  router();
}

window.addEventListener("hashchange", router);
