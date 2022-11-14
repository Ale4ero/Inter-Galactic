const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const player = new Player()

const projectiles = []
const asteroids = []
const particles = []
const astCount = 0
let game = {
    over: false,
    active: true
}

//asteroids.push(new Asteroid())


//function to handle input from keyboard
function handleKeyInput(event) {
    if (game.over) return 
    const { key, type } = event;
    const isKeyDown = type === 'keydown' ? true : false;

    if (key === 'a'){
        player.rotatingLeft = isKeyDown
        //console.log('left')
    } 
    if (key === 'd'){
        player.rotatingRight = isKeyDown
        //console.log('right')
    } 
    if (key === 'w'){
        player.engineOn = isKeyDown
        //console.log('up')
    } 
    if (key === ' '){
        player.shooting = isKeyDown
        //console.log(projectiles)
    } 
    if (key === 's'){
        player.reverse = isKeyDown
    }
}

//background stars
for(let i = 0; i < 100; i++){
    let amount = Math.random() * 10
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

function animate(){
    if (!game.active) return
    
    requestAnimationFrame(animate)
    c.fillStyle = '#24162F'
    c.fillRect(0, 0, canvas.width, canvas.height)
    if (!game.over){
        player.movePlayer()
    }
    particles.forEach((particle, i) =>{
        if (particle.position.x + particle.size.width < 0){
            particle.position.x = canvas.width + particle.size.width
            particle.position.y = Math.random() * canvas.height
        }

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
                    console.log('player hit!')
                    console.log('you lose!')
                    player.opacity = 0
                    game.over = true
                    createParticles({object: player, color: 'red', fade: true})
                    setTimeout(()=>{
                        game.active = false
                    }, 3000)
                }
    
            //collision detection for projectiles and ateroids, projectile hits asteroid
            projectiles.forEach((projectile, j) =>{
                if(projectile.position.x <= ARBorder && 
                    projectile.position.x  >= ALBorder && 
                    projectile.position.y  >= ATBorder && 
                    projectile.position.y  <= ABBorder){

                        createParticles({object: asteroid, color: '#8e99a9', fade : true})
                        
                        setTimeout(() =>{
                            console.log('hit!')
                            asteroids.splice(i,1)
                            projectiles.splice(j, 1)
                        }, 0)
                    }
    
                //positioning testing 
                // console.log('Asteroid Position:\nRB: X: '+ RB+"\n"+
                // 'LB: X: '+ asteroid.position.x + '\n'+
                // 'TB: Y: ' + asteroid.position.y + '\n'+
                // 'BB: Y: '+ BB + '\n\n'+
                // 'Pixel Position: \nPx: '+ projectile.position.x + '\n'+
                // 'Py: '+ projectile.position.y)
            })
        }
        

    })

    //max 3 asteroids 
    if (asteroids.length < 5){
        //console.log(asteroids)
        asteroids.push(new Asteroid())
    }
    
    //asteroid collision


}


document.addEventListener('keydown', handleKeyInput);
document.addEventListener('keyup', handleKeyInput);

document.querySelector('#startButton').addEventListener('click',()=>{
    document.querySelector('#startScreen').style.display = 'none'
    animate()
})
//animate()




