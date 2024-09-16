
# Inter-Galactic

Inter-Galactic is a retro space shooter game built using HTML5, CSS3, and JavaScript. The game features smooth animations, dynamic canvas rendering, custom ship designs, and interactive space combat. Players control a spaceship to shoot down asteroids and survive as long as possible while progressing through increasingly difficult levels.

## Features

- **Responsive Canvas**: The game is fully responsive and adjusts the canvas size dynamically based on the browser window dimensions.
- **Smooth 60 FPS Rendering**: Ensures a consistent 60 frames per second across different systems by managing frame rates using `requestAnimationFrame()` and time-based controls.
- **Level Progression**: The game becomes progressively harder every 20 seconds as more asteroids are spawned and cool-down times are shortened.
- **Customizable Ships**: Players can unlock new ship designs as they achieve higher scores, with unique spaceship sprites available at specific milestones.
- **Collision Detection**: Real-time collision detection between the player's ship, projectiles, and asteroids.
- **Particle Effects**: Explosions and visual effects for asteroid destruction and player collisions using dynamically generated particles.
- **Sound Effects**: Integrated with Howler.js for dynamic sound effects that can be toggled on or off.

## Installation
To play the game online, click this link:
[Inter-Galactic](https://ale4ero.github.io/Inter-Galactic/)
To play the game locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/inter-galactic.git
    ```
2. Navigate to the project directory:
    ```bash
    cd inter-galactic
    ```
3. Open `index.html` in your browser to play the game.

## How It Works

### 1. **Main Game Loop (`animate()` function)**
The `animate()` function is the core of the game, ensuring smooth rendering and updating game elements on each frame:
```javascript
function animate() {
    if (!game.active) return;
    requestAnimationFrame(animate);

    const msNow = window.performance.now();
    const elapsed = msNow - msPrev;
    if (elapsed < fpsInterval) return;
    msPrev = msNow - (elapsed % fpsInterval);

    // Game logic and rendering code...
    c.fillRect(0, 0, canvas.width, canvas.height);
}
```
- **Frame Rate Control**: The function ensures the game runs at 60 FPS using `requestAnimationFrame(animate)` and time-based calculations.
- **Level Progression**: The game progresses automatically every 20 seconds by increasing difficulty (more asteroids and reduced cool-down time).
- **Rendering**: Clears the canvas and redraws all elements (particles, projectiles, asteroids, player) every frame.
- **Collision Detection**: Checks for player collisions with asteroids and projectiles with asteroids.

### 2. **Handling Player Input (`handleKeyInput()` function)**
This function handles player control through keyboard inputs (e.g., movement and shooting):

```javascript
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
    console.log(event)
}
```
- **'a' or 'ArrowLeft'**: Rotates the ship left.
- **'d' or 'ArrowRight'**: Rotates the ship right.
- **'w' or 'ArrowUp'**: Moves the ship forward.
- **'Spacebar'**: Fires projectiles.

### 3. **Particle System (`createParticles()` function)**
When asteroids are destroyed or the player is hit, particles are generated to create an explosion-like effect.
```javascript
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
```
-**Particle Generation**: Particles are dynamically rendered based on the object's position and are removed when they fade out.

### 4. **Asteroid and Projectile Management**
- **Asteroids**: The game spawns new asteroids and keeps them within a threshold. Collision detection ensures asteroids are destroyed by projectiles or if they collide with the player.
- **Projectiles**: Players can fire projectiles to destroy asteroids. Projectiles are removed once they go off-screen or hit an asteroid.

### 5. **Responsive Design**
The canvas resizes dynamically based on the user's screen size. Event listeners handle browser window resizing, ensuring the game scales and fits any device.

## Ship Unlocks
As players reach certain scores, they can unlock new ship designs in the garage:
- **3 Points**: Kill Bill ship
- **6 Points**: SR71-Blackbird
- **7 Points**: Darth Maul ship
- **8 Points**: Burger ship

## Tech Stack

- **HTML5**: Canvas for 2D rendering.
- **CSS3**: Custom styling for game UI and menus.
- **JavaScript**: Game logic, animations, and event handling.
- **Howler.js**: For managing sound effects.


## Acknowledgments

- [Howler.js](https://howlerjs.com/) for providing an easy-to-use API for managing game audio.
- Special thanks to any other contributors or resources used in building the game.

