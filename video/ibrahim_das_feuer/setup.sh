#!/usr/bin/env bash
# Schriften, Python-Pakete und Real-ESRGAN-Modell holen (idempotent)
set -e
cd "$(dirname "$0")"
mkdir -p fonts models assets build out
pip install -q pillow numpy fonttools faster-whisper onnxruntime huggingface_hub
B=https://raw.githubusercontent.com/google/fonts/main/ofl
cd fonts
[ -f Montserrat-VF.ttf ] || curl -sfL -o Montserrat-VF.ttf "$B/montserrat/Montserrat%5Bwght%5D.ttf"
[ -f CormorantGaramond-VF.ttf ] || curl -sfL -o CormorantGaramond-VF.ttf "$B/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf"
[ -f Amiri-Regular.ttf ] || curl -sfL -o Amiri-Regular.ttf "$B/amiri/Amiri-Regular.ttf"
[ -f AmiriQuran.ttf ] || curl -sfL -o AmiriQuran.ttf "$B/amiriquran/AmiriQuran-Regular.ttf"
[ -f KFGQPC_HAFS.ttf ] || curl -sfL -o KFGQPC_HAFS.ttf "https://raw.githubusercontent.com/thetruetruth/quran-data-kfgqpc/main/hafs/font/hafs.18.ttf" || echo "KFGQPC nicht erreichbar -> Amiri Quran"
for w in 400:Regular 600:SemiBold 700:Bold 800:ExtraBold; do
  [ -f Montserrat-${w##*:}.ttf ] || fonttools varLib.instancer Montserrat-VF.ttf wght=${w%%:*} -q -o Montserrat-${w##*:}.ttf
done
[ -f CormorantGaramond-Bold.ttf ] || fonttools varLib.instancer CormorantGaramond-VF.ttf wght=700 -q -o CormorantGaramond-Bold.ttf
cd ..
[ -f models/realesrgan_x4.onnx ] || python3 -c "
from huggingface_hub import hf_hub_download; import shutil
shutil.copy(hf_hub_download('imgdesignart/realesrgan-x4-onnx','onnx/model.onnx'),'models/realesrgan_x4.onnx')"
echo "Setup fertig."
