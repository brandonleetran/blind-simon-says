const colors = ["red", "yellow", "green", "blue"]
const cookieName = "score"
const userArr = []
const simonArr = []
let isWrong = false
let currentScore = 0

// ---------- SIMONS TURN ----------
const simonsTurn = async () => {
    return await new Promise(resolve => {
        // get a random color within the colors array
        let randomColor = colors[Math.floor(Math.random() * colors.length)]

        // add random color to the sequence
        simonArr.push(randomColor)

        let index = 0
        console.log("Simon says: ")
        const intervalId = setInterval(() => {

            const color = document.getElementById(`${simonArr[index]}`)

            if (color != null) {
                color.classList.add("color-active")

                console.log(color.id)
                
                // Schedule a timeout to remove the "color-active" class after 1 second
                setTimeout(() => {
                    color.classList.remove("color-active");
                }, 1000)
            }

            if (index === simonArr.length - 1) {
                clearInterval(intervalId)
                resolve()
            }
            index++

        }, 2000)
    })
}

// ---------- USERS TURN ----------
const usersTurn = async () => {
    return await new Promise(async (resolve, reject) => {

        // Initialization
        console.log("User says: ")
        emptyUserArr()

        const handleKeyDown = (event) => {
            const color = event.target.id

            console.log(color)
            
            // add the users choice to the user array
            addUserArr(color)

            // then, compare the user array and simon array
            if (userArr[userArr.length - 1] !== simonArr[userArr.length - 1]) {
                isWrong = true
                reject("End game")
            }
            
            // only resolve when the userArr is the same as the simonArr
            // else, keep listening to user input
            if (userArr.length === simonArr.length) {
                if (!isWrong) score()
                document.getElementById("score").innerHTML = currentScore
                removeEventListeners(handleKeyDown)
                resolve()
            }
        }

        addEventListeners(handleKeyDown) 
    }).catch(reject => console.log(reject))
}

// ---------- START GAME ----------
const startGame = async() => {
    
    // we must await each turn or else it will execute synchronously 
    while(!isWrong) {
        // simon's turn (returns a resolved promise.. this function will always resolve no matter what!)
        await simonsTurn()

        // user's turn (returns a resolved/rejected promise)
        await usersTurn()
    }
}

// ---------- END GAME ----------
const endGame = () => {
    const dialog = document.querySelector("dialog")
       dialog.firstElementChild.innerHTML = `Game score: ${currentScore}`
       dialog.showModal()

       // if we beat our high score, update high score
       if (cookieExists(cookieName)) {
           const highScore = Number(getCookie(cookieName))
           if (highScore < currentScore) setCookie("score", currentScore)
       }
       else
       {
           setCookie("score", currentScore)
       }
}

// ---------- HELPER FUNCTIONS ----------
const addUserArr = (color) => userArr.push(color)

const emptyUserArr = () => userArr.length = 0
    
const score = () => currentScore++

// ---------- EVENT HANDLER FUNCTIONS ----------
const addEventListeners = (handleKeyDown) => {
    colors.forEach((color) => {
        const element = document.querySelector(`#${color}`)
        element.addEventListener("keydown", (event) => {
            if (event.keyCode === 65) {
                handleKeyDown(event)
            }
        })
        element.addEventListener("click", handleKeyDown)
    })
}

const removeEventListeners = (handleKeyDown) => {
    colors.forEach((color) => {
        const element = document.querySelector(`#${color}`)
        element.removeEventListener("keydown", handleKeyDown)
        element.removeEventListener("click", handleKeyDown)
    })
}

// ---------- COOKIE FUNCTIONS  ----------
const setCookie = (key, value) => {
    if (navigator.cookieEnabled) {
        console.log(`New high score: ${value}`)
        document.cookie = `${key}=${value}`
    }
}

const getCookie = (key) => {
    const arr = document.cookie.split("; ")
    let value = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes(key)) {
            value = arr[i].substring(key.length + 1)
            break
        }
    }

    return value 
}

const cookieExists = (key) => {
    const cookie = document.cookie

    if (cookie.length === 0)  return false

    const arr = document.cookie.split("; ")
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes(key)) {
            return true
        }
    }

    return false
}

// ------------------- START OF SIMON SAYS -------------------
console.log("Welcome to Accessible Simon Says!")
startGame()