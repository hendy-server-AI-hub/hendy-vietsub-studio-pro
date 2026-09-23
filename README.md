# Hendy Vietsub Studio Pro v2.1

CapCut-style video editor with Vietnamese subtitles, Workers AI translation, TTS, filters, transitions, timeline, and bookmarklet.

## What's New in v2.1
- Workers AI integration - free subtitle translation, no API key needed!
- Uses @cf/meta/llama-3.1-8b-instruct model for Vietnamese translation
- Removed Gemini API key requirement

## Deploy

```bash
npm install
npx wrangler login
npx wrangler deploy
```

## Features
- Video editing: cut, split, trim, rotate, flip
- Color filters: 9 presets (Teal & Orange, Vintage, Cyberpunk, Noir, etc.)
- Transitions: Fade, Dissolve, Slide, Zoom, Glitch, Flash
- Audio: extract, voiceover recording, TTS Vietnamese
- Sound FX: Whoosh, Ding, Pop, Boom, Shutter, Glitch
- Subtitles: SRT/VTT import/export, bilingual, sync offset
- AI translation via Workers AI (FREE - no API key)
- Bookmarklet for Vietsub on any website
- Export: Hard sub MP4, SRT, VTT with 720p/1080p/4K @ 30/60fps
- Floating export widget with progress
- Aspect ratios: 16:9, 9:16, 1:1, 4:5, 21:9

## wrangler.toml
The [ai] binding is required for Workers AI translation:
```toml
[ai]
binding = "AI"
```
