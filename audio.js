// ============================================================
// LUMINA FLUX — AUDIO ENGINE
// Ambient BGM (MP3) + Procedural Modern UI SFX
// ============================================================

(function () {
    'use strict';

    let audioCtx = null;
    let masterGain = null;
    let sfxGain = null;
    let isMuted = false;
    let isInitialized = false;
    
    // BGM Audio Element
    let bgmAudio = null;

    // --------------------------------------------------------
    // CONFIGURATION
    // --------------------------------------------------------
    const BGM_VOLUME = 0.35;        // Volume for the MP3 track
    const SFX_VOLUME = 0.5;         // Modern UI SFX volume
    const FADE_DURATION = 1.5;      // Seconds for mute/unmute fade

    // Initialize BGM Audio Element immediately so it preloads before first click
    bgmAudio = new Audio('./assets/audio/bgm.mp3');
    bgmAudio.loop = true;
    bgmAudio.volume = BGM_VOLUME;
    bgmAudio.preload = 'auto'; // Force browser to buffer it

    // --------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------
    function initAudio() {
        if (isInitialized) return;

        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            // Master gain (controls overall SFX mute)
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 1.0;
            masterGain.connect(audioCtx.destination);

            // SFX bus
            sfxGain = audioCtx.createGain();
            sfxGain.gain.value = SFX_VOLUME;
            sfxGain.connect(masterGain);

            // Restore mute preference
            const savedPref = localStorage.getItem('lumina-sound');
            if (savedPref === 'off') {
                isMuted = true;
                masterGain.gain.value = 0;
                bgmAudio.volume = 0;
            }

            isInitialized = true;
        } catch (e) {
            console.warn('Audio setup failed:', e);
        }
    }

    // --------------------------------------------------------
    // AMBIENT BGM
    // --------------------------------------------------------
    function startBGM() {
        if (!isInitialized || isMuted) return;
        
        // Play the MP3
        if (bgmAudio.paused) {
            bgmAudio.play().catch(e => console.log('BGM Autoplay prevented:', e));
        }
    }

    // --------------------------------------------------------
    // SFX — Modern Procedural UI Sounds
    // --------------------------------------------------------

    // Modern UI Click (Glass/Mechanical tap)
    function playSfxClick() {
        if (!isInitialized || isMuted) return;
        ensureContextRunning();

        const now = audioCtx.currentTime;
        const duration = 0.04;

        // Sharp descending triangle for the "tap"
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + duration);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + duration);
    }

    // Modern UI Open (Soft rising sweep)
    function playSfxOpen() {
        if (!isInitialized || isMuted) return;
        ensureContextRunning();

        const now = audioCtx.currentTime;
        const duration = 0.15;

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + duration);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + duration * 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + duration + 0.01);
    }

    // Modern UI Close (Soft descending sweep)
    function playSfxClose() {
        if (!isInitialized || isMuted) return;
        ensureContextRunning();

        const now = audioCtx.currentTime;
        const duration = 0.15;

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + duration);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + duration + 0.01);
    }

    // Modern UI Hover (Tiny tick)
    function playSfxHover() {
        if (!isInitialized || isMuted) return;
        ensureContextRunning();

        const now = audioCtx.currentTime;
        const duration = 0.015;

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + duration);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + duration);
    }

    // Ensure AudioContext is running (browser policy)
    function ensureContextRunning() {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // --------------------------------------------------------
    // TOGGLE SOUND ON/OFF
    // --------------------------------------------------------
    function toggleSound() {
        if (!isInitialized) {
            initAudio();
        }
        ensureContextRunning();

        isMuted = !isMuted;
        const now = audioCtx.currentTime;

        if (isMuted) {
            // Mute SFX
            masterGain.gain.setValueAtTime(masterGain.gain.value, now);
            masterGain.gain.linearRampToValueAtTime(0, now + FADE_DURATION);
            
            // Mute BGM smoothly using a small interval loop
            fadeOutAudio(bgmAudio, FADE_DURATION);
            
            localStorage.setItem('lumina-sound', 'off');
        } else {
            // Unmute SFX
            masterGain.gain.setValueAtTime(0, now);
            masterGain.gain.linearRampToValueAtTime(1.0, now + FADE_DURATION);
            
            // Unmute/Play BGM smoothly
            fadeInAudio(bgmAudio, BGM_VOLUME, FADE_DURATION);
            
            localStorage.setItem('lumina-sound', 'on');
            startBGM();
        }

        // Update button icon
        updateSoundIcon();
        return !isMuted;
    }

    // Helper for HTML5 Audio Fade Out
    function fadeOutAudio(audioEl, durationSec) {
        if (!audioEl) return;
        const steps = 20;
        const stepTime = (durationSec * 1000) / steps;
        const stepVol = audioEl.volume / steps;
        
        let currentVol = audioEl.volume;
        const fadeInterval = setInterval(() => {
            currentVol = Math.max(0, currentVol - stepVol);
            audioEl.volume = currentVol;
            if (currentVol <= 0) {
                clearInterval(fadeInterval);
                audioEl.pause();
            }
        }, stepTime);
    }

    // Helper for HTML5 Audio Fade In
    function fadeInAudio(audioEl, targetVol, durationSec) {
        if (!audioEl) return;
        audioEl.play().catch(() => {}); // Attempt play
        const steps = 20;
        const stepTime = (durationSec * 1000) / steps;
        const stepVol = targetVol / steps;
        
        audioEl.volume = 0;
        let currentVol = 0;
        const fadeInterval = setInterval(() => {
            currentVol = Math.min(targetVol, currentVol + stepVol);
            audioEl.volume = currentVol;
            if (currentVol >= targetVol) {
                clearInterval(fadeInterval);
            }
        }, stepTime);
    }

    function updateSoundIcon() {
        const icon = document.getElementById('sound-icon');
        if (icon) {
            icon.textContent = isMuted ? 'volume_off' : 'volume_up';
        }
    }

    // --------------------------------------------------------
    // AUTO-START: Initialize on first user interaction
    // --------------------------------------------------------
    function tryPlayBGM() {
        if (!isMuted && bgmAudio && bgmAudio.paused) {
            const playPromise = bgmAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log('BGM Play prevented or failed:', err);
                    // Re-attach only strong user interactions to try playing BGM later
                    document.addEventListener('click', tryPlayBGM, { once: true });
                    document.addEventListener('touchstart', tryPlayBGM, { once: true });
                    document.addEventListener('keydown', tryPlayBGM, { once: true });
                });
            }
        }
    }

    function handleFirstInteraction(e) {
        if (isInitialized) return;

        initAudio(); // This sets isInitialized = true, enabling SFX

        // Remove listeners immediately to prevent spam
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('mousemove', handleFirstInteraction);
        document.removeEventListener('scroll', handleFirstInteraction);

        updateSoundIcon();

        // Try playing BGM (if it fails, it will re-attach BGM-only listeners, keeping SFX active)
        tryPlayBGM();
    }

    // Listen for any interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('mousemove', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);

    // --------------------------------------------------------
    // PUBLIC API
    // --------------------------------------------------------
    window.luminaAudio = {
        toggleSound,
        playSfxClick,
        playSfxOpen,
        playSfxClose,
        playSfxHover,
        isMuted: () => isMuted,
        pauseBGM: () => {
            if (bgmAudio && !bgmAudio.paused) {
                fadeOutAudio(bgmAudio, FADE_DURATION);
            }
        },
        resumeBGM: () => {
            if (bgmAudio && bgmAudio.paused && !isMuted) {
                fadeInAudio(bgmAudio, BGM_VOLUME, FADE_DURATION);
            }
        }
    };

})();
