class Asteroid{
    constructor(){
        const image = new Image()
        image.src = './img/asteroid_pixel.png'

        image.onload = () => {
            const ratio = Math.random() * 1.2 + .5
            this.image = image
            this.width = image.width * ratio
            this.height = image.height * ratio
            this.velocity = Math.random() * 10 + 1
            this.type = Math.random() * 10 

            //if less than 7 comes from left side if greater than 7 comes from top
            if(this.type <= 7){
                this.position = {
                    x: -this.width,
                    y: Math.random() * (canvas.height - this.height)
                }
            }else{
                this.position = {
                    x: Math.random()* (canvas.width - this.width),
                    y: -this.height - 200
                }
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
            if(this.type <= 7){
                this.position.x += this.velocity
            }else{
                this.position.y += this.velocity
            }
        } 
    }
}