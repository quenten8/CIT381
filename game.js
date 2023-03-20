let games = 1;
let win = 0;
let lose = 0;
let counts = [
    {'move': 'rock', 'count': 0},
    {'move': 'paper', 'count': 0},
    {'move': 'scissors', 'count': 0}
];

//build page
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
})()

//Initial event listeners
document.getElementById('reset').addEventListener("click", resetBoard)
document.getElementById('rock').addEventListener("click", onRockClick)
document.getElementById('paper').addEventListener("click", onPaperClick)
document.getElementById('scissors').addEventListener("click", onScissorsClick)

function onRockClick() {
    play("rock");
}
function onPaperClick() {
    play("paper");
}
function onScissorsClick() {
    play("scissors");
}

//reset score board
function resetBoard() {
    win = 0;
    lose = 0;
    games = 1;
    
    document.getElementById('winsCount').innerText = win;
    document.getElementById('loseCount').innerText = lose;
    document.getElementById('rateCount').innerText = rate;
}

function play(playerSelection) {
    document.getElementById(playerSelection).style.opacity = 1;

    //find player's most used move
    let highest = counts.reduce(
        (prev, current) => {
          return prev.count > current.count ? prev : current
        }
      );


    let computerSelection;
    //Random move if probability is the same
    if(counts[0].count == counts[1].count && counts[0].count == counts[2].count) {
        const random = Math.floor(Math.random() * Object.keys(counts).length);

        computerSelection = counts[random].move;

        //Check if two moves have equal probability
    } else if(counts.find(move => (move.count == highest.count) && move.move != highest.move)) {
        computerSelection = convert(highest);

        //Find best move according to probability
    } else {
        computerSelection = convert(highest)
    };

    //Converts predicted player move to computer move
    if(computerSelection == 'rock') {
        document.getElementById('rockEnemy').style.opacity = 1;
    } else if(computerSelection == 'paper') {
        document.getElementById('paperEnemy').style.opacity = 1;
    } else if(computerSelection == 'scissors') {
        document.getElementById('scissorsEnemy').style.opacity = 1;
    }

    //Counts what the player has done so far
    if(playerSelection == 'rock') {
        counts[0].count++;
    } else if(playerSelection == 'paper') {
        counts[1].count++;
    } else if(playerSelection == 'scissors') {
        counts[2].count++;
    };

    //Checks who won
    scoring(playerSelection, computerSelection);

    //Prevents any more moves until board is reset
    document.getElementById("rock").removeEventListener("click", onRockClick);
    document.getElementById("paper").removeEventListener("click", onPaperClick);
    document.getElementById("scissors").removeEventListener("click", onScissorsClick);

    document.querySelectorAll(".hover").forEach(element => {
        element.classList.add('disabled');
    });
}


function scoring(playerSelection, computerSelection) {
    if (playerSelection == computerSelection) {
        document.getElementById('result').innerText = "Tie!";
      } else if (
        (playerSelection == "rock" && computerSelection == "scissors") ||
        (playerSelection == "paper" && computerSelection == "rock") ||
        (playerSelection == "scissors" && computerSelection == "paper")
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

function convert(highest) {
    let move;
    if(highest.move == 'rock') {
        move = 'paper';
    } else if(highest.move == 'paper') {
        move = 'scissors';
    } else if(highest.move == 'scissors') {
        move = 'rock';
    }
    return move;
}
