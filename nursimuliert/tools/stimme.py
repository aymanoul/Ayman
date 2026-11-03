#!/usr/bin/env python3
"""Erzaehlerstimme: Stimme aus einer Stimmprobe klonen (Chatterbox Multilingual, MIT-Lizenz)
und mit faster-whisper pruefen. Laeuft in der eigenen Umgebung .venv-stimme:

  .venv-stimme/bin/python tools/stimme.py vorbereiten <stimmprobe.(mp3|m4a|wav|aac|ogg|mp4)> [--bereich 2.0-15.5]
  .venv-stimme/bin/python tools/stimme.py erzeugen          # 12 Saetze x 3 Versionen, bis zu 5 Runden
  .venv-stimme/bin/python tools/stimme.py zusammensetzen    # audio/stimme.wav + audio/transkript.json
  .venv-stimme/bin/python tools/stimme.py alles <stimmprobe>

Ergebnisse:
  audio/stimmprobe_original.<endung>  unveraenderte Kopie (schreibgeschuetzt)
  audio/referenz.wav                  10-20 s saubere Sprache, Mono
  audio/saetze/satz_XX.wav            gewaehlte Version je Satz (zum Austauschen)
  audio/stimme.wav                    fertige Sprachspur, -16 LUFS
  audio/transkript.json               Wortzeiten (faster-whisper, word_timestamps, vad_filter)
  audio/hinweise.txt                  Saetze, die auch nach 5 Versuchen nicht sauber sind
"""
import json, os, re, shutil, stat, subprocess, sys, inspect, unicodedata
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, 'audio', *p)
WORK = A('work')
SR_OUT = 48000
VERSIONS, MAX_ROUNDS = 3, 5
EXAGGERATION, CFG_WEIGHT = 0.4, 0.4
WHISPER_MODEL = os.environ.get('WHISPER_MODEL', 'large-v3')

NUM_WORDS = {'0': 'null', '1': 'eins', '2': 'zwei', '3': 'drei', '4': 'vier', '5': 'fünf', '6': 'sechs', '7': 'sieben',
             '8': 'acht', '9': 'neun', '10': 'zehn', '11': 'elf', '12': 'zwölf'}


def ff(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def read_wav(path):
    import soundfile as sf
    x, sr = sf.read(path, dtype='float64', always_2d=False)
    if x.ndim > 1:
        x = x.mean(1)
    return x, sr


def write_wav(path, x, sr):
    import soundfile as sf
    sf.write(path, np.asarray(x, dtype=np.float32), sr)


def norm_words(text):
    text = unicodedata.normalize('NFC', text.lower())
    toks = re.findall(r"[\wäöüß]+", text)
    return [NUM_WORDS.get(t, t) for t in toks]


def frame_rms_db(x, sr, win=0.02):
    n = int(win * sr)
    m = len(x) // n
    r = np.sqrt(np.mean(x[: m * n].reshape(m, n) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(r), n


def load_story():
    return json.load(open(os.path.join(ROOT, 'story', 'shots.json'), encoding='utf-8'))


# ------------------------------------------------------------------ 1. Stimmprobe vorbereiten

def vorbereiten(src, bereich=None):
    os.makedirs(WORK, exist_ok=True)
    ext = os.path.splitext(src)[1].lower() or '.bin'
    orig = A('stimmprobe_original' + ext)
    if not os.path.exists(orig):
        shutil.copyfile(src, orig)
        os.chmod(orig, stat.S_IRUSR | stat.S_IRGRP | stat.S_IROTH)  # Original nie veraendern
    mono = os.path.join(WORK, 'probe_mono.wav')
    ff(['-i', orig, '-vn', '-ac', '1', '-ar', '24000', mono])
    x, sr = read_wav(mono)
    if bereich:
        a, b = (float(v) for v in bereich.split('-'))
        x = x[int(a * sr):int(b * sr)]
    # Sprache finden: Pegel je 20 ms, Schwelle aus der Verteilung
    db, n = frame_rms_db(x, sr)
    floor, top = np.percentile(db, 10), np.percentile(db, 95)
    thr = max(floor + 12, top - 28)
    voiced = db > thr
    # Luecken < 0,15 s schliessen, Inseln < 0,2 s entfernen
    def runs(mask):
        out, i = [], 0
        while i < len(mask):
            if mask[i]:
                j = i
                while j < len(mask) and mask[j]:
                    j += 1
                out.append([i, j]); i = j
            else:
                i += 1
        return out
    segs = runs(voiced)
    merged = []
    for s in segs:
        if merged and (s[0] - merged[-1][1]) * n / sr < 0.15:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    merged = [s for s in merged if (s[1] - s[0]) * n / sr >= 0.2]
    # Stuecke aneinanderhaengen, Pausen ueber 0,5 s auf 0,3 s kuerzen, bis 10-20 s Sprache
    pieces, total = [], 0.0
    for s in merged:
        a, b = max(0, s[0] * n - int(0.05 * sr)), min(len(x), s[1] * n + int(0.05 * sr))
        seg = x[a:b]
        pieces.append(seg)
        pieces.append(np.zeros(int(0.3 * sr)))
        total += len(seg) / sr
        if total >= 18:
            break
    if total < 10:
        print(f'WARNUNG: nur {total:.1f} s Sprache gefunden (Ziel 10-20 s).')
    ref = np.concatenate(pieces[:-1]) if pieces else x
    ref = ref / (np.abs(ref).max() + 1e-9) * 0.9
    raw = os.path.join(WORK, 'referenz_roh.wav')
    write_wav(raw, ref, sr)
    # leicht entrauschen, wenn der Grundpegel hoch ist
    noise_db = float(np.percentile(frame_rms_db(ref, sr)[0], 8))
    af = 'afftdn=nr=10:nf=-45,' if noise_db > -55 else ''
    ff(['-i', raw, '-af', f'{af}highpass=f=60,loudnorm=I=-20:TP=-2', '-ar', '24000', '-ac', '1', A('referenz.wav')])
    print(f'audio/referenz.wav: {total:.1f} s Sprache aus {len(merged)} Stuecken, Grundrauschen {noise_db:.0f} dBFS{" (entrauscht)" if af else ""}')


# ------------------------------------------------------------------ 2. Saetze erzeugen und pruefen

def load_models():
    import torch
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    from faster_whisper import WhisperModel
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    tts = ChatterboxMultilingualTTS.from_pretrained(device=dev)
    asr = WhisperModel(WHISPER_MODEL, device=dev, compute_type='int8' if dev == 'cpu' else 'float16')
    return tts, asr, dev


def tts_generate(tts, text, seed):
    import torch
    torch.manual_seed(seed)
    np.random.seed(seed % (2 ** 32))
    params = inspect.signature(tts.generate).parameters  # genaue Parameter der installierten Version
    kw = {'language_id': 'de', 'audio_prompt_path': A('referenz.wav'), 'exaggeration': EXAGGERATION, 'cfg_weight': CFG_WEIGHT}
    kw = {k: v for k, v in kw.items() if k in params}
    wav = tts.generate(text, **kw)
    x = wav.squeeze().detach().cpu().numpy().astype(np.float64)
    return x, tts.sr


def transcribe(asr, path, vad=False):
    segs, _ = asr.transcribe(path, language='de', word_timestamps=True, vad_filter=vad, beam_size=5)
    words = []
    for s in segs:
        for w in s.words or []:
            words.append({'word': w.word.strip(), 'start': float(w.start), 'end': float(w.end), 'prob': float(w.probability)})
    return words


def quality(x, sr, words, expected):
    """Exakter Wortlaut, keine langen Pausen, kein Knacken, kein Rauschen. Rueckgabe (ok, score, gruende)."""
    why = []
    got = norm_words(' '.join(w['word'] for w in words))
    if got != expected:
        why.append(f'Wortlaut: "{" ".join(got)}"')
    gaps = [b['start'] - a['end'] for a, b in zip(words, words[1:])]
    if gaps and max(gaps) > 0.6:
        why.append(f'Pause {max(gaps):.2f} s')
    peak = float(np.abs(x).max())
    if peak > 0.99:
        why.append('Uebersteuerung')
    d = np.abs(np.diff(x))
    loc = np.convolve(np.abs(x), np.ones(240) / 240, 'same')[1:]
    clicks = int(np.sum((d > 0.25) & (d > 8 * loc + 0.05)))
    if clicks:
        why.append(f'{clicks} Knackser')
    if words:
        a, b = int(words[0]['start'] * sr), int(words[-1]['end'] * sr)
        rest = np.concatenate([x[: max(0, a - int(0.05 * sr))], x[min(len(x), b + int(0.1 * sr)):]])
        if len(rest) > sr * 0.1:
            nd = 20 * np.log10(np.sqrt(np.mean(rest ** 2)) + 1e-12)
            if nd > -45:
                why.append(f'Rauschen {nd:.0f} dBFS')
    prob = float(np.mean([w['prob'] for w in words])) if words else 0
    score = prob - 0.2 * len(why)
    return (not why), score, why


def pitch_median(x, sr):
    import librosa
    f0, vf, _ = librosa.pyin(librosa.resample(x, orig_sr=sr, target_sr=16000), fmin=60, fmax=400, sr=16000)
    f0 = f0[~np.isnan(f0)]
    return float(np.median(f0)) if len(f0) else 0.0


def erzeugen():
    story = load_story()
    os.makedirs(WORK, exist_ok=True)
    os.makedirs(A('saetze'), exist_ok=True)
    tts, asr, dev = load_models()
    ref, rsr = read_wav(A('referenz.wav'))
    ref_f0 = pitch_median(ref, rsr)
    print(f'Modelle geladen ({dev}), Referenz-Tonhoehe {ref_f0:.0f} Hz')
    log, notes = [], []
    for s in story['script']:
        text = s.get('speak') or re.sub(r'[„“"‚‘]', '', s['text']).strip()
        expected = norm_words(text)
        best = None
        for rnd in range(1, MAX_ROUNDS + 1):
            for v in range(1, VERSIONS + 1):
                seed = s['id'] * 1000 + rnd * 10 + v
                x, sr = tts_generate(tts, text, seed)
                path = os.path.join(WORK, f'satz_{s["id"]:02d}_r{rnd}_v{v}.wav')
                write_wav(path, x, sr)
                words = transcribe(asr, path)
                ok, score, why = quality(x, sr, words, expected)
                f0 = pitch_median(x, sr)
                if ref_f0 and f0 and abs(f0 - ref_f0) / ref_f0 > 0.2:
                    why.append(f'Tonhoehe {f0:.0f} Hz statt {ref_f0:.0f}')
                    ok = False
                    score -= 0.2
                cand = {'path': path, 'ok': ok, 'score': score, 'why': why, 'words': [w['word'] for w in words], 'round': rnd, 'version': v}
                log.append({'satz': s['id'], **{k: cand[k] for k in ('path', 'ok', 'score', 'why', 'words')}})
                print(f'  Satz {s["id"]:2d} Runde {rnd} Version {v}: {"OK" if ok else "nein"} {score:.2f} {"; ".join(why)}')
                if best is None or (cand['ok'], cand['score']) > (best['ok'], best['score']):
                    best = cand
            if best['ok']:
                break
        shutil.copyfile(best['path'], A('saetze', f'satz_{s["id"]:02d}.wav'))
        if not best['ok']:
            notes.append(f'Satz {s["id"]} ("{s["text"]}"): nach {MAX_ROUNDS} Runden nicht sauber - beste Version: {"; ".join(best["why"])}')
    json.dump(log, open(os.path.join(WORK, 'pruefung.json'), 'w'), ensure_ascii=False, indent=1)
    with open(A('hinweise.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(notes) + '\n' if notes else 'Alle Saetze sauber (exakter Wortlaut, keine langen Pausen, kein Knacken, kein Rauschen).\n')
    print(open(A('hinweise.txt'), encoding='utf-8').read())


# ------------------------------------------------------------------ 3. Zusammensetzen + Wortzeiten

def trim(x, sr, keep=0.1):
    db, n = frame_rms_db(x, sr, 0.01)
    thr = max(np.max(db) - 40, -55)
    idx = np.where(db > thr)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] * n - int(keep * sr))
    b = min(len(x), (idx[-1] + 1) * n + int(keep * sr))
    return x[a:b]


def zusammensetzen():
    from faster_whisper import WhisperModel
    story = load_story()
    V = story['voice']
    parts, offsets, t = [], {}, 0.0
    for s in story['script']:
        x, sr = read_wav(A('saetze', f'satz_{s["id"]:02d}.wav'))
        if sr != SR_OUT:
            import librosa
            x = librosa.resample(x, orig_sr=sr, target_sr=SR_OUT)
        x = trim(x, SR_OUT, 0.1)                       # Stille an Anfang/Ende auf 0,1 s
        if s['id'] != story['script'][0]['id']:
            pause = float(V.get('pauseBefore', {}).get(str(s['id']), V['gap']))
            parts.append(np.zeros(int(pause * SR_OUT)))
            t += pause
        offsets[s['id']] = (t, t + len(x) / SR_OUT)
        parts.append(x)
        t += len(x) / SR_OUT
    raw = os.path.join(WORK, 'stimme_roh.wav')
    write_wav(raw, np.concatenate(parts), SR_OUT)
    ff(['-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR_OUT), '-ac', '1', A('stimme.wav')])
    asr = WhisperModel(WHISPER_MODEL, device='cpu', compute_type='int8')
    segs, _ = asr.transcribe(A('stimme.wav'), language='de', word_timestamps=True, vad_filter=True, beam_size=5)
    words = [{'word': w.word.strip(), 'start': round(w.start, 3), 'end': round(w.end, 3), 'prob': round(w.probability, 3)} for sg in segs for w in (sg.words or [])]
    sentences, problems = [], []
    for s in story['script']:
        a, b = offsets[s['id']]
        ws = [w for w in words if a - 0.05 <= (w['start'] + w['end']) / 2 <= b + 0.05]
        if not ws:
            problems.append(f'Satz {s["id"]}: keine Woerter erkannt')
            continue
        exp = norm_words(s.get('speak') or s['text'])
        got = norm_words(' '.join(w['word'] for w in ws))
        if exp != got:
            problems.append(f'Satz {s["id"]}: erkannt "{" ".join(got)}"')
        sentences.append({'id': s['id'], 'start': ws[0]['start'], 'end': ws[-1]['end'], 'words': ws})
    dur = len(read_wav(A('stimme.wav'))[0]) / SR_OUT
    json.dump({'source': 'audio/stimme.wav', 'model': WHISPER_MODEL, 'duration': round(dur, 3), 'sentences': sentences},
              open(A('transkript.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'audio/stimme.wav ({dur:.1f} s), audio/transkript.json ({len(words)} Woerter)')
    if problems:
        with open(A('hinweise.txt'), 'a', encoding='utf-8') as f:
            f.write('\nAbgleich der fertigen Sprachspur:\n' + '\n'.join(problems) + '\n')
        print('\n'.join(problems))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    rng = sys.argv[sys.argv.index('--bereich') + 1] if '--bereich' in sys.argv else None
    if cmd == 'vorbereiten':
        vorbereiten(sys.argv[2], rng)
    elif cmd == 'erzeugen':
        erzeugen()
    elif cmd == 'zusammensetzen':
        zusammensetzen()
    elif cmd == 'alles':
        vorbereiten(sys.argv[2], rng); erzeugen(); zusammensetzen()
    else:
        print(__doc__)
