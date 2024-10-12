let audio = new Audio();
letlet audio = new Audio(); // Create a new audio object
let source = "audio/" // Base path for audio files
// let source = "http://192.168.153.250:5500/audio/" // Optional network path for audio files

// Function to get the index of the current song based on its file path
function getKeyByValue(song_data, path) {
    for (let index = 0; index < Object.keys(song_data).length; index++) {
        if (song_data[index].path == path) {
            return index; // Return the index of the matching song
        }
    }
    console.log("invalid index of current song");
    return -1; // Return -1 if no song is found
}

// Convert seconds to a formatted "MM:SS" time string
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"; // Return default time if invalid input
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`; // Return time in "MM:SS" format
}

// Update the song information in the UI
function song_info(linker1, linker2) {
    document.querySelector('.song-info-title').firstElementChild.innerHTML = linker1; // Set song name
    document.querySelector('.song-info-title').firstElementChild.nextElementSibling.innerHTML = ` - ${linker2}`; // Set artist name
    document.querySelector('.song-info-duration').innerHTML = "00:00 / 00:00"; // Reset duration display
}

// Function to add songs to the homepage UI
async function addSongs_home(songs) {
    let list = document.getElementsByClassName("songs-list")[0];
    for (i in songs) {
        // Create song list item with name and artist
        let div = document.createElement('div');
        div.classList.add('song', 'flex-row', 'align-items-center', 'background-black', 'border-radius-5', 'cursor-pointer', 'hover-fliter-invert', 'transition-2');
        div.innerHTML = ` 
            <img src="Logos/music.svg" alt="music">
            <div class="song-info flex-col border-radius-5">
                <div class="song-name font-white-small">${songs[i].name}</div>
                <div class="artist-name font-small-grey-thin">${songs[i].artist}</div>
            </div>`;
        list.appendChild(div); // Add song item to list
    }

    let section_1 = document.getElementsByClassName("section-1")[0];

    for (i in songs) {
        // Create cards for each song with image, name, and artist
        let div = document.createElement('div');
        div.classList.add('card', 'card-2', 'flex-col', 'hover-background', 'border-radius-10', 'transition-2')
        div.innerHTML = ` 
            <img src="Logos/main-play.svg " alt="" class="play-svg border-radius-20 transition-3 cursor-pointer play-svg-mobile-2 ">
            <img class="border-radius-5" src="${songs[i].image}" alt="">
            <h1 class="font-white">${songs[i].name}</h1>
            <div class="font-small-grey">${songs[i].artist}</div>`;
        section_1.appendChild(div); // Add song card to section
    }
    return "song add home"; // Return success message
}

// Function to add a specific song card to the homepage (mobile view)
async function add_cardHome(songs, count) {
    let section_1 = document.getElementsByClassName("section-1")[0];
    section_1.innerHTML = ""; // Clear the section
    document.querySelector('.direction').lastElementChild.style.opacity = '0.6';
    document.querySelector('.direction').firstElementChild.nextElementSibling.style.opacity = '1';
    document.querySelector('.section-1-mobile-2').style.height = '60%';

    let div = document.createElement('div');
    div.classList.add('card', 'flex-col', 'hover-background', 'border-radius-10', 'transition-2', 'card-mobile');
    div.innerHTML = ` 
            <img src="Logos/main-play.svg " alt="" class="play-svg border-radius-20 transition-3 cursor-pointer play-svg-mobile">
            <img class="border-radius-5" src="${songs[count].image}" alt="">
            <h1 class="font-white font-white-mobile">${songs[count].name}</h1>
            <div class="font-small-grey font-small-grey-mobile">${songs[count].artist}</div>`;
    
    section_1.appendChild(div); // Add the song card to the section
    console.log("Hello from home_Card", count); // Log the song count for debugging
}

// Function to play a selected song and handle UI updates
function playMusic(linker1, linker2, songs, pauseOnLoad = true) {
    song_info(linker1, linker2); // Update the song info in the UI

    let path = linker1 + "_" + linker2 + ".mp3";
    path = source + path.replaceAll(" ", "%20"); // Encode spaces in the file path
    audio.src = path; // Set the audio source

    let section_1 = document.getElementsByClassName("section-1")[0];
    let count = getKeyByValue(songs, audio.src); // Get the song index

    if (pauseOnLoad) {
        audio.load(); // Load the new audio source
        document.querySelector('.controls-play-song').src = 'Logos/pause.svg'; // Update play button to pause icon
        audio.addEventListener('canplay', () => { // Play when the audio is ready
            audio.play().catch(error => {
                console.error('Failed to play the audio:', error); // Handle play errors
            });
        }, { once: true }); // Ensure this event listener is called only once
    }

    if (document.body.offsetWidth <= 490 && document.querySelector('.direction').lastElementChild.style.opacity == '0.6') {
        add_cardHome(songs, count); // Add mobile card view if necessary
    }

    localStorage.setItem('Last_song', count); // Store the last played song
    document.querySelector('#volume-bar').value = '50'; // Set default volume

    // Mobile adjustments for smaller screen size
    if (document.body.offsetWidth <= 490 && (count >= 0 || count <= Object.keys(songs).length - 1) && document.querySelector('.direction').lastElementChild.style.opacity == '0.6') {
        add_cardHome(songs, count);
    }

    // Event listeners for previous and next buttons, mobile interactions
    // ...

    // Update UI as the song progresses
    audio.addEventListener("timeupdate", () => {
        document.querySelector('.song-info-duration').innerHTML = secondsToMinutesSeconds(audio.currentTime) + " / " + secondsToMinutesSeconds(audio.duration);
        document.querySelector('.circle').style.left = (audio.currentTime / audio.duration) * 98 + "%"; // Update progress circle

        // If the song has finished, reset the progress and play the next song if available
        if (audio.currentTime / audio.duration == 1) {
            document.querySelector('.circle').style.left = "0px";
            document.querySelector('.song-info-duration').innerHTML = "00:00 / 00:00";
            let count = getKeyByValue(songs, audio.src); // Get the index of the current song
            if (count < Object.keys(songs).length - 1) {
                playMusic(songs[count + 1].name, songs[count + 1].artist, songs); // Play next song if available
            } else {
                document.querySelector('.controls-play-song').src = 'Logos/play.svg'; // Reset play button to default
            }
        }
    });

    // Volume control event listener
    document.querySelector('#volume-bar').addEventListener('change', (e) => {
        audio.volume = parseInt(e.target.value) / 100; // Update volume
        const volumeIcon = document.querySelector('.volume-icon');
        if (parseInt(e.target.value) == 0) {
            volumeIcon.src = 'Logos/volumeOff.svg'; // Mute icon
        } else {
            volumeIcon.src = 'Logos/volumeOn.svg'; // Unmute icon
        }
    });
}

// Fetch the list of songs from the server and process them
async function getSongs() {
    let file = await fetch(source); // Fetch the song data from the source
    let response = await file.text(); // Parse response as text

    // List of song images to display
    let songs_images = [
        'https://c.saavncdn.com/984/Bijlee-Bijlee-Punjabi-2021-20220729120741-500x500.jpg',
        'https://c.saavncdn.com/225/Chaar-Din-Punjabi-2016-20220813160404-500x500.jpg',
        'https://c.saavncdn.com/047/Unstoppable-R3HAB-Remix-English-2022-20220705225818-500x500.jpg',
        'https://c.saavncdn.com/660/Faraar-Hindi-2021-20210113053337-500x500.jpg',
        'https://c.saavncdn.com/197/FRIENDS-English-2018-20190607042605-500x500.jpg',
        'https://c.saavncdn.com/588/Ghana-Kasoota-Hindi-2021-20211110172537-500x500.jpg',
        'https://c.saavncdn.com/577/Hamari-Adhuri-Kahani-Hindi-2015-500x500.jpg',
        'https://c.saavncdn.com/161/Ishare-Tere-Punjabi-2018-20180724123848-500x500.jpg',
        'https://c.saavncdn.com/465/Honey-3-0-Hindi-2024-20240318123128-500x500.jpg',
        'https://c.saavncdn.com/734/Champagne-Talk-Hindi-2022-20221008011951-500x500.jpg',
        'https://c.saavncdn.com/257/No-Love-Punjabi-2022-20221104093550-500x500.jpg',
        'https://c.saavncdn.com/663/Pasoori-Punjabi-2022-20220203181058-500x500.jpg'
    ];

    let song_data = {}; // Object to store song information

    // Create a div to parse the fetched response
    let div = document.createElement('div');
    div.innerHTML = response;
    let a = div.getElementsByTagName('a'); // Get all anchor tags
    let count = 0;

    // Loop through anchor tags to find mp3 files and extract song info
    for (let i of a) {
        if (i.href.endsWith(".mp3")) {
            let path = i.href;
            let name = i.children[0].innerHTML.split("_")[0]; // Extract song name
            let artist = i.children[0].innerHTML.split("_")[1].replace('.mp3', ''); // Extract artist name
            let duration = i.children[1].innerHTML; // Get song duration
            let obj = { "path": path, "name": name, "artist": artist, "image": songs_images[count], "duration": duration }; // Create song object
            song_data[count] = obj; // Add song to song_data object
            count++;
        }
    }

    return song_data; // Return the song data
}

// Function to add songs to the UI and set up event listeners
async function addSongs(songs) {
    let meta = await addSongs_home(songs); // Add songs to the homepage
    console.log(meta);

    // Add hover effects for play icon on song cards
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

    // Play or pause the song when the play button is clicked
    document.querySelector('.controls-play-song').addEventListener('click', () => {
        if (audio.paused) {
            document.querySelector('.controls-play-song').src = 'Logos/pause.svg';
            audio.play();
        } else {
            audio.pause();
            document.querySelector('.controls-play-song').src = 'Logos/play.svg';
        }
    });

    // Seek to a different part of the song when the status bar is clicked
    document.querySelector(".status-bar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        audio.currentTime = (audio.duration * percent) / 100;
    });

    // Toggle the sidebar menu on smaller screens when the hamburger icon is clicked
    document.querySelector(".ham-Burger").addEventListener("click", () => {
        document.querySelector(".left-side").classList.toggle("left-slide");

        if (!document.querySelector(".ham-Burger").src.endsWith('Logos/close.svg')) {
            document.querySelector(".ham-Burger").src = 'Logos/close.svg';
        } else {
            document.querySelector(".ham-Burger").src = 'Logos/hamburger.svg';
        }
    });

    // Play the selected song when a song is clicked from the song list
    document.querySelectorAll('.song').forEach((song) => {
        song.addEventListener('click', () => {
            let linker1 = song.children[1].children[0].innerHTML; // Get song name
            let linker2 = song.children[1].children[1].innerHTML; // Get artist name
            playMusic(linker1, linker2, songs); // Play the selected song
        });
    });

    // Play the song when the play icon on a song card is clicked
    document.querySelectorAll('.play-svg').forEach((svg) => {
        svg.addEventListener('click', () => {
            let linker1 = svg.nextElementSibling.nextElementSibling.innerHTML; // Get song name
            let linker2 = svg.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML; // Get artist name
            playMusic(linker1, linker2, songs); // Play the selected song
        });
    });

    // Mute/unmute the volume when the volume icon is clicked
    document.querySelector('.volume-icon').addEventListener('click', () => {
        if (document.querySelector('.volume-icon').src.endsWith('volumeOn.svg')) {
            document.querySelector('.volume-icon').src = 'Logos/volumeOff.svg';
            audio.volume = 0;
            document.querySelector('#volume-bar').value = '0';
            console.log(audio.volume, "off");
        } else {
            document.querySelector('.volume-icon').src = 'Logos/volumeOn.svg';
            audio.volume = 0.5; // Set volume to 50%
            document.querySelector('#volume-bar').value = '50';
            console.log(audio.volume, "on");
        }
    });

    return "songs added"; // Return confirmation
}

// Main function to initialize the app
async function main() {
    let songs = await getSongs(); // Fetch songs
    audio.volume = 0.5; // Set default volume

    let lastsong = localStorage.getItem('Last_song'); // Retrieve last played song from localStorage
    let username = localStorage.getItem('username'); // Retrieve username from localStorage

    // Display username if it exists
    if (username != null) {
        document.querySelector('.main-buttons').innerHTML = "Hello, " + username;
    }

    // Default to the first song if no song has been played before
    if (lastsong == null || lastsong < 0) {
        lastsong = 0;
    }

    // Play the last played song (or first song by default)
    playMusic(songs[lastsong].name, songs[lastsong].artist, songs, false);

    // Add songs to the UI
    let message = await addSongs(songs);
    console.log(songs);
}

// Call the main function to start the app
main();



