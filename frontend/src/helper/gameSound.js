let _ctx = null;

function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
}

function tone(freq, type, startTime, duration, volume = 0.28) {
  const c = ctx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playCorrect() {
  try {
    const c = ctx();
    const t = c.currentTime;
    // C5 E5 G5 ascending chord
    [523, 659, 784].forEach((f, i) => tone(f, 'sine', t + i * 0.07, 0.35));
  } catch {}
}

export function playWrong() {
  try {
    const c = ctx();
    const t = c.currentTime;
    // Two-tone descending buzzer
    tone(280, 'sawtooth', t, 0.15, 0.25);
    tone(220, 'sawtooth', t + 0.15, 0.25, 0.2);
  } catch {}
}

export function playComplete() {
  try {
    const c = ctx();
    const t = c.currentTime;
    // C5 E5 G5 C6 fanfare
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', t + i * 0.11, 0.45, 0.22));
  } catch {}
}
