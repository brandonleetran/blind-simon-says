let gameStarted = false
let intervalId; 
console.log("Welcome to Blind Simon Says!")

const startButton = document.querySelector("#start-btn")

const focusableElements = document.querySelectorAll('input, button, select, textarea, a[href], area[href], object, embed, [tabindex]');
const filteredFocusableElements = Array.from(focusableElements).filter(element => element.getAttribute('tabindex') !== '-1');

if (filteredFocusableElements.length > 0) {
  // Set focus on the first focusable element
  filteredFocusableElements[0].focus();
}


// startButton.addEventListener("focus", () => {
//     startButton.style.padding = "25px"
//     // Change the background color
//     console.log(intervalId)
//     if (!intervalId) {
//         intervalId = setInterval(() => {
//             let randomColor = ["red", "yellow", "green", "blue"][Math.floor(Math.random() * 4)]
//             startButton.style.background = randomColor
//         }, 500)
//     }
//     console.log(intervalId)
// })

// startButton.addEventListener("blur", () => {
//     startButton.style.padding = "20px"
//     clearInterval(intervalId);
//     intervalId = undefined

//     // Element has lost focus
//     if (!this.gameStarted) startButton.style.background = "white"
//     else startButton.style.background = "black"
// });

startButton.addEventListener("click", () => {
    this.gameStarted = true
    console.log(gameStarted)
    document.body.style.background = "white"
    // console.log("Starting Blind Simons Says...")
    // const simonSays = new SimonSays()
    // simonSays.startGame()
})

class SimonSays {
    constructor() {
        this.userArr = []
        this.simonArr = []
        this.colors = ["red", "yellow", "green", "blue"]
        this.isWrong = false
        this.pace = 1
        this.level = 1
    }

    startGame = async () => {
        while(!this.isWrong) {
            // simon's turn
            await this.simonsTurn()
    
            // user's turn
            await this.usersTurn()
        }
    }

    // ---------- SIMONS TURN ----------
    simonsTurn = async () => {
        await new Promise(resolve => {
            // get a random color within the colors array
            let randomColor = this.colors[Math.floor(Math.random() * this.colors.length)]

            // reset focus after each turn
            document.querySelector("#red").focus()

            // add random color to the sequence
            this.simonArr.push(randomColor)
            let index = 0
            console.log("Simon says: ")
            const intervalId = setInterval(() => {
                if (index < this.simonArr.length) {
                    console.log(this.simonArr[index])
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
        await new Promise(async (resolve) => {
        // Initialization
        document.querySelector("#red").focus();
        console.log("User says: ");
        this.emptyUserArr();
    
        const handleKeyDown = (event) => {
            if (event.keyCode === 32) {
            const color = event.target.id;
            // console.log(`Space key pressed on the #${color} element`);
            this.addUserArr(color);
    
                // TODO: Refactor this
                if (this.simonArr.length === this.userArr.length) {
                    if (this.compareUserSimonArr()) {
                        this.levelUp();
                        this.removeEventListeners(handleKeyDown);
                        resolve();
                    }
                    else this.isWrong = true
                }
                else {
                     if (this.userArr[this.userArr.length - 1] === this.simonArr[this.userArr.length - 1]) {
                        console.log("Correct, keep going!")
                     }
                     else this.isWrong = true
                }
            }
        };
    
        this.addEventListeners(handleKeyDown);
        }).then(() => {
        console.log(this.userArr);
        });
    };


    // ---------- EVENT HANDLER FUNCTIONS ----------
    addEventListeners = (handleKeyDown) => {
        this.colors.forEach((color) => {
        const element = document.querySelector(`#${color}`);
        element.addEventListener("keydown", handleKeyDown);
        });
    };
    
    removeEventListeners = (handleKeyDown) => {
        this.colors.forEach((color) => {
        const element = document.querySelector(`#${color}`);
        element.removeEventListener("keydown", handleKeyDown);
        });
    };
  

    // ---------- PURE HELPER FUNCTIONS ----------
    addUserArr = (color) => this.userArr.push(color)

    emptyUserArr = () => this.userArr.length = 0
    
    compareUserSimonArr = () => this.simonArr.every((value, index) => value === this.userArr[index])

    levelUp = () => this.level++

    endGame = () => this.simonSequenceArr = 0
}

