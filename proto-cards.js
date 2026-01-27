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
let dHand
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

function formatOptions(arr) {
    if (arr.length === 1) return arr[0]
    if (arr.length === 2) return arr.join(" or ")
    return arr.slice(0, -1).join(", ") + ", or " + arr.at(-1)
}

async function ask(allowed, player, name) {
    while (true) {
        write([1, `${name}, type ${formatOptions(allowed)} and press submit: `])
        
        choice = (await returnElement()).trim().toLowerCase()  
        
        if (choice === "s") {
            write(choice)
            await sleep(1)
            if (name.includes("_2")) {
                return await stand(player, true)
            } else {
                return await stand(player)
            }
        } else if (choice === "h") {
            write(choice)
            await sleep(1)
            if (name.includes("_2")) {
                return await hit(player, true)
            } else {
                return await hit(player)
            }
        } else if (allowed.includes(choice) && choice === "surrender") {
            write(choice)
            await sleep(1)
            list[player].surrender = true
            list[player].balance -= list[player].bet / 2
            return await stand(player)
        } else if (allowed.includes("doubledown") && choice === "doubledown") {
            write(choice)
            await sleep(1)
            if (list[player].balance < list[player].bet * 2) {
                write("Insufficient funds to double down")
                continue
            }
            return await dDown(player, name)
        } else if (allowed.includes("split") && choice === "split") {
            write(choice)
            await sleep(1)
            if (list[player].balance < list[player].bet * 2) {
                write("Insufficient funds to double down")
                continue
            }
            return await split(player)
        } else {
            write("invalid input, try again")
        }
    }
}

async function bet() {
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

function aceCheck(player, card, split) {
    if (card === "Ace") {
        if (split === true) {
            list[player].split.aces += 1
            return
        } else if (split === false) {
            list[player].aces += 1
            return
        }
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
        split: undefined,
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

function check(player, name, hand) {
    if (dHand > 21 && hand <= 21) {
        write(`${name}'s hand wins`)
        player.balance += player.bet  
        write(`${player.username}, your balance is now ${player.balance}`)
    } else if (dHand >= 17) {
        if (hand > dHand) {
            write(`${name}'s handwins`)
            player.balance += player.bet  
        } else if (hand < dHand) {
            write(`${name}'s hand loses`)
            player.balance -= player.bet
        } else {
            write(`${name}'s hand ties`)
        }
        write(`${player.username}, your balance is now ${player.balance}`)
    } 
    
}

function winChecker(){
    dHand = list[0].getValue()
    write(`The Dealer has ${dHand} points`)
    for (let i = 1; i <= players; i++) {
        if (list[i].split === undefined) {
            if (list[i].getValue() <= 21 && list[i].surrender === false) {
                check(list[i], list[i].username, list[i].getValue())
            } else if (list[i].surrender === true) {
                write(`Player${i} already surrendered and lost`)
            } else (write(`Player${i} already busted`))
        } else {
            if (list[i].getValue() <= 21 || list[i].split.getValue() <= 21) {
                check(list[i], list[i].username, list[i].getValue())
                check(list[i], list[i].split.username, list[i].split.getValue())
            } else (write(`Player${i} already busted`))
        }
    }
}

async function dDown(player, name) {
    if (name.includes("_2")) {
        list[player].split.bet *= 2
        list[player].split.doubleDown = true
        return await hit(player, true)
    } else {
        list[player].bet *= 2
        list[player].doubleDown = true
        return await hit(player)
    }
}

async function split(player) {
    list[player].split = playerFactory(`${list[player].username}_2`)
    list[player].split.hand.card1 = list[player].hand.card2
    list[player].hand.card2 = 0
    list[player].split.hand.card2 = 0
    list[player].aces = 0
    list[player].split.aces = 0
    if (list[player].hand.card1 === "Ace") list[player].aces += 1
    if (list[player].split.hand.card1 === "Ace") list[player].split.aces += 1
    if (list[player].username.includes("_2")) {
        return await hit(player, true)
    } else {
        return await hit(player)
    }
}

async function stand(player, split) {
    if (player === players && list[player].split === undefined || player === players && list[player].split !== undefined && split === true) {
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
            aceCheck(0, newCard, false)
            list[0].hand.cardsNew += cardValue[newCard]
            if (list[0].getValue() === 21) {
                await sleep(1)
                write(`The Dealer has ${list[0].getValue()} points`)
                write("He yells BlackJack!")
            } else if (list[0].getValue() < 17) {
                await sleep(1)
                write(`The Dealer has ${list[0].getValue()} points`)
            }
        }
        winChecker()
        replay()
    } else {
        if (split === undefined && list[player].split === undefined) {
            player += 1
            if (list[player].hand.card1 === list[player].hand.card2) {
                return await ask(["s", "h", "surrender", "doubledown", "split"], player, list[player].username)
            } else {
                return await ask(["s", "h", "surrender", "doubledown"], player, list[player].username)
            }
        } else if (split === undefined && list[player].split !== undefined) {
            return await hit(player, true)
        } else {
            player += 1
            if (list[player].hand.card1 === list[player].hand.card2) {
                return await ask(["s", "h", "surrender", "doubledown", "split"], player, list[player].username)
            } else {
                return await ask(["s", "h", "surrender", "doubledown"], player, list[player].username)
            }
        }
    }
}

async function hitCheck(player, user, split) {
    let args
    if (cardValue[newCard] === 8 || cardValue[newCard] === 11) {
        write(`${user.username}, you drew an ${newCard}`)
    } else {
        write(`${user.username}, you drew a ${newCard}`)
    }
    if (user.hand.card2 === 0) {
        user.hand.card2 = cardValue[newCard]
        args = [["s","h", "doubledown"], player, user.username]
    } else {
        user.hand.cardsNew += cardValue[newCard]
        args = [["s","h"], player, user.username]
    }
    if (split === true) {
        aceCheck(player, newCard, true)
    } else {
        aceCheck(player, newCard, false)
    }
    if (user.getValue() > 21) {
        write("Your hand went over 21")
        return await stand(player, split)
    } else if (user.doubleDown === true) {
        write(`You have ${user.getValue()} points`) 
        return await stand(player, split)
    } else {
        write(`You have ${user.getValue()} points`) 
        return await ask(...args)
    }
}

async function hit(player, split){
    newCard = cards()
    if (split === true) {
        hitCheck(player, list[player].split, true)
    } else {
        hitCheck(player, list[player], undefined)
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

async function begin() {
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
    startBtn.addEventListener("click", start)
    start()
}

function set_up() {
    tag.remove()
    full_deck()
	startBtn.style.display = "none"
    output.textContent = ""
    output.innerHTML = ""
    for (let i = 0; i <= players; i++) {
        list[i].surrender = false
        list[i].doubleDown = false
        list[i].split = undefined
        list[i].hand.card1 = cards()
        list[i].hand.card2 = cards()
        list[i].aces = 0
        if (list[i].hand.card1 === "Ace") list[i].aces += 1
        if (list[i].hand.card2 === "Ace") list[i].aces += 1
        list[i].hand.cardsNew = 0
    }   
}

async function start() {
    if (gameRunning) {return}
    gameRunning = true
	set_up()
    for (let i = 1; i <= players; i++) {
        while (true) {
            dollars = 0
            write(`Player ${list[i].username}'s balance is $${list[i].balance}`)
            if (list[i].balance === 0) {
                write(`Player ${list[i].username} is bankrupt`)
                break
            }
            write([1, "Place your bet: "])
            dollars = await bet(); 
            write(dollars)
            if (dollars > list[i].balance) {
                await sleep(0.5)
                write(`You spent $${dollars}`)
                write("Insufficient funds")
                write("")
                continue
            }
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
        if (list[i].getValue() === 21) {
            write(`Player${i} has Blackjack!!!!!`)
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
        winChecker()
    }

    if (list[1].hand.card1 === list[1].hand.card2) {
        return await ask(["s", "h", "surrender", "doubledown", "split"], 1, list[1].username)
    } else {
        return await ask(["s", "h", "surrender", "doubledown"], 1, list[1].username)
    }
}
startBtn.className = "start-btn"
startBtn.addEventListener("click", begin)