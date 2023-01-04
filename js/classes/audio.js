

const audio = {
    selectSound: new Howl({
        src: './audio/menuSelect.mp3',
        rate: 2.0 
    }),
    pressedSound: new Howl({
        src: './audio/pressedBtn.mp3',
        volume: 1
    }),
    bombSound: new Howl({
        src: './audio/bomb.mp3',
        volume: .2,
        rate: 2.0 
    }),
    laser: new Howl({
        src: './audio/laser.mp3',
        volume: .05,
        rate: 2.0
    }),
    flame: new Howl({
        src: './audio/flame.mp3',
        volume: .05,
        rate: 1,
        loop: true
    }),
    gameOver: new Howl({
        src: './audio/gameover.mp3',
        volume: .5,
        rate: 2
    })
}

bgMusic = undefined

function playlist(i, list) {
     bgMusic = new Howl({
        src: list[i],
        volume: 0.1,
        onend: function () {
            if ((i + 1) == list.length) {
                playlist(0, list)
            } else {
                playlist(i + 1, list)
            }
        }
    })
    bgMusic.play();
}

function muteSoundFx(mute){
    audio.selectSound.mute(mute)
    audio.pressedSound.mute(mute)
    audio.bombSound.mute(mute)
    audio.laser.mute(mute)
    audio.gameOver.mute(mute)
}

