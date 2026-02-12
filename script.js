let audio = document.getElementById('audio');
let files = [], order = [], currentIndex = 0;
let isShuffle = false, isRepeat = false, isPlaying = false;
let isRadioMode = false;
let currentStationIndex = 0;

const stations = [
    { name: 'Jovem Pan FM', desc: 'Pop/Hits', url: 'https://streaming.jovempan.com.br/pan', cover: 'https://i.imgur.com/s4A6pNq.png' },
    { name: 'Antena 1', desc: 'Pop/Classic', url: 'https://antenaone.crossradio.com.br/stream/1', cover: 'https://i.imgur.com/cC0kQzC.png' },
    { name: '89 FM A Rádio Rock', desc: 'Rock', url: 'https://26583.live.streamtheworld.com/RADIO89_SC', cover: 'https://i.imgur.com/E8R8XyB.png' },
    { name: 'Kiss FM', desc: 'Classic Rock', url: 'https://stream.kissfm.com.br/kiss', cover: 'https://i.imgur.com/y76m3aH.png' },
    { name: 'Alpha FM', desc: 'Adulto/Contemporâneo', url: 'https://26623.live.streamtheworld.com/ALPHAFM_SC', cover: 'https://i.imgur.com/Xy1P0P3.png' },
    { name: 'Mix FM SP', desc: 'Hits', url: 'https://25533.live.streamtheworld.com/MIXFM_SP_SC', cover: 'https://i.imgur.com/qRzYwN2.png' },
    { name: 'Nova Brasil FM', desc: 'MPB', url: 'https://streaming.novabrasilfm.com.br/novabrasil', cover: 'https://i.imgur.com/m2eB7Rj.png' },
    { name: 'Metropolitana FM', desc: 'Hits/Jovem', url: 'https://17103.live.streamtheworld.com/METROPOLITANAFM_SC', cover: 'https://i.imgur.com/uG9p1wE.png' },
    { name: 'Mundo Livre FM', desc: 'Rock Alternativo', url: 'https://worldfreeradio.radioca.st/1', cover: 'https://i.imgur.com/8P2J3Vn.png' },
    { name: 'Band FM', desc: 'Popular/Pagode', url: 'https://26613.live.streamtheworld.com/BANDFM_SP_SC', cover: 'https://i.imgur.com/6S3v38z.png' },
    { name: 'Gazeta FM', desc: 'Hits', url: 'https://Painel.suaradio.com.br:7010/stream', cover: 'https://i.imgur.com/kS9QzQO.png' },
    { name: 'Transcontinental FM', desc: 'Samba/Pagode', url: 'https://19073.live.streamtheworld.com/TRANS_FM_SP_SC', cover: 'https://i.imgur.com/yK5p9fG.png' },
    { name: 'Rádio Disney', desc: 'Pop/Teen', url: 'https://22553.live.streamtheworld.com/DISNEY_BRAZIL_SC', cover: 'https://i.imgur.com/8QO9I7O.png' },
    { name: 'JB FM', desc: 'Rio de Janeiro', url: 'https://25513.live.streamtheworld.com/JBFM_SC', cover: 'https://i.imgur.com/tO9O9O9.png' },
    { name: 'Rádio Gaúcha', desc: 'Notícias', url: 'https://26033.live.streamtheworld.com/GAUCHA_PORTO_ALEGRE_SC', cover: 'https://i.imgur.com/k6O6FfS.png' },
    { name: 'Itatiaia FM', desc: 'Notícias/MG', url: 'https://26603.live.streamtheworld.com/ITATIAIA_MG_SC', cover: 'https://i.imgur.com/O6LdG3C.png' },
    { name: 'BH FM', desc: 'Hits', url: 'https://23523.live.streamtheworld.com/BHFM_SC', cover: 'https://i.imgur.com/E6f9n1S.png' },
    { name: 'Guaíba FM', desc: 'Notícias/RS', url: 'https://20853.live.streamtheworld.com/RADIOGUAIBA_SC', cover: 'https://i.imgur.com/L79pA0X.png' },
    { name: 'Rádio Grenal', desc: 'Esportes', url: 'https://20383.live.streamtheworld.com/RADIOGRENAL_SC', cover: 'https://i.imgur.com/5O4f9W5.png' },
    { name: 'Coca-Cola FM', desc: 'Pop/Hits', url: 'https://192.99.8.192:3032/stream', cover: 'https://i.imgur.com/W6lV6V9.png' }
];

function showStatus(msg) {
    const el = document.getElementById('status-message');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

document.getElementById('files').onchange = e => {
    const newFiles = [...e.target.files].filter(f => f.name.toLowerCase().endsWith('.mp3'));
    if (!newFiles.length) return;
    files.push(...newFiles);
    order = files.map((_,i)=>i);
    renderPlaylist();
    document.getElementById('file-count').textContent = files.length;
    document.getElementById('file-count').style.display = 'block';
    if (files.length === newFiles.length) play(0);
};

function play(idx) {
    if (idx < 0 || idx >= order.length) return;
    isRadioMode = false;
    currentIndex = idx;
    const file = files[order[idx]];
    audio.src = URL.createObjectURL(file);
    audio.play();
    updateUI(file.name.replace('.mp3',''), 'Arquivo Local', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300');
}

function playRadioStation(idx) {
    isRadioMode = true;
    currentStationIndex = idx;
    const s = stations[idx];
    audio.src = s.url;
    audio.play().catch(() => showStatus('Erro ao carregar rádio'));
    updateUI(s.name, s.desc, s.cover);
    renderStations();
}

function updateUI(title, artist, cover) {
    document.getElementById('now-playing-title').textContent = title;
    document.getElementById('now-playing-artist').textContent = artist;
    document.getElementById('cd-cover').src = cover;
    document.getElementById('now-playing-img').src = cover;
    document.getElementById('now-playing').classList.add('show');
    document.getElementById('cd-player').classList.remove('hidden');
}

function togglePlayPause() {
    if (audio.paused) audio.play(); else audio.pause();
}

function playNext() {
    if (isRadioMode) playRadioStation((currentStationIndex + 1) % stations.length);
    else play((currentIndex + 1) % order.length);
}

function playPrev() {
    if (isRadioMode) playRadioStation((currentStationIndex - 1 + stations.length) % stations.length);
    else play((currentIndex - 1 + order.length) % order.length);
}

window.switchMode = mode => {
    isRadioMode = (mode === 'radio');
    document.getElementById('modeMp3Btn').classList.toggle('active', !isRadioMode);
    document.getElementById('modeRadioBtn').classList.toggle('active', isRadioMode);
    document.getElementById('radio-stations').classList.toggle('show', isRadioMode);
    document.getElementById('mp3-playlist-container').classList.toggle('hidden', isRadioMode);
};

function renderStations() {
    const list = document.getElementById('stations-list');
    list.innerHTML = '';
    stations.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = `station-item ${i === currentStationIndex && isRadioMode ? 'active' : ''}`;
        div.innerHTML = `<i class="fas fa-radio"></i> <div class="station-info"><div class="station-name">${s.name}</div><div class="station-desc">${s.desc}</div></div>`;
        div.onclick = () => playRadioStation(i);
        list.appendChild(div);
    });
    document.getElementById('station-count').textContent = stations.length + ' estações';
}

function renderPlaylist() {
    const list = document.getElementById('playlist');
    list.innerHTML = '';
    files.forEach((f, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-music"></i> ${f.name}`;
        li.onclick = () => play(i);
        list.appendChild(li);
    });
    document.getElementById('playlist-empty').style.display = files.length ? 'none' : 'block';
    document.getElementById('playlist-count').textContent = files.length + ' músicas';
}

audio.onplay = () => {
    document.getElementById('play-pause-btn').querySelector('i').className = 'fas fa-pause';
    document.querySelector('.cd-disk').classList.add('playing');
};
audio.onpause = () => {
    document.getElementById('play-pause-btn').querySelector('i').className = 'fas fa-play';
    document.querySelector('.cd-disk').classList.remove('playing');
};
audio.ontimeupdate = () => {
    if (!isRadioMode && audio.duration) {
        document.getElementById('progress-container').style.display = 'block';
        document.getElementById('progress-bar').style.width = (audio.currentTime / audio.duration * 100) + '%';
    } else {
        document.getElementById('progress-container').style.display = 'none';
    }
};

function openConverter() {
    const url = document.getElementById('yturl').value.trim();
    if (!url.includes('youtu')) return showStatus('Link inválido');
    document.getElementById('converter-frame').src = `https://ezconv.cc/?url=${encodeURIComponent(url)}`;
    document.getElementById('converter-container').style.display = 'flex';
}
function closeConverter() { document.getElementById('converter-container').style.display = 'none'; }

document.addEventListener('DOMContentLoaded', renderStations);
