// Define possible moves and initial weights for each move
const moves = ['rock', 'paper', 'scissors'];
let weights = [1, 1, 1];

// Initialize game state variables
let games = 0;
let win = 0;
let lose = 0;
let rate;

let lastPlayerSelection;
let lastComputerSelection;
let lastWinner;
let selectedMove;
let mode = 'Strategy';

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
        <div id="rounds">
            <h2>Round:</h2>
            <span id="round"></span>
    </div>
        <div id="reset">
            <h2>Reset Scores</h2>
            <span id="resetBtn"></span>
        </div>
    <div id="switchMode">
        <h2>Switch Mode</h2>
    </div>
    <div id="modeDisplay">
        <h2>Mode:</h2>
        <h3 id="mode">Strategy</h3>
    </div>
    </div>
    <div id=gameFinished>
        <div id="result">Results</div>
        <div id="playAgain">Click here to play again</div>
    </div>
    <div id="board">
    <h3 class="name">You</h3>   
        <div class="player hover" id="rock"><img src="images/rock.png"></div>
        <div class="player hover" id="paper"><img src="images/paper.png"></div>
        <div class="player hover" id="scissors"><img src="images/scissors.png"></div>
        <span id="fence"></span>
        <div class="computer" id="rockEnemy"><img src="images/rock.png"></div>
        <div class="computer" id="paperEnemy"><img src="images/paper.png"></div>
        <div class="computer" id="scissorsEnemy"><img src="images/scissors.png"></div>
        <h3 class="name">Computer</h3>
    </div>`;
})();

// Set up initial event listeners for buttons
document.getElementById('reset').addEventListener("click", resetScores);
document.getElementById('switchMode').addEventListener("click", switchMode);
document.getElementById('rock').addEventListener("click", onRockClick);
document.getElementById('paper').addEventListener("click", onPaperClick);
document.getElementById('scissors').addEventListener("click", onScissorsClick);

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
function resetScores() {
    win = 0;
    lose = 0;
    games = 0;
    
    document.getElementById('winsCount').innerText = win;
    document.getElementById('loseCount').innerText = lose;
    document.getElementById('rateCount').innerText = 0;
    document.getElementById('round').innerText = games;
    document.getElementById('mode').innerText = mode;
}

//Change how you want the computer to play
function switchMode() {
    if(mode == 'Strategy') {
        mode = 'Learning'
        document.getElementById('mode').innerText = mode;
    } else {
        mode = 'Strategy'
        document.getElementById('mode').innerText = mode;
    }
}

// Function to play a move
function play(playerSelection) {
    document.getElementById(playerSelection).style.opacity = 1;

    //check which mode is on and play accordingly
    if(mode=='Strategy') {
        //**If computer lost, it will play the thing that didn't come up the round before
        if(lastWinner == 'player') {
            if(lastPlayerSelection=='rock'){
                selectedMove = 'paper'
            } else if(lastPlayerSelection=='paper'){
                selectedMove = 'scissors'
            } else {
                selectedMove = 'rock'
            }
        //**If computer wins, it will play what player just lost with
        } else if(lastWinner == 'computer') {
            selectedMove = lastPlayerSelection;
        //**Play random move if there was a tie
        } else {
            selectedMove = convert(moves[Math.floor(Math.random()*3)]);
        }
    //Computer will guess next move with best chance of winning
    } else {
        // Get weights based off of past player moves
        const randomNum = Math.random();
        let totalWeight = weights.reduce((acc, curr) => acc + curr);

        let weightSum = 0;
        for (let i = 0; i < moves.length; i++) {
        weightSum += weights[i];
        if (randomNum < weightSum / totalWeight) {
            selectedMove = convert(moves[i]);
            break;
        } else {
            selectedMove = convert(moves[Math.floor(randomNum*3)]);
        }
    }}

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
    }

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
        lastWinner = "none";
      } else if (
        (playerSelection == "rock" && selectedMove == "scissors") ||
        (playerSelection == "paper" && selectedMove == "rock") ||
        (playerSelection == "scissors" && selectedMove == "paper")
      ) {
        document.getElementById('result').innerText = "You Won!";
        win++;
        lastPlayerSelection = playerSelection;
        lastComputerSelection = selectedMove;
        lastWinner = "player";
      } else {
        document.getElementById('result').innerText = "Computer Won!";
        lose++;
        lastWinner = "computer";
      }

      if(win == 0 && lose == 0) {
        rate = 0;
      } else {
        rate = Math.round((win/(win+lose))*100);
      }

      document.getElementById('winsCount').innerText = win;
      document.getElementById('loseCount').innerText = lose;
      document.getElementById('rateCount').innerText = rate;
      document.getElementById('round').innerText = games;

      document.getElementById('gameFinished').style.visibility = "visible";
}

document.getElementById('gameFinished').addEventListener("click", resetBoard)

// Reset button
function resetBoard() {
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

    document.getElementById('winsCount').innerText = win;
    document.getElementById('loseCount').innerText = lose;
    document.getElementById('rateCount').innerText = rate;
}

// Converts what computer thinks player will play to the winning move
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
