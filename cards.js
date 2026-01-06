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
let beginning = true
let dl = {
    username: "dealer",
    hand: {
    card1: 0,
    card2: 0,
    cardsNew: 0
    },
    getValue: function() {
        return cardValue[this.hand.card1] + cardValue[this.hand.card2] + this.hand.cardsNew
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
        if (allowed.includes("surrender") && allowed.includes("doubledown")) {
            write([1, `player${player}, type ${allowed[0]}, ${allowed[1]}, ${allowed[2]}, or ${allowed[3]} and press submit: `])
        } else if (allowed.includes("surrender")) {
            write([1, `player${player}, type ${allowed[0]}, ${allowed[1]}, or ${allowed[2]} and press submit: `])
        } else if (allowed.includes("doubledown")) {
            write([1, `player${player}, type ${allowed[0]}, ${allowed[1]}, or ${allowed[3]} and press submit: `])
        } else {
            write([1, `player${player}, type ${allowed[0]}, or ${allowed[1]} and press submit: `])
        }
        
        choice = (await returnElement()).trim().toLowerCase()  
        
        if (choice === "s") {
            write(choice)
            await sleep(1)
            return await multistand(player)
        } else if (choice === "h") {
            write(choice)
            await sleep(1)
            return await multihit(player)
        } else if (allowed.includes(choice) && choice === "surrender") {
            write(choice)
            await sleep(1)
            list[player].surrender = true
            list[player].balance += list[player].bet / 2
            return await multistand(player)
        } else if (allowed.includes("doubledown")) {
            write(choice)
            await sleep(1)
            return await multihit(player)
        } else {
            write("invalid input, try again")
        }
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

function aceCheck(player, item) {
    if (item === "Ace") {
        list[player].aces += 1
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
    if (username === undefined) {
        username = "player"
    }
    const player = {
        username: username,
        balance: 1000,
        surrender: false,
        doubleDown: false,
        hand: {
            card1: 0,
            card2: 0,
            cardsNew: 0
        },
        aces: 0,
        aceValue: function() {
            let holding = cardValue[this.hand.card1] + cardValue[this.hand.card2] + this.hand.cardsNew 
            let acesToMinus = 0
            let acesAvailable = this.aces
            while (holding > 21 && acesAvailable > 0) {
                holding -= 10
                acesAvailable -= 1
                acesToMinus += 1
            }
            return acesToMinus * 10
        },
        getValue: function() {
            return cardValue[this.hand.card1] + cardValue[this.hand.card2] + this.hand.cardsNew - this.aceValue();
        },
        bet: 0,
        
    }
    return player
}

async function assignPlayer(){
    let rowbtn = document.getElementById("rowbtn")
    write([1,"How many players will you have: "])
    players = await new Promise(resolve => {
        for (let c = 1; c < 9; c++) {
            let btn = document.createElement("button");
            btn.innerHTML = c
            btn.className = "numBtns"
            rowbtn.appendChild(btn);
            btn.addEventListener("click", () => {
                rowbtn.remove()
                write(c)
                resolve(c)
            });
	    }	
    })   
    if (players > 1) {
        for (let i = 1; i <= players; i++) {
            while (true) {
                write([1, `Player${i}, type your username: `])
                let name = (String(await returnElement())).trim()
                if (list.some(p => p.username.toLowerCase() === name.toLowerCase())) {
                    write("")
                    write("This username is taken")
                    continue
                }
                write(name)
                if (name === "") {
                    continue
                }
                list.push(playerFactory(name));
                await sleep(0.5)
                break
            }
        }
    } else {
        list.push(playerFactory(undefined))
    }
}

function multiwinChecker(){
    for (let i = 1; i <= players; i++) {
        if (list[i].getValue() <= 21 && list[i].surrender === false) {
            if (list[0].getValue() > 21) {
                write(`The dealer has ${list[0].getValue()} points`)
                write("The dealer's hand is over 21")
                write(`Player${i}, you win!`)
                list[i].balance += list[i].bet * 2
                write(`Player${i}, your balance is now ${list[i].balance}`)
            } else if (list[0].getValue() >= 17) {
                if (list[i].getValue() > list[0].getValue()) {
                    write(`The Dealer has ${list[0].getValue()} points`)
                    write(`Player${i}, you win`)
                    list[i].balance += list[i].bet * 2
                    write(`Player${i}, your balance is now ${list[i].balance}`)
                } else if (list[i].getValue() < list[0].getValue()) {
                    write(`The Dealer has ${list[0].getValue()} points`)
                    write(`Player${i}, you lose`)
                    write(`Player${i}, your balance is now ${list[i].balance}`)
                } else if (list[i].getValue() === list[0].getValue()) {
                    write(`The Dealer has ${list[0].getValue()} points`)
                    write(`Player${i}, you tie`)
                    list[i].balance += list[i].bet
                    write(`Player${i}, your balance is now ${list[i].balance}`)
                }
            }
        } else {
            if (list[i].surrender === true) {
                write(`Player${i} already surrendered and lost`)
            } else (write(`Player${i} already busted`))
        }
    }
}

async function multistand(player) {
    if (player === players){
        write(`Dealer's hand: ${list[0].hand.card1} and ${list[0].hand.card2}`)
        await sleep(1)
        while (list[0].getValue() < 17) {
            newCard = cards()
            if (cardValue[newCard] === 8 || cardValue[newCard] === 11) {
                write(`The dealer draws an ${newCard}`)
                await sleep(1)
            } else {
                write(`The dealer draws a ${newCard}`)
                await sleep(1)
            }
            list[0].hand.cardsNew += cardValue[newCard]
                
            aceCheck(0, newCard)

            if (list[0].getValue() === 21) {
                await sleep(1)
                write(`The Dealer has ${list[0].getValue()} points`)
                write("He yells BlackJack!")
            } else if (list[0].getValue() < 17) {
                await sleep(1)
                write(`The Dealer has ${list[0].getValue()} points`)
            }
        }
        multiwinChecker()
        replay()
    } else {
        player += 1
        return await multiask(["s", "h", "surrender", "doubledown"], player)
    }
}

async function multihit(player){
    while (true) {
        newCard = cards()
        if (cardValue[newCard] === 8 || cardValue[newCard] === 11) {
            write(`You drew an ${newCard}`)
        } else {
            write(`You drew a ${newCard}`)
        }
        list[player].hand.cardsNew += cardValue[newCard]
        aceCheck(player, newCard)

        write(`You have ${list[player].getValue()} points`) 
        if (list[player].getValue() > 21 && player === players) {
            write("Your hand went over 21")
            write("You bust")
            write("You lose")
            write(`Your balance is now ${list[player].balance}`)
            return await multistand(player)
        } else if (list[player].getValue() > 21){
            write("You lose")
            return await multistand(player)
        } else if (list[player].doubleDown = true) {
            list[player].bet *= 2
            return await multistand(player)
        } else {
            return await multiask(["s","h"], player)
        }
    }
}

function replay(){
	gameRunning = false
	document.body.appendChild(tag)
    if (list.some(p => p.balance > 0)) {
        startBtn.style.display = "flex"
    } else {
        write("Your balance is too low to play again. Come back soon.")
        exit()
    }
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
    startBtn.removeEventListener("click", multibegin)
    startBtn.addEventListener("click", multistart)
    multistart()
}

function multiset_up() {
    tag.remove()
    full_deck()
	startBtn.style.display = "none"
    output.textContent = ""
    output.innerHTML = ""
    for (let i = 0; i <= players; i++) {
        list[i].hand.card1 = cards()
        list[i].hand.card2 = cards()
        list[i].aces = 0
        if (list[i].hand.card1 === "Ace") list[i].aces += 1
        if (list[i].hand.card2 === "Ace") list[i].aces += 1
        list[i].hand.cardsNew = 0
    }   
}

async function multistart() {
    if (gameRunning) {return}
    gameRunning = true
	multiset_up()
    for (let i = 1; i <= players; i++) {
        while (true) {
            dollars = 0
            write(`Player ${list[i].username}'s balance is $${list[i].balance}`)
            if (list[i].balance === 0) {
                write(`Player ${list[i].username} is bankrupt`)
                break
            }
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
        if (list[i].getValue() === 21 && list[0].getValue() != 21) {
            write(`Player${i} has Blackjack!!!!!`)
        } else if (list[0].getValue() && list[i].getValue() === 21) {
            write(`The dealer shows that his second card is a ${list[0].hand.card2}`)
            write("Blackjack!!!!!!!!")
            write("You tie")
            list[i].balance += list[i].bet
            replay()
        }
    }

    if (cardValue[list[0].hand.card1] === 8 || cardValue[list[0].hand.card1] === 11) {
        write(`The dealer's first card is an ${list[0].hand.card1}`)
        await sleep(1)
    } else { 
        write(`The dealer's first card is a ${list[0].hand.card1}`)
        await sleep(1)
    }
    if (dealer === 21 && list[i].getValue() != 21) {
        multiwinChecker()
    }

    return await multiask(["s","h", "surrender", "doubledown"], 1)
}






async function ask(allowed) {
    while (true) {
        write([1, `type ${allowed[0]} or ${allowed[1]} and press submit`])
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