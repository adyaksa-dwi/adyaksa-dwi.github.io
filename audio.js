// ============================================================
// LUMINA FLUX — AUDIO ENGINE
// Generative Ambient BGM + Procedural SFX
// Powered by Web Audio API — Zero external audio files
// ============================================================

(function () {
    'use strict';

    let audioCtx = null;
    let masterGain = null;
    let bgmGain = null;
    let sfxGain = null;
    let isMuted = false;
    let bgmLayers = [];
    let isInitialized = false;
    let bgmStarted = false;

    // --------------------------------------------------------
    // CONFIGURATION
    // --------------------------------------------------------
    const BGM_VOLUME = 0.045;       // Very subtle ambient volume
    const SFX_VOLUME = 0.12;        // Gentle but audible SFX
    const FADE_DURATION = 1.5;      // Seconds for mute/unmute fade
    const BGM_FADE_IN = 3.0;        // Slow fade-in when BGM starts

    // Ambient pad chord: Cmaj7 voicing (C3, E3, G3, B3)
    // Frequencies chosen for a warm, cinematic, modern feel
    const PAD_VOICES = [
        { freq: 130.81, type: 'sine',     gain: 0.35, detune: 0 },      // C3
        { freq: 164.81, type: 'triangle', gain: 0.20, detune: 3 },      // E3 (slightly sharp for shimmer)
        { freq: 196.00, type: 'sine',     gain: 0.25, detune: -2 },     // G3
        { freq: 246.94, type: 'sine',     gain: 0.18, detune: 5 },      // B3
    ];

    // --------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------
    function initAudio() {
        if (isInitialized) return;

        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            // Master gain (controls overall mute/unmute)
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 1.0;
            masterGain.connect(audioCtx.destination);

            // BGM bus
            bgmGain = audioCtx.createGain();
            bgmGain.gain.value = 0; // Start silent, fade in
            bgmGain.connect(masterGain);

            // SFX bus
            sfxGain = audioCtx.createGain();
            sfxGain.gain.value = SFX_VOLUME;
            sfxGain.connect(masterGain);

            // Restore mute preference
            const savedPref = localStorage.getItem('lumina-sound');
            if (savedPref === 'off') {
                isMuted = true;
                masterGain.gain.value = 0;
            }

            isInitialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // --------------------------------------------------------
    // AMBIENT BGM — Generative Pad
    // --------------------------------------------------------
    function startBGM() {
        if (!isInitialized || bgmStarted || isMuted) return;
        bgmStarted = true;

        // Resume context if suspended (browser autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        // Create a subtle reverb-like effect using a convolver with generated impulse
        const convolver = audioCtx.createConvolver();
        convolver.buffer = createReverbImpulse(2.5, 1.8);
        convolver.connect(bgmGain);

        // Dry/wet mix
        const dryGain = audioCtx.createGain();
        dryGain.gain.value = 0.6;
        dryGain.connect(bgmGain);

        const wetGain = audioCtx.createGain();
        wetGain.gain.value = 0.4;
        wetGain.connect(convolver);

        // Create each voice of the ambient pad
        PAD_VOICES.forEach((voice, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = voice.type;
            osc.frequency.value = voice.freq;
            osc.detune.value = voice.detune;

            // Per-voice gain
            const voiceGain = audioCtx.createGain();
            voiceGain.gain.value = voice.gain;

            // Low-pass filter for warmth
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800 + (i * 200);
            filter.Q.value = 0.5;

            // LFO on filter cutoff — slow organic movement
            const filterLfo = audioCtx.createOscillator();
            filterLfo.type = 'sine';
            filterLfo.frequency.value = 0.05 + (i * 0.02); // Very slow: 0.05-0.11 Hz
            const filterLfoGain = audioCtx.createGain();
            filterLfoGain.gain.value = 200 + (i * 100); // Subtle sweep range
            filterLfo.connect(filterLfoGain);
            filterLfoGain.connect(filter.frequency);
            filterLfo.start(now);

            // LFO on volume — gentle breathing effect
            const volLfo = audioCtx.createOscillator();
            volLfo.type = 'sine';
            volLfo.frequency.value = 0.03 + (i * 0.015); // 0.03-0.075 Hz
            const volLfoGain = audioCtx.createGain();
            volLfoGain.gain.value = voice.gain * 0.3; // 30% volume modulation
            volLfo.connect(volLfoGain);
            volLfoGain.connect(voiceGain.gain);
            volLfo.start(now);

            // Slow detune drift for shimmer
            const detuneLfo = audioCtx.createOscillator();
            detuneLfo.type = 'sine';
            detuneLfo.frequency.value = 0.02 + (i * 0.01);
            const detuneLfoGain = audioCtx.createGain();
            detuneLfoGain.gain.value = 8; // ±8 cents drift
            detuneLfo.connect(detuneLfoGain);
            detuneLfoGain.connect(osc.detune);
            detuneLfo.start(now);

            // Connect chain: osc -> voiceGain -> filter -> dry + wet
            osc.connect(voiceGain);
            voiceGain.connect(filter);
            filter.connect(dryGain);
            filter.connect(wetGain);

            osc.start(now);

            bgmLayers.push({ osc, voiceGain, filter, filterLfo, volLfo, detuneLfo });
        });

        // Fade in BGM smoothly
        bgmGain.gain.setValueAtTime(0, now);
        bgmGain.gain.linearRampToValueAtTime(BGM_VOLUME, now + BGM_FADE_IN);
    }

    // Generate a synthetic reverb impulse response
    function createReverbImpulse(duration, decay) {
        const length = audioCtx.sampleRate * duration;
        const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }
        return impulse;
    }

    // --------------------------------------------------------
    // SFX — Procedural Sound Effects
    // --------------------------------------------------------

    // Soft tap click — for buttons
    function playSfxClick() {
        if (!isInitialized || isMuted) return;
        ensureContextRunning();

        const now = audioCtx.currentTime;

        // Primary tone
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        // Subtle harmonic layer
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1320, now);
        osc2.frequency.exponentialRampToValueAtTime(990, now + 0.05);

        const gain2 = audioCtx.createGain();
        gain2.gain.setValueAtTime(0.06, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        osc2.connect(gain2);
        gain.connect(sfxGain);
        gain2.connect(sfxGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.1);
        osc2.stop(now + 0.08);
    }

    // Whoosh up — for opening overlays/modals
    function playSfxOpen() {
        if (!isInitialized || isMuted) return;
        ensureContextRunning();

        const now = audioCtx.currentTime;
        const duration = 0.25;

        // Rising sweep
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + duration);

        // Noise burst for texture
        const noiseBuffer = createNoiseBuffer(duration);
        const noise = audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1000, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(3000, now + duration);
        noiseFilter.Q.value = 2;

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.03, now);
        noiseGain.gain.linearRampToValueAtTime(0.06, now + duration * 0.3);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(sfxGain);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(sfxGain);

        osc.start(now);
        noise.start(now);
        osc.stop(now + duration + 0.01);
        noise.stop(now + duration + 0.01);
    }

    // Whoosh down — for closing overlays/modals
    function playSfxClose() {
        if (!isInitialized || isMuted) return;
        ensureContextRunning();

        const now = audioCtx.currentTime;
        const duration = 0.2;

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + duration);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + duration + 0.01);
    }

    // Soft tick — for hovering nav links (very subtle)
    function playSfxHover() {
        if (!isInitialized || isMuted) return;
        ensureContextRunning();

        const now = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 1200 + Math.random() * 200; // Slight randomization

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Helper: create noise buffer
    function createNoiseBuffer(duration) {
        const length = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
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

        const now = audioCtx.currentTime;
        isMuted = !isMuted;

        if (isMuted) {
            // Fade out
            masterGain.gain.setValueAtTime(masterGain.gain.value, now);
            masterGain.gain.linearRampToValueAtTime(0, now + FADE_DURATION);
            localStorage.setItem('lumina-sound', 'off');
        } else {
            // Fade in
            masterGain.gain.setValueAtTime(0, now);
            masterGain.gain.linearRampToValueAtTime(1.0, now + FADE_DURATION);
            localStorage.setItem('lumina-sound', 'on');

            // Start BGM if not yet started
            if (!bgmStarted) {
                startBGM();
            }
        }

        // Update button icon
        updateSoundIcon();
        return !isMuted;
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
    function handleFirstInteraction() {
        if (isInitialized) return;

        initAudio();

        if (!isMuted) {
            startBGM();
        }

        updateSoundIcon();

        // Remove listeners after first interaction
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
    }

    // Listen for first interaction
    document.addEventListener('click', handleFirstInteraction, { once: false });
    document.addEventListener('touchstart', handleFirstInteraction, { once: false });
    document.addEventListener('keydown', handleFirstInteraction, { once: false });

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
    };

})();
