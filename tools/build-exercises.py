"""Build exercises.js from the base library + Aadi's master index.

Inputs (both in tools/):
  exercises-base.json  the library the app already had (names here are kept,
                       because saved workouts and the coach's plan use them)
  exercise-index.txt   the master gym exercise & equipment index

Every exercise ends up in one app muscle group (k) and one sub-section (s).
Duplicates are merged by comparing names as word sets ("Lateral Raise
(Dumbbell)" == "Dumbbell lateral raise"), plus a short alias table for
equivalents worded differently. Equipment, implement, attachment and
training-method lists in the index are not exercises and are skipped.

Run from the repo root:  python3 tools/build-exercises.py
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = lambda *p: os.path.join(ROOT, 'tools', *p)

SECTIONS = {
    'chest': ['Upper chest', 'Mid chest', 'Lower chest', 'Flyes & isolation', 'Advanced pressing'],
    'back': ['Pull-ups', 'Pulldowns', 'Rows', 'Upper back', 'Traps', 'Lower back & deadlifts'],
    'shoulders': ['Overhead presses', 'Front raises', 'Side delts', 'Rear delts', 'Neck'],
    'arms': ['Biceps', 'Brachialis & reverse curls', 'Triceps · overhead', 'Triceps · pushdowns & presses', 'Forearms & grip'],
    'legs': ['Quads', 'Hamstrings', 'Glutes', 'Inner thigh', 'Outer hip', 'Calves & shins', 'Olympic & power'],
    'core': ['Abs', 'Planks & anti-extension', 'Obliques & rotation', 'Hip flexors & leg raises', 'Carries', 'Calisthenics skills', 'Medicine ball'],
    'cardio': ['Walking & running', 'Cycling', 'Rowing & ski', 'Stairs & climbing', 'Elliptical', 'Conditioning', 'Strongman & sleds', 'Plyometrics', 'Other cardio'],
    'mobility': ['Warm-up & recovery', 'Shoulders', 'Hips', 'Ankles', 'Spine', 'Stretches'],
}

# ── name matching ─────────────────────────────────────
SYN = {'one': 'single', 'db': 'dumbbell', 'biceps': 'bicep', 'triceps': 'tricep', 'stones': 'stone', 'shrugs': 'shrug', 'dips': 'dip',
       'raises': 'raise', 'curls': 'curl', 'rows': 'row', 'presses': 'press', 'flyes': 'fly', 'flies': 'fly', 'lunges': 'lunge',
       'slides': 'slide', 'swings': 'swing', 'carries': 'carry', 'ropes': 'rope', 'crunches': 'crunch', 'squats': 'squat',
       'woodchopper': 'woodchop', 'pullups': 'pullup', 'farmers': 'farmer', 'farmer': 'farmer', 'extensions': 'extension'}
STOP = {'flat', 'the', 'style', 'variations', 'variation', 'and', 'with', 'focus', 's'}

def key(name):
    w = re.findall(r'[a-z0-9]+', name.lower().replace("'", ''))
    w = [SYN.get(x, x) for x in w if x not in STOP]
    if 'smith' in w and 'machine' in w:
        w.remove('machine')
    return ' '.join(sorted(w))

def title(name):
    small = {'and', 'or', 'of', 'to', 'the', 'a', 'on'}
    keep = {'ez': 'EZ', 'rdl': 'RDL', 'trx': 'TRX', 'ghd': 'GHD', 'rkc': 'RKC', 'jm': 'JM', 'cars': 'CARs', 'v': 'V', 'l': 'L', 'y': 'Y',
            't': 'T', 'z': 'Z', 'erg': 'Erg'}
    out = []
    for i, word in enumerate(name.split(' ')):
        parts = word.split('-')
        fixed = []
        for p in parts:
            lw = p.lower()
            if lw in keep: fixed.append(keep[lw])
            elif (i > 0 or len(fixed) > 0) and lw in small: fixed.append(lw)
            elif p[:1].isdigit() or p.isupper() and len(p) > 1: fixed.append(p)
            else: fixed.append(p[:1].upper() + p[1:])
        out.append('-'.join(fixed))
    return ' '.join(out)

# Master names that mean an exercise already in the library.
ALIAS = {
    'pec deck': 'Pec Fly / Chest Fly Machine', 'machine fly': 'Pec Fly / Chest Fly Machine',
    'cable fly': 'Cable Crossover', 'standing cable fly': 'Cable Crossover',
    'low-to-high cable fly': 'Cable Chest Fly (Low)', 'high-to-low cable fly': 'Cable Chest Fly (High)',
    'decline machine press': 'Decline Chest Press Machine', 'incline barbell bench press': 'Incline Barbell Press',
    'decline barbell bench press': 'Decline Barbell Press', 'incline bench': 'Incline Barbell Press',
    'machine pull-up': 'Assisted Pull-Up Machine', 'close-grip pulldown': 'Close-Grip Lat Pulldown',
    'machine pulldown': 'Lat Pulldown Machine', 'pulldown machine': 'Lat Pulldown Machine', 'pulldown': 'Lat Pulldown',
    'machine row': 'Seated Row Machine', 'seated row': 'Seated Row Machine', 'low cable row': 'Seated Cable Row', 'cable row': 'Seated Cable Row',
    'barbell bent-over row': 'Barbell Row', 'dumbbell row': 'Dumbbell Row (Single Arm)', 'iso-lateral row': 'Iso-Lateral Back Row',
    'rope face pull': 'Face Pull', "farmer's carry": "Farmer's Walk", 'farmer carry': "Farmer's Walk",
    'conventional deadlift': 'Barbell Deadlift', 'barbell deadlift': 'Barbell Deadlift', 'conventional': 'Barbell Deadlift',
    'back extension': '45° Back Extension', '45° hyperextension': '45° Back Extension', '45° back extension': '45° Back Extension',
    'reverse dumbbell fly': 'Rear Delt Fly (Dumbbell)', 'bent-over dumbbell fly': 'Rear Delt Fly (Dumbbell)',
    'cable reverse fly': 'Rear Delt Fly (Cable)', 'machine reverse fly': 'Reverse Pec Deck', 'pec-deck reverse fly': 'Reverse Pec Deck',
    'rear-delt machine': 'Reverse Pec Deck', 'machine curl': 'Machine Bicep Curl', 'biceps curl': 'Machine Bicep Curl',
    'overhead cable extension': 'Overhead Tricep Extension', 'cable overhead extension': 'Overhead Tricep Extension',
    'cable pushdown': 'Tricep Pushdown (Bar)', 'straight-bar pushdown': 'Tricep Pushdown (Bar)', 'rope pushdown': 'Tricep Pushdown (Rope)',
    'single-arm pushdown': 'Single-Arm Cable Pushdown', 'dumbbell kickback': 'Tricep Kickback', 'bench dips': 'Tricep Dips (Bench)',
    'triceps extension': 'Tricep Machine', 'back squat': 'Barbell Back Squat', 'front squat': 'Barbell Front Squat',
    'hack squat': 'Hack Squat Machine', '45° leg press': 'Leg Press', 'reverse lunge': 'Reverse Lunge (Dumbbell)',
    'forward lunge': 'Lunge (Dumbbell)', 'step-up': 'Step-Up (Dumbbell)', 'dumbbell rdl': 'Romanian Deadlift (Dumbbell)',
    'machine kickback': 'Glute Kickback Machine', 'hip abduction machine': 'Abductor Machine', 'hip abduction': 'Abductor Machine',
    'hip adduction': 'Adductor Machine', 'leg press calf raise': 'Leg Press Calf Press', 'machine calf raise': 'Standing Calf Raise',
    'calf raise': 'Standing Calf Raise', 'leg curl': 'Seated Leg Curl', 'ab wheel': 'Ab Wheel Rollout', 'hollow hold': 'Hollow Body Hold',
    'hollow-body hold': 'Hollow Body Hold', 'cable woodchop': 'Cable Woodchopper', 'squat': 'Bodyweight Squat',
    'suspension push-up': 'TRX Push-Up', 'suspension row': 'TRX Row', 'treadmill': 'Treadmill Run',
    'incline treadmill': 'Treadmill Incline Walk', 'walking': 'Outdoor Brisk Walk', 'rowing ergometer': 'Rowing Machine',
    'stair climber': 'Stairmaster / StepMill', 'stepmill': 'Stairmaster / StepMill', 'cross trainer': 'Elliptical',
    'spin bike': 'Stationary Bike', 'air bike': 'Assault Bike', '90/90': '90/90 Hip Switch', 'swing': 'Kettlebell Swing',
    'russian swing': 'Kettlebell Swing', 'atlas stones': 'Atlas Stone Lift', 'chest press': 'Chest Press Machine',
    'shoulder press': 'Shoulder Press Machine', 'lateral raise': 'Lateral Raise Machine', 'preacher curl': 'Preacher Curl',
    'clean & press': 'Clean and Press', 'competition squat': 'Barbell Back Squat', 'high-bar squat': 'Barbell Back Squat',
    'incline press': 'Incline Chest Press Machine', 'decline press': 'Decline Chest Press Machine',
    'cable crossover': 'Cable Crossover', 'reverse hyper': 'Reverse Hyperextension',
    'barbell good morning': 'Good Morning', 'high row': 'Machine High Row', 'floor press': 'Barbell Floor Press',
    'machine seated calf raise': 'Seated Calf Raise', 'sumo squat': 'Sumo Squat (Dumbbell)',
    'close-grip bench press': 'Close-Grip Bench Press', 'pause bench press': 'Paused Bench Press', 'incline bench press': 'Incline Barbell Press', 'competition bench press': 'Barbell Bench Press',
}

# Names that need context from their section (same words, different exercise).
def rename(sec_no, sub, name):
    n = name.strip().rstrip('.')
    l = n.lower()
    if sec_no == 10 and l == 'cable kickback': return 'Cable tricep kickback'
    if sec_no == 14 and l == 'cable kickback': return 'Cable Glute Kickback'
    if sec_no == 10 and l == 'dips': return 'Tricep dips'
    if sec_no == 26 and l == 'dips': return 'Dips'
    if sec_no == 1 and l == 'floor press': return 'Barbell floor press'
    if l.endswith(' bench') or l == 'band bench': return n + ' press'
    if l == 'landmine press variations': return 'Landmine press'
    if l == 'captains-of-crush style gripper work': return 'Gripper work'
    if l == 'single-leg squat variations': return 'Single-leg squat'
    if l == 'hip hinge': return 'Hip hinge drill'
    if l == 'manual resistance': return 'Manual-resistance neck work'
    if sec_no == 24:
        if sub == 'Squat' and 'squat' not in l: return n + ' squat'
        if sub == 'Bench' and 'bench' in l and 'press' not in l: return n + ' press'
        if sub == 'Bench' and l in ('spoto press', 'larsen press', 'floor press', 'board press', 'pin press'): return n
        if sub == 'Deadlift':
            m = {'sumo': 'Sumo deadlift', 'deficit': 'Deficit deadlift'}
            return m.get(l, n)
    if sec_no == 27:
        m = {'swing': 'Kettlebell swing', 'russian swing': 'Kettlebell swing', 'american swing': 'American kettlebell swing',
             'front squat': 'Kettlebell front squat', 'clean': 'Kettlebell clean', 'snatch': 'Kettlebell snatch', 'press': 'Kettlebell press',
             'push press': 'Kettlebell push press', 'jerk': 'Kettlebell jerk', 'windmill': 'Kettlebell windmill', 'halo': 'Kettlebell halo',
             'row': 'Kettlebell row', 'renegade row': 'Renegade row', 'front-rack carry': 'Kettlebell front-rack carry',
             'bottoms-up press': 'Kettlebell bottoms-up press', 'bottoms-up carry': 'Kettlebell bottoms-up carry',
             'clean & press': 'Kettlebell clean & press', 'clean & jerk': 'Kettlebell clean & jerk', 'thruster': 'Kettlebell thruster'}
        return m.get(l, n)
    if sec_no == 36:
        if l in ('wall ball', 'russian twist'): return n
        if not l.startswith('medicine'): return 'Medicine-ball ' + l
    if sec_no == 35 and l in ('overhead throw', 'rotational throw'): return 'Medicine-ball ' + l
    if sec_no == 31:
        if l in ('cable station',): return None
        m = {'plate-loaded press': 'Plate-loaded chest press', 'converging press': 'Converging chest press', 'high row': 'Machine high row',
             'low row': 'Machine low row', 'pullover': 'Machine pullover', 'front raise': 'Machine front raise', 'triceps press': 'Machine triceps press',
             'glute drive': 'Glute drive machine', 'tibialis machine': 'Tibialis machine', 'back extension': 'Machine back extension',
             'standing leg curl': 'Standing leg curl', 'hip thrust': 'Machine hip thrust'}
        return m.get(l, n)
    if sec_no == 34:
        m = {'sled': 'Sled push', 'prowler': 'Prowler push', 'tire': 'Tire flip', 'sandbag': None, 'medicine ball': None,
             'water rower': 'Water rower', 'ski erg': 'Ski erg'}
        if l in m: return m[l]
    if sec_no == 37:
        m = {'external rotation': 'Shoulder external rotation', 'internal rotation': 'Shoulder internal rotation',
             'knee-to-wall': 'Knee-to-wall ankle stretch', 'open book': 'Open book stretch', 'wall slides': 'Wall slide',
             'tibialis raises': 'Tibialis raise'}
        return m.get(l, n)
    if sec_no == 25:
        m = {'stone-to-shoulder': 'Stone to shoulder', 'stone load': 'Atlas stone load', 'circus dumbbell': 'Circus dumbbell press'}
        return m.get(l, n)
    return n

# ── where each index section goes: (group, sub-section) ──
SKIP_SECTIONS = {28, 32, 33, 39, 40}
SUBMAP = {
    (1, 'Pectoralis major, clavicular head / upper chest'): ('chest', 'Upper chest'),
    (1, 'Pectoralis major, sternal/mid chest'): ('chest', 'Mid chest'),
    (1, 'Lower chest'): ('chest', 'Lower chest'),
    (1, 'Chest isolation'): ('chest', 'Flyes & isolation'),
    (1, 'Special/advanced'): ('chest', 'Advanced pressing'),
    (2, 'Vertical pulling'): ('back', 'Pull-ups'), (2, 'Pulldown'): ('back', 'Pulldowns'), (2, 'Lat-focused rows'): ('back', 'Rows'),
    (3, 'Horizontal pulling'): ('back', 'Rows'), (3, 'Rhomboids'): ('back', 'Upper back'), (3, 'Teres major/minor'): ('back', 'Upper back'),
    (4, None): ('back', 'Traps'), (5, None): ('back', 'Lower back & deadlifts'),
    (6, 'Pressing'): ('shoulders', 'Overhead presses'), (6, 'Isolation'): ('shoulders', 'Front raises'),
    (7, None): ('shoulders', 'Side delts'), (8, None): ('shoulders', 'Rear delts'),
    (9, 'Biceps brachii'): ('arms', 'Biceps'), (9, 'Brachialis / brachioradialis'): ('arms', 'Brachialis & reverse curls'), (9, 'Specialty'): ('arms', 'Biceps'),
    (10, 'Long head'): ('arms', 'Triceps · overhead'), (10, 'Lateral/medial heads'): ('arms', 'Triceps · pushdowns & presses'),
    (11, None): ('arms', 'Forearms & grip'),
    (12, None): ('legs', 'Quads'), (13, None): ('legs', 'Hamstrings'),
    (14, 'Hip extension'): ('legs', 'Glutes'), (14, 'Glute isolation'): ('legs', 'Glutes'), (14, 'Glute medius'): ('legs', 'Outer hip'),
    (15, None): ('legs', 'Inner thigh'), (16, None): ('legs', 'Outer hip'), (17, None): ('legs', 'Calves & shins'),
    (18, 'Spinal flexion'): ('core', 'Abs'), (18, 'Anti-extension'): ('core', 'Planks & anti-extension'),
    (19, None): ('core', 'Obliques & rotation'), (20, None): ('core', 'Hip flexors & leg raises'), (21, None): ('shoulders', 'Neck'),
    (23, None): ('legs', 'Olympic & power'),
    (34, 'Running'): ('cardio', 'Walking & running'), (34, 'Cycling'): ('cardio', 'Cycling'), (34, 'Rowing'): ('cardio', 'Rowing & ski'),
    (34, 'Climbing'): ('cardio', 'Stairs & climbing'), (34, 'Elliptical'): ('cardio', 'Elliptical'), (34, 'Other'): ('cardio', 'Other cardio'),
    (35, 'Lower body'): ('cardio', 'Plyometrics'), (35, 'Upper body'): ('cardio', 'Plyometrics'),
    (36, None): ('core', 'Medicine ball'),
    (37, 'Shoulders'): ('mobility', 'Shoulders'), (37, 'Hips'): ('mobility', 'Hips'), (37, 'Ankles'): ('mobility', 'Ankles'), (37, 'Spine'): ('mobility', 'Spine'),
}

def by_keywords(name):
    """Group and sub-section for mixed sections (full body, bands, kettlebell, machines…)."""
    l = name.lower()
    has = lambda *ws: any(w in l for w in ws)
    if has('carry', 'yoke', 'conan', 'farmer'): return ('core', 'Carries')
    if has('neck'): return ('shoulders', 'Neck')
    if has('sled', 'prowler', 'tire flip', 'truck pull', 'keg toss', 'stone', 'sandbag load', 'sandbag shoulder', 'atlas'): return ('cardio', 'Strongman & sleds')
    if has('burpee', 'man maker', 'bear crawl', 'devil press', 'complex'): return ('cardio', 'Conditioning')
    if has('snatch', 'clean', 'jerk', 'high pull', 'clean pull', 'thruster', 'sandbag clean'): return ('legs', 'Olympic & power')
    if has('get-up', 'windmill', 'halo', 'renegade', 'pallof', 'rotation', 'woodchop', 'body saw', 'fallout', 'pike', 'atomic'): return ('core', 'Obliques & rotation' if has('pallof', 'rotation', 'woodchop', 'windmill') else 'Planks & anti-extension')
    if has('l-sit', 'v-sit', 'dragon flag', 'human flag', 'planche', 'front lever', 'back lever', 'arch hold'): return ('core', 'Calisthenics skills')
    if has('toes-to-bar', 'leg raise', 'knee raise'): return ('core', 'Hip flexors & leg raises')
    if has('hollow', 'plank'): return ('core', 'Planks & anti-extension')
    if has('hercules', 'grip'): return ('arms', 'Forearms & grip')
    if has('wrist'): return ('arms', 'Forearms & grip')
    if has('pullover'): return ('back', 'Upper back')
    if has('pull-apart', 'face pull'): return ('back', 'Upper back')
    if has('pull-up', 'chin-up', 'muscle-up'): return ('back', 'Pull-ups')
    if has('pulldown'): return ('back', 'Pulldowns')
    if has('row'): return ('back', 'Rows')
    if has('deadlift', 'good morning', 'back extension', 'reverse hyper', 'car deadlift'):
        return ('legs', 'Hamstrings') if has('romanian', 'stiff', 'good morning') else ('back', 'Lower back & deadlifts')
    if has('log press', 'axle', 'circus', 'pike push', 'handstand', 'push press', 'bottoms-up press', 'kettlebell press', 'overhead press'): return ('shoulders', 'Overhead presses')
    if has('lateral raise'): return ('shoulders', 'Side delts')
    if has('front raise'): return ('shoulders', 'Front raises')
    if has('rear-delt', 'reverse fly'): return ('shoulders', 'Rear delts')
    if has('curl') and has('leg', 'hamstring'): return ('legs', 'Hamstrings')
    if has('curl'): return ('arms', 'Brachialis & reverse curls' if has('reverse', 'hammer') else 'Biceps')
    if has('tricep', 'triceps', 'dip machine', 'pushdown'): return ('arms', 'Triceps · pushdowns & presses')
    if has('extension') and has('leg'): return ('legs', 'Quads')
    if has('extension') and not has('hip', 'back'): return ('arms', 'Triceps · overhead')
    if has('fly', 'pec deck', 'crossover'): return ('chest', 'Flyes & isolation')
    if has('incline') and has('press', 'push'): return ('chest', 'Upper chest')
    if has('decline'): return ('chest', 'Lower chest')
    if has('push-up', 'chest press', 'bench', 'converging', 'plate-loaded'): return ('chest', 'Mid chest')
    if has('dip'): return ('chest', 'Lower chest')
    if has('nordic', 'leg curl', 'hamstring'): return ('legs', 'Hamstrings')
    if has('hip thrust', 'glute', 'kickback', 'hip extension'): return ('legs', 'Glutes')
    if has('abduction'): return ('legs', 'Outer hip')
    if has('adduction'): return ('legs', 'Inner thigh')
    if has('calf', 'tibialis'): return ('legs', 'Calves & shins')
    if has('squat', 'lunge', 'leg press', 'step-up', 'jump'): return ('legs', 'Quads')
    if has('swing'): return ('legs', 'Glutes')
    if has('shrug'): return ('back', 'Traps')
    return None

ISO = {'isometric squat': ('legs', 'Quads'), 'isometric split squat': ('legs', 'Quads'), 'isometric leg extension': ('legs', 'Quads'),
       'isometric leg curl': ('legs', 'Hamstrings'), 'isometric calf raise': ('legs', 'Calves & shins'),
       'isometric bench press': ('chest', 'Advanced pressing'), 'isometric deadlift': ('back', 'Lower back & deadlifts'),
       'isometric curl': ('arms', 'Biceps'), 'isometric triceps extension': ('arms', 'Triceps · pushdowns & presses'),
       'isometric lateral raise': ('shoulders', 'Side delts'), 'isometric pull-up': ('back', 'Pull-ups'),
       'isometric row': ('back', 'Rows'), 'isometric grip hold': ('arms', 'Forearms & grip')}

def place(sec_no, sub, name):
    l = name.lower()
    if sec_no == 38: return ISO.get(l) or by_keywords(name)
    if 'medicine' in l: return ('core', 'Medicine ball')
    if sec_no == 5 and any(w in l for w in ('romanian', 'stiff-leg', 'single-leg rdl')): return ('legs', 'Hamstrings')
    if sec_no == 4 and 'carry' in l: return ('core', 'Carries')
    if sec_no == 19 and 'carry' in l: return ('core', 'Carries')
    if sec_no == 11 and any(w in l for w in ('farmer', 'suitcase')): return ('core', 'Carries')
    if sec_no == 13 and 'deadlift' in l and 'romanian' not in l and 'stiff' not in l: return ('back', 'Lower back & deadlifts')
    if sec_no == 14 and any(w in l for w in ('romanian', 'bulgarian', 'lunge', 'step-up', 'swing')): return ('legs', 'Glutes')
    if sec_no == 23 and l in ('overhead squat', 'front squat'): return ('legs', 'Quads')
    if sec_no == 24:
        return {'Squat': ('legs', 'Quads'), 'Bench': ('chest', 'Advanced pressing')}.get(sub) or \
               (('legs', 'Hamstrings') if any(w in l for w in ('romanian', 'stiff')) else ('back', 'Lower back & deadlifts'))
    if sec_no == 26:
        if sub == 'Push': return ('shoulders', 'Overhead presses') if any(w in l for w in ('pike', 'handstand')) else (('chest', 'Lower chest') if l == 'dips' else ('chest', 'Mid chest'))
        if sub == 'Pull': return by_keywords(name) or ('back', 'Pull-ups')
        if sub == 'Legs': return ('legs', 'Hamstrings') if 'nordic' in l else ('legs', 'Quads')
        if sub == 'Core': return by_keywords(name) or ('core', 'Calisthenics skills')
    if sec_no in (22, 25, 27, 29, 30, 31): return by_keywords(name)
    if sec_no == 37 and l == 'jefferson curl': return ('mobility', 'Spine')
    for k in ((sec_no, sub), (sec_no, None)):
        if k in SUBMAP: return SUBMAP[k]
    return by_keywords(name)

# ── base library: sub-section for entries the index doesn't cover ──
def base_place(e):
    n, g, grp = e['n'].lower(), e['g'], e['grp']
    has = lambda *ws: any(w in n for w in ws)
    if has('shrug'): return ('back', 'Traps')
    if n in ('romanian deadlift',): return ('legs', 'Hamstrings')
    if grp == 'chest':
        return ('chest', 'Upper chest' if has('incline', 'low)') else 'Lower chest' if has('decline', 'dips', 'high)') else 'Flyes & isolation' if has('fly', 'crossover') else 'Mid chest')
    if grp == 'back':
        return ('back', 'Pull-ups' if has('pull-up', 'chin-up') else 'Pulldowns' if has('pulldown') else 'Lower back & deadlifts' if has('deadlift', 'rack pull', 'extension', 'good morning') else 'Upper back' if has('face pull', 'pull-apart') else 'Rows')
    if grp == 'shoulders':
        return ('shoulders', 'Overhead presses' if has('press') else 'Front raises' if has('front') else 'Rear delts' if has('rear', 'reverse') else 'Side delts')
    if grp == 'arms':
        if g == 'Forearms': return ('arms', 'Forearms & grip')
        if g == 'Triceps': return ('arms', 'Triceps · overhead' if has('overhead', 'skull') else 'Triceps · pushdowns & presses')
        return ('arms', 'Brachialis & reverse curls' if has('hammer', 'reverse') else 'Biceps')
    if grp == 'legs':
        m = e.get('m', '').lower()
        if g == 'Calves': return ('legs', 'Calves & shins')
        if g == 'Olympic': return ('legs', 'Olympic & power')
        if has('abductor'): return ('legs', 'Outer hip')
        if has('adductor', 'sumo'): return ('legs', 'Inner thigh')
        if 'hamstring' in m and not has('pull-through'): return ('legs', 'Hamstrings')
        if m.startswith('glute') or has('hip thrust', 'kickback', 'bridge', 'pull-through', 'swing'): return ('legs', 'Glutes')
        return ('legs', 'Quads')
    if grp == 'core':
        if has('farmer', 'carry'): return ('core', 'Carries')
        if has('plank', 'dead bug', 'hollow', 'bird dog', 'rollout', 'get-up'): return ('core', 'Planks & anti-extension')
        if has('twist', 'woodchop', 'pallof', 'bicycle'): return ('core', 'Obliques & rotation')
        if has('leg raise', 'knee raise', 'mountain'): return ('core', 'Hip flexors & leg raises')
        if has('slam'): return ('core', 'Medicine ball')
        return ('core', 'Abs')
    if grp == 'cardio':
        if has('treadmill', 'walk'): return ('cardio', 'Walking & running')
        if has('bike', 'cycling'): return ('cardio', 'Cycling')
        if has('rowing'): return ('cardio', 'Rowing & ski')
        if has('stair'): return ('cardio', 'Stairs & climbing')
        if has('elliptical'): return ('cardio', 'Elliptical')
        if has('burpee', 'high knees', 'box jump'): return ('cardio', 'Plyometrics')
        if has('battle'): return ('cardio', 'Conditioning')
        return ('cardio', 'Other cardio')
    if grp == 'mobility':
        if has('hip', 'pigeon', '90/90', 'couch'): return ('mobility', 'Hips')
        if has('calf'): return ('mobility', 'Ankles')
        if has('cat-cow', 'thoracic', 'child', 'cobra'): return ('mobility', 'Spine')
        if has('doorway'): return ('mobility', 'Shoulders')
        if has('stretch'): return ('mobility', 'Stretches')
        return ('mobility', 'Warm-up & recovery')
    return (grp, SECTIONS[grp][0])

# ── equipment and measure ─────────────────────────────
def equipment(name):
    l = name.lower()
    has = lambda *ws: any(w in l for w in ws)
    if has('smith'): return 'Smith Machine'
    if has('kettlebell') or l.startswith('kb '): return 'Kettlebell'
    if has('band'): return 'Band'
    if has('suspension', 'trx', 'ring '): return 'Suspension'
    if has('landmine'): return 'Landmine'
    if has('cable', 'pulldown', 'pushdown', 'face pull', 'crossover', 'pull-through', 'woodchop', 'pallof') or (has('rope') and not has('jump rope', 'battle rope')): return 'Cable'
    if has('reverse-grip incline press'): return 'Barbell'
    if has('dumbbell', 'goblet', 'squeeze press', 'hex press', 'devil press', 'arnold', 'renegade', 'zottman', 'pinwheel', 'concentration curl', 'spider curl', 'kroc', 'meadows', 'seal row'): return 'Dumbbell'
    if has('barbell', 'ez-bar', 'ez bar', 'ez ', 'trap-bar', 'bench press', 'deadlift', 'squat', 'military press', 'good morning', 'rack pull', 'block pull',
           'pendlay', 'yates', 't-bar', 'clean', 'snatch', 'jerk', 'thruster', 'zercher', 'jm', 'guillotine', 'board press', 'pin press',
           'larsen', 'spoto', 'floor press', 'skull crusher', 'french press', 'drag curl', 'push press', 'bradford', 'z-press', 'behind-neck', 'high pull'):
        if not has('bodyweight', 'pistol', 'shrimp', 'sissy', 'jump squat', 'cossack', 'split squat', 'bulgarian', 'air squat', 'wall', 'belt squat', 'hack', 'pendulum'):
            return 'Barbell'
    if has('machine', 'pec deck', 'leg press', 'hack squat', 'leg extension', 'leg curl', 'pendulum', 'belt squat', 'plate-loaded', 'converging', 'hammer strength',
           'iso-lateral', 'glute drive', 'treadmill', 'bike', 'rower', 'rowing', 'erg', 'stair', 'stepmill', 'versaclimber', 'elliptical', 'cross trainer',
           'arc trainer', "jacob's", 'reverse hyper', 'ghd', 'glute-ham', 'captain'): return 'Machine'
    if has('medicine', 'wall ball', 'slam'): return 'Medicine Ball'
    if has('sled', 'prowler', 'tire', 'sandbag', 'atlas', 'stone', 'keg', 'log press', 'axle', 'yoke', 'frame carry', 'husafell', 'conan', 'truck', 'car deadlift', 'circus'): return 'Strongman'
    if has('plate'): return 'Plate'
    # Free-weight isolation moves with no equipment named are usually done with dumbbells.
    if has('raise', 'fly', 'curl', 'kickback', 'shrug', 'extension', 'pullover') and not has('leg raise', 'knee raise', 'calf raise', 'y-raise', 'tibialis', 'nordic', 'hip extension', 'back extension', 'sliding', 'stability', 'razor', 'jefferson', 'glute-ham'):
        return 'Dumbbell'
    if has('row') and not has('inverted', 'ring row'): return 'Cable'
    if has('behind-the-back shrug', 'shrug'): return 'Barbell'
    return 'Bodyweight'

def measure(name, grp, sec):
    l = name.lower()
    if grp == 'cardio' and sec not in ('Plyometrics', 'Strongman & sleds', 'Conditioning'): return 'duration'
    if any(w in l for w in ('battle rope', 'jump rope', 'sled', 'prowler')): return 'duration'
    if any(w in l for w in ('plank', 'hold', 'dead hang', 'towel hang', 'isometric', 'wall sit', 'l-sit', 'v-sit', 'lever', 'planche', 'carry', 'walk', 'stretch', 'flag', 'sorensen')): return 'time'
    if grp == 'mobility': return 'reps'
    return 'weight' if equipment(name) not in ('Bodyweight', 'Band', 'Suspension') else 'reps'

# ── parse the index ───────────────────────────────────
def parse_index(path):
    out, sec_no, sub = [], None, None
    for raw in open(path, encoding='utf-8'):
        line = raw.rstrip('\n').strip()
        if not line: continue
        m = re.match(r'^(\d+)\.\s+(.+)$', line)
        if m:
            sec_no, sub = int(m.group(1)), None
            continue
        if line.startswith('The important part'): break
        if sec_no is None: continue
        if line.startswith('- '):
            out.append((sec_no, sub, line[2:].strip()))
        elif len(line) < 60 and not line.endswith('.'):
            sub = line if line not in ('LATS',) else sub
    return out

def main():
    base = json.load(open(T('exercises-base.json')))
    lib, by_key, by_name = [], {}, {}
    for e in base:
        k, s = base_place(e)
        item = {'n': e['n'], 'k': k, 's': s, 'eq': e['eq'] if e['eq'] != 'Other' else equipment(e['n']).replace('Bodyweight', 'Other'), 'm': e['m'], 't': e['t']}
        lib.append(item); by_key[key(e['n'])] = item; by_name[e['n'].lower()] = item
    base_hit, added, skipped = set(), 0, []
    for sec_no, sub, raw in parse_index(T('exercise-index.txt')):
        if sec_no in SKIP_SECTIONS: continue
        name = rename(sec_no, sub, raw)
        if not name: continue
        alias = ALIAS.get(name.lower())
        if alias:
            if alias.lower() not in by_name: sys.exit('alias target missing: ' + alias)
            hit = by_name[alias.lower()]
        else:
            hit = by_key.get(key(name))
        spot = place(sec_no, sub, name)
        if hit:
            # The index's own section is more specific than the base guess: adopt it once.
            if spot and hit['n'] not in base_hit and any(b['n'] == hit['n'] for b in base):
                hit['k'], hit['s'] = spot
            base_hit.add(hit['n'])
            continue
        if not spot:
            skipped.append((sec_no, sub, name)); continue
        nm = title(name)
        k, s = spot
        item = {'n': nm, 'k': k, 's': s, 'eq': equipment(nm), 'm': (sub or s).split(',')[0].split('/')[0].strip().capitalize() if sub and len(sub) < 40 else s, 't': measure(nm, k, s)}
        lib.append(item); by_key[key(nm)] = item; by_name[nm.lower()] = item; added += 1
    # Keep plan/seed names where the app expects them.
    for e in lib:
        assert e['s'] in SECTIONS[e['k']], (e, SECTIONS[e['k']])
    order = {k: i for i, k in enumerate(SECTIONS)}
    lib.sort(key=lambda e: (order[e['k']], SECTIONS[e['k']].index(e['s'])))
    js = ['// ══════════════════════════════════════════════════════',
          '// EXERCISE LIBRARY — generated by tools/build-exercises.py from the',
          '// original SET3 list and the master gym index (tools/exercise-index.txt).',
          '// k = app muscle group, s = sub-section, eq = equipment, m = muscles,',
          '// t = how it is measured (weight, reps, time, duration). Edit the inputs',
          '// and re-run the script rather than editing this list by hand.',
          '// ══════════════════════════════════════════════════════',
          'const EX_SECTIONS=' + json.dumps(SECTIONS, ensure_ascii=False, separators=(',', ':')) + ';',
          'const EXDB=[']
    js += ['  ' + json.dumps({k: e[k] for k in ('n', 'k', 's', 'eq', 'm', 't')}, ensure_ascii=False, separators=(',', ':')) + ',' for e in lib]
    js.append('];')
    open(os.path.join(ROOT, 'exercises.js'), 'w', encoding='utf-8').write('\n'.join(js) + '\n' + HELPERS)
    from collections import Counter
    c = Counter(e['k'] for e in lib)
    print('total', len(lib), 'added', added, dict(c))
    if skipped: print('UNPLACED', skipped)

HELPERS = r'''
const EQ_ORDER=['Machine','Cable','Dumbbell','Barbell','Smith Machine','Kettlebell','Landmine','Plate','Band','Suspension','Medicine Ball','Bodyweight','Strongman','Other','Yours'];
const _EXIDX={};EXDB.forEach(function(e){_EXIDX[e.n]=e});
function customEx(){return (sGet('profile',{})||{}).customEx||[]}
function exInfo(name){
  if(_EXIDX[name])return _EXIDX[name];
  const c=customEx().filter(function(x){return x.n===name})[0];
  return c?{n:c.n,k:c.group,s:'Added by you',eq:'Yours',m:'',t:c.t||'weight'}:null;
}
function exGroup(name){const e=exInfo(name);return e?e.k:null}
function exercisesInGroup(k){
  const out=EXDB.filter(function(e){return e.k===k});
  customEx().forEach(function(c){if(c.group===k)out.push({n:c.n,k:k,s:'Added by you',eq:'Yours',m:'',t:c.t||'weight'})});
  return out;
}
function exSections(k){return (EX_SECTIONS[k]||[]).concat(['Added by you'])}
// Generic guidance for exercises the plan doesn't prescribe.
function genericDose(name){
  const e=exInfo(name),t=e?e.t:'weight';
  return t==='duration'?'15–30 min':t==='time'?'2 × 30–45 s':t==='reps'?'2–3 × 10–15':'2–3 × 8–12';
}
'''

if __name__ == '__main__':
    main()
