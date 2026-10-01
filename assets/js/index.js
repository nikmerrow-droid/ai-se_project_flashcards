import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const deckTemplate = document.querySelector("#deck-template")?.content;
const deckList = document.querySelector("#home .decks__list");
const homeSection = document.querySelector("#home");
const deckSection = document.querySelector("#deck");
const deckTitle = document.querySelector("#deck-section-title");
const deckCardList = document.querySelector("#deck-cards");
const cardTemplate = document.querySelector("#card-template")?.content;
const practiceBtn = document.querySelector(".decks__practice-btn");
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
  linkEl.href = `#deck/${deckData.id}`;

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
  if (deckSection) deckSection.style.display = "none";
  if (aboutSection) aboutSection.style.display = "none";
  if (notFoundSection) notFoundSection.style.display = "none";
  if (carouselSection) carouselSection.style.display = "none";
  if (mainContent)
    mainContent.classList.remove("page__main-content_location_carousel");
}

function renderAboutView() {
  if (homeSection) homeSection.style.display = "none";
  if (deckSection) deckSection.style.display = "none";
  if (aboutSection) aboutSection.style.display = "block";
  if (notFoundSection) notFoundSection.style.display = "none";
  if (carouselSection) carouselSection.style.display = "none";
  if (mainContent)
    mainContent.classList.remove("page__main-content_location_carousel");
}

function renderNotFoundView() {
  if (homeSection) homeSection.style.display = "none";
  if (deckSection) deckSection.style.display = "none";
  if (aboutSection) aboutSection.style.display = "none";
  if (notFoundSection) notFoundSection.style.display = "block";
  if (carouselSection) carouselSection.style.display = "none";
  if (mainContent)
    mainContent.classList.remove("page__main-content_location_carousel");
}

function createCardEl(cardData, deckColor) {
  if (!cardTemplate) {
    return null;
  }

  const cardEl = cardTemplate.cloneNode(true);
  const textEl = cardEl.querySelector(".deck__text");
  const flipBtn = cardEl.querySelector(".deck__flip-btn");
  const deleteBtn = cardEl.querySelector(".deck__delete-btn");
  const cardLi = cardEl.querySelector(".deck");
  const colorName = hexToString(deckColor) || "green";

  if (textEl) {
    textEl.textContent = cardData.question;
  }

  if (cardLi) {
    removeColorClasses(cardLi);
    cardLi.classList.add(`deck_color_${colorName}`);
  }

  if (flipBtn) {
    flipBtn.addEventListener("click", () => {
      if (!textEl || !cardData) return;
      const nextValue =
        textEl.dataset.isAnswer === "true"
          ? cardData.question
          : cardData.answer;
      textEl.textContent = nextValue;
      textEl.dataset.isAnswer =
        textEl.dataset.isAnswer === "true" ? "false" : "true";
    });
  }

  if (deleteBtn && cardLi) {
    deleteBtn.addEventListener("click", () => cardLi.remove());
  }

  return cardEl;
}

function renderDeckView(deck) {
  if (homeSection) homeSection.style.display = "none";
  if (aboutSection) aboutSection.style.display = "none";
  if (notFoundSection) notFoundSection.style.display = "none";
  if (deckSection) deckSection.style.display = "flex";
  if (carouselSection) carouselSection.style.display = "none";
  if (mainContent)
    mainContent.classList.remove("page__main-content_location_carousel");

  if (deckTitle) {
    deckTitle.textContent = deck.name;
  }

  if (practiceBtn) {
    practiceBtn.onclick = () => {
      window.location.href = `carousel.html?deck=${deck.id}`;
    };
  }

  if (!deckCardList || !cardTemplate) {
    return;
  }

  deckCardList.innerHTML = "";

  const cards = Array.isArray(deck.cards) ? deck.cards : [];
  cards.forEach((card) => {
    const cardEl = createCardEl(card, deck.color);
    if (cardEl) {
      deckCardList.append(cardEl);
    }
  });
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
  } else if (hash.startsWith("#deck/")) {
    const deckId = hash.replace("#deck/", "");
    const deck = decks.find((d) => d.id === deckId);

    if (deck) {
      renderDeckView(deck);
    } else {
      renderNotFoundView();
    }
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
