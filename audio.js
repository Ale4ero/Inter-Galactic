
var songs = ['./audio/Everlong_FooFighters.mp3', './audio/Yolo_TheStrokes.mp3', './audio/HereComesYourMan_Pixes.mp3', './audio/HardToExplain_TheStrokes.mp3']
var songFile = songs[Math.floor(Math.random() * songs.length)]
const audio = {
    backgroundMusic: new Howl({
        src: songFile,
        loop: false,
        volume: 0.1,
        html5: true
    }),
    selectSound: new Howl({
        src: './audio/menuSelect.mp3',
        rate: 2.0 
    }),
    pressedSound: new Howl({
        src: './audio/pressedBtn.mp3',
        volume: 1
    }),
    flameSound: new Howl({
        src: './audio/flame.mp3',
        volume: .02
    }),
    

}

function autoplay(i, list) {
    console.log('hello i am working!')
    var sound = new Howl({
        src: list[i],
        volume: 0.1,
        onend: function () {
            if ((i + 1) == list.length) {
                autoplay(0, list)
            } else {
                autoplay(i + 1, list)
            }
        }
    })
    sound.play();
}