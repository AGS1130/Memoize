const spriteImages = Object.freeze({
    HEART: 'heart',
    MOON: 'moon',
    ACORN: 'acorn',
    ANCHOR: 'anchor',
    A_COIN: 'a-coin',
    AXE: 'axe',
    BALLOON: 'balloon',
    BELL: 'bell',
    BLUE_SHELL: 'blue-shell',
    BOOMERANG_FLOWER: 'boomerang-flower',
    CARROT: 'carrot',
    CHERRIES: 'cherries',
    GOLD_FLOWER: 'golden-flower',
    GOLD_MUSH: 'golden-mushroom',
    BLUE_MUSH: 'blue-mushroom',
    BOO_MUSH: 'boo-mushroom',
    BOWSER_MUSH: 'bowser-mushroom',
    BRICK_MUSH: 'brick-mushroom',
    GIANT_MUSH: 'giant-mushroom',
    HELI_MUSH: 'helicopter-mushroom',
    HONEY_MUSH: 'honey-mushroom',
    LIFE_MUSH: 'life-mushroom',
    POISON_MUSH: 'poison-mushroom',
    POWER_MUSH: 'power-mushroom',
    SPRING_MUSH: 'spring-mushroom',
    CLOUD_FLOWER: 'cloud-flower',
    DOUBLE_FLOWER: 'double-flower',
    FIRE_FLOWER: 'fire-flower',
    ICE_FLOWER: 'ice-flower',
    BLANK_BLOCK: 'blank-block',
    CANNON_BLOCK: 'cannon-block',
    FACE_BLOCK: 'face-block',
    MYSTERY_BLOCK: 'mystery-block',
    RING_BLOCK: 'ring-block',
    BLUE_POW: 'blue-pow',
    RED_POW: 'red-pow',
    DARK_STAR: 'dark-star',
    GREEN_STAR: 'green-star',
    POWER_STAR: 'power-star',
    PURPLE_STAR: 'purple-star',
    RAINBOW_STAR: 'rainbow-star',
    RED_STAR: 'red-star',
    SPRING_STAR: 'spring-mushroom',
    FEATHER: 'feather',
    FROG: 'frog',
    HAMMER_BRO: 'hammer-bro',
    JINGLE_BELL: 'jingle-bell',
    LEAF1: 'leaf-1',
    LEAF2: 'leaf-2',
    PENGUIN: 'penguin',
    P_WING: 'p-wing',
    SHOE: 'shoe',
    TANOOKI: 'tanooki'
});

let state = {
    chances: 3,
    time: 0,
    numberOfCards: 0,
    numberOfMoves: 0,
    firstPick: null,
    firstActiveCard: null,
    secondActiveCard: null,
};

// Sets cards and player lives
const setTheBoard = () => {
    // Prompt Number of Cards
    let numberOfCards = Number(prompt(`Welcome to the Memoize Match Card Game!\nEnter a number of cards that is a multiple of 4 and between 4 and 20:`));

    while (isNaN(numberOfCards) || numberOfCards % 4 !== 0 || numberOfCards <= 3 || numberOfCards >= 21) {
        numberOfCards = Number(prompt(`I'm sorry, please type a number that is a multiple of 4 and between 4 and 20.\nAcceptable numbers are 4, 8, 16, 20`));
    }

    state.numberOfCards = numberOfCards;

    // Reset Board
    let $cardRows = document.querySelectorAll('.memoize-board .container.cards .row');
    for (row of $cardRows) {
        row.remove();
    }

    let spriteObj = {};

    for (let i = 0; i < state.numberOfCards / 2; i++) {
        let randNum = Math.floor(Math.random() * 53);
        let sprite = spriteImages[Object.keys(spriteImages)[randNum]];

        if (!spriteObj.hasOwnProperty(sprite)) {
            spriteObj[sprite] = `
        <div class="card sprite-img mystery-block">
            <div class="card-face card-front">
                <div class="sprite-img ${sprite}"></div>
            </div>
            <div class="card-face card-back"></div>
        </div>`;
        } else {
            i--;
        }
    }

    gameAudio();
    createCards(spriteObj);
    setPlayersLives();
}

const createCards = (spriteObj) => {
    const $table = document.querySelector('.container.cards');
    let rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    let duplicatesArr = [];
    let setLength = 0;

    // Random for loop
    for (let i = 0; i < state.numberOfCards; i++) {
        let keys = Object.keys(spriteObj)
        let randVal = spriteObj[keys[keys.length * Math.random() << 0]];

        if (!duplicatesArr.includes(randVal)) {
            duplicatesArr.push(randVal);
            // Add card into row
            rowDiv.innerHTML += randVal;

            // Append card row to game board
            if (duplicatesArr.length % 4 === 0 && duplicatesArr.length > setLength) {
                $table.append(rowDiv);
                rowDiv = rowDiv.cloneNode(false);
                setLength = duplicatesArr.length;
            }
        } else {
            duplicatesArr.push(randVal);
            if (cardDuplicatesRithm(randVal, duplicatesArr, {})) {
                duplicatesArr.pop();
                i--;
            } else {
                // Add card into row
                rowDiv.innerHTML += randVal;

                // Append card row to game board
                if (duplicatesArr.length % 4 === 0 && duplicatesArr.length > setLength) {
                    $table.append(rowDiv);
                    rowDiv = rowDiv.cloneNode(false);
                    setLength = duplicatesArr.length;
                }
            };
        }
    }
}

const cardDuplicatesRithm = (randVal, duplicatesArr, duplicatesObjCount) => {
    duplicatesArr.forEach((index) => duplicatesObjCount[index] = (duplicatesObjCount[index] || 0) + 1);
    return duplicatesObjCount[randVal] > 2 ? true : false;
}

const setPlayersLives = () => {
    const $lives = document.querySelector('#lives');
    const lifeDiv = document.createElement('div');
    lifeDiv.classList.add('sprite-img', 'power-star');
    for (let i = 0; i < state.chances; i++) {
        $lives.appendChild(lifeDiv.cloneNode());
    }
}

// Starts Game
const letTheGameBegin = () => {
    const $gameCards = document.querySelectorAll('.container.cards .row .card');

    $gameCards.forEach(($card) => {
        $card.addEventListener('click', (e) => {
            let $frontCard = $card.children[0];
            let $sprite = $frontCard.children[0].classList[1];

            // The CSS class immediately removes the ability to select a card again
            if (!$card.classList.contains('active')) {
                $card.classList.add('active');
                deckCheck($frontCard, $sprite);
            }

            const $attempts = document.querySelector('#navbar #attempts span');
            state.numberOfMoves += 1;
            $attempts.innerHTML = state.numberOfMoves;

            e.stopImmediatePropagation();
        })
    })

    setInterval(() => {
        const {
            numberOfCards
        } = state;
        const numberOfCorrectCards = document.querySelectorAll('.card.correct').length;
        if (numberOfCards !== numberOfCorrectCards) {
            ticks();
        }
    }, 1000);
}

// Check if player has selected two cards
const deckCheck = (cardPosition, cardFace) => {
    let {
        firstActiveCard
    } = state;

    // If there is no active card
    // Else player has selected two cards
    if (!firstActiveCard) {
        state.firstActiveCard = cardPosition.parentNode;
        state.firstPick = cardFace;
    } else {
        state.secondActiveCard = cardPosition.parentNode;
        checkMatch(cardFace);
        setTimeout(() => resetState(), 650);
    }
}

// Check if cards are a match
const checkMatch = (playerPick) => {
    let {
        firstPick,
        firstActiveCard,
        secondActiveCard
    } = state;

    let $playerLives = document.querySelector('#lives').children;

    if (firstPick === playerPick) {
        firstActiveCard.classList.add('correct');
        secondActiveCard.classList.add('correct');
        correctChoiceAudio();
    } else {
        incorrectChoice($playerLives[0]);
    }

    setTimeout(() => checkVictory(), 1250);
}

const resetState = () => {
    if (state.secondActiveCard) {
        // First and Second Choice are no longer active
        state.firstActiveCard.classList.remove('active');
        state.secondActiveCard.classList.remove('active');

        // Reset State
        state.firstPick = null;
        state.firstActiveCard = null;
        state.secondActiveCard = null;
    }
}

const checkVictory = () => {
    const {
        numberOfMoves,
        numberOfCards,
        chances,
        time
    } = state;
    const numberOfCorrectCards = document.querySelectorAll('.card.correct').length;

    if (numberOfCards === numberOfCorrectCards) {
        winnerAudio();

        setTimeout(() => {
            const $resultTime = document.querySelector('#resultsTime span');
            const $resultStars = document.querySelector('#resultsStars span');
            const $resultAttempts = document.querySelector('#resultsAttempts span');

            $resultTime.innerHTML = time;
            $resultStars.innerHTML = chances;
            $resultAttempts.innerHTML = numberOfMoves;

            window.location.hash += 'open-modal';
        }, 500);
    }
}

const resetGame = () => {
    state.chances = 3;
    state.numberOfCards = 0;
    state.numberOfMoves = 0;
    state.firstPick = null;
    state.firstActiveCard = null;
    state.secondActiveCard = null;

    const $gameCards = document.querySelectorAll('.container.cards .row .card');
    $gameCards.forEach($card => {
        $card.classList.remove('active', 'correct', 'incorrect');
    })

    setTheBoard();
    letTheGameBegin();
}

window.addEventListener('DOMContentLoaded', () => {
    window.onscroll = () => makeNavSticky();

    setTheBoard();
    letTheGameBegin();
});

const makeNavSticky = () => {
    const $navbar = document.querySelector('#navbar');
    const sticky = $navbar.offsetTop;

    if (window.pageYOffset > sticky) {
        $navbar.classList.add('sticky');
    } else {
        $navbar.classList.remove('sticky');
    }
}

const correctChoiceAudio = () => {
    const $audio = document.querySelector('#correctChoice');
    $audio.play();
}

const incorrectChoiceAudio = () => {
    const $audio = document.querySelector('#incorrectChoice');
    $audio.play();
}

const winnerAudio = () => {
    const $gameAudio = document.querySelector("#gameAudio");
    const $gameOverAudio = document.querySelector("#gameOverAudio");

    $gameAudio.pause();
    $gameOverAudio.src = "audio/winner.mp3";
    $gameOverAudio.play();
}

const gameOverAudio = () => {
    const $gameAudio = document.querySelector("#gameAudio");
    const $gameOverAudio = document.querySelector("#gameOverAudio");

    $gameAudio.pause();
    $gameOverAudio.src = "audio/game_over.mp3";
    $gameOverAudio.play();
}

const gameAudio = () => {
    const $gameAudio = document.querySelector("#gameAudio");
    $gameAudio.play();
}

const incorrectChoice = ($playerLives) => {
    let {
        numberOfCards,
        numberOfMoves
    } = state;
    let remainder = Math.sqrt(numberOfCards) / 2;
    if (numberOfMoves === Math.floor(remainder * 1) || numberOfMoves === Math.floor(remainder * 5) || numberOfMoves === Math.floor(remainder * 7)) {
        $playerLives.classList.add('lose-life');
        state.chances = state.chances - 1;
        setTimeout(() => $playerLives.remove(), 1250);
    }
    incorrectChoiceAudio();
}

const ticks = () => {
    const $timer = document.querySelector('#navbar #timer span');
    state.time += 1
    $timer.innerHTML = state.time;
}