# Startet MoneyPrinterTurbo (CLI) mit unseren eigenen Clips, eigener Sprecherspur (Piper, offline)
# und exakten Untertiteln aus den Satzzeiten (statt Whisper/Edge-TTS).
import os, sys, shutil, json
HIER = os.path.dirname(os.path.abspath(__file__))
MPT = '/home/user/harry0703/moneyprinterturbo'
sys.path.insert(0, MPT); os.chdir(MPT)
from app.services import task as tm
from app.utils import utils

SRT = os.path.join(HIER, 'untertitel.srt')
def eigene_untertitel(task_id, params, video_script, sub_maker, audio_file):
    if not params.subtitle_enabled:
        return ''
    ziel = os.path.join(utils.task_dir(task_id), 'subtitle.srt')
    shutil.copy(SRT, ziel)
    return ziel
tm.generate_subtitle = eigene_untertitel

import cli
saetze = [s[0] for s in json.load(open(os.path.join(HIER, 'saetze.json')))]
clips = ['c1_aufbau', 'c2_eingang', 'c3_keller', 'c4_dach', 'c5_hof', 'c6_stufen', 'c7_altbau', 'c8_parken', 'c9_schluss']
argv = [
    '--video-script', ' '.join(saetze),
    '--video-language', 'de-DE',
    '--video-source', 'local',
    '--video-materials', ','.join(os.path.join(HIER, c + '.mp4') for c in clips),
    '--video-concat-mode', 'sequential',
    '--video-transition-mode', 'none',
    '--video-clip-duration', '10',
    '--video-aspect', '9:16',
    '--video-count', '1',
    '--custom-audio-file', os.path.join(HIER, 'sprecher.wav'),
    '--bgm-type', 'none',
    '--subtitle-enabled',
    '--font-name', 'MicrosoftYaHeiBold.ttc',
    '--font-size', '58',
    '--text-fore-color', '#FFFFFF',
    '--stroke-color', '#000000',
    '--stroke-width', '2.5',
    '--subtitle-position', 'custom',
    '--custom-position', '80',
    '--n-threads', '4',
    '--task-id', '5e6f7a8b-1c2d-4e3f-9a0b-0c1d2e3f4a5b',
]
sys.exit(cli.run_cli(argv))
