# Outils de montage — Inventaire général

## Outils installés et disponibles

### Traitement vidéo / audio

| Outil | Version | Rôle |
|-------|---------|------|
| **ffmpeg** | 6.1.1 | Encodage, découpe, concaténation, normalisation, mixage audio/vidéo, burn-in sous-titres, overlays |
| **ffprobe** | 6.1.1 | Inspection des fichiers (durée, codec, résolution, fps, bitrate) |

**Opérations ffmpeg courantes :**
- Extraction de segments : `ffmpeg -ss START -t DURATION -i input.mp4 -vf "scale=1920:1080:..." output.mp4`
- Concaténation : `ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4`
- Normalisation : `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black`
- Mixage voix + broll : `ffmpeg -i broll.mp4 -i voix.m4a -c:v copy -c:a aac -shortest output.mp4`
- Burn-in sous-titres : `ffmpeg -i video.mp4 -vf "ass=subtitles.ass" output.mp4`
- Reset PTS : `setpts=PTS-STARTPTS` (fix décalages après concat)

---

### Remotion — Animations programmatiques

| Élément | Détail |
|---------|--------|
| **Emplacement** | `_shared/remotion/` |
| **Runtime** | Node.js v22.22.1 + npx |
| **Framework** | React 19 + TypeScript 5.9 |
| **3D** | three.js 0.185 + @react-three/fiber + @react-three/drei |
| **Cartes** | react-simple-maps + topojson-client |
| **Polices** | @remotion/google-fonts |
| **Commandes** | `npx remotion studio` (preview) · `npx remotion render` (export MP4) |



---

### Python — Bibliothèques installées

| Bibliothèque | Version | Rôle |
|-------------|---------|------|
| **Pillow** | 10.2.0 | Génération d'images frame par frame (intro, transitions, Ken Burns, overlays) |
| **requests** | 2.31.0 | Appels API (ScreenshotOne, PostCapture, Pixabay, Pexels) |

**Bibliothèques utilisables mais non confirmées installées** (à vérifier si besoin) :
- `numpy` — synthèse audio, manipulation de frames
- `scipy` — filtres audio (butter, sosfilt)
- `soundfile` — écriture de fichiers audio
- `groq` — API Groq pour transcription Whisper

---

### APIs externes

| API | Rôle | Auth |
|-----|------|------|
| **Groq Whisper** | Transcription audio word-level (`whisper-large-v3`) | Clé API dans `.env` |
| **ScreenshotOne** | Capture de screenshots de pages web | Clé API |
| **PostCapture** | Capture de posts sociaux (x.com, twitter, tiktok, bsky) | Clé API |
| **Pixabay** | Vidéos et images libres de droits (CC0) | Clé API dans `.env` |
| **Pexels** | Vidéos et images libres de droits | Clé API dans `.env` |

---

### SnapGen — Génération visuelle

generation des clips video et des photos par IA.  Modèle utilisé veo flash et grok



## Effets & techniques disponibles

| Technique | Outil | Description |
|-----------|-------|-------------|
| **Ken Burns** | PIL + ffmpeg | Zoom/pan progressif sur image statique → clip vidéo |
| **Show-then-tell** | Script Python | Image arrive 0.5s avant la voix (anticipation) |
| **Loop animation** | ffmpeg `-stream_loop -1` | Boucler un clip court pour remplir un segment long |
| **Fade in/out** | ffmpeg `fade=t=in:st=0:d=0.5` | Fondu entrée/sortie |
| **Crossfade** | ffmpeg `xfade` filter | Transition douce entre deux clips |
| **Scan line** | PIL | Ligne horizontale qui traverse l'écran (effet radar) |
| **Synthèse audio** | numpy + scipy | Génération de sons (impact, swoosh, résonance) |
| **Burn-in sous-titres** | ffmpeg + `.ass` | Incrustation de sous-titres stylisés |
| **Overlay CTA** | ffmpeg `overlay` filter | Incrustation d'animation d'abonnement |
| **Normalisation** | ffmpeg `scale+pad` | Tous les clips → 1920×1080 avec letterbox |
| **Reset PTS** | ffmpeg `setpts=PTS-STARTPTS` | Fix des décalages après concaténation |

---

## Format de sortie standard

| Paramètre | Valeur |
|-----------|--------|
| Résolution | 1920×1080 |
| FPS | 25 |
| Codec vidéo | H.264 (libx264, CRF 22) |
| Codec audio | AAC |
| Pixel format | yuv420p |

---

## Étapes du pipeline de montage

```
1. Transcription voix-off     → Groq Whisper (timestamps word-level)
2. Capture visuelle           → ScreenshotOne / PostCapture / manuel
3. Génération animations      → Remotion (npx remotion render)
4. Génération intro           → PIL (frame par frame) → ffmpeg → MP4
5. Assemblage b-roll          → ffmpeg (extraction + normalisation + concat)
6. Mixage b-roll + voix       → ffmpeg (mux audio/vidéo)
7. Transitions                → numpy/scipy (audio) + PIL (visuel) → ffmpeg
8. Sous-titres                → génération .ass → ffmpeg burn-in
9. Overlay CTA                → ffmpeg overlay filter
10. Export final              → ffmpeg (encodage H.264)
```
