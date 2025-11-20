function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms*1000));
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
        if (!Number.isNaN(choice)) {
            return choice
        }
        write(" ")
        write("invalid input, try again")
        write([1, `${col} chips – $${a}: `])
    }
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

const output = document.getElementById("output")
const startBtn = document.getElementById("start-btn")
const box = document.getElementById("container2")
const request = document.createElement("input")
const submitBtn = document.createElement("button")
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
    let num = Math.floor(Math.random() * deck.length)
    return deck[num]
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

function write(msg) {
    msg[0] === 1 ? output.textContent += msg[1] : output.textContent += msg + "\n"
    output.scrollTop = output.scrollHeight;
}

function winChecker(){
    if (dealer > 21) {
        write(`The dealer has ${dealer} points`)
        write("The dealer's hand is over 21")
        write("You win")
        balance += dollars * 2
    } else if (dealer >= 17) {
        if (value > dealer) {
            write(`The Dealer has ${dealer} points`)
            write("You win")
            balance += dollars * 2
        } else if (value < dealer) {
            write(`The Dealer has ${dealer} points`)
            write("You lose")
        } else if (value == dealer) {
            write(`The Dealer has ${dealer} points`)
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

function replay(){
	gameRunning = false
    tag.href = "index.html"
	quit.id = "quit"
	quit.textContent = "Quit Game"
    tag.appendChild(quit)
	document.body.appendChild(tag)
    
    if (balance > 0) {
        startBtn.style.display = "flex"
    } else {
        write("Your balance is too low to play again. Come back soon.")
        exit()
    }
}

async function start() {
    if (gameRunning) {return}
    gameRunning = true
	tag.remove()
	startBtn.style.display = "none"
    startBtn.className = "restart-btn"
    startBtn.textContent = "play again"
    output.className = "display"
    request.remove()
    submitBtn.remove()
    box.appendChild(request)
    request.id = "txt"
    request.type = "text"
    request.placeholder = "Type something here"
    box.appendChild(submitBtn)
    submitBtn.id = "submit"
	submitBtn.textContent = "submit"
    output.textContent = ""
    output.innerHTML = ""
    full_deck()
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
startBtn.addEventListener("click", start)
