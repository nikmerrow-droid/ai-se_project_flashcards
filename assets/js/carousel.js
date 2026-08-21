import { decks } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";

function getCarouselTitleString(deckName, index, total) {
  return `${deckName} · ${index}/${total}`;
}

function getDeckFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const deckIdFromQuery = params.get("deck");

  if (deckIdFromQuery) {
    const deck = decks.find((item) => item.id === deckIdFromQuery);
    if (deck) return deck;
  }

  const hashDeckId = window.location.hash.replace("#carousel/", "").trim();
  if (hashDeckId) {
    const deck = decks.find((item) => item.id === hashDeckId);
    if (deck) return deck;
  }

  return decks[0];
}

export function renderCarouselView(deck) {
  const homeSection = document.querySelector("#home");
  const aboutSection = document.querySelector("#about");
  const notFoundSection = document.querySelector("#not-found");
  const carouselSection = document.querySelector("#carousel");
  const mainContent = document.querySelector(".page__main-content");

  if (homeSection) homeSection.style.display = "none";
  if (aboutSection) aboutSection.style.display = "none";
  if (notFoundSection) notFoundSection.style.display = "none";
  if (carouselSection) carouselSection.style.display = "flex";
  if (mainContent)
    mainContent.classList.add("page__main-content_location_carousel");

  const carouselEl = document.querySelector(".carousel");
  if (!carouselEl) return;

  const titleEl = carouselEl.querySelector(".carousel__title");
  const contentEl = carouselEl.querySelector(".carousel__content");
  const leftBtn = contentEl.querySelector(".carousel__btn_type_left");
  const cardEl = contentEl.querySelector(".carousel__card");
  const cardTextEl = cardEl.querySelector(".carousel__card-text");
  const rightBtn = contentEl.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");

  if (
    !titleEl ||
    !contentEl ||
    !leftBtn ||
    !cardEl ||
    !cardTextEl ||
    !rightBtn ||
    !flipBtn
  ) {
    console.warn("Carousel: missing expected DOM elements");
    return;
  }

  removeColorClasses(cardEl);
  const colorName = hexToString(deck.color) || "green";
  cardEl.classList.add(`carousel__card_color_${colorName}`);

  let currentIndex = 0;
  let showingQuestion = true;
  const cards = Array.isArray(deck.cards) ? deck.cards : [];

  function updateButtons() {
    const liveLeft = contentEl.querySelector(".carousel__btn_type_left");
    const liveRight = contentEl.querySelector(".carousel__btn_type_right");
    const liveFlip = carouselEl.querySelector(".carousel__btn_type_flip");

    if (cards.length === 0 || currentIndex <= 0) {
      liveLeft?.classList.add("carousel__btn_disabled");
    } else {
      liveLeft?.classList.remove("carousel__btn_disabled");
    }

    if (cards.length === 0 || currentIndex >= cards.length - 1) {
      liveRight?.classList.add("carousel__btn_disabled");
    } else {
      liveRight?.classList.remove("carousel__btn_disabled");
    }

    if (cards.length === 0) {
      liveFlip?.classList.add("carousel__btn_disabled");
    } else {
      liveFlip?.classList.remove("carousel__btn_disabled");
    }
  }

  function updateDisplay() {
    if (cards.length === 0) {
      cardTextEl.textContent = "No cards in this deck.";
      cardEl.classList.remove("carousel__card_color_white");
      cardEl.classList.remove("carousel__card_flipped");
      titleEl.textContent = getCarouselTitleString(deck.name || "Deck", 0, 0);
    } else {
      const currentCard = cards[currentIndex];

      if (showingQuestion) {
        cardTextEl.textContent = currentCard.question;
        cardEl.classList.remove("carousel__card_color_white");
        cardEl.classList.remove("carousel__card_flipped");
      } else {
        cardTextEl.textContent = currentCard.answer;
        cardEl.classList.add("carousel__card_color_white");
        cardEl.classList.add("carousel__card_flipped");
      }

      titleEl.textContent = getCarouselTitleString(
        deck.name || "Deck",
        currentIndex + 1,
        cards.length,
      );
    }

    updateButtons();
  }

  const newLeft = leftBtn.cloneNode(true);
  leftBtn.parentNode.replaceChild(newLeft, leftBtn);
  const newRight = rightBtn.cloneNode(true);
  rightBtn.parentNode.replaceChild(newRight, rightBtn);
  const newFlip = flipBtn.cloneNode(true);
  flipBtn.parentNode.replaceChild(newFlip, flipBtn);

  const left = contentEl.querySelector(".carousel__btn_type_left");
  const right = contentEl.querySelector(".carousel__btn_type_right");
  const flip = carouselEl.querySelector(".carousel__btn_type_flip");

  left.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  });

  right.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  });

  flip.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  currentIndex = 0;
  showingQuestion = true;
  updateDisplay();
  console.log("Carousel elements initialized", {
    titleEl,
    contentEl,
    left,
    cardEl,
    right,
    flip,
  });
}

const initialDeck = getDeckFromLocation();
if (initialDeck) {
  renderCarouselView(initialDeck);
}
