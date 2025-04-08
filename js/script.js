document.addEventListener("DOMContentLoaded", function () {
    const playlistData = [
        "audio/A_Familia_Como_Vai.mp3",
        "audio/Ele_Tem_o_Mundo_em_Suas_Maos.mp3",
        "audio/Ida_Quem_eh_que_vai.mp3",
        "audio/Move_te_em_Mim.mp3",
        "audio/Oracao_da_Noite_mais_outro_dia_findou.mp3",
        "audio/Quero_Louvar-te.mp3",
        "audio/Quero_Ouvir_Teu_Apelo.mp3",
        "audio/Oracao_pela_Familia.mp3",
        "audio/Oracao_Pela_Paz.mp3",
        "audio/Pelas_Estradas_da_Vida.mp3",
        "audio/Poe_Tua_mao.mp3",
        "audio/Salmo_138_Tu_me_Conheces.mp3",
        "audio/Senhor_Se_Tu_Me_Chamas.mp3",
        "audio/Tomado_Pela_Mao.mp3",
        "audio/Um_certo_Galileu.mp3"
    ];
    const titulosFormatados = {
        "A Familia Como Vai": "A Família, Como Vai",
        "Ele Tem O Mundo em Suas Maos": "Ele Tem o Mundo em Suas Mãos",
        "Ida Quem eh Que Vai": "Ida (Quem eh Que Vai)",
        "Move Te em Mim":"Move-te Em Mim",
        "Tomado Pela Mao": "Tomado Pela Mão",
        "Poe Tua Mao": "Põe Tua Mão",
        "Oracao da Noite Mais Outro Dia Findou": "Oração da Noite (mais outro dia findou)",
        "Oracao Pela Paz": "Oração Pela Paz",
        "Oracao Pela Familia": "Oração pela Família",
        "Salmo 138 Tu me Conheces": "Salmo 138 Tu me Conheces",
        "Senhor Se Tu Me Chamas": "Senhor, Se Tu Me Chamas",
        "Um Certo Galileu": "Um Certo Galileu"
    };
    
    

    let playlist = document.getElementById("playlist");
    let currentPlaying = null;
    let currentIndex = -1;
    let letraDiv = document.querySelector(".letra");
    let visiblePlaylist = [...playlistData];
    // let lastVolume = 1;

    // Referências do player fixo
    const fixedPlayer = document.getElementById("fixedPlayer");
    const fixedPlayBtn = document.getElementById("fixedPlayBtn");
    const fixedPlayBtnPlay = document.getElementById("fixedPlayBtnPlay");
    const prevBtn = document.querySelector(".control-btn.prev");
    const nextBtn = document.querySelector(".control-btn.next");
    const fixedSongTitle = document.getElementById("fixedSongTitle");
    const fixedProgressBar = document.getElementById("fixedProgressBar");
    const fixedTimeDisplay = document.getElementById("fixedTimeDisplay");
    const fixedTotalTimeDisplay = document.getElementById("fixedTotalTimeDisplay");
    // const volumeIcon = document.getElementById("volumeIcon");
    // const volumeControl = document.getElementById("volumeControl");

    function formatarTitulo(caminho) {
        const nomeArquivo = caminho.split("/").pop().replace(".mp3", "");
        const palavras = nomeArquivo.split("_");
    
        let tituloGerado = palavras.map(p => {
            if (["da", "de", "do", "das", "dos", "eh", "e", "em"].includes(p.toLowerCase())) {
                return p.toLowerCase();
            }
            return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
        }).join(" ");
    
        return titulosFormatados[tituloGerado] || tituloGerado;
    }
    
    function stopAllAudiosExcept(currentAudio) {
        document.querySelectorAll("audio").forEach(audioEl => {
            if (audioEl !== currentAudio) {
                audioEl.pause();
                audioEl.currentTime = 0;
                let btn = audioEl.parentElement?.querySelector(".play-btn");
                if (btn) btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
            }
        });
    }
    

    function loadSongs(filteredData) {
        visiblePlaylist = filteredData;
        playlist.innerHTML = '';

        filteredData.forEach(src => {
            let title = formatarTitulo(src);

            let musicItem = document.createElement("div");
            musicItem.classList.add("playlist-item");

            let playBtn = document.createElement("button");
            playBtn.classList.add("play-btn");
            playBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';

            let songTitle = document.createElement("strong");
            songTitle.classList.add("song-title");
            songTitle.textContent = title;

            let audio = document.createElement("audio");
            let source = document.createElement("source");
            source.src = src;
            source.type = "audio/mpeg";
            audio.appendChild(source);

            // Atualiza automaticamente o ícone do botão conforme o estado do áudio
            audio.addEventListener("play", () => { 
                playBtn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
            });
            audio.addEventListener("pause", () => { 
                playBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
            });

            playBtn.addEventListener("click", () => {
                currentIndex = visiblePlaylist.indexOf(src);
                if (audio.paused) {
                    stopAllAudiosExcept(audio);
                    audio.play();
                    currentPlaying = audio;
                    showFixedPlayer(title, audio);
            
                    letraDiv.innerHTML = `<h4>${title}</h4><pre>${letras[title] || "Letra não encontrada."}</pre>`;
                    letraDiv.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    audio.pause();
                    currentPlaying = null;
                    hideFixedPlayer();
                }
            });
            

            musicItem.appendChild(playBtn);
            musicItem.appendChild(songTitle);

            playlist.appendChild(musicItem);
            playlist.appendChild(audio);

            // Mostra a letra da música ao clicar
            musicItem.style.cursor = "pointer";
            musicItem.addEventListener("click", (e) => {
                if (e.target.closest(".play-btn")) return;
            
                let nomeOriginal = title.trim();
                letraDiv.innerHTML = `<h4>${nomeOriginal}</h4><pre>${letras[nomeOriginal] || "Letra não encontrada."}</pre>`;
            
                // Só exibe o fixedPlayer se nenhuma música estiver tocando
                const isSameAudio = currentPlaying === audio;
                if (!currentPlaying || currentPlaying.paused || isSameAudio) {
                    showFixedPlayer(title, audio);
                }
            });

            // Exibe automaticamente a letra da primeira música
            if (filteredData.length > 0 && !currentPlaying) {
                const firstTitle = formatarTitulo(filteredData[0]);
                letraDiv.innerHTML = `<h4>${firstTitle}</h4><pre>${letras[firstTitle] || "Letra não encontrada."}</pre>`;
            }

                      
        });
        // Controle de volume
        // volumeControl.addEventListener("input", () => {
        //     audio.volume = volumeControl.value;
        // });

        // // Define o volume inicial
        // audio.volume = volumeControl.value;
    }

    function showFixedPlayer(title, audio) {
        fixedPlayer.classList.remove("hidden");
        fixedSongTitle.textContent = title;

        // Atualiza automaticamente o ícone do botão fixo conforme o estado do áudio
        audio.addEventListener("play", () => {
            fixedPlayBtn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
        });
        audio.addEventListener("pause", () => {
            fixedPlayBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
        });
        audio.addEventListener("play", () => {
            fixedPlayBtnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
        });
        audio.addEventListener("pause", () => {
            fixedPlayBtnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
        });

        fixedPlayBtn.onclick = () => {
            if (audio.paused) {
                stopAllAudiosExcept(audio);
                audio.play();
            } else {
                audio.pause();
            }
        };
        fixedPlayBtnPlay.onclick = () => {
            if (audio.paused) {
                stopAllAudiosExcept(audio);
                audio.play();
            } else {
                audio.pause();
            }
        };

        audio.addEventListener("timeupdate", () => {
            let progress = (audio.currentTime / audio.duration) * 100;
            fixedProgressBar.value = progress;

            let minutes = Math.floor(audio.currentTime / 60);
            let seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
            fixedTimeDisplay.textContent = `${minutes}:${seconds}`;
        });

        // Atualiza o tempo total: se já estiver carregado, atualiza imediatamente; caso contrário, aguarda o loadedmetadata
        if (audio.readyState > 0 && audio.duration > 0) {
            let totalMinutes = Math.floor(audio.duration / 60);
            let totalSeconds = Math.floor(audio.duration % 60).toString().padStart(2, "0");
            fixedTotalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds}`;
        } else {
            audio.addEventListener("loadedmetadata", () => {
                let totalMinutes = Math.floor(audio.duration / 60);
                let totalSeconds = Math.floor(audio.duration % 60).toString().padStart(2, "0");
                fixedTotalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds}`;
            });
        }

               // Controle de volume
        // volumeControl.addEventListener("input", () => {
        //     audio.volume = volumeControl.value;
        //     lastVolume = audio.volume; 
        // });

        // Botão de mute/unmute
        // volumeIcon.addEventListener("click", () => {
        //     if (audio.volume > 0) {
        //         lastVolume = audio.volume; 
        //         audio.volume = 0;
        //         volumeControl.value = 0;
        //         volumeIcon.textContent = "🔇";
        //     } else {
        //         audio.volume = lastVolume;
        //         volumeControl.value = lastVolume;
        //         volumeIcon.textContent = "🔊";
        //     }
        // });

        // audio.volume = volumeControl.value;

        fixedProgressBar.addEventListener("input", () => {
            audio.currentTime = (fixedProgressBar.value / 100) * audio.duration;
        });
    }

    function hideFixedPlayer() {
        fixedPlayer.classList.add("hidden");
        fixedSongTitle.textContent = "Nenhuma música";
        fixedPlayBtn.textContent = '<i class="fa-solid fa-circle-play"></i>';
        fixedPlayBtnPlay.textContent = '<i class="fa-solid fa-circle-play"></i>';
        fixedProgressBar.value = 0;
        fixedTimeDisplay.textContent = "0:00";
        fixedTotalTimeDisplay.textContent = "0:00";
    }

    function searchSongs() {
        let searchQuery = document.getElementById("searchInput").value.toLowerCase();
        let filteredData = playlistData.filter(song => song.toLowerCase().includes(searchQuery));
        loadSongs(filteredData);
    }
    function playSongAtIndex(index) {
        if (index >= 0 && index < visiblePlaylist.length) {
            if (currentPlaying) {
                currentPlaying.pause();
                currentPlaying.currentTime = 0;
            }
    
            const src = visiblePlaylist[index];
            const title = formatarTitulo(src);
    
            const audio = Array.from(document.querySelectorAll("audio")).find(a => {
                const source = a.querySelector("source");
                return source && source.src.endsWith(src);
            });
    
            if (audio) {
                stopAllAudiosExcept(audio);
                currentPlaying = audio;
                currentIndex = index;
                audio.play();
                showFixedPlayer(title, audio);
    
                letraDiv.innerHTML = `<h4>${title}</h4><pre>${letras[title] || "Letra não encontrada."}</pre>`;
                letraDiv.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                console.error("Áudio não encontrado para src:", src);
            }
        }
    }
    
    
    const toggleBtn = document.getElementById('toggleControlsBtn');
    const player = document.getElementById('fixedPlayer');
  
    toggleBtn.addEventListener('click', () => {
      player.classList.toggle('expanded');
      toggleBtn.innerHTML = player.classList.contains('expanded') 
      ? '<i class="fa-solid fa-chevron-down"></i>' 
      : '<i class="fa-solid fa-chevron-up"></i>';
    });
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            playSongAtIndex(currentIndex - 1);
        }
    });
    
    nextBtn.addEventListener("click", () => {
        if (currentIndex < playlistData.length - 1) {
            playSongAtIndex(currentIndex + 1);
        }
    });
    
    document.getElementById("searchInput").addEventListener("input", searchSongs);
    loadSongs(playlistData);
});
