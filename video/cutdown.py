"""Cut a short ad version out of a full reel, keeping the beat: every segment starts and ends on the 0.6s grid.
usage: python3 cutdown.py <erp|crm> <in.mp4> <out.mp4>
Run it again on the voiced master once the voiceover is in; the segments follow whole lines of the script.
"""
import subprocess, sys

CUTS = {
    # hook · «كل سؤال بيعدّي عليه هو» · «الشغل كله يقع» · rewind + calm + system · security · end card
    'erp': [(0, 4.8), (8.4, 10.8), (13.2, 15.6), (15.6, 21.6), (26.4, 30.0), (30.0, 33.6)],
    # hook + «بكام؟» · arrived · sinking + «يوم ٣» · competitor + «٤٨,٥٠٠» · «بس مع سيستم عملاء» · follow-up + «اتفقنا» · «جرّب تسرقني» · end card
    'crm': [(0, 3.0), (4.8, 6.6), (9.0, 11.4), (11.4, 15.0), (16.2, 19.8), (21.6, 24.6), (27.6, 31.2), (33.0, 36.6)],
}

kind, src, out = sys.argv[1:4]
segs = CUTS[kind]
parts, labels = [], []
for i, (a, b) in enumerate(segs):
    fo = b - a - .012
    parts.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}];"
                 f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={fo:.3f}:d=0.012[a{i}];")
    labels.append(f"[v{i}][a{i}]")
f = "".join(parts) + "".join(labels) + f"concat=n={len(segs)}:v=1:a=1[v][a];[v]fade=t=out:st={sum(b - a for a, b in segs) - .3:.2f}:d=0.3[vo]"
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-filter_complex', f, '-map', '[vo]', '-map', '[a]',
                '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                '-movflags', '+faststart', out], check=True)
print(out, round(sum(b - a for a, b in segs), 1), 's')
