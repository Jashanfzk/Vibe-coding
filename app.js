const cards = [
    '🍎', '🍌', '🍇', '🍊', 
    '🍎', '🍌', '🍇', '🍊', 
    '🍉', '🍓', '🍒', '🍍', 
    '🍉', '🍓', '🍒', '🍍'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCards = 0;

const grid = document.querySelector('.grid');

function shuffle() {
    cards.sort(() => 0.5 - Math.random());
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.cardValue = card;
    cardElement.addEventListener('click', flipCard);
    return cardElement;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    this.textContent = this.dataset.cardValue;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.cardValue === secondCard.dataset.cardValue;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startGame() {
    shuffle();
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        grid.appendChild(cardElement);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const board = document.getElementById('game-board');
  const timerDisplay = document.getElementById('timer');
  const movesDisplay = document.getElementById('moves');
  const gameOverDisplay = document.getElementById('game-over');
  let seconds = 0;
  let moves = 0;
  let flippedCards = [];
  let matchedPairs = 0;
  let lockBoard = false;
  const maxMoves = 30; // Example: Game over after 30 moves

  let timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Time: ${seconds}s`;
  }, 1000);

  // 8 pairs of Squid Game-inspired emojis/shapes
  const emojis = ['🔺','🟩','🟦','🟥','🔵','🟢','⬛','⬜'];
  const values = [...emojis, ...emojis];
  values.sort(() => Math.random() - 0.5);

  function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
      matchedPairs++;
      flippedCards = [];
      if (matchedPairs === 8) {
        clearInterval(timerInterval);
        setTimeout(() => {
          alert(`Congratulations! You won in ${moves} moves and ${seconds} seconds!`);
        }, 300);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }
  }

  function endGame() {
    clearInterval(timerInterval);
    gameOverDisplay.style.display = 'block';
    board.style.pointerEvents = 'none';
  }

  for (let i = 0; i < 16; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    const squareInner = document.createElement('div');
    squareInner.classList.add('square-inner');

    const front = document.createElement('div');
    front.classList.add('square-front');
    front.textContent = '';

    const back = document.createElement('div');
    back.classList.add('square-back');
    back.textContent = values[i];

    squareInner.appendChild(front);
    squareInner.appendChild(back);
    square.appendChild(squareInner);

    square.dataset.value = values[i];

    square.addEventListener('click', function () {
      if (lockBoard) return;
      if (square.classList.contains('flipped')) return;
      if (flippedCards.length === 2) return;

      square.classList.add('flipped');
      flippedCards.push(square);

      if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;
        checkForMatch();
        if (moves >= maxMoves && matchedPairs < 8) {
          setTimeout(endGame, 800);
        }
      }
    });

    board.appendChild(square);
  }
});