class Particle{
    constructor({position, velocity, size, color}){
        this.position = position
        this.velocity = velocity
        this.size = size
        this.color = color
        this.opacity = 1
    }

    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.opacity -= 0.01
    }
}