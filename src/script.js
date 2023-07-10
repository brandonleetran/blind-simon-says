// const focusableElements = document.querySelectorAll('input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]:not([disabled]), area[href]:not([disabled]), object:not([disabled]), embed:not([disabled]), [tabindex]:not([disabled])')
// const filteredFocusableElements = Array.from(focusableElements).filter(element => element.getAttribute('tabindex') !== '-1')

// if (filteredFocusableElements.length > 0) {
//   // Set focus on the first focusable element
//   filteredFocusableElements[0].focus()
// }

class SimonSays {
    constructor() {
        this.userArr = []
        this.simonArr = []
        this.cookieName = "score"
        this.colors = ["red", "yellow", "green", "blue"]
        this.isWrong = false
        this.pace = 1
        this.level = 1
        this.currentScore = 0
    }

    startGame = async () => {
        while(!this.isWrong) {
            // simon's turn
            await this.simonsTurn()

            // reset the focus after each turn
            document.getElementById("red").focus()
    
            // user's turn
            await this.usersTurn()

            // reset the focus after each turn
            document.getElementById("red").focus()
        }

        // if we beat our high score, update high score
        if (this.cookieExists(this.cookieName)) {
            const highScore = Number(this.getCookie(this.cookieName))
            if (highScore < this.currentScore) this.setCookie("score", this.currentScore)
        }
        else
        {
            this.setCookie("score", this.currentScore)
        }
    }

    // ---------- SIMONS TURN ----------
    simonsTurn = async () => {
        await new Promise(resolve => {

            document.querySelectorAll(".game-dot").forEach(elem => elem.style.background = "black")

            // get a random color within the colors array
            let randomColor = this.colors[Math.floor(Math.random() * this.colors.length)]

            // add random color to the sequence
            this.simonArr.push(randomColor)
            let index = 0
            console.log("Simon says: ")
            const intervalId = setInterval(() => {

                if (index < this.simonArr.length) {
                    let color = this.simonArr[index]
                    console.log(color)
                    document.getElementById(`${color}`).focus()
                    index++
                } else {
                    clearInterval(intervalId)
                    resolve()
                }

            }, 1000)
        })
    }

    // ---------- USERS TURN ----------
    usersTurn = async () => {
        await new Promise(async (resolve, reject) => {
    
            // Initialization
            document.querySelectorAll(".game-dot").forEach(elem => elem.style.background = "white")
            console.log("User says: ")
            this.emptyUserArr()

            const handleKeyDown = (event) => {
                const color = event.target.id
                console.log(color)
                
                // add the users choice to the user array
                this.addUserArr(color)

                // then, compare the user array and simon array
                if (this.userArr[this.userArr.length - 1] !== this.simonArr[this.userArr.length - 1]) {
                    this.isWrong = true
                    reject("Wrong! End game")
                }
                
                // only resolve when the userArr is the same as the simonArr
                // else, keep listening to user input
                if (this.userArr.length === this.simonArr.length) {
                    this.score()
                    document.getElementById("score").innerHTML = this.currentScore
                    this.removeEventListeners(handleKeyDown)
                    resolve()
                }
            }
    
        this.addEventListeners(handleKeyDown)
        }).catch(reject => console.log(reject))
    }


    // ---------- EVENT HANDLER FUNCTIONS ----------
    addEventListeners = (handleKeyDown) => {
        this.colors.forEach((color) => {
            const element = document.querySelector(`#${color}`)
            element.addEventListener("keydown", (event) => {
                if (event.keyCode === 65) {
                    handleKeyDown(event)
                }
            })
            element.addEventListener("click", handleKeyDown)
        })
    }
    
    removeEventListeners = (handleKeyDown) => {
        this.colors.forEach((color) => {
        const element = document.querySelector(`#${color}`)
        element.removeEventListener("keydown", handleKeyDown)
        element.removeEventListener("click", handleKeyDown)
        })
    }

    // ---------- COOKIE FUNCTIONS  ----------
    setCookie = (key, value) => {
        if (navigator.cookieEnabled) {
            console.log(`New high score: ${value}`)
            document.cookie = `${key}=${value}`
        }
    }

    getCookie = (key) => {
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

    cookieExists = (key) => {
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
    
    // ---------- PURE HELPER FUNCTIONS ----------
    addUserArr = (color) => this.userArr.push(color)

    emptyUserArr = () => this.userArr.length = 0
    
    score = () => this.currentScore++

    endGame = () => this.simonSequenceArr = 0
}

// ------------------- START OF SIMON SAYS -------------------
console.log("Welcome to Accessible Simon Says!")
const simonSays = new SimonSays()

setTimeout(() => {
    simonSays.startGame()
}, 2000)

// ------------------- index.html -------------------
if (document.getElementById("high-score")) {
    console.log(document.getElementById("high-score"))
}