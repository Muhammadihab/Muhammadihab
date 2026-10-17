#!/bin/bash
# usage: mix.sh <vo.wav> <sfx.wav> <music.wav> <out.wav>
# Music is ducked under the voice (sidechain); final master at -14 LUFS / -1 dBTP for Reels.
set -e
VO=$1; SFX=$2; MUS=$3; OUT=$4
F="[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,asplit=2[vo][sc];\
[2:a]aresample=48000,volume=-4dB[mus];\
[mus][sc]sidechaincompress=threshold=0.04:ratio=2.5:attack=20:release=400:makeup=1[duck];\
[1:a]aresample=48000,volume=-5dB[fx];\
[vo][fx][duck]amix=inputs=3:normalize=0:duration=longest[m]"
ffmpeg -loglevel error -y -i "$VO" -i "$SFX" -i "$MUS" -filter_complex "$F" -map "[m]" -c:a pcm_s24le "$OUT.pre.wav"
J=$(ffmpeg -hide_banner -i "$OUT.pre.wav" -af loudnorm=I=-14:TP=-1:LRA=9:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
LN=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"loudnorm=I=-14:TP=-1:LRA=9:measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}:linear=true\")")
ffmpeg -loglevel error -y -i "$OUT.pre.wav" -af "$LN,aresample=48000" -c:a pcm_s16le "$OUT"
rm -f "$OUT.pre.wav"
