class Particle{
    constructor({position, velocity, size, color, fade, opacity, star, type}){
        this.position = position
        this.velocity = velocity
        this.size = size
        this.color = color
        this.opacity = opacity
        this.fade = fade
        this.star = star
        this.type = type
    }

    draw(){

        c.save()
        c.globalAlpha = this.opacity

        //if i want a star, if type is 2 its a big star
        if(this.star){
            if (this.type > 3){
                c.fillStyle = '#9CD2EC'
                c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
                c.fillStyle = '#62A3DF'
                c.fillRect(this.position.x - this.size.width + 1, this.position.y, this.size.width, this.size.height)
                c.fillRect(this.position.x , this.position.y - this.size.height + 1, this.size.width, this.size.height)
                c.fillRect(this.position.x + this.size.width - 1, this.position.y, this.size.width, this.size.height)
                c.fillRect(this.position.x, this.position.y + this.size.height - 1, this.size.width, this.size.height)
            }else{
                if(this.type>2){
                    c.fillStyle = '#89D9FF'
                }else{
                    c.fillStyle = '#168FFF'
                }
                c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
            }
            
        }else{
            //if not a star, normal particle
            c.fillStyle = this.color
            c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
        }

        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if ( this.fade){
            this.opacity -= 0.01
        }
        
    }
}