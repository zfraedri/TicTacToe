let playerTurn = true;
let computerMoveTimeout = 0;

const gameStatus = {
	MORE_MOVES_LEFT: 1,
	HUMAN_WINS: 2,
	COMPUTER_WINS: 3,
	DRAW_GAME: 4
};

window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
	// Setup the click event for the "New game" button
	const newBtn = document.getElementById("newGameButton");
	newBtn.addEventListener("click", newGame);

	// Create click-event handlers for each game board button
	const buttons = getGameBoardButtons();
	for (let button of buttons) {
		button.addEventListener("click", function () { boardButtonClicked(button); });
	}

	// Clear the board
	newGame();
}

// Returns an array of 9 <button> elements that make up the game board. The first 3 
// elements are the top row, the next 3 the middle row, and the last 3 the 
// bottom row. 
function getGameBoardButtons() {
	return document.querySelectorAll("#gameBoard > button");
}

function checkForWinner() {
	
	const buttons = getGameBoardButtons();

	// Ways to win
	const possibilities = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
		[0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
		[0, 4, 8], [2, 4, 6] // diagonals
	];

	// Check for a winner first
	for (let indices of possibilities) {
		if (buttons[indices[0]].innerHTML !== "" &&
			buttons[indices[0]].innerHTML === buttons[indices[1]].innerHTML &&
			buttons[indices[1]].innerHTML === buttons[indices[2]].innerHTML) {
			
			// Found a winner
			if (buttons[indices[0]].innerHTML === "X") {
				return gameStatus.HUMAN_WINS;
			}
			else {
				return gameStatus.COMPUTER_WINS;
			}
		}
	}

	// See if any more moves are left
	for (let button of buttons) {
		if (button.innerHTML !== "X" && button.innerHTML !== "O") {
			return gameStatus.MORE_MOVES_LEFT;
		}
	}

	// If no winner and no moves left, then it's a draw
	return gameStatus.DRAW_GAME;
}

function newGame() {
	
    // Use clearTimeout() to clear the computer's move timeout 
    // and then set computerMoveTimeout back to 0.
    clearTimeout(computerMoveTimeout);
	computerMoveTimeout = 0;

    // Loop through all game board buttons and set the text content of each to an empty string.
    // Also remove the class name and disabled attribute. The disabled attribute prevents the user from clicking the button, but all the buttons should be clickable when starting a new game.
    const buttons = getGameBoardButtons();
	for (let button of buttons) {
		button.innerHTML = "";
		button.className = "";
		button.disabled = false;
	}

    // Allow the player to take a turn by setting playerTurn to true.
    playerTurn = true;
    
    // Set the text of the turn information paragraph to "Your turn".
    document.getElementById("turnInfo").innerText = "Your turn";
}

function boardButtonClicked(button) {

    // If playerTurn is true:
    if (playerTurn) {
    // Set the button's text content to "X".
    // Add the "x" class to the button.
    // Set the button's disabled attribute to true so the button cannot be clicked again.
    // Call switchTurn() so the computer can take a turn.
		button.innerHTML = "X";
		button.classList.add("x");
		button.disabled = true;

		switchTurn();
	}
}

function switchTurn() {

    // Call checkForWinner() to determine the game's status.
	const status = checkForWinner();
	const turnInfo = document.getElementById("turnInfo")

	if (status == gameStatus.MORE_MOVES_LEFT) {
		if (playerTurn) {
			// If switching from the player's turn to the computer's turn, use setTimeout() to call makeComputerMove() after 1 second (1000 milliseconds). Assign the return value of setTimeout() to computerMoveTimeout. The timeout simulates the computer "thinking", and prevents the nearly-instant response to each player move that would occur from a direct call to makeComputerMove().
            computerMoveTimeout = setTimeout(makeComputerMove, 1000)
		}		

		// Toggle playerTurn's value from false to true or from true to false.	
        playerTurn = !playerTurn;

		// Set the turn information paragraph's text content to "Your turn" if playerTurn is true, or "Computer's turn" if playerTurn is false.
		turnInfo.innerText = playerTurn ? "Your turn" : "Computer's turn";
		// add that info/message to the page in the correct place
        // TODO
		} else {
        // In the case of a winner or a draw game:
        // Set playerTurn to false to prevent the user from being able to place an X after the game is over.
        playerTurn = false;

        // If the human has won, display the text "You win!" in the turn info paragraph.
		if (status == gameStatus.HUMAN_WINS) {
			turnInfo.innerHTML = "You win!";		
		}
        // If the computer has won, display the text "Computer wins!" in the turn info paragraph.
		else if (status == gameStatus.COMPUTER_WINS) {
			turnInfo.innerHTML = "Computer wins!";
		}
        // If the game is a draw, display the text "Draw game" in the turn info paragraph.
		else if (status == gameStatus.DRAW_GAME) {
			turnInfo.innerHTML = "Draw game";
		}
	}
}

function makeComputerMove() {
	// THIS CODE HAS BEEN COMPLETED FOR YOU
    // Find indices of available buttons
	const buttons = getGameBoardButtons();
	let indices = [];
	buttons.forEach((button, i) => {
		if (button.innerHTML !== "X" && button.innerHTML !== "O") {
			indices.push(i);
		}
	});

	// If an index is available, pick randomly
	if (indices.length > 0) {
		const index = indices[Math.floor(Math.random() * indices.length)];
		buttons[index].innerHTML = "O";
		buttons[index].classList.add("o");

		// Don't allow user to click this button
		buttons[index].disabled = true;

		// Switch turn back to player
		switchTurn();
	}
}