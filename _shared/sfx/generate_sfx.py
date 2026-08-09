"""
Synthétise la bibliothèque SFX signature de la chaîne (whoosh, clic d'obturateur, beats)
via numpy/scipy — pas de dépendance à des banques de sons sous licence.

Usage:
    python generate_sfx.py

Sortie (dans le dossier courant, sous-dossiers déjà présents) :
    camera-shutter/shutter_01.wav, shutter_02.wav
    whoosh/whoosh_short.wav, whoosh_medium.wav, whoosh_long.wav
    beats/stab_neutral.wav, stab_dramatic.wav, stab_reveal.wav
"""

import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
HERE = os.path.dirname(__file__)


def bandpass(x, low, high, sr=SR, order=4):
    sos = butter(order, [low, high], btype="band", fs=sr, output="sos")
    return sosfilt(sos, x)


def lowpass(x, cutoff, sr=SR, order=4):
    sos = butter(order, cutoff, btype="low", fs=sr, output="sos")
    return sosfilt(sos, x)


def envelope(n, attack, release, sr=SR):
    a = int(attack * sr)
    r = int(release * sr)
    a = max(a, 1)
    r = max(r, 1)
    sustain_len = max(n - a - r, 0)
    env = np.concatenate([
        np.linspace(0, 1, a),
        np.ones(sustain_len),
        np.linspace(1, 0, r),
    ])
    if len(env) < n:
        env = np.pad(env, (0, n - len(env)))
    return env[:n]


def normalize(x, peak=0.9):
    m = np.max(np.abs(x)) or 1.0
    return (x / m) * peak


def save(path, x):
    x = normalize(x)
    sf.write(path, x.astype(np.float32), SR)
    print(f"  -> {path} ({len(x) / SR:.2f}s)")


# ---------------------------------------------------------------------------
# 1. Camera shutter click — deux variantes (simple / double clic type reflex)
# ---------------------------------------------------------------------------

def make_shutter(double=False):
    duration = 0.14 if not double else 0.22
    n = int(duration * SR)
    noise = np.random.randn(n)
    click = bandpass(noise, 1500, 9000) * envelope(n, 0.0005, 0.03)

    if double:
        gap = int(0.06 * SR)
        n2 = int(0.10 * SR)
        noise2 = np.random.randn(n2)
        click2 = bandpass(noise2, 1200, 7000) * envelope(n2, 0.0005, 0.05) * 0.7
        out = np.zeros(n + gap + n2)
        out[:n] = click
        out[n + gap:n + gap + n2] = click2
        return out

    return click


# ---------------------------------------------------------------------------
# 2. Whoosh — bruit filtré avec un sweep de fréquence (rising puis falling)
# ---------------------------------------------------------------------------

def make_whoosh(duration):
    n = int(duration * SR)
    t = np.linspace(0, 1, n)
    noise = np.random.randn(n)

    # sweep de la fréquence de coupure passe-bas : monte puis redescend
    out = np.zeros(n)
    win = 512
    for i in range(0, n, win):
        frac = i / n
        # courbe en cloche : monte jusqu'à 60% du son, puis redescend
        shape = np.sin(np.pi * frac) ** 0.7
        cutoff = 300 + shape * 4000
        cutoff = min(cutoff, SR / 2 - 100)
        seg = noise[i:i + win]
        if len(seg) == 0:
            continue
        filtered = lowpass(seg, cutoff)
        out[i:i + len(filtered)] = filtered

    out *= envelope(n, duration * 0.15, duration * 0.55)
    return out


# ---------------------------------------------------------------------------
# 3. Beat stabs — accents percussifs courts pour souligner un mot-clé
# ---------------------------------------------------------------------------

def make_stab(freq, duration, noisy=False):
    n = int(duration * SR)
    t = np.linspace(0, duration, n, endpoint=False)
    tone = np.sin(2 * np.pi * freq * t) * np.exp(-t * 14)

    if noisy:
        noise = np.random.randn(n) * np.exp(-t * 30)
        transient = bandpass(noise, 800, 6000)
        tone = tone * 0.8 + transient * 0.5

    tone *= envelope(n, 0.001, duration * 0.85)
    return tone


def main():
    print("Camera shutter...")
    save(os.path.join(HERE, "camera-shutter", "shutter_01.wav"), make_shutter(double=False))
    save(os.path.join(HERE, "camera-shutter", "shutter_02_double.wav"), make_shutter(double=True))

    print("Whoosh...")
    save(os.path.join(HERE, "whoosh", "whoosh_short.wav"), make_whoosh(0.35))
    save(os.path.join(HERE, "whoosh", "whoosh_medium.wav"), make_whoosh(0.55))
    save(os.path.join(HERE, "whoosh", "whoosh_long.wav"), make_whoosh(0.85))

    print("Beat stabs...")
    save(os.path.join(HERE, "beats", "stab_neutral.wav"), make_stab(180, 0.30, noisy=False))
    save(os.path.join(HERE, "beats", "stab_dramatic.wav"), make_stab(90, 0.55, noisy=True))
    save(os.path.join(HERE, "beats", "stab_reveal.wav"), make_stab(130, 0.45, noisy=True))

    print("\nTerminé.")


if __name__ == "__main__":
    main()
