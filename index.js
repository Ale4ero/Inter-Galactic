const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player{
    constructor(){
        this.velocity ={
            x: 0,
            y: 0
        }

        this.angle = 0
        this.engineOn = false
        this.rotatingLeft = false
        this.rotatingRight = false
        this.shooting = false
        this.reverse = false
        this.opacity = 1

        const image = new Image()
        image.src = './img/blue_orange_ship.png'

        image.onload = () => {
            const ratio = .5
            this.image = image
            this.width = image.width * ratio
            this.height = image.height * ratio
            this.position = {
                x: (canvas.width / 2) - this.width / 2,
                y: canvas.height - this.height - 50
            }
        }
    }

    draw(){
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width/2, player.position.y + player.height / 2)
        c.rotate(this.angle)
        c.translate(-player.position.x - player.width/2, -player.position.y - player.height / 2)
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )

        //flame
        if(this.engineOn){
            const fireYPos = player.position.y + player.height + 5 
            const fireXPos = player.position.x
            c.beginPath()
            c.moveTo(fireXPos + player.width*.375, fireYPos)
            c.lineTo(fireXPos + player.width*.625, fireYPos)
            c.lineTo(fireXPos + player.width*.5, fireYPos + Math.random() * 100)
            c.lineTo(fireXPos + player.width*.375, fireYPos)
            c.closePath()
            c.fillStyle = 'orange'
            c.fill()
        }

        c.restore()
    }

    movePlayer(){

        //if image is loaded we can move it
        if (this.image){
            const thrust = 5
            const turnSpeed = 5

            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            // Angle has to be in radians
            const degToRad = Math.PI / 180;
            // Change the position based on velocity
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            //right border
            if (this.position.x + this.width >= canvas.width){
                this.position.x -= 5
                this.velocity.x = -this.velocity.x/2
            }

            //left border
            if(this.position.x < 0){
                this.position.x += 5
                this.velocity.x = -this.velocity.x/2
            }

            //top border
            if(this.position.y < 0){
                this.position.y += 5
                this.velocity.y = -this.velocity.y/2
            }

            //bottom border
            if(this.position.y + this.height > canvas.height){
                this.position.y -= 5
                this.velocity.y = -this.velocity.y/2
            }

            // Turning
            if (this.rotatingLeft) this.angle -= turnSpeed * degToRad;
            if (this.rotatingRight) this.angle += turnSpeed * degToRad;

            // Acceleration
            if (this.engineOn) {
                this.velocity.x += (thrust / 100) * Math.sin(this.angle);
                this.velocity.y -= (thrust / 100) * Math.cos(this.angle);
            }

            //Reverse
            if (this.reverse) {
                this.velocity.x += -(thrust / 100) * Math.sin(this.angle);
                this.velocity.y -= -(thrust / 100) * Math.cos(this.angle);
            }

            //shooting
            if(this.shooting){
                projectiles.push(new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y + player.height / 2 
                    },
                    velocity: {
                        x: 15 * Math.sin(this.angle),
                        y: -15 * Math.cos(this.angle)
                    }
                }))
                this.shooting = false
            }   
        }
    }
}

class Projectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Asteroid{
    constructor(){
        const image = new Image()
        image.src = './img/asteroid_1.png'

        image.onload = () => {
            const ratio = 1
            this.image = image
            this.width = image.width * ratio
            this.height = image.height * ratio
            this.velocity = Math.random() * 10 + 1

            this.position = {
                x: -this.width,
                y: Math.random() * (canvas.height - this.height)
            }
            
            this.topBorder = this.position.y
            this.bottomBorder = this.position.y + this.height
            this.leftBorder = this.position.x
            this.rightBorder = this.position.x + this.width
        }        
    }

    draw(){
        
        c.drawImage(
            this.image, 
            this.position.x,
            this.position.y,
            this.width, 
            this.height
        ) 
    
    }

    update(){
        if(this.image){
            this.draw()
            this.position.x += this.velocity
        }
        
    }

}



const player = new Player()
const projectiles = []
const asteroids = []
const astCount = 0
asteroids.push(new Asteroid())
let game = {
    over: false,
    active: false
}



function handleKeyInput(event) {
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


function animate(){
    
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.movePlayer()
    

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
            if(ALBorder > canvas.width){
                asteroids.splice(i,1)
            }else{
                asteroid.update()
            }

            //player collision with asteroids
            if (ARBorder >= PLBorder && ALBorder <= PRBorder &&
                ABBorder >= PTBorder && ATBorder <= PBBorder){
                    console.log('player hit!')
                    player.opacity = 0
                    game.over = true
                }
    
            //collision detection for projectiles and ateroids
            projectiles.forEach((projectile, j) =>{
                if(projectile.position.x <= ARBorder && 
                    projectile.position.x  >= ALBorder && 
                    projectile.position.y  >= ATBorder && 
                    projectile.position.y  <= ABBorder){
                        console.log('hit!')
                        asteroids.splice(i,1)
                        projectiles.splice(j, 1)
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

animate()




