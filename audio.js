
var songs = ['./audio/Everlong_FooFighters.mp3', './audio/Yolo_TheStrokes.mp3']
var songFile = songs[Math.floor(Math.random() * songs.length)]
const audio = {
    backgroundMusic: new Howl({
        src: songFile
    })
}