[HTML]


[CSS]


[JS]
let audio = document.getElementById('audio');
let files = [], order = [], currentIndex = 0;
let isShuffle = false, isRepeat = false, isPlaying = false;
let isRadioMode = false;
let currentStationIndex = 0;

// Referências DOM
const playlistEl = document.getElementById('playlist');
const nowPlaying = document.getElementById('now-playing');
const nowTitle = document.getElementById('now-playing-title');
const nowArtist = document.getElementById('now-playing-artist');
const cdCover = document.getElementById('cd-cover');
const cdContainer = document.getElementById('cd-player');
const progressBar = document.getElementById('progress-bar');
const progressCont = document.getElementById('progress-container');
const fileCount = document.getElementById('file-count');
const statusMsg = document.getElementById('status-message');
const stationsList = document.getElementById('stations-list');

// LISTA DE RÁDIOS EXPANDIDA (20 Estações)
const stations = [
    { name: 'Jovem Pan FM', desc: 'São Paulo / Pop', url: 'https://streaming.jovempan.com.br/pan', cover: 'https://i.imgur.com/s4A6pNq.png' },
    { name: 'Antena 1', desc: 'Pop / Classic', url: 'https://antenaone.crossradio.com.br/stream/1', cover: 'https://i.imgur.com/cC0kQzC.png' },
    { name: 'Mundo Livre FM', desc: 'Curitiba / Rock', url: 'https://worldfreeradio.radioca.st/1', cover: 'https://i.imgur.com/8P2J3Vn.png' },
    { name: 'Kiss FM', desc: 'Brasil / Classic Rock', url: 'https://stream.kissfm.com.br/kiss', cover: 'https://i.imgur.com/y76m3aH.png' },
    { name: 'Nova Brasil FM', desc: 'MPB', url: 'https://streaming.novabrasilfm.com.br/novabrasil', cover: 'https://i.imgur.com/m2eB7Rj.png' },
    { name: 'Alpha FM', desc: 'Adulto Contemporâneo', url: 'https://26623.live.streamtheworld.com/ALPHAFM_SC', cover: 'https://i.imgur.com/Xy1P0P3.png' },
    { name: '89 FM A Rádio Rock', desc: 'São Paulo / Rock', url: 'https://26583.live.streamtheworld.com/RADIO89_SC', cover: 'https://i.imgur.com/E8R8XyB.png' },
    { name: 'Metropolitana FM', desc: 'Pop / Hits', url: 'https://17103.live.streamtheworld.com/METROPOLITANAFM_SC', cover: 'https://i.imgur.com/uG9p1wE.png' },
    { name: 'Mix FM SP', desc: 'Hits / Jovem', url: 'https://25533.live.streamtheworld.com/MIXFM_SP_SC', cover: 'https://i.imgur.com/qRzYwN2.png' },
    { name: 'Band FM', desc: 'Popular / Pagode', url: 'https://26613.live.streamtheworld.com/BANDFM_SP_SC', cover: 'https://i.imgur.com/6S3v38z.png' },
    { name: 'Gazeta FM', desc: 'São Paulo / Hits', url: 'https://Painel.suaradio.com.br:7010/stream', cover: 'https://i.imgur.com/kS9QzQO.png' },
    { name: 'Transcontinental FM', desc: 'Samba / Pagode', url: 'https://19073.live.streamtheworld.com/TRANS_FM_SP_SC', cover: 'https://i.imgur.com/yK5p9fG.png' },
    { name: 'Rádio Grenal', desc: 'Esportes', url: 'https://20383.live.streamtheworld.com/RADIOGRENAL_SC', cover: 'https://i.imgur.com/5O4f9W5.png' },
    { name: 'Guaíba FM', desc: 'Notícias', url: 'https://20853.live.streamtheworld.com/RADIOGUAIBA_SC', cover: 'https://i.imgur.com/L79pA0X.png' },
    { name: 'Itatiaia FM', desc: 'Notícias / Esportes', url: 'https://26603.live.streamtheworld.com/ITATIAIA_MG_SC', cover: 'https://i.imgur.com/O6LdG3C.png' },
    { name: 'Rádio Gaúcha', desc: 'Notícias', url: 'https://26033.live.streamtheworld.com/GAUCHA_PORTO_ALEGRE_SC', cover: 'https://i.imgur.com/k6O6FfS.png' },
    { name: 'BH FM', desc: 'Belo Horizonte / Hits', url: 'https://23523.live.streamtheworld.com/BHFM_SC', cover: 'https://i.imgur.com/E6f9n1S.png' },
    { name: 'JB FM', desc: 'Rio de Janeiro', url: 'https://25513.live.streamtheworld.com/JBFM_SC', cover: 'https://i.imgur.com/tO9O9O9.png' },
    { name: 'Coca-Cola FM', desc: 'Música Online', url: 'https://192.99.8.192:3032/stream', cover: 'https://i.imgur.com/W6lV6V9.png' },
    { name: 'Rádio Disney', desc: 'Pop / Teen', url: 'https://22553.live.streamtheworld.com/DISNEY_BRAZIL_SC', cover: 'https://i.imgur.com/8QO9I7O.png' }
];

// Funções de UI
function showStatus(msg, type='info') {
    statusMsg.textContent = msg;
    statusMsg.className = 'status-message show ' + type;
    setTimeout(() => statusMsg.classList.remove('show'), 3000);
}

// Lógica MP3
document.getElementById('files').onchange = e => {
    const newFiles = [...e.target.files].filter(f => f.name.toLowerCase().endsWith('.mp3'));
    if (!newFiles.length) return showStatus('Nenhum MP3 válido', 'error');
    files.push(...newFiles);
    order = files.map((_,i)=>i);
    renderPlaylist();
    updateCounts();
    if (files.length === newFiles.length && !isRadioMode) play(0);
};

function play(idx) {
    if (idx < 0 || idx >= order.length) return;
    isRadioMode = false;
    currentIndex = idx;
    const file = files[order[idx]];
    audio.src = URL.createObjectURL(file);
    audio.play();
    updateNowPlayingMP3(order[idx]);
}

function updateNowPlayingMP3(fileIdx) {
    const file = files[fileIdx];
    nowTitle.textContent = file.name.replace(/\.mp3$/i,'');
    nowArtist.textContent = "Arquivo Local";
    cdCover.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300';
    document.getElementById('now-playing-img').src = cdCover.src;
    nowPlaying.classList.add('show');
    cdContainer.classList.remove('hidden');
}

// Lógica Rádio
function renderStations() {
    stationsList.innerHTML = '';
    stations.forEach((station, idx) => {
        const div = document.createElement('div');
        div.className = `station-item ${idx === currentStationIndex && isRadioMode ? 'active' : ''}`;
        div.innerHTML = `
            <i class="fas fa-radio"></i>
            <div class="station-info">
                <div class="station-name">${station.name}</div>
                <div class="station-desc">${station.desc}</div>
            </div>
        `;
        div.onclick = () => playRadioStation(idx);
        stationsList.appendChild(div);
    });
    document.getElementById('station-count').innerText = stations.length + ' estações';
}

function playRadioStation(index) {
    isRadioMode = true;
    currentStationIndex = index;
    const station = stations[index];
    audio.src = station.url;
    audio.play().catch(() => showStatus('Erro ao carregar rádio', 'error'));
    
    nowTitle.textContent = station.name;
    nowArtist.textContent = station.desc;
    cdCover.src = station.cover;
    document.getElementById('now-playing-img').src = station.cover;
    
    nowPlaying.classList.add('show');
    cdContainer.classList.remove('hidden');
    renderStations();
}

// Controles Gerais
function togglePlayPause() {
    if (audio.paused) audio.play(); else audio.pause();
}

function playNext() {
    if (isRadioMode) {
        let next = (currentStationIndex + 1) % stations.length;
        playRadioStation(next);
    } else {
        currentIndex = (currentIndex + 1) % order.length;
        play(currentIndex);
    }
}

function playPrev() {
    if (isRadioMode) {
        let prev = (currentStationIndex - 1 + stations.length) % stations.length;
        playRadioStation(prev);
    } else {
        currentIndex = (currentIndex - 1 + order.length) % order.length;
        play(currentIndex);
    }
}

window.switchMode = function(mode) {
    const isRadio = (mode === 'radio');
    document.getElementById('modeMp3Btn').classList.toggle('active', !isRadio);
    document.getElementById('modeRadioBtn').classList.toggle('active', isRadio);
    document.getElementById('radio-stations').classList.toggle('show', isRadio);
    document.getElementById('mp3-playlist-container').classList.toggle('hidden', isRadio);
};

// Eventos de Áudio
audio.onplay = () => {
    isPlaying = true;
    document.getElementById('play-pause-btn').querySelector('i').className = 'fas fa-pause';
    document.querySelector('.cd-disk').classList.add('playing');
};

audio.onpause = () => {
    isPlaying = false;
    document.getElementById('play-pause-btn').querySelector('i').className = 'fas fa-play';
    document.querySelector('.cd-disk').classList.remove('playing');
};

audio.ontimeupdate = () => {
    if (audio.duration && !isRadioMode) {
        progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
        progressCont.style.display = 'block';
    } else {
        progressCont.style.display = 'none';
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderStations();
});

function openConverter() {
    const url = document.getElementById('yturl').value.trim();
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) return showStatus('URL Inválida','error');
    document.getElementById('converter-frame').src = `https://ezconv.cc/?url=${encodeURIComponent(url)}`;
    document.getElementById('converter-container').style.display = 'flex';
}

function closeConverter() {
    document.getElementById('converter-container').style.display = 'none';
}

function updateCounts() {
    fileCount.textContent = files.length;
    fileCount.style.display = files.length ? 'block' : 'none';
}

function renderPlaylist() {
    playlistEl.innerHTML = '';
    files.forEach((file, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-music"></i> <span>${file.name}</span>`;
        li.onclick = () => play(i);
        playlistEl.appendChild(li);
    });
    document.getElementById('playlist-empty').style.display = files.length ? 'none' : 'block';
}
