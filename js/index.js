const canvas = document.querySelector('canvas')
const levelVal = document.querySelector('#levelVal')
const c = canvas.getContext('2d')


canvas.width = innerWidth
canvas.height = innerHeight

let level = 1
let highScore = 1
let startTime = Date.now()
let player = new Player()
let projectiles = []
let asteroids = []
let particles = []
let astCount = 4
let hit = false
let music = true
let coolDown = 15000
let tempCoolDown = coolDown
//prescreen appears so that user inputs into browser and music can start
let preScreen = true
let game = {
    over: false,
    active: true
}
let playerSprite = './img/original_ship.png'

//list of songs
var songs = [
    './audio/Yolo_TheStrokes.mp3',
    './audio/Everlong_FooFighters.mp3',
    './audio/HardToExplain_TheStrokes.mp3',
    './audio/RoomOnFire_TheStrokes.mp3'
]

//function that initializes game
function init(){

    level = 1
    startTime = Date.now()
    player = new Player(playerSprite)
    projectiles = []
    asteroids = []
    particles = []
    hit = false
    coolDown = 15000
    tempCoolDown = coolDown
    astCount = 4
    game = {
        over: false,
        active: true
    }
    levelVal.innerHTML = level
    //background stars
    for(let i = 0; i < 1000; i++) {
        let amount = Math.random() * 10;
        particles.push(new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            }, 
            velocity: {
                x: -0.5,
                y : 0
            },
            size: {
                width: amount,
                height: amount
            },
            color : '#9CD2EC',
            fade: false,
            star: true,
            type: Math.random() * 3,    //randomise, if > 2 its a big star
            opacity: 0.7

        }))
    }

    //show level
    document.querySelector('#showLevel').innerHTML = 'LEVEL: '+ level
        document.querySelector('#showLevel').style.display = 'block'
        setTimeout(()=>{
            document.querySelector('#showLevel').style.display = 'none'
        },2000)
}


//function to handle input from keyboard
function handleKeyInput(event) {
    if (game.over) return
    const { key, type, shiftKey} = event
    const isKeyDown = type === 'keydown' ? true : false

    
    if (key === 'a' || key === 'ArrowLeft'){
        player.rotatingLeft = isKeyDown
    } 
    if (key === 'd' || key === 'ArrowRight'){
        player.rotatingRight = isKeyDown
    } 
    if (key === 'w' || key === 'ArrowUp'){
        player.engineOn = isKeyDown
    } 
    if (key === ' '){
        player.shooting = isKeyDown
        //console.log(projectiles)
    } 
    if (key === 's' || key === 'ArrowDown'){
        player.reverse = isKeyDown
    }
    // if (key === 'Shift'){
    //     player.boost = isKeyDown
    // }
    console.log(event)
}



//function to create particles
function createParticles({object, color, fade, opacity, star, type }){
    for(let i = 0; i < 15; i++){
        let amount = Math.random() * 10
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width/2,
                y: object.position.y + object.height/2
            }, 
            velocity: {
                x: (Math.random() - .5) * 2,
                y : (Math.random() - .5) * 2
            },
            size: {
                width: amount,
                height: amount
            },
            color : color || '#8e99a9',
            fade: true,
            star: false,
            type: 0,
            opacity: 1
        }))
    }
}

//consistent frame rate, 60fps
let fps = 60
let fpsInterval = 1000 / fps

let msPrev = window.performance.now()



//main animation function
function animate(){
    if (!game.active) return
    
    requestAnimationFrame(animate)

    //make sure code runs 60 fps no matter what system, since requestAnimation function varies per system
    const  msNow = window.performance.now()
    const elapsed = msNow - msPrev
    if (elapsed < fpsInterval) return
    msPrev = msNow - (elapsed % fpsInterval)



    //continue to next level every 20s
    //use date.now to tell how much time has gone by
    const nowTime = Date.now()
    const elapTime = nowTime - startTime
    console.log('Time: '+elapTime+'ms')

    if(level%2 == 0 && newLevel){
        newLevel = false
        if(coolDown<8000) return
        coolDown-=2000
        astCount+= 2
    }

    //if 20 seconds have elapsed, next level
    //stop updating if hit
    if(!hit){
        if (elapTime > tempCoolDown){
            level++
            newLevel = true
            tempCoolDown = coolDown
            levelVal.innerHTML = level
            startTime = Date.now()
    
            document.querySelector('#showLevel').innerHTML = 'LEVEL: '+ level
            document.querySelector('#showLevel').style.display = 'block'
            setTimeout(()=>{
                document.querySelector('#showLevel').style.display = 'none'
            },2000)
        }
        document.querySelector('#showSeconds').innerHTML = Math.floor(((tempCoolDown/1000)+1) - (elapTime/1000)) + 's'
    }
    


    

    // c.fillStyle = '#24162F'
    // switch(level){
    //     case 1:
    //         c.fillStyle = '#2c0c52'
    //         break
    //     case 2:
    //         c.fillStyle = '#39106A'
    //         break
    //     case 3:
    //         c.fillStyle = '#42137C'
    //         break
    //     case 4:
    //         c.fillStyle = '#7B2869'
    //         break
    //     default:
    //         c.fillStyle = '#42137C'
    // }

    c.fillStyle = '#2c0c52'
    
    c.fillRect(0, 0, canvas.width, canvas.height)
    



    //when stars go off screen draw new ones 
    particles.forEach((particle, i) =>{
        if (particle.position.x + particle.size.width < 0){
            particle.position.x = canvas.width + particle.size.width
            particle.position.y = Math.random() * canvas.height
        }

        //when opacity is gone remove stars otherwise update the stars
        if (particle.opacity <= 0){
            setTimeout(()=>{
                particles.splice(i, 1)
            }, 0) 
        } else{
            particle.update()
        }  
    })
    

    //garbage collecting for projectiles
    projectiles.forEach((projectile, index)=> {
        if (projectile.position.y + projectile.radius < 0){
            projectiles.splice(index, 1)
        }else if (projectile.position.y > canvas.height){
            projectiles.splice(index, 1)
        }else if (projectile.position.x + projectile.radius < 0){
            projectiles.splice(index, 1)
        }else if (projectile.position.x > canvas.width){
            projectiles.splice(index, 1)
        }
        else{
            projectile.update()
        }
    })  
    
    
    
    //garbage collecting for asteroids
    asteroids.forEach((asteroid, i)=>{
        if (asteroid.image){
            //variables for asteroid borders
            const ARBorder = asteroid.position.x + asteroid.width
            const ALBorder = asteroid.position.x
            const ABBorder = asteroid.position.y + asteroid.height
            const ATBorder = asteroid.position.y

            //variables for player borders
            const PRBorder = player.position.x + player.width
            const PLBorder = player.position.x
            const PBBorder = player.position.y + player.height
            const PTBorder = player.position.y

            //if asteroid goes off screen delete it
            if(ALBorder > canvas.width || ATBorder > canvas.height){
                setTimeout(()=>{
                    asteroids.splice(i,1)
                }, 0) 
            }else{
                asteroid.update()
            }
            
            //player collision with asteroids
            if (ARBorder >= PLBorder && ALBorder <= PRBorder &&
                ABBorder >= PTBorder && ATBorder <= PBBorder){
                    if(player.boost && player.engineOn){
                        createParticles({object: asteroid, color: '#8e99a9', fade : true})
                        setTimeout(() =>{
                            console.log('ram hit!')
                            asteroids.splice(i,1)
                        }, 0)
                    }else{
                        // console.log('player hit!')
                        // console.log('you lose!')
                        
                        player.opacity = 0
                        game.over = true
                        createParticles({object: player, color: 'red', fade: true})
                        if (level > highScore) highScore = level;
                        
                        //ensure game only detects colllision once instead of multiple times in loop
                        if (!hit){
                            //play sounds
                            audio.bombSound.play()
                            audio.gameOver.play()

                            //set game not active and display restart screen after 2 seconds
                            setTimeout(()=>{
                                console.log("player hit game over!")
                                game.active = false
                                document.querySelector('#restartScreen').style.display = 'flex'
                                document.querySelector('.currentScoreEl').innerHTML = level
                                document.querySelector('.highScoreEl').innerHTML = highScore
                            }, 2000)

                            hit = true

                        }  
                    }          
            }
    
            //collision detection for projectiles and ateroids, projectile hits asteroid
            projectiles.forEach((projectile, j) =>{
                if(projectile.position.x <= ARBorder && 
                    projectile.position.x  >= ALBorder && 
                    projectile.position.y  >= ATBorder && 
                    projectile.position.y  <= ABBorder){

                        createParticles({object: asteroid, color: '#8e99a9', fade : true})
                        setTimeout(() =>{
                            //console.log('hit!')
                            audio.bombSound.play()
                            asteroids.splice(i,1)
                            projectiles.splice(j, 1)
                            console.log('temp cool down: '+ tempCoolDown)
                            tempCoolDown-=1000
                        }, 0)
                        document.querySelector('#minus1Sec').style.display = 'flex'
                        setTimeout(()=>{
                            document.querySelector('#minus1Sec').style.display = 'none'
                        }, 500)
                    }

            })
        }

    })


    //min number of asteroids
    if (asteroids.length < astCount){
        //console.log(asteroids)
        asteroids.push(new Asteroid())
    }


    //unlock new sprites
    if(highScore >= 3){
        document.querySelector('#kbLock').style.display = 'none'
    }
  
    if(highScore >= 6){
        document.querySelector('#srLock').style.display = 'none'
    }

    if(highScore >= 7){
        document.querySelector('#dmLock').style.display = 'none'
    }
        
    if(highScore >= 8){
        document.querySelector('#bLock').style.display = 'none'
    }
        

        


    //as long as game is not over mover player
    if (!game.over){
        player.movePlayer()
    }

}//END OF ANIMATE


document.addEventListener('keydown', handleKeyInput);
document.addEventListener('keyup', handleKeyInput);





//if prescreen is on and key is pressed display start screen
document.body.addEventListener('keydown',(e)=>{
    if (preScreen){
        document.querySelector('#preScreen').style.display = 'none'
        document.querySelector('#startScreen').style.display = 'block'
        preScreen = false
        //can now start playlist and sound affects
        playlist(Math.floor(Math.random() * songs.length), songs)
    }
})



document.querySelector('#startButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'none'
    init()
    animate()
    audio.pressedSound.play()
})

document.querySelector('#restartButton').addEventListener('click',()=>{
    game.active = true
    init()
    animate()
    audio.pressedSound.play()
    document.querySelector('#restartScreen').style.display = 'none'
})
document.querySelector('#rsHomeButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'block'
    document.querySelector('#restartScreen').style.display = 'none'
    document.querySelector('.optionsScreen').style.display = 'none'
    audio.pressedSound.play()
})

document.querySelector('#opHomeButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'block'
    document.querySelector('#restartScreen').style.display = 'none'
    document.querySelector('.optionsScreen').style.display = 'none'
    document.querySelector('#optionsScreen').style.display = 'none'
    audio.pressedSound.play()
})

document.querySelector('#grgHomeButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'block'
    document.querySelector('.garageScreen').style.display = 'none'
    audio.pressedSound.play()
})

document.querySelector('#optionsButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'none'
    document.querySelector('.optionsScreen').style.display = 'flex'
    document.querySelector('#optionsScreen').style.display = 'flex'
    document.querySelector('#optionsScreen').style.backgroundColor = '#004162'
    document.querySelector('#opHomeButton').style.display = 'block'
    document.querySelector('#opBackButton').style.display = 'none'
    audio.pressedSound.play()
})

document.querySelector('#garageButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'none'
    document.querySelector('.garageScreen').style.display = 'flex'
    audio.pressedSound.play()
})

document.querySelector('#rsOptionsButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'none'
    document.querySelector('.optionsScreen').style.display = 'flex'
    document.querySelector('#optionsScreen').style.backgroundColor = '#00416200'
    document.querySelector('#optionsScreen').style.display = 'flex'
    document.querySelector('#restartScreen').style.display = 'none'
    document.querySelector('#opHomeButton').style.display = 'none'
    document.querySelector('#opBackButton').style.display = 'block'
    audio.pressedSound.play()
})

document.querySelector('#opBackButton').addEventListener('click',()=>{
    document.querySelector('.optionsScreen').style.display = 'none'
    document.querySelector('#optionsScreen').style.display = 'none'
    document.querySelector('#restartScreen').style.display = 'flex'
    audio.pressedSound.play()
})

document.querySelector('.musicOn').addEventListener('change',(event)=>{
    if(event.currentTarget.checked){
        bgMusic.mute(false)
        music = true
    }else{
        console.log("music paused")
        bgMusic.mute(true)
        music = false
    }
})

document.querySelector('.soundFxOn').addEventListener('change',(event)=>{
    if(event.currentTarget.checked){
        muteSoundFx(false)
    }else{
        console.log("sound fx muted")
        muteSoundFx(true)
    }
})

document.querySelector('#original').addEventListener('click',()=>{
    playerSprite = './img/original_ship.png'
    document.querySelector('.ogRadio').checked = true
    audio.pressedSound.play()
})

document.querySelector('#redRocket').addEventListener('click',()=>{
    playerSprite = './img/red_rocket_ship.png'
    document.querySelector('.rrRadio').checked = true
    audio.pressedSound.play()
})
document.querySelector('#killBill').addEventListener('click',()=>{
    playerSprite = './img/kill_bill_ship.png'
    document.querySelector('.kbRadio').checked = true
    audio.pressedSound.play()
})
document.querySelector('#sr71').addEventListener('click',()=>{
    playerSprite = './img/sr71_blackbird_ship.png'
    document.querySelector('.srRadio').checked = true
    audio.pressedSound.play()
})
document.querySelector('#darthMaul').addEventListener('click',()=>{
    playerSprite = './img/darth_maul_ship.png'
    document.querySelector('.dmRadio').checked = true
    audio.pressedSound.play()
})
document.querySelector('#burger').addEventListener('click',()=>{
    playerSprite = './img/burger_ship.png'
    document.querySelector('.bRadio').checked = true
    audio.pressedSound.play()
})

document.querySelector('#restartButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#optionsButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#garageButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#startButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#opHomeButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#opBackButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#rsHomeButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#rsOptionsButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#grgHomeButton').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#original').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#redRocket').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#killBill').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#sr71').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#darthMaul').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})
document.querySelector('#burger').addEventListener('mouseover',()=>{
    audio.selectSound.play()
})









