
//var songs = ['./audio/Everlong_FooFighters.mp3', './audio/Yolo_TheStrokes.mp3', './audio/HereComesYourMan_Pixes.mp3', './audio/HardToExplain_TheStrokes.mp3']
//var songFile = songs[Math.floor(Math.random() * songs.length)]
const audio = {
    //backgroundMusic: new Howl({
        // src: songFile,
        // loop: true,
        // volume: 0.1,
        // html5: true,
        // onend: function(){
        //     songFile = songs[Math.floor(Math.random() * songs.length)]
            
        // }
    //}),
    selectSound: new Howl({
        src: './audio/menuSelect.mp3',
        rate: 2.0 
    })
}