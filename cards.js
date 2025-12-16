function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms*1000));
}

let allowed
let col
let dealer 
let choice
let value 
let balance = 1000
let deck
let newCard
let first
let second
let dFirst
let dSecond
let white
let red
let green
let black
let purple
let orange
let gameRunning = false
let a
let players
let list = []
let dv
let playbtn
let dl = {
    hand: {
    card1: 0,
    card2: 0
    },
    getValue: function() {
        return this.hand.card1 + this.hand.card2
    }
}

const output = document.getElementById("output")
const startBtn = document.getElementById("start-btn")
const box = document.getElementById("container2")
const request = document.createElement("input")
request.id = "txt"
request.type = "text"
request.placeholder = "Type something here"
const submitBtn = document.createElement("button")
submitBtn.id = "submit"
submitBtn.textContent = "submit"
const tag = document.createElement("a")
const quit = document.createElement("button")

function full_deck() {
    deck = [
        '2', '2', '2', '2', 
        '3', '3', '3', '3', 
        '4', '4', '4', '4', 
        '5', '5', '5', '5', 
        '6', '6', '6', '6', 
        '7', '7', '7', '7', 
        '8', '8', '8', '8', 
        '9', '9', '9', '9', 
        '10', '10', '10', '10', 
        'Jack', 'Jack', 'Jack', 'Jack', 
        'Queen', 'Queen', 'Queen', 'Queen', 
        'King', 'King', 'King', 'King', 
        'Ace', 'Ace', 'Ace', 'Ace', 
    ]
}

function cards() {
    let num = Math.floor(Math.random() * deck.length);
    let card = deck[num]
    deck.splice(num, 1);
    return card;
}

let cardValue = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'Jack' : 10,
  'Queen' : 10 ,
  'King' : 10,
  'Ace' : 11,
}



async function returnElement() {
    return new Promise(resolve => {
        function handler() {
            choice = request.value.trim()
            request.value = ""
            submitBtn.removeEventListener("click", handler)
            window.removeEventListener("keyup", enterHandler)
            resolve(choice)
        }
        function enterHandler(event) {
            if (event.key === "Enter") {handler()}
        }
        submitBtn.addEventListener("click", handler)
        window.addEventListener("keyup", enterHandler)
    })
}

async function multiask(allowed, player) {
    while (true) {
        write(`player${player}, type ${allowed[0]} or ${allowed[1]} and press submit`)
        choice = (await returnElement()).toLowerCase()  
        if (allowed.includes(choice)) {
            if (choice === "s") {
                await sleep(1)
                return multistand(player)
            } else if (choice === "h") {
                await sleep(1)
                return multihit(player)
            }             
        } else {
        write("invalid input, try again")
        }
    }
}

async function ask(allowed) {
    while (true) {
        write(`type ${allowed[0]} or ${allowed[1]} and press submit`)
        choice = (await returnElement()).toLowerCase()
        if (allowed.includes(choice)) {
            return choice
        }
        write("invalid input, try again")
    }
}

async function bet(col) {
    while (true) {
        choice = parseFloat(await returnElement())
        if (!Number.isNaN(choice && choice > 0)) {
            return choice
        }
        write(" ")
        write("invalid input, try again")
        write([1, `${col} chips – $${a}: `])
    }
}

async function multibet() {
    while (true) {
        choice = parseFloat(await returnElement())
        if (!Number.isNaN(choice) && choice > 0) {
            return choice
        }
        write(" ")
        write("invalid input, try again")
        write([1, "Place your bet: "])
    }

}


function write(msg) {
    if (msg[0] === 1) {
        output.textContent += msg[1]
    } else {
        output.textContent += msg + "\n"
    } 
    output.scrollTop = output.scrollHeight;
}

function playerFactory(username) {
    const player = {
        username: username,
        balance: 1000,
        hand: {
            card1: cards(),
            card2: cards()
        },
        getValue: function() {
            return this.hand.card1 + this.hand.card2
        },
        bet: 0
    }
    return player
}

async function assignPlayer(){
    let rowbtn = document.getElementById("rowbtn")
    for (let c = 1; c < 9; c++) {
		let btn = document.createElement("button");
		btn.textContent = (c).toString();
		btn.id = "player-btn";
        playbtn = document.getElementById("player-btn")
        rowbtn.appendChild(btn);
        write("hhhh")
		btn.addEventListener("click", (ev) => {
			players = Number(btn.textContent)
            rowbtn.remove()
		});
	}	
    for (let i = 1; i >= players; i++) {
        write("Type your username")
        let name = String(await returnElement)
        list.push(playerFactory(name));
    }


}

function winChecker(){
    if (dealer > 21) {
        write(`The dealer has ${dv} points`)
        write("The dealer's hand is over 21")
        write("You win")
        balance += dollars * 2
    } else if (dealer >= 17) {
        if (value > dealer) {
            write(`The Dealer has ${dv} points`)
            write("You win")
            balance += dollars * 2
        } else if (value < dealer) {
            write(`The Dealer has ${dv} points`)
            write("You lose")
        } else if (value === dealer) {
            write(`The Dealer has ${dv} points`)
            write("You tie")
            balance += dollars
        }
    }
}

function multiwinChecker(){
    for (let i = 1; i <= players; i++) {
        if (list[i][2] <= 21) {
            if (dv > 21) {
                write(`The dealer has ${dv} points`)
                write("The dealer's hand is over 21")
                write(`Player${i}, you win!`)
                list[i][3] += list[i][4] * 2
                write(`Player${i}, your balance is now ${list[i][3]}`)
            } else if (dv >= 17) {
                if (list[i][2] > dv) {
                    write(`The Dealer has ${dv} points`)
                    write(`Player${i}, you win`)
                    list[i][3] += list[i][4] * 2
                    write(`Player${i}, your balance is now ${list[i][3]}`)
                } else if (list[i][2] < dv) {
                    write(`The Dealer has ${dv} points`)
                    write(`Player${i}, you lose`)
                    write(`Player${i}, your balance is now ${list[i][3]}`)
                } else if (list[i][2] === dv) {
                    write(`The Dealer has ${dv} points`)
                    write(`Player${i}, you tie`)
                    list[i][3] += list[i][4]
                    write(`Player${i}, your balance is now ${list[i][3]}`)
                }
            }
        } else {
            write(`Player${i} already busted`)
        }
    }
}


async function stand() {
    write(`Dealer's hand: ${dFirst} and ${dSecond}`)
    await sleep(1)
    winChecker()
    while (dealer < 17) {
        newCard = cards()
        if (cardValue[newCard] === 8 || cardValue[newCard] === 11 || cardValue[newCard] === 18) {
            write(`The dealer draws an ${newCard}`)
            await sleep(1)
        } else {
            write(`The dealer draws a ${newCard}`)
            await sleep(1)
        }
        dealer += cardValue[newCard]
            
        if (dealer > 21 && newCard === 'Ace') {
            dealer -= 10
        }
        if (dealer < 17) {
            await sleep(1)
            write(`The Dealer has ${dealer} points`)
        }
    }
    winChecker()
    replay()
}

async function multistand(player) {
    if (player === players){
        write(`Dealer's hand: ${list[0][0]} and ${list[0][1]}`)
        await sleep(1)
        while (dv < 17) {
            if (cardValue[list[0][1]] === 8 || cardValue[[list[0][1]]] === 11 || cardValue[[list[0][1]]] === 18) {
                write(`The dealer draws an ${[list[0][1]]}`)
                await sleep(1)
            } else {
                write(`The dealer draws a ${[list[0][1]]}`)
                await sleep(1)
            }
            dv += cardValue[[list[0][1]]]
                
            if (dv > 21 && newCard[list[0][1]] === 'Ace') {
                dv -= 10
            }
            if (dv === 21) {
                await sleep(1)
                write(`The Dealer has ${dv} points`)
                write("He yells BlackJack!")
            } else if (dv < 17) {
                await sleep(1)
                write(`The Dealer has ${dv} points`)
            }
        }
        multiwinChecker()
        replay()
    } else {
        player += 1
        await multiask(["s", "h"], player)
    }
}

async function multihit(player){
    while (list[player][2] <= 21 && choice === "h") {
        newCard = cards()
        if (cardValue[newCard] === 8 || cardValue[newCard] === 11 || cardValue[newCard] === 18) {
            write(`You drew an ${newCard}`)
        } else {
            write(`You drew a ${newCard}`)
        }
        list[player][2] += cardValue[newCard]
        if (list[player][2] > 21 && newCard === "Ace") {
            list[player][2] -= 10 
        }
        write(`You have ${list[player][2]} points`) 
        if (list[player][2] > 21 && player === players) {
            write("Your hand went over 21")
            write("You bust")
            write("You lose")
            write(`Your balance is now ${list[player][3]}`)
            multistand(player)
        } else if (list[player][2] > 21){
            write("You lose")
            multistand(player)
        } else {
            await multiask(["s","h"], player)
        }
    }
}

async function hit(){
    while (value < 21 && choice === "h") {
        newCard = cards()
        if (cardValue[newCard] === 8 || cardValue[newCard] === 11 || cardValue[newCard] === 18) {
            write(`You drew an ${newCard}`)
        } else {
            write(`You drew a ${newCard}`)
        }
        value += cardValue[newCard]
        if (value > 21 && newCard === "Ace") {
            value -= 10 
        }
        write(`You have ${value} points`)
        if (value > 21) {
            write("Your hand went over 21")
            write("You bust")
            write("You lose")
            write(`Your balance is now ${balance}`)
            replay()
        } else {
            choice = await ask(["s", "h"])
            if (choice === "s") {
                stand()
            } else if (choice === "h") {
                hit()
            }
        }
    }
}

function replay(){
	gameRunning = false
	document.body.appendChild(tag)
    if (balance > 0) {
        startBtn.style.display = "flex"
    } else {
        write("Your balance is too low to play again. Come back soon.")
        exit()
    }
}

function begin() {
    output.className = "display"
    startBtn.className = "restart-btn"
    startBtn.textContent = "play again"
    quit.id = "quit"
	quit.textContent = "Quit Game"
    tag.href = "index.html"
    tag.appendChild(quit)
    box.appendChild(request)
    box.appendChild(submitBtn)
    startBtn.removeEventListener("click", begin)
    startBtn.addEventListener("click", start)
    start()
}

function set_up() {
    tag.remove()
    full_deck()
	startBtn.style.display = "none"
    output.textContent = ""
    output.innerHTML = ""
}

async function multibegin() {
    startBtn.className = "restart-btn"
    startBtn.textContent = "play again"
    quit.id = "quit"
	quit.textContent = "Quit Game"
    tag.href = "index.html"
    tag.appendChild(quit)
    box.appendChild(request)
    box.appendChild(submitBtn)
    list.push(dl)
    output.className = "display"
    await assignPlayer()
    startBtn.removeEventListener("click", begin)
    startBtn.addEventListener("click", multistart)
    multistart()
}

function multiset_up() {
    tag.remove()
    full_deck()
	startBtn.style.display = "none"
    output.textContent = ""
    output.innerHTML = ""

    dl.hand.card1 = cards()
    dl.hand.card1 = cards()    
}

async function multistart() {
    if (gameRunning) {return}
    gameRunning = true
	multiset_up()
    full_deck()

    for (let i = 1; i <= players; i++) {
        while (true) {
            dollars = 0
            write(`Player ${i} balance is $${list[i].balance}`)
            write([1, "Place your bet: "])
            dollars = await multibet(); 
            write(dollars)
            if (dollars > list[i].balance) {
                await sleep(0.5)
                write(`You spent $${dollars}`)
                write("Insufficient funds")
                write("")
                continue
            }
            list[i].balance -= dollars
            list[i].bet = dollars
            break
        }
    }


    for (let i = 1; i <= players; i++) {
        if (cardValue[list[i].hand.card1] === 8 || cardValue[list[i].hand.card1] === 11) {
            write(`Player${i}'s first card is an ${list[i].hand.card1}`)
            await sleep(1)
        } else {
            write(`Player${i}'s first card is a ${list[i].hand.card1}`)
            await sleep(1)
        }
        if (cardValue[list[i].hand.card1] === 8 || cardValue[list[i].hand.card1] === 11) {
            write(`Player${i}'s second card is an ${list[i].hand.card2}`)
            await sleep(1)
        } else {
            write(`Player${i}'s second card is a ${list[i].hand.card2}`)
            await sleep(1)
        }
    }
    write(" ")

    for (let i = 1; i <= players; i++) {
        if (list[i].getValue === 21 && list[0].getValue != 21) {
            write(`Player${i} has Blackjack!!!!!`)
        } else if (dv === 21 && list[i][2] === 21) {
            write(`The dealer shows that his second card is a ${list[0][1]}`)
            write("Blackjack!!!!!!!!")
            write("You tie")
            list[i][3] += list[i][4]
            replay()
        }
    }

    if (cardValue[list[0][0]] === 8 || cardValue[list[0][0]] === 11 || cardValue[list[0][0]] === 18) {
        write(`The dealer's first card is an ${list[0][0]}`)
        await sleep(1)
    } else { 
        write(`The dealer's first card is a ${list[0][0]}`)
        await sleep(1)
    }
    if (dealer === 21 && list[i][2] != 21) {
        multiwinChecker()
    }

    await multiask(["s","h"], 1)
}

async function start() {
    if (gameRunning) {return}
    gameRunning = true
	set_up()
    while (true) {
        write(`Your balance is $${balance}`)
        write("Pick your chips")
        await sleep(0.5)
        dollars = 0
        write([1, "White chips – $1: "])
		a = 1
        white = await bet('White'); 
        write(white)
        dollars += white
        if (dollars > balance) {
            await sleep(0.5)
            write(`You spent $${dollars}`)
            write("Insufficient funds")
            write("")
            continue
        }
        write([1, "Red chips – $5: "])
		a = 5
        red = await bet('Red'); 
        write(red)
        dollars += red * 5
        if (dollars > balance) {
            await sleep(0.5)
            write(`You spent $${dollars}`)
            write("Insufficient funds")
            write("")
            continue
        }
        write([1, "Green chips – $25: "])
		a = 25
        green = await bet('Green'); 
        write(green)
        dollars += green * 25
        if (dollars > balance) {
            await sleep(0.5)
            write(`You spent $${dollars}`)
            write("Insufficient funds")
            write("")
            continue
        }
        write([1, "Black chips – $100: "])
		a = 100
        black = await bet('Black'); 
        write(black)
        dollars += black * 100
        if (dollars > balance) {
            await sleep(0.5)
            write(`You spent $${dollars}`)
            write("Insufficient funds")
            write("")
            continue
        }
        write([1, "Purple chips – $500: "])
		a = 500
        purple = await bet('Purple'); 
        write(purple)
        dollars += purple * 500
        if (dollars > balance) {
            await sleep(0.5)
            write(`You spent $${dollars}`)
            write("Insufficient funds")
            write("")
            continue
        }
        write([1, "Orange chips – $1000: "])
		a = 1000
        orange = await bet('Orange'); 
        write(orange)
        dollars += orange * 1000
        if (dollars > balance) {
            await sleep(0.5)
            write(`You spent $${dollars}`)
            write("Insufficient funds")
            write("")
            continue
        }
		break
    }
    if (dollars >= 0){balance -= dollars}
    if (dollars > 0) {
        write("You purchased: ")
        if (white > 0) {
            write(`${white} white chips ($${white})`)
            await sleep(1)
        }
        if (red > 0) {
            write(`${red} red chips ($${red * 5})`)
            await sleep(1)
        }
        if (green > 0) {
            write(`${green} green chips ($${green * 25})`)
            await sleep(1)
        }
        if (black > 0) {
            write(`${black} black chips ($${black * 100})`)
            await sleep(1)
        }
        if (purple > 0) {
            write(`${purple} purple chips ($${purple * 500})`)
            await sleep(1)
        }
        if (orange > 0) {
            write(`${orange} orange chips ($${orange * 1000})`)
            await sleep(1)
        }
    }
    write(`You've bet $${dollars} on this match`)    
    write(`Your balance is now $${balance}`) 
    await sleep(1)
    write("")
    
    first = cards()
    second = cards()
    value = cardValue[first] + cardValue[second]
    first === "Ace" && second === "Ace" ? value -= 10 : value = value
    dFirst = cards()
    dSecond = cards()
    dealer = cardValue[dFirst] + cardValue[dSecond]
    dFirst === "Ace" && dSecond === "Ace" ? dealer -= 10 : dealer = dealer

    if (cardValue[first] === 8 || cardValue[first] === 11 || cardValue[first] === 18) {
        write(`Your first card is an ${first}`)
        await sleep(1)
    } else {
        write(`Your first card is a ${first}`)
        await sleep(1)
    }
    if (cardValue[second] === 8 || cardValue[second] === 11 || cardValue[second] === 18) {
        write(`Your second card is an ${second}`)
        await sleep(1)
    } else {
        write(`Your second card is a ${second}`)
        await sleep(1)
    }
    write(`You have ${value} points`)
    await sleep(1)
    write(" ")

    if (value === 21 && dealer != 21) {
        write("Blackjack!!!!!")
        write(`The dealer's second card was a ${dSecond}`)
        write("You win")
        balance += dollars * 2
        write(`Your balance is now ${balance}`)
        replay()
    } else if (dealer === 21 && value === 21) {
        write(`The dealer shows that his second card is a ${dSecond}`)
        write("Blackjack!!!!!!!!")
        write("You tie")
        balance += dollars
        replay()
    } else {
        if (cardValue[dFirst] === 8 || cardValue[dFirst] === 11 || cardValue[dFirst] === 18) {
            write(`The dealer's first card is an ${dFirst}`)
            await sleep(1)
        } else { 
            write(`The dealer's first card is a ${dFirst}`)
            await sleep(1)
        }
        if (dealer === 21 && value != 21) {
            write("Blackjack!!!!!")
            write(`The dealer's second card was a ${dSecond}`)
            write("The dealer wins")
            write(`Your balance is now ${balance}`)
            replay()
        }
        choice = await ask(["s","h"])
        if (choice === "s") {
            await sleep(1)
            stand()
        } else if (choice === "h") {
            await sleep(1)
            hit()
        }
    }
}

startBtn.className = "start-btn"
startBtn.addEventListener("click", multibegin)