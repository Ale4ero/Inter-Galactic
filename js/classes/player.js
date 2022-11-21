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
        this.boost = false
        this.opacity = 1

        const image = new Image()
        image.src = './img/blue_orange_ship_pixel.png'

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
            if(this.boost){
                c.fillStyle = 'blue'
            } else{
                c.fillStyle = 'orange'
            }
            
            c.fill()
        }

        c.restore()
    }

    movePlayer(){

        //if image is loaded we can move it
        if (this.image){
            let thrust = 5
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
            if (this.rotatingLeft && !this.boost) this.angle -= turnSpeed * degToRad;
            if (this.rotatingRight && !this.boost) this.angle += turnSpeed * degToRad;

            if(this.engineOn && this.boost){
                // this.velocity.x +=  Math.sin(this.angle)
                // this.velocity.y -=  Math.cos(this.angle)
                thrust = 15
            }

            // Acceleration
            if (this.engineOn) {
                this.velocity.x += (thrust / 100) * (Math.sin(this.angle) *3.5)
                this.velocity.y -= (thrust / 100) * (Math.cos(this.angle) *3.5)
                if (this.boost){
                    this.velocity.x  = Math.min(10, this.velocity.x)
                    this.velocity.x  = Math.max(-10, this.velocity.x)
                    this.velocity.y  = Math.min(10, this.velocity.y)
                    this.velocity.y  = Math.max(-10, this.velocity.y)
                }else{
                    this.velocity.x  = Math.min(4, this.velocity.x)
                    this.velocity.x  = Math.max(-4, this.velocity.x)
                    this.velocity.y  = Math.min(4, this.velocity.y)
                    this.velocity.y  = Math.max(-4, this.velocity.y)
                }
                
            }


            //Reverse
            if (this.reverse) {
                this.velocity.x += -(thrust / 100) * Math.sin(this.angle)
                this.velocity.y -= -(thrust / 100) * Math.cos(this.angle)
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
            
            console.log('Velocity X: '+ player.velocity.x + '\n'
            + 'Velocity Y: ' + this.velocity.y)
        }
    }
}