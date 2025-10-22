let play_count = false
let num = null
let p 
let col
let game_over = false
let full = false
let cells
let row 
let pillar
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
const count = document.createElement("div")

function write(msg, col){
	count.className = "count"
	if (game_over){
		count.classList.add("game_over")
		count.textContent = msg 
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
		toggle(cells)
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
	}, 500)
	setTimeout(() => {
		clearInterval(blink)
		cells.forEach(win => win.style.display = 'flex');
	}, 3000)	
}

function board_print() {
	let cell = document.createElement("div");
	cell.classList.add("cell");
	if (p === "x") {
		cell.classList.add("red");
		cell.style.gridRowStart = row + 1;
		cell.style.gridColumnStart = pillar + 1;
		cell.dataset.row = row;
		cell.dataset.col = pillar;
		grid.appendChild(cell)
	} else if (p === "o") {
		cell.classList.add("yellow");
		cell.style.gridRowStart = row + 1;
		cell.style.gridColumnStart = pillar + 1;
		cell.dataset.row = row;
		cell.dataset.col = pillar;
		grid.appendChild(cell)
	}
	if (game_over) { 
        write(`Player ${num} wins`)
    } else if (full){
		write("Game Over!!")
	} else {
        write(num, col)
    }		
}

function turns(column) {
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
            board_print(num)
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
	grid.innerHTML = ""
	grid.appendChild(img)
	game_btn.addEventListener("click", () => {
		grid.innerHTML = "";
		grid.appendChild(img)
    });
	play_count = false
	full = false
    game_over = false
    board_print("1")
	count.classList.add("count")
	let pc = "1"
	count.textContent = `P${pc}`
	count.className = "count red"
	output.appendChild(count)
    game_div.innerHTML = ""
    for (let c = 0; c < 7; c++) {
		let btn = document.createElement("button");
		btn.textContent = (c + 1).toString();
		btn.className = "column-btn";
		btn.addEventListener("click", (ev) => {
			turns(c)
		});
		game_div.appendChild(btn);
	}	
}
window.addEventListener("keydown", function(event) {
	event.target.blur()
	let key = event.key 
	if (!isNaN(key)) {
		turns(key - 1)
	}
})

game_btn.addEventListener("click", start_game);	