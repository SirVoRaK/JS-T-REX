const dino = document.querySelector('.dino')
let cactus = document.querySelectorAll('.cactus')
const game = document.querySelector('.game')
const pscore = document.querySelector('.score.current')
const precord = document.querySelector('.score.record')
const sizes = [40,70,110]
const minBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--min-bottom').replace('px','').replace(' ',''))
const startBtn = document.querySelector('button.start')
const pressSpace = document.querySelector('p.press-space')
let animation = 1
let duration = 550
let canJump = true
let isPlaying = false
let cactusSeconds = 1.8
let spawnRate = 700
let gameOver = false
let timer
let score = 0
let record = localStorage.getItem('record') || 0
precord.innerText = `Record: ${record}`
let walkInterval
let canStart = false

startBtn.onclick = () => {
    startBtn.style.display = 'none'
    canStart = true
    pressSpace.style.display = 'block'
}

function jump(){
    dino.style.animation = `jump${animation} ${duration}ms ease-in-out`
    if(animation == 1) animation = 2
    else animation = 1
}

document.addEventListener('keydown', (e) => {
    if(e.code != 'Space' || gameOver || !canStart) return
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
        dino.classList.add('walk2')
        startWalkAnimation()
        pressSpace.style.display = 'none'
    }
})

document.addEventListener('touchstart', (e) => {
    if(gameOver || !canStart) return
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
        dino.classList.add('walk2')
        startWalkAnimation()
        pressSpace.style.display = 'none'

    }
}, false)

function startWalkAnimation(){
    let current = 1
    walkInterval = setInterval(() => {
        if(current === 1){
            dino.classList.replace('walk2','walk1')
            current = 2
        }else{
            dino.classList.replace('walk1','walk2')
            current = 1
        }
    },175)
}

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
        if(random == 1){
            newCactus.style = `animation: moveLeft ${cactusSeconds + .1}s linear forwards; --cactus-width: ${sizes[random]}px;`
        }
        else if(random == 2){
            newCactus.style = `animation: moveLeft ${cactusSeconds + .2}s linear forwards; --cactus-width: ${sizes[random]}px;`
        }
        else{
            newCactus.style = `animation: moveLeft ${cactusSeconds}s linear forwards; --cactus-width: ${sizes[random]}px;`
        }
        game.appendChild(newCactus)
        setTimeout(() => {
            if(!gameOver) newCactus.remove()
        },cactusSeconds * 1000 + 500)
    },spawnRate)
}

let collisionCheck = setInterval(() => {
    cactus = document.querySelectorAll('.cactus')
    let dinoRect = dino.getBoundingClientRect()
    cactus.forEach(e => {
        let cactusRect = e.getBoundingClientRect()
        let ignore = 20
        if(!(dinoRect.right < cactusRect.left + ignore || 
            dinoRect.left + ignore > cactusRect.right || 
            dinoRect.bottom < cactusRect.top + ignore || 
            dinoRect.top + ignore > cactusRect.bottom)){
                
                console.log('game over')
                clearInterval(walkInterval)
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
    /* let dinoBottom = game.clientHeight - dino.offsetTop - dino.clientHeight
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
    }) */
},10)