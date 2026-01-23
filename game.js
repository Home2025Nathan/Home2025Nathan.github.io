function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms*1000));
}

let play_count = false
let num = null
let p 
let col
let game_over = false
let full = false
let cells
let row 
let pillar
let dropping = false
let board = [
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "]
]

const output = document.getElementById("box")
const game_div = document.getElementById("game")
const game_btn = document.getElementById("start-btn")
const grid = document.getElementById("grid")
const dropGrid = document.getElementById("drop-grid")
const columnBtn = document.getElementsByClassName("column-btn")
const count = document.createElement("div")
const img = document.createElement("img");


function keypad(event) {
	event.target.blur()
	let key = event.key 
	if (!isNaN(key)) {
		turns(key - 1)
	}
}

async function write(msg, col){
	count.className = "count"
	if (game_over){
		count.classList.add("game_over")
		count.textContent = msg 
		await sleep(1)
		for (let i = 0; i < 6; i++) {
			for (let n = 0; n < 7; n++) {
				if (board[i][n] === "P1" || board[i][n] === "P2") {
					let cel = document.querySelector(`.cell[data-row="${i}"][data-col="${n}"]`);
					cel.classList.add("win") 
				}
			}
		}
		if (p === "x") {
			cells = document.querySelectorAll(".cell.red.win")
		} else if (p === "o") {
			cells = document.querySelectorAll(".cell.yellow.win")
		}
		setTimeout(() => {
			cells.forEach(cell => cell.classList.remove("win"));
		}, 3000)	

		

	} else if (full) {
		count.classList.add("full")
		count.textContent = msg 
	} else if (col === "red") {
		count.classList.add("yellow")
		count.textContent = "P" + "2" 
	} else if (col === "yellow") {
		count.classList.add("red")
		count.textContent = "P" + "1" 
	}
}

function toggle(cells) {
	const blink = setInterval(() => {
		cells.forEach(win => { 
			const currentDisplay = window.getComputedStyle(win).display;
			if (currentDisplay === 'none') {
				win.style.display = 'flex';  
			} else {
				win.style.display = 'none';
			}
		})
	}, 400)
	setTimeout(() => {
		clearInterval(blink)
		cells.forEach(win => win.style.display = 'flex');
	}, 3000)	
}

async function board_print() {
	let cell = document.createElement("div")
	anim = getComputedStyle(cell).animationPlayState 
	let sCell = document.createElement("div")
	cell.classList.add("cell");
	sCell.classList.add("sCell")
	if (p === "x") {
		cell.classList.add("red")
		sCell.classList.add("red")
	} else if (p === "o") {
		cell.classList.add("yellow")
		sCell.classList.add("yellow")
	}
	cell.appendChild(sCell)
	cell.dataset.row = row
	cell.dataset.col = pillar
	cell.style.gridColumnStart = pillar + 1;
	cell.style.gridRowStart = 1; // top of animation grid
	dropGrid.appendChild(cell)
	let targetRow = row;
	cell.classList.add("drop");
	cell.style.setProperty("--drop-rows", targetRow);
		

	cell.addEventListener("animationend", () => {
		cell.classList.remove("drop");
		cell.style.transform = "";
		cell.style.opacity = "";
		cell.style.gridRowStart = targetRow + 1;
		grid.appendChild(cell) 
		});
	
	

	if (game_over) { 
        await write(`Player ${num} wins`)
    } else if (full){
		await write("Game Over!!")
	} else {
        await write(num, col)
    }		
}

async function turns(column) {
    if (game_over || full) {
        return
    }
    if (play_count === false) {
        num = "1"
        p = "x"
		col = "red"
    } else {
        num = "2"
        p = "o"
		col = "yellow"
    }
    for (let i = 5; i > -1; i--) {
        if (board[i][column] === " ") {
            board[i][column] = p
			row = i 
			pillar = column 
            winchecker()
            if (!board.some(row => row.includes(" "))) {
                full = true
            }
            (play_count) ? play_count = false : play_count = true
            await board_print(num)
            break
        }
    }
}
    
function winchecker() {
    if (play_count === false) {
        num = "1"
        p = "x"
    } else {
        num = "2"
        p = "o"
    }
 
	for (let i = 0; i < 6; i++) {
		for (let column = 0; column < 7; column++) {
			if (i > 2 && board[i][column] === p && board[i-1][column] === p && board[i-2][column] === p && board[i-3][column] === p) {
				board[i][column] = `P${num}`
				board[i-1][column] = `P${num}`
				board[i-2][column] = `P${num}`
				board[i-3][column] = `P${num}`
				game_over = true
			} else if (i < 3 && board[i][column] === p && board[i+1][column] === p && board[i+2][column] === p && board[i+3][column] === p) {
				board[i][column] = `P${num}`
				board[i+1][column] = `P${num}`
				board[i+2][column] = `P${num}`
				board[i+3][column] = `P${num}`
				game_over = true
			} else if (column > 2 && board[i][column] === p && board[i][column-1] === p && board[i][column-2] === p && board[i][column-3] === p) {
				board[i][column] = `P${num}`
				board[i][column-1] = `P${num}`
				board[i][column-2] = `P${num}`
				board[i][column-3] = `P${num}`
				game_over = true
			} else if (column < 4 && board[i][column] === p && board[i][column+1] === p && board[i][column+2] === p && board[i][column+3] === p) {
				board[i][column] = `P${num}`
				board[i][column+1] = `P${num}`
				board[i][column+2] = `P${num}`
				board[i][column+3] = `P${num}`
				game_over = true
			} else if (i > 2 && board[i][column] === p && column > 2 && board[i-1][column-1] === p && board[i-2][column-2] === p && board[i-3][column-3] === p) {
				board[i][column] = `P${num}`
				board[i-1][column-1] = `P${num}`
				board[i-2][column-2] = `P${num}`
				board[i-3][column-3] = `P${num}`
				game_over = true
			} else if (i > 2 && board[i][column] === p && column < 4 && board[i-1][column+1] === p && board[i-2][column+2] === p && board[i-3][column+3] === p) {
				board[i][column] = `P${num}`
				board[i-1][column+1] = `P${num}`
				board[i-2][column+2] = `P${num}`
				board[i-3][column+3] = `P${num}`
				game_over = true
			} else if (i < 3 && board[i][column] === p && column < 4 && board[i+1][column+1] === p && board[i+2][column+2] === p && board[i+3][column+3] === p) {
				board[i][column] = `P${num}`
				board[i+1][column+1] = `P${num}`
				board[i+2][column+2] = `P${num}`
				board[i+3][column+3] = `P${num}`
				game_over = true
			} else if (i < 3 && board[i][column] === p && column > 2 && board[i+1][column-1] === p && board[i+2][column-2] === p && board[i+3][column-3] === p) {
				board[i][column] = `P${num}`
				board[i+1][column-1] = `P${num}`
				board[i+2][column-2] = `P${num}`
				board[i+3][column-3] = `P${num}`
				game_over = true
			}
		}
	}
}    
 
function start_game(){
	game_btn.textContent = "Re-start"
	game_btn.className = "startbtn"
    board = [
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " "]
    ]
	const img = document.createElement("img");
	img.src = "https://cgi.csc.liv.ac.uk/~trp/Teaching/Entries/2013/10/21_COMP327_-_Practical_Assignment_1_2013_files/FIAL_Board.png"
	img.classList.add("img")
	play_count = false
	full = false
    game_over = false
	count.classList.add("count")
	let pc = "1"
	count.textContent = `P${pc}`
	count.className = "count red"
	output.appendChild(count)
	if (document.querySelector(".column-btn")) {
		// remove all old buttons, not just the first
		document.querySelectorAll(".column-btn").forEach(btn => btn.remove());
		document.querySelectorAll(".hover-btn").forEach(btn => btn.remove());
	}
	
	for (let c = 0; c < 7; c++) {
		let btn = document.createElement("button");
		let hoverBtn = document.createElement("button");
		btn.textContent = (c + 1).toString();
		btn.className = "column-btn";
		hoverBtn.className = "hover-btn"
		btn.addEventListener("click", () => turns(c));
		hoverBtn.addEventListener("click", () => turns(c))
		game_div.appendChild(btn);
		game_div.appendChild(hoverBtn)
	}
window.removeEventListener("keydown", keypad)

window.addEventListener("keydown", keypad)
}

game_btn.addEventListener("click", () => {
	if (!document.querySelector(".cell.drop")) {
		grid.innerHTML = "";
		img.src = "https://cgi.csc.liv.ac.uk/~trp/Teaching/Entries/2013/10/21_COMP327_-_Practical_Assignment_1_2013_files/FIAL_Board.png"
		img.classList.add("img")
		grid.appendChild(img)
		start_game();
	}
	
});	