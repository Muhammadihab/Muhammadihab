"""Cut a short ad version out of a full reel, keeping the beat: every segment starts and ends on the 0.6s grid.
usage: python3 cutdown.py <erp|crm|erp-hookB|…> <in.mp4> <out.mp4>
Run it again on the voiced master once the voiceover is in; the segments follow whole lines of the script.
"""
import subprocess, sys

CUTS = {
    # ERP (voiced v11): hook · «ولو موبايله وقع… الشغل كله يقع» + rewind + the system · security · end card
    'erp': [(0, 4.8), (13.2, 24.0), (27.6, 39.0)],
    # hook variants for A/B tests: same reel, a different first 3 seconds
    'erp-hookB': [(11.4, 15.6), (0, 11.4), (15.6, 39.0)],  # cold open: 11:48 at night, battery 3%, «ولو موبايله وقع… الشغل كله يقع» (not repeated later)
    'erp-hookC': [(4.8, 8.4), (0, 4.8), (8.4, 39.0)],   # cold open: «الفني وصل؟ القطعة عندنا؟ العميل دفع؟»
    # CRM (voiced v8, timeline from reel-crm/crm.sync.js): hook + «بكام؟» · «وأنا بغرق» + «يوم ٣» · competitor + «٤٨,٥٠٠» · «بس مع سيستم عملاء» + card · follow-up + «اتفقنا» · «حاول تسرقه بنفسك» + «٥ من ٥» · CTA + end card
    'crm': [(0, 2.4), (10.2, 13.8), (13.8, 19.2), (19.2, 23.4), (25.2, 29.4), (35.4, 39.0), (39.0, 47.4)],
    'crm-hookB': [(16.0, 19.2), (0, 47.4)],             # cold open: «ده كان أوردر بتمانية وأربعين ألف… كان بتاعك»
    'crm-hookC': [(10.4, 13.8), (0, 47.4)],             # cold open: «وأنا بغرق تحت رسايل الجروب», «يوم ٣ ومحدش رد»
}

if __name__ == '__main__':
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
