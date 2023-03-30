// Define possible moves and initial weights for each move
const moves = ['rock', 'paper', 'scissors'];
let weights = [1, 1, 1];

// Initialize game state variables
let games = 1;
let win = 0;
let lose = 0;

// Build page HTML using JavaScript
(function buildPage() {
    document.getElementById('output').innerHTML = `
    <h1>Rock paper Scissors</h1>
    <div id="scoreDisplay">
        <div id="wins">
            <h2>Wins:</h2>
            <span id="winsCount"></span>
        </div>
        <div id="losses">
            <h2>Losses:</h2>
            <span id="loseCount"></span>
        </div>
        <div id="rate">
            <h2>Win Rate:</h2>
            <span id="rateCount"></span><span>%</span>
        </div>
        <div id="reset">
            <h2>Reset Scores</h2>
            <span id="resetBtn"></span>
        </div>
    </div>
    <div id=gameFinished>
        <div id="result">Results</div>
        <div id="playAgain">Click here to play again</div>
    </div>
    <div id="board">
        <h3 class="name">Computer</h3>
        <div class="computer" id="rockEnemy"><img src="images/rock.png"></div>
        <div class="computer" id="paperEnemy"><img src="images/paper.png"></div>
        <div class="computer" id="scissorsEnemy"><img src="images/scissors.png"></div>
        <span id="fence"></span>
        <div class="player hover" id="rock"><img src="images/rock.png"></div>
        <div class="player hover" id="paper"><img src="images/paper.png"></div>
        <div class="player hover" id="scissors"><img src="images/scissors.png"></div>
        <h3 class="name">You</h3>
    </div>`
})();

// Set up initial event listeners for buttons
document.getElementById('reset').addEventListener("click", resetBoard)
document.getElementById('rock').addEventListener("click", onRockClick)
document.getElementById('paper').addEventListener("click", onPaperClick)
document.getElementById('scissors').addEventListener("click", onScissorsClick)

// Event handlers for player moves
function onRockClick() {
    play("rock");
}
function onPaperClick() {
    play("paper");
}
function onScissorsClick() {
    play("scissors");
}

// Function to reset the score board
function resetBoard() {
    win = 0;
    lose = 0;
    games = 1;
    
    document.getElementById('winsCount').innerText = win;
    document.getElementById('loseCount').innerText = lose;
    document.getElementById('rateCount').innerText = 0;
}

// Function to play a move
function play(playerSelection) {
    document.getElementById(playerSelection).style.opacity = 1;

    // Get weights based off of past player moves
    const randomNum = Math.random();
    let totalWeight = weights.reduce((acc, curr) => acc + curr);

    let selectedMove;
    let weightSum = 0;
    for (let i = 0; i < moves.length; i++) {
      weightSum += weights[i];
      if (randomNum < weightSum / totalWeight) {
        selectedMove = convert(moves[i]);
        break;
      } else {
        selectedMove = convert(moves[Math.floor(randomNum*3)])
      }
    }

    // Highlights computer move
    if(selectedMove == 'rock') {
        document.getElementById('rockEnemy').style.opacity = 1;
    } else if(selectedMove == 'paper') {
        document.getElementById('paperEnemy').style.opacity = 1;
    } else if(selectedMove == 'scissors') {
        document.getElementById('scissorsEnemy').style.opacity = 1;
    }

    // Counts what the player has done so far
    if(playerSelection == 'rock') {
        weights[0]++;
    } else if(playerSelection == 'paper') {
        weights[1]++;
    } else if(playerSelection == 'scissors') {
        weights[2]++;
    };

    // Checks who won
    scoring(playerSelection, selectedMove);

    // Prevents any more moves until board is reset
    document.getElementById("rock").removeEventListener("click", onRockClick);
    document.getElementById("paper").removeEventListener("click", onPaperClick);
    document.getElementById("scissors").removeEventListener("click", onScissorsClick);

    document.querySelectorAll(".hover").forEach(element => {
        element.classList.add('disabled');
    });
}

// Adjust score board
function scoring(playerSelection, selectedMove) {
    if (playerSelection == selectedMove) {
        document.getElementById('result').innerText = "Tie!";
      } else if (
        (playerSelection == "rock" && selectedMove == "scissors") ||
        (playerSelection == "paper" && selectedMove == "rock") ||
        (playerSelection == "scissors" && selectedMove == "paper")
      ) {
        document.getElementById('result').innerText = "You Won!";
        win++;
      } else {
        document.getElementById('result').innerText = "Computer Won!";
        lose++;
      }

      let rate = Math.round((win/games)*100);

      document.getElementById('winsCount').innerText = win;
      document.getElementById('loseCount').innerText = lose;
      document.getElementById('rateCount').innerText = rate;

      document.getElementById('gameFinished').style.visibility = "visible";
}

document.getElementById('gameFinished').addEventListener("click", reset)

// Reset button
function reset() {
    document.getElementById('rockEnemy').style.opacity = 0.1;
    document.getElementById('paperEnemy').style.opacity = 0.1;
    document.getElementById('scissorsEnemy').style.opacity = 0.1;
    document.getElementById('rock').style.opacity = 0.1;
    document.getElementById('paper').style.opacity = 0.1;
    document.getElementById('scissors').style.opacity = 0.1;

    document.getElementById('gameFinished').style.visibility = "hidden";

    games++;

    document.getElementById("rock").addEventListener("click", onRockClick);
    document.getElementById("paper").addEventListener("click", onPaperClick);
    document.getElementById("scissors").addEventListener("click", onScissorsClick);

    document.querySelectorAll(".hover").forEach(element => {
        element.classList.remove('disabled');
    });
}

// Converts move to the one that will win
function convert(selectedMove) {
    let move;
    if(selectedMove == 'rock') {
        move = 'paper';
    } else if(selectedMove == 'paper') {
        move = 'scissors';
    } else if(selectedMove == 'scissors') {
        move = 'rock';
    }
    return move;
}
