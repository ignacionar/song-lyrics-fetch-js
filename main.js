const search = document.querySelector('#search');
const more = document.querySelector('#more');
const result = document.querySelector('#result');
const form = document.querySelector('#form');


const API_URL = 'https://api.lyrics.ovh'; 


const searchSongs = async (value) => {
    const res = await fetch(`${API_URL}/suggest/${value}`);
    const data = await res.json();
    console.log(data);
    showData(data);
};

const showData = ({ data, next, prev }) => { 
    result.innerHTML = `
    <ul class="songs">
    ${data
    .map(
    (song) => 
        `<li><span><strong> ${song.artist.name} - </strong> 
        ${song.title}</span><button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Letra</button></li><img src="${song.album.cover_small}">`
        ).join("")}

    </ul>
    `;

//      SI EXISTEN A O B
    if (prev || next) {
        more.innerHTML = `
            ${prev 
                ? `<button class="btn" onclick="getMoreSongs('${prev}')">Anterior</button>` 
                : ""
            }
            ${next 
                ? `<button class="btn" onclick="getMoreSongs('${next}')">Siguiente</button>` 
                : ""
            }
        
        `;

    } else {
        more.innerHTML = '';
    }
};

const getMoreSongs = async (url) => {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showData(data);
};

const getLyrics = async (artist, songTitle) => {

    const res = await fetch(`${API_URL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    result.innerHTML = `
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
    `;
    more.innerHTML = '';
}

// INIT
function init() {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const searchValue = search.value.trim();
        if (!searchValue) {
            return;
        } 
        searchSongs(searchValue);
    });
    result.addEventListener("click", (e) => {
        const element = e.target
        if (element.nodeName === "BUTTON") {
            const artist = element.dataset.artist;
            const songTitle = element.dataset.songtitle;
            getLyrics(artist, songTitle);
        }
    });
}

init();