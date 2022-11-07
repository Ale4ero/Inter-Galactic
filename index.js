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

        this.angle = 0;
        this.engineOn = false;
        this.rotatingLeft = false;
        this.rotatingRight = false;
        this.shooting = false;

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
            this.velocity = Math.random * 10 + 1

            this.position = {
                x: 200,
                y: 200
            }
            
        }        
    }

    draw(){
        if (this.image){
            c.drawImage(
                this.image, 
                this.position.x,
                this.position.y,
                this.width, 
                this.height
            ) 
        }
    }

    update(){
        this.draw()
        this.position.x += this.velocity
    }

}



const player = new Player()
const projectiles = []
const asteroids = []

const asteroid = new Asteroid()



function handleKeyInput(event) {
    const { key, type } = event;
    const isKeyDown = type === 'keydown' ? true : false;

    if (key === 'a'){
        player.rotatingLeft = isKeyDown;
        console.log('left')
    } 
    if (key === 'd'){
        player.rotatingRight = isKeyDown;
        console.log('right')
    } 
    if (key === 'w'){
        player.engineOn = isKeyDown;
        console.log('up')
    } 
    if (key === ' '){
        player.shooting = isKeyDown;
        console.log(projectiles)
    } 
  }


function animate(){
    const speed = 10
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.movePlayer()
    meteor.draw()

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

    


}


document.addEventListener('keydown', handleKeyInput);
document.addEventListener('keyup', handleKeyInput);

animate()




