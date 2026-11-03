import { hexToString, removeColorClasses } from "./colors.js";

const deckSection = document.querySelector("#deck");
const deckTitle = document.querySelector("#deck-section-title");
const deckCardList = document.querySelector("#deck-cards");
const cardTemplate = document.querySelector("#card-template")?.content;
const homeSection = document.querySelector("#home");
const aboutSection = document.querySelector("#about");
const notFoundSection = document.querySelector("#not-found");
const carouselSection = document.querySelector("#carousel");
const mainContent = document.querySelector(".page__main-content");

function createCardEl(cardData, deckColor) {
  if (!cardTemplate) {
    return null;
  }

  const cardEl = cardTemplate.cloneNode(true);
  const textEl = cardEl.querySelector(".deck__text");
  const flipBtn = cardEl.querySelector(".card__btn_type_flip");
  const deleteBtn = cardEl.querySelector(".card__btn_type_delete");
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
      cardLi?.classList.toggle(
        "deck_answer_showing",
        textEl.dataset.isAnswer === "true",
      );
    });
  }

  if (deleteBtn && cardLi) {
    deleteBtn.addEventListener("click", () => cardLi.remove());
  }

  return cardEl;
}

export function renderDeckView(deck) {
  if (homeSection) homeSection.style.display = "none";
  if (aboutSection) aboutSection.style.display = "none";
  if (notFoundSection) notFoundSection.style.display = "none";
  if (deckSection) deckSection.style.display = "block";
  if (carouselSection) carouselSection.style.display = "none";
  if (mainContent)
    mainContent.classList.remove("page__main-content_location_carousel");

  console.log("Rendering deck view", deck);

  if (deckTitle) {
    deckTitle.textContent = deck.name;
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
