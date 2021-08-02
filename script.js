const dino = document.querySelector('.dino')
let cactus = document.querySelectorAll('.cactus')
const game = document.querySelector('.game')
const pscore = document.querySelector('.score.current')
const precord = document.querySelector('.score.record')
const sizes = [30,60,90]
const minBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--min-bottom').replace('px','').replace(' ',''))
let animation = 1
let duration = 500
let canJump = true
let isPlaying = false
let cactusSeconds = 2
let spawnRate = 700
let gameOver = false
let timer
let score = 0
let record = localStorage.getItem('record') || 0
precord.innerText = `Record: ${record}`

function jump(){
    dino.style.animation = `jump${animation} ${duration}ms ease-in-out`
    if(animation == 1) animation = 2
    else animation = 1
}

document.addEventListener('keydown', (e) => {
    if(e.code != 'Space' || gameOver) return
    if(canJump){
        canJump = false
        jump()
        setTimeout(() => {
            canJump = true
        },duration)
    }
    if(!isPlaying){
        isPlaying = true
        setTimeout(() => {
            startSpaw()
        },1000)
        startCounter()
    }
})

function startCounter(){
    timer = setInterval(() => {
        score++
        pscore.innerText = score
    },100)
}

function startSpaw(){
    setInterval(() => {
        if(gameOver) return
        let newCactus = document.createElement('div')
        newCactus.classList.add('cactus')
        let random = Math.floor(Math.random() * 4)
        newCactus.style = `animation: moveLeft ${cactusSeconds}s linear forwards; --cactus-width: ${sizes[random]}px;`
        game.appendChild(newCactus)
        setTimeout(() => {
            if(!gameOver) newCactus.remove()
        },cactusSeconds * 1000 + 100)
    },spawnRate)
}

let collisionCheck = setInterval(() => {
    cactus = document.querySelectorAll('.cactus')
    let dinoBottom = game.clientHeight - dino.offsetTop - dino.clientHeight
    cactus.forEach(e => {
        if(e.offsetLeft < 90 && e.offsetLeft > 60 && dinoBottom < 80){
            console.log('game over')
            cactus.forEach(element => {
                let width = getComputedStyle(element).getPropertyValue('--cactus-width')
                element.style = `--cactus-width:${width};right: unset;left:${element.offsetLeft}px`
                gameOver = true
                clearInterval(collisionCheck)
                clearInterval(timer)
                if(score == 0 || score > record){
                    record = score
                    precord.innerText = `Record: ${record}`
                    localStorage.setItem("record", record)
                }
            })
        }
    })
},10)