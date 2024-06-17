let audio = new Audio();
let source = "audio/"
// let source = "http://192.168.153.250:5500/audio/"
function getKeyByValue(song_data, path) {
    for (let index = 0; index < Object.keys(song_data).length; index++) {
        if (song_data[index].path == path) {
            return index;
        }

    }
    console.log("invalid index of current song");
    return -1;
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

function song_info(linker1, linker2) {
    document.querySelector('.song-info-title').firstElementChild.innerHTML = linker1;
    document.querySelector('.song-info-title').firstElementChild.nextElementSibling.innerHTML = ` - ${linker2}`;
    document.querySelector('.song-info-duration').innerHTML = "00:00 / 00:00";

}

async function addSongs_home(songs) {

    let list = document.getElementsByClassName("songs-list")[0];
    for (i in songs) {
        let div = document.createElement('div');
        div.classList.add('song', 'flex-row', 'align-items-center', 'background-black', 'border-radius-5', 'cursor-pointer', 'hover-fliter-invert', 'transition-2');
        div.innerHTML = ` 
    <img src="Logos/music.svg" alt="music">
    <div class="song-info flex-col border-radius-5">
        <div class="song-name font-white-small">${songs[i].name}</div>
        <div class="artist-name font-small-grey-thin">${songs[i].artist}</div>
    </div>`;
        list.appendChild(div);

    }
    let section_1 = document.getElementsByClassName("section-1")[0];

    for (i in songs) {
        let div = document.createElement('div');
        div.classList.add('card', 'card-2', 'flex-col', 'hover-background', 'border-radius-10', 'transition-2')
        div.innerHTML = ` 
     <img src="Logos/main-play.svg " alt="" class="play-svg border-radius-20 transition-3 cursor-pointer play-svg-mobile-2 ">
                            <img class="border-radius-5"
                                src="${songs[i].image}" alt="">
                            <h1 class="font-white">${songs[i].name}</h1>
                            <div class="font-small-grey">${songs[i].artist}</div>`;
        section_1.appendChild(div);

    }
    return "song add home"
}
async function add_cardHome(songs, count) {
    let section_1 = document.getElementsByClassName("section-1")[0];
    section_1.innerHTML = "";
    document.querySelector('.direction').lastElementChild.style.opacity = 0.6
    document.querySelector('.direction').firstElementChild.nextElementSibling.style.opacity = 1
    document.querySelector('.section-1-mobile-2').style.height = '60%';


    // document.querySelector('.direction').lastElementChild.style.background = none;
    let div = document.createElement('div');
    div.classList.add('card', 'flex-col', 'hover-background', 'border-radius-10', 'transition-2', 'card-mobile');
    div.innerHTML = ` 
     <img src="Logos/main-play.svg " alt="" class="play-svg border-radius-20 transition-3 cursor-pointer play-svg-mobile">
                            <img class="border-radius-5"
                                src="${songs[count].image}" alt="">
                            <h1 class="font-white font-white-mobile">${songs[count].name}</h1>
                            <div class="font-small-grey font-small-grey-mobile">${songs[count].artist}</div>`;

    section_1.appendChild(div);
}

function playMusic(linker1, linker2, songs, pauseOnLoad = true) {
    song_info(linker1, linker2)
    let path = linker1 + "_" + linker2 + ".mp3";
    path = source + path.replaceAll(" ", "%20")
    audio.src = path
    if (pauseOnLoad == true) {
        audio.play();
        document.querySelector('.controls-play-song').src = 'Logos/pause.svg'

    }
    let count = getKeyByValue(songs, audio.src);
    let section_1 = document.getElementsByClassName("section-1")[0];


    localStorage.setItem('Last_song', count)
    document.querySelector('#volume-bar').value = '50'
    if (document.body.offsetWidth <= 490 && (count >= 0 || count <= Object.keys(songs).length - 1)) {
        Array.from(document.querySelectorAll('.direction >img')).forEach((img) => {
            img.classList.remove('hover-background-white', 'hover-filter-invert-2')
        })
        document.querySelector('.direction').lastElementChild.style.opacity = 1
        document.querySelector('.direction').firstElementChild.nextElementSibling.style.opacity = 0.6
    }

    document.querySelector('.direction').lastElementChild.addEventListener('click', () => {
        if (document.body.offsetWidth <= 490 && (count >= 0 || count <= Object.keys(songs).length - 1)) {
            add_cardHome(songs, count)

        }
    })


    document.querySelector('.direction').firstElementChild.nextElementSibling.addEventListener('click', () => {
        if (document.body.offsetWidth <= 490 && (count >= 0 || count <= Object.keys(songs).length - 1)) {

            section_1.innerHTML = "";
            document.querySelector('.direction').lastElementChild.style.opacity = 1
            document.querySelector('.direction').firstElementChild.nextElementSibling.style.opacity = 0.6

            document.querySelector('.section-1-mobile-2').style.height = '110%';


            addSongs_home(songs)
        }

    })

    console.log(count)
    if (count == 0) {

        document.querySelector('.controls-prev-song').style.opacity = 0.5
    }
    if (count == Object.keys(songs).length - 1) {
        document.querySelector('.controls-next-song').style.opacity = 0.5
    }
    if (count > 0) {
        document.querySelector('.controls-prev-song').style.opacity = 1
        document.querySelector('.controls-prev-song').addEventListener('click', () => {
            if (document.querySelector('.direction').lastElementChild.style.opacity == 0.6 && document.body.offsetWidth <= 490) {
                add_cardHome(songs, count - 1)
            }
            playMusic(songs[count - 1].name, songs[count - 1].artist, songs)
        })
    }
    if (count < Object.keys(songs).length - 1) {
        document.querySelector('.controls-next-song').style.opacity = 1
        document.querySelector('.controls-next-song').addEventListener('click', () => {
            if (document.querySelector('.direction').lastElementChild.style.opacity == 0.6 && document.body.offsetWidth <= 490) {
                add_cardHome(songs, count + 1)
            }
            playMusic(songs[count + 1].name, songs[count + 1].artist, songs)
        })
    }
    audio.addEventListener("timeupdate", () => {
        document.querySelector('.song-info-duration').innerHTML = secondsToMinutesSeconds(audio.currentTime) + " / " + secondsToMinutesSeconds(audio.duration);

        document.querySelector('.circle').style.left = (audio.currentTime / audio.duration) * 98 + "%";
        if (audio.currentTime / audio.duration == 1) {
            document.querySelector('.circle').style.left = "0px";
            // document.querySelector('.controls-play-song').src = 'Logos/play.svg'
            document.querySelector('.song-info-duration').innerHTML = "00:00 / 00:00";
            let count = getKeyByValue(songs, audio.src);
            if (count < Object.keys(songs).length - 1) {
                if (document.querySelector('.direction').lastElementChild.style.opacity == 0.6 && document.body.offsetWidth <= 490) {
                    add_cardHome(songs, count + 1)
                }
                playMusic(songs[count + 1].name, songs[count + 1].artist, songs)
            }
            else {
                document.querySelector('.controls-play-song').src = 'Logos/play.svg'

            }



        }

    })


    document.querySelector('#volume-bar').addEventListener('change', (e) => {
        console.log(parseInt(e.target.value))
        audio.volume = parseInt(e.target.value) / 100;
        const volumeIcon = document.querySelector('.volume-icon');
        if (parseInt(e.target.value) == 0) {
            volumeIcon.src = 'Logos/volumeOff.svg';
        }
        else {
            volumeIcon.src = 'Logos/volumeOn.svg';

        }
    })



}

async function getSongs() {
    let file = await fetch(source)
    let respose = await file.text()

    let songs_images = ['https://i.scdn.co/image/ab67616d00001e026404721c1943d5069f0805f3', 'https://i.scdn.co/image/ab67616d00001e022ebe695c153f347cf257fc28', 'https://i.scdn.co/image/ab67616d00001e027ea5a422c7cae22626a36893', 'https://i.scdn.co/image/ab67616d00001e02f78d8d3dd6f83183ec4309e2', 'https://i.scdn.co/image/ab67616d00001e028074d75f0e453804efcec351', 'https://i.scdn.co/image/ab67616d00001e02f19e3dac6714edfe85ad9847', 'https://i.scdn.co/image/ab67616d00001e02a6a151ed88a170ae3a81eff5', '	https://i.scdn.co/image/ab67616d00001e020181987950c64ae28aefbd1a']
    let song_data = {

    }
    let div = document.createElement('div')
    div.innerHTML = respose;
    let a = div.getElementsByTagName('a');
    let count = 0;
    for (i of a) {
        if (i.href.endsWith(".mp3")) {
            let path = i.href;
            let name = i.children[0].innerHTML.split("_")[0];
            let artist = i.children[0].innerHTML.split("_")[1].replace('.mp3', '');
            let duration = i.children[1].innerHTML;
            let obj = { "path": path, "name": name, "artist": artist, "image": songs_images[count], "duration": duration }
            song_data[count] = obj;
            count++;

        }
    }
    // console.log(song_data);
    return song_data;


}
async function addSongs(songs) {

    let meta = await addSongs_home(songs)
    console.log(meta)


    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('mouseenter', () => {
            const playSvg = card.querySelector('.play-svg');
            playSvg.classList.add('play-svg-hover', 'play-svg-hover-mobile', 'play-svg-hover-mobile-2');
        });

        card.addEventListener('mouseleave', () => {
            const playSvg = card.querySelector('.play-svg');
            playSvg.classList.remove('play-svg-hover', 'play-svg-hover-mobile', 'play-svg-hover-mobile-2');
        });
    });
    document.querySelector('.controls-play-song').addEventListener('click', () => {
        if (audio.paused) {
            document.querySelector('.controls-play-song').src = 'Logos/pause.svg'
            audio.play();
        }
        else {
            audio.pause();
            document.querySelector('.controls-play-song').src = 'Logos/play.svg'
        }

    })
    document.querySelector(".status-bar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        audio.currentTime = ((audio.duration) * percent) / 100
    })

    document.querySelector(".ham-Burger").addEventListener("click", () => {
        document.querySelector(".left-side").classList.toggle("left-slide")

        if (!document.querySelector(".ham-Burger").src.endsWith('Logos/close.svg')) {
            document.querySelector(".ham-Burger").src = 'Logos/close.svg';

        } else {
            document.querySelector(".ham-Burger").src = 'Logos/hamburger.svg';

        }
    })
    document.querySelectorAll('.song').forEach((song) => {
        song.addEventListener('click', () => {
            let linker1 = song.children[1].children[0].innerHTML
            let linker2 = song.children[1].children[1].innerHTML
            playMusic(linker1, linker2, songs)

        })

    })
    document.querySelectorAll('.play-svg').forEach((svg) => {
        svg.addEventListener('click', () => {
            let linker1 = svg.nextElementSibling.nextElementSibling.innerHTML
            let linker2 = svg.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML
            playMusic(linker1, linker2, songs)

        })

    })
    document.querySelector('.volume-icon').addEventListener('click', () => {

        if (document.querySelector('.volume-icon').src.endsWith('volumeOn.svg')) {
            document.querySelector('.volume-icon').src = 'Logos/volumeOff.svg';
            audio.volume = 0;
            document.querySelector('#volume-bar').value = '0'
            console.log(audio.volume, "off")
        }
        else {
            document.querySelector('.volume-icon').src = 'Logos/volumeOn.svg';
            audio.volume = 0.5; // Volume should be between 0 and 1
            document.querySelector('#volume-bar').value = '50'
            console.log(audio.volume, "on")

        }
    });











    return "songs added"
}
async function main() {
    let songs = await getSongs();
    audio.volume = 0.5;
    let lastsong = localStorage.getItem('Last_song');
    let username = localStorage.getItem('username');
    if (username != null) {
        document.querySelector('.main-buttons').innerHTML = username;
    }
    if (lastsong == null) {
        lastsong = 0
    }


    playMusic(songs[lastsong].name, songs[lastsong].artist, songs, false);
    let message = await addSongs(songs);
    console.log(songs)
    // let song = songs[1].path
    // console.log(song)
    // var audio = new Audio(song);
    // audio.play();

}


main()


