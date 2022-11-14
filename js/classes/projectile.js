class Projectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }

    draw(){
        // c.beginPath()
        // c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        // c.fillStyle = 'red'
        // c.fill()
        // c.closePath()
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 7, 7)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}