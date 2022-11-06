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

        this.rotation = 0

        const image = new Image()
        image.src = './img/blue_orange_ship.png'

        image.onload = () => {
            const ratio = .5
            this.image = image
            this.width = image.width * ratio
            this.height = image.height * ratio
            this.position = {
                x: (canvas.width / 2) - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw(){
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
        c.save()
        c.translate(player.position.x + player.width/2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width/2, -player.position.y - player.height / 2)
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )

        c.restore()
    }

    update(){
        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
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

const player = new Player()
const projectiles = []


const keys = {
    a: {
        pressed: false 
    },
    d: {
        pressed: false 
    },
    w: {
        pressed: false 
    },
    s: {
        pressed: false 
    },
    space: {
        pressed: false 
    }
}

function animate(){
    const speed = 10
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

    projectiles.forEach((projectile, index)=> {
        if (projectile.position.y + projectile.radius < 0){
            projectiles.splice(index, 1)
        }else{
            projectile.update()
        }
        
    })

    if( keys.a.pressed && player.position.x > 0){
        //console.log('left')
        player.velocity.x = -speed
        player.rotation = -.15
    }else if(keys.d.pressed && player.position.x + player.width < canvas.width){
        //console.log('right')
        player.velocity.x = speed
        player.rotation = .15
    }else if(keys.w.pressed && player.position.y > 0){
        player.velocity.y = -speed
    }else if(keys.s.pressed && player.position.y + player.height < canvas.height){
        player.velocity.y = speed
    }else{
        player.velocity.x = 0
        player.velocity.y = 0
        player.rotation = 0
    }
}



animate()

addEventListener('keydown', event => {
    switch(event.key){
        case 'a':
            console.log('left')
            keys.a.pressed = true
            break
        case 'd':
            console.log('right')
            keys.d.pressed = true
            break
        case 'w':
            console.log('up')
            keys.w.pressed = true
            break
        case 's':
            console.log('down')
            keys.s.pressed = true
            break
        case ' ':
            console.log('pew')
            keys.space.pressed = true
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -15
                }
            }))
            break
    }
})

addEventListener('keyup', event => {
    switch(event.key){
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case ' ':
            keys.space,pressed = false
            //console.log(projectiles)
            break
            
    }
})