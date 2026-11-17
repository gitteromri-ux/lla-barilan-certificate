# Footage shotlist: Professional Certificate in Longevity and Lifelong Wellbeing Advisory Practice

Landing-page background loops for the Bar-Ilan University (Health 360 Center) and Bar-Ilan Akadima certificate, delivered with eTeacher / Longevity Life Academy. All clips are muted, cut-free loops chosen for a non-clinical, academic and premium register. Machine-readable data: `footage/manifest.json` (file paths there are relative to `site/`).

## Status at a glance

| Slot | Section | Current clip | Source res. | Output | Flag |
|---|---|---|---|---|---|
| `hero-science` | Hero, beat 01 "Science" | Stylised CGI DNA double helix (glowing particle backbones, twisted base-pair rungs), cyan on near-black navy, slow continuous rotation | 3840x2160 | 1920x1080, 10.00 s, 1.90 MB (+720p 0.88 MB) | Verify helix handedness |
| `hero-evidence` | Hero, beat 02 "Evidence" | Bearded researcher in a lab coat looking into a light microscope in a bright, modern lab; locked-off, minimal movement | 4096x2160 | 1920x1080, 10.00 s, 0.86 MB (+720p 0.31 MB) |  |
| `hero-practice` | Hero, beat 03 "Practice" | Younger advisor (man) and an older woman on a sofa at home reviewing a printed page together, smiling and talking | 3840x2160 | 1920x1080, 8.60 s, 1.61 MB (+720p 0.68 MB) | 8.6 s (source length) |
| `hero-impact` | Hero, beat 04 "Impact" | Older couple walking hand in hand toward camera through a summer meadow, soft overcast light | 4096x2160 | 1920x1080, 10.00 s, 1.83 MB (+720p 0.71 MB) |  |
| `about-academic` | 01 About the program | Students studying at lamp-lit reading desks in a modern university library at dusk, slow camera drift | 3840x2160 | 1280x720, 10.00 s, 0.55 MB | Young students |
| `course-1-science` | 02 Program journey | LLA production asset: CGI cluster of translucent cells drifting and rotating in a dark teal field | 1280x720 | 1280x720, 9.00 s, 1.27 MB | LLA 720p source (below 1440p) |
| `course-2-food` | 02 Program journey | Top-down view of hands slicing tomatoes, then lettuce, on a wooden board with celery, a salad bowl and cheese | 3840x2160 | 1280x720, 10.00 s, 1.31 MB |  |
| `course-3-habits` | 02 Program journey | Two older men walking toward camera on a park path, chatting and laughing (one uses a walking stick) | 3840x2160 | 1280x720, 9.96 s, 1.12 MB | Logo removed by inpainting |
| `course-4-sleep` | 02 Program journey | Woman resting and waking in a sunlit white bedroom, cheek on a pillow, soft morning light | 3840x2160 | 1280x720, 9.30 s, 0.33 MB | Younger subject |
| `course-5-purpose` | 02 Program journey | Senior woman in glasses and an apron shaping clay at a pottery wheel in a bright studio | 3840x2160 | 1280x720, 8.80 s, 0.51 MB |  |
| `course-6-social` | 02 Program journey | Grandparents and granddaughter laughing together outdoors against a timber facade | 4096x2160 | 1280x720, 10.00 s, 0.85 MB |  |
| `stage-4-capstone` | 02 Program journey | Woman presenting to a small seated group in a bright library learning space, no screen | 3840x2160 | 1280x720, 10.00 s, 0.70 MB |  |
| `live-online` | 02 Program journey | Educator speaking and gesturing to camera as if teaching a live online class, bookshelves behind | 3840x2160 | 1280x720, 10.00 s, 0.77 MB | Reframed to exclude a school letterboard |
| `opp-organizations` | 04 Professional opportunities | Diverse team in a workshop, posting sticky notes on a glass wall, filmed through the glass | 3840x2160 | 1280x720, 10.00 s, 1.11 MB |  |
| `opp-individuals` | 04 Professional opportunities | Professional woman in an armchair listening to an off-screen client and taking notes in a notebook | 3840x2160 | 1280x720, 10.00 s, 0.62 MB |  |
| `opp-community` | 04 Professional opportunities | Group of older adults on mats in a sunny park following an instructor through gentle stretches | 3840x2160 | 1280x720, 8.80 s, 2.41 MB |  |
| `cta-final` | Closing CTA | Older couple walking onto a lakeside dock at golden-hour sunset, seen from behind in near-silhouette, then standing arm in arm | 4096x2160 | 1280x720, 10.00 s, 0.59 MB | Same couple as hero-impact (bookend) |

## Encoding specs (applies to every slot)

- **Cut**: the best 8-12 s cut-free segment; muted loop; no fades. In and out points are listed per slot.
- **Files**: hero slots get `{slot}.mp4` at 1920x1080 and `{slot}-720.mp4` at 1280x720; every other slot gets `{slot}.mp4` at 1280x720 only. Each slot also gets a `{slot}.jpg` poster (first frame of the cut; 1920x1080 for heroes, 1280x720 for the rest). Everything lives in `site/assets/video/`.
- **Video**: H.264 High profile, yuv420p, `-preset slow`, `-movflags +faststart`, no audio (`-an`), metadata stripped. CRF 25 for hero 1080p and CRF 27 for everything else; CRF goes up 1 step at a time only if a file is over its size target.
- **Framing**: exact 16:9 cover crop (`scale=W:H:force_original_aspect_ratio=increase:flags=lanczos,crop=W:H`), centred. 4096x2160 sources lose about 3% at each side.
- **Frame rate**: kept from the source when 30 fps or lower (all current sources are 23.976, 24, 25 or 30 fps); 50 fps sources go to 25 and anything else above 30 goes to 30.
- **Grade**: gentle and uniform, `eq=contrast=1.03:saturation=0.95`.
- **Size targets**: hero 1080p 4.5 MB or less, hero 720p 2 MB or less, other slots 2.5 MB or less, posters 220 KB or less (JPEG quality about 80, progressive).
- **Never upscale.** A source below the output size, such as the 720p LLA clip, is encoded at its native size.

Reference commands (replace `IN`, `DUR`, `SOURCE` and `SLOT`):

```bash
VF='scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,eq=contrast=1.03:saturation=0.95,setsar=1,format=yuv420p'
# hero 1080p
ffmpeg -ss IN -i SOURCE -t DUR -vf "$VF" -c:v libx264 -profile:v high -preset slow -crf 25 \
  -pix_fmt yuv420p -movflags +faststart -an -map_metadata -1 site/assets/video/SLOT.mp4
# hero 720p: same command with 1280:720 in both places in VF, -crf 27, output SLOT-720.mp4
# other slots: 1280:720 in VF, -crf 27, output SLOT.mp4
# add -r 25 (50 fps source) or -r 30 (other sources above 30 fps) before -c:v
# poster from the first frame of the cut (hero 1920x1080, others 1280x720), then check it is 220 KB or less
ffmpeg -ss IN -i SOURCE -frames:v 1 -vf "${VF%,format=yuv420p}" -q:v 4 site/assets/video/SLOT.jpg
```

## How to swap a clip (Artgrid / Artlist or other licensed footage)

1. Download the 4K (or larger) master; keep raw files outside the repo.
2. Choose an 8-12 s cut-free segment and check that no logos, readable text, captions or watermarks appear at the delivered size.
3. Re-encode with the commands above to the **same file names** (`SLOT.mp4`, plus `SLOT-720.mp4` for heroes) and overwrite in place. The page markup does not change.
4. Regenerate the poster `SLOT.jpg` from the first frame of the new cut, so the poster-to-video hand-off is seamless.
5. Confirm the size targets (`ls -l`) and that the file decodes (`ffprobe -v error SLOT.mp4`).
6. Update this slot's entry here and in `manifest.json`: source page, file URL, creator, licence, source resolution, sizes and notes.

## Slots

### `hero-science`

- **Page section**: Hero, beat 01 "Science" (What actually extends healthy life)
- **Meaning**: Luminous cellular/molecular imagery, deep blue, slow drift; macro full-bleed.
- **Current clip**: Stylised CGI DNA double helix (glowing particle backbones, twisted base-pair rungs), cyan on near-black navy, slow continuous rotation.
  - Source page: https://www.pexels.com/video/digital-formation-of-a-dna-in-an-animated-presentation-3191572/
  - Direct file: https://videos.pexels.com/video-files/3191572/3191572-uhd_3840_2160_25fps.mp4
  - Creator: Pressmaster
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 24.88 s
  - Segment used: 2-12 s
- **Processed files**: `hero-science.mp4`: 1920x1080, 10.00 s, 1.90 MB (CRF 25); `hero-science-720.mp4`: 1280x720, 10.00 s, 0.88 MB (CRF 27); `hero-science.jpg`: 1920x1080, 92 KB (JPEG q80)
- **Notes**: CGI render, not microscopy. FLAG: helix handedness could not be verified in this stylised, partly defocused render (biological B-DNA is right-handed). Ask a Bar-Ilan scientist to sign off; if judged left-handed, add hflip at the start of the -vf chain (mirroring reverses handedness) or replace via the brief. Small magenta highlights in the strands.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Macro / extreme close-up, full-bleed; either real fluorescence or confocal microscopy of living human cells, or a scientifically accurate CGI of right-handed B-DNA (visible major/minor grooves). No labels, UI or text.
  - Subject (age, diversity): Cells, organelles or DNA only; no people.
  - Action: Very slow drift or orbit (under ~5 degrees/s), gentle particle float, optional slow rack-focus through depth.
  - Setting: Abstract dark field.
  - Lighting and time of day: Self-luminous cyan/teal emission on a deep navy-to-black ground; no red/magenta accents.
  - Lens and camera movement: Macro look, very shallow depth of field, slow push-in or orbit, locked horizon.
  - Mood: Awe, precision, calm authority.
  - Colour grade: Deep navy blacks (#040D24 to #0A1E3A), cool blue mids, restrained saturation; must sit under white headline type.
  - Ideal duration: 10-15 s, one continuous take, loopable.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "fluorescence microscopy living cells", "confocal cells blue 4K", "B-DNA double helix accurate", "cell biology macro navy", "microscopic particles slow drift"

### `hero-evidence`

- **Page section**: Hero, beat 02 "Evidence" (Appraisal over hype)
- **Meaning**: Researcher at a microscope; research, not clinical care.
- **Current clip**: Bearded researcher in a lab coat looking into a light microscope in a bright, modern lab; locked-off, minimal movement.
  - Source page: https://www.pexels.com/video/man-using-microscope-8771149/
  - Direct file: https://videos.pexels.com/video-files/8771149/8771149-uhd_4096_2160_25fps.mp4
  - Creator: Gustavo Fring
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 4096x2160 @ 25 fps, 16.20 s
  - Segment used: 2-12 s
- **Processed files**: `hero-evidence.mp4`: 1920x1080, 10.00 s, 0.86 MB (CRF 25); `hero-evidence-720.mp4`: 1280x720, 10.00 s, 0.31 MB (CRF 27); `hero-evidence.jpg`: 1920x1080, 148 KB (JPEG q80)
- **Notes**: Research-lab setting, no patients. Only tiny generic objective magnification markings visible at 1:1 at 1080p, no brand name. Very static shot, so files are small.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium close-up, profile or three-quarter, on a researcher at a research microscope or reviewing data at a lab bench.
  - Subject (age, diversity): Researcher aged 40-60, any ethnicity (ideally a woman or a mixed-age pair); no patients, no hospital cues.
  - Action: Adjusts focus, pauses, makes a handwritten note, looks up thoughtfully.
  - Setting: University research lab with daylight windows, glassware, softly defocused colleagues; no logos or screens.
  - Lighting and time of day: Soft daylight (about 5600K), clean and cool.
  - Lens and camera movement: 50-85 mm at f/2-2.8, slow slider or gentle push-in; or locked-off with subtle subject motion.
  - Mood: Rigorous, focused, credible.
  - Colour grade: Cool neutral whites, shadows nudged toward navy, natural skin.
  - Ideal duration: 10-15 s, no cuts.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "scientist microscope university lab", "researcher focus microscope daylight", "academic laboratory slow push", "senior researcher lab notes"

### `hero-practice`

- **Page section**: Hero, beat 03 "Practice" (Structured, non-diagnostic advisory work)
- **Meaning**: Non-clinical advisor with an older adult at home.
- **Current clip**: Younger advisor (man) and an older woman on a sofa at home reviewing a printed page together, smiling and talking.
  - Source page: https://www.pexels.com/video/bearded-man-explaining-a-document-to-an-elderly-woman-8439146/
  - Direct file: https://videos.pexels.com/video-files/8439146/8439146-uhd_3840_2160_25fps.mp4
  - Creator: Kampus Production
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 8.76 s
  - Segment used: 0.08-8.68 s
- **Processed files**: `hero-practice.mp4`: 1920x1080, 8.60 s, 1.61 MB (CRF 25); `hero-practice-720.mp4`: 1280x720, 8.60 s, 0.68 MB (CRF 27); `hero-practice.jpg`: 1920x1080, 142 KB (JPEG q80)
- **Notes**: Home setting, no clinical items. Printed page shows only faint, illegible lines at 1080p. Source is only 8.76 s, so the cut is 8.6 s (just above the 8 s minimum).
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium two-shot or over-the-shoulder at a kitchen table or sofa.
  - Subject (age, diversity): Advisor aged 30-50 and client aged 65-80, diverse; no white coats, devices, pills or medical paperwork.
  - Action: Reviewing a printed wellbeing plan or notebook; client speaks and smiles, advisor listens and points to the plan.
  - Setting: Bright, lived-in home (books, plants, soft textiles).
  - Lighting and time of day: Soft window light, late morning.
  - Lens and camera movement: 35-50 mm at f/2-2.8, slow arc or push-in.
  - Mood: Respectful, warm, attentive.
  - Colour grade: Warm, natural skin; cool navy-leaning shadows.
  - Ideal duration: 10-15 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "advisor older client home conversation", "senior woman consultation notebook home", "wellbeing coach elderly client", "reviewing plan at kitchen table"

### `hero-impact`

- **Page section**: Hero, beat 04 "Impact" (Individuals, workplaces and communities)
- **Meaning**: Older adults thriving outdoors, wide.
- **Current clip**: Older couple walking hand in hand toward camera through a summer meadow, soft overcast light.
  - Source page: https://www.pexels.com/video/an-elderly-couple-walking-in-a-park-8795725/
  - Direct file: https://videos.pexels.com/video-files/8795725/8795725-uhd_4096_2160_24fps.mp4
  - Creator: Anastasia Shuraeva
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 4096x2160 @ 24 fps, 21.62 s
  - Segment used: 0.8-10.8 s
- **Processed files**: `hero-impact.mp4`: 1920x1080, 10.00 s, 1.83 MB (CRF 25); `hero-impact-720.mp4`: 1280x720, 10.00 s, 0.71 MB (CRF 27); `hero-impact.jpg`: 1920x1080, 206 KB (JPEG q80)
- **Notes**: Cut 0.8-10.8 s avoids a lamp post that enters frame left later in the source; a faint power line may be visible in the sky. Same creator, and apparently the same couple, as cta-final, but a different setting and light.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Wide to medium-wide establishing shot.
  - Subject (age, diversity): Couple or small group of older adults aged 65-80, diverse, visibly active and joyful.
  - Action: Walking side by side, laughing, natural stride; toward camera or tracked laterally.
  - Setting: Open nature (coastal path, meadow, parkland) with expansive sky; no urban signage.
  - Lighting and time of day: Late-afternoon daylight with a cool sky (keep the golden-hour sunset for cta-final).
  - Lens and camera movement: 35 mm on a gimbal or a low, slow drone pass; slow lateral or backward tracking.
  - Mood: Vitality, freedom, possibility.
  - Colour grade: Cool blue sky, natural greens, warm skin.
  - Ideal duration: 12-15 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "active seniors walking nature", "older couple meadow walk", "senior friends coastal path", "healthy aging outdoors tracking"

### `about-academic`

- **Page section**: 01 About the program
- **Meaning**: Library, lecture or seminar; no signage.
- **Current clip**: Students studying at lamp-lit reading desks in a modern university library at dusk, slow camera drift.
  - Source page: https://www.pexels.com/video/college-students-researching-and-reading-at-the-library-6549288/
  - Direct file: https://videos.pexels.com/video-files/6549288/6549288-uhd_3840_2160_25fps.mp4
  - Creator: Tima Miroshnichenko
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 15.45 s
  - Segment used: 5-15 s
- **Processed files**: `about-academic.mp4`: 1280x720, 10.00 s, 0.55 MB (CRF 27); `about-academic.jpg`: 1280x720, 70 KB (JPEG q80)
- **Notes**: No signage, logos or readable titles at 720p. Subjects are young students; an adult-learner seminar would fit the audience better.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Wide to medium in a university library or seminar room.
  - Subject (age, diversity): Adult learners aged 30-60, mixed genders and ethnicities.
  - Action: Reading, writing notes, quiet discussion.
  - Setting: Academic library or seminar room with tall shelves and reading lamps; no signage or logos.
  - Lighting and time of day: Dusk or evening: warm practical lamps against blue window light.
  - Lens and camera movement: 35-50 mm, slow dolly or slider.
  - Mood: Scholarly, serious, inviting.
  - Colour grade: Navy shadows, warm practicals.
  - Ideal duration: 10-15 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "university library evening adult learners", "mature students seminar room", "academic library dolly", "adult education study"

### `course-1-science`

- **Page section**: 02 Program journey: Stage 01, Course 1 "The Science of Longevity" (also stage card, rail thumbnail, Insights covers)
- **Meaning**: Science close-up (cells or microscopy), different from the hero shots.
- **Current clip**: LLA production asset: CGI cluster of translucent cells drifting and rotating in a dark teal field.
  - Source page: https://www.longevitylifeacademy.com/
  - Direct file: https://longevitylifeacademy.pages.dev/assets/cells-light.mp4
  - Creator: Not stated (Longevity Life Academy production asset)
  - Licence: Client-owned LLA production asset; reuse permitted by the brief. Original origin and licence are not documented in the provided materials (confirm with LLA).
  - Source resolution: 1280x720 @ 25 fps, 9.04 s
  - Segment used: 0-9 s
- **Processed files**: `course-1-science.mp4`: 1280x720, 9.00 s, 1.27 MB (CRF 27); `course-1-science.jpg`: 1280x720, 49 KB (JPEG q80)
- **Notes**: The LLA home page loads this file, and it is listed in materials/lla_site_notes.md. FLAG: source is only 1280x720 (below the 1440p minimum). Used under the brief's LLA-reuse allowance because it is the client's own science footage and differs from the hero DNA; encoded at native 720p with no upscaling. The cluster resembles an early-stage embryo (morula), so a reviewer may want a more neutral cell image. 4K stock fallback considered: Pexels 4114797 (Edward Jenner, microscope objective close-up, 3840x2160 50 fps), not used because it repeats hero-evidence's microscope.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Extreme close-up or macro, distinct from hero-science (no DNA helix).
  - Subject (age, diversity): Living cells, mitochondria or a phase-contrast cell-culture time-lapse; no embryo-like clusters.
  - Action: Slow drift or time-lapse cell motion.
  - Setting: Microscopic field.
  - Lighting and time of day: Cool blue/teal on dark.
  - Lens and camera movement: Macro or microscope camera, minimal camera movement.
  - Mood: Curiosity, clarity.
  - Colour grade: Navy/cyan to match the brand palette.
  - Ideal duration: 8-12 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "cell culture time lapse microscope", "mitochondria animation", "microscopy cells blue", "cell biology macro 4K"

### `course-2-food`

- **Page section**: 02 Program journey: Stage 02, Course 2 "Food as Medicine" (also stage card, Insights cover)
- **Meaning**: Whole foods, hands preparing.
- **Current clip**: Top-down view of hands slicing tomatoes, then lettuce, on a wooden board with celery, a salad bowl and cheese.
  - Source page: https://www.pexels.com/video/a-woman-making-a-vegetable-salad-7204593/
  - Direct file: https://videos.pexels.com/video-files/7204593/7204593-uhd_3840_2160_24fps.mp4
  - Creator: ArtHouse Studio
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 24 fps, 17.83 s
  - Segment used: 0-10 s
- **Processed files**: `course-2-food.mp4`: 1280x720, 10.00 s, 1.31 MB (CRF 27); `course-2-food.jpg`: 1280x720, 129 KB (JPEG q80)
- **Notes**: Natural daylight; a kitchen knife is in use (culinary only). The hands look younger; older hands would fit the program better.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Top-down or 45-degree medium close-up.
  - Subject (age, diversity): Hands of an older adult, diverse skin tones.
  - Action: Chopping vegetables, assembling a grain or legume bowl, pouring olive oil.
  - Setting: Home kitchen counter in natural wood or stone; Mediterranean-pattern whole foods.
  - Lighting and time of day: Soft daylight from a side window.
  - Lens and camera movement: 50-100 mm macro, slow slider.
  - Mood: Nourishing, simple, real.
  - Colour grade: Natural greens and reds, slightly desaturated, cool shadows.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "older hands chopping vegetables", "Mediterranean diet preparation top down", "whole food kitchen", "olive oil vegetables bowl"

### `course-3-habits`

- **Page section**: 02 Program journey: Stage 02, Course 3 "Habits That Shape Health"
- **Meaning**: Walking, stairs, cycling or a small group.
- **Current clip**: Two older men walking toward camera on a park path, chatting and laughing (one uses a walking stick).
  - Source page: https://www.pexels.com/video/two-older-men-walking-outside-27333200/
  - Direct file: https://videos.pexels.com/video-files/27333200/12120270_3840_2160_25fps.mp4
  - Creator: Centre for Ageing Better
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 10.56 s (original Pexels file; encoded from a logo-inpainted 3840x2160 intermediate)
  - Segment used: 0.3-10.3 s
- **Processed files**: `course-3-habits.mp4`: 1280x720, 9.96 s, 1.12 MB (CRF 27); `course-3-habits.jpg`: 1280x720, 118 KB (JPEG q80)
- **Notes**: MODIFIED: a small apparel-brand logo (The North Face) on one man's jacket was removed before encoding with per-frame template tracking and OpenCV inpainting; checked clean at 4K and 720p (the Pexels License allows modification). The walking stick is realistic and inclusive; swap the clip if a more athletic register is wanted.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium-wide tracking shot.
  - Subject (age, diversity): Two to four older adults aged 60-80, diverse.
  - Action: Brisk walking and talking, climbing outdoor steps, or cycling together.
  - Setting: Urban park or tree-lined neighbourhood path; no branded clothing.
  - Lighting and time of day: Morning daylight.
  - Lens and camera movement: 35-50 mm on a gimbal, backward or lateral tracking.
  - Mood: Everyday vitality, companionship.
  - Colour grade: Natural, slightly cool.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "seniors walking park conversation", "older adults daily walk", "senior cycling city", "older people outdoor stairs"

### `course-4-sleep`

- **Page section**: 02 Program journey: Stage 02, Course 4 "Sleep, Stress, and Healthy Aging" (also Insights cover)
- **Meaning**: Morning light, waking, breathing.
- **Current clip**: Woman resting and waking in a sunlit white bedroom, cheek on a pillow, soft morning light.
  - Source page: https://www.pexels.com/video/a-beautiful-woman-waking-up-7505440/
  - Direct file: https://videos.pexels.com/video-files/7505440/7505440-uhd_3840_2160_30fps.mp4
  - Creator: Artem Podrez
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 30 fps, 9.37 s
  - Segment used: 0-9.3 s
- **Processed files**: `course-4-sleep.mp4`: 1280x720, 9.30 s, 0.33 MB (CRF 27); `course-4-sleep.jpg`: 1280x720, 56 KB (JPEG q80)
- **Notes**: Subject is a younger adult, not an older adult. Chosen over a similar clip to avoid repeating the hero-impact model.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium or close shot.
  - Subject (age, diversity): Older adult aged 55-75.
  - Action: Waking naturally and opening eyes, a gentle stretch, or slow breathing at a window or on a balcony at dawn.
  - Setting: Calm bedroom with linen and sheer curtains.
  - Lighting and time of day: Soft early-morning sun through curtains.
  - Lens and camera movement: 50-85 mm, slow push-in.
  - Mood: Restorative, calm.
  - Colour grade: Soft whites, cool shadows.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "senior waking up morning light", "older woman bedroom sunrise", "morning breathing window", "restful sleep bedroom"

### `course-5-purpose`

- **Page section**: 02 Program journey: Stage 03, Course 5 "Purpose, Meaning & Emotional Wellbeing"
- **Meaning**: Pottery, painting or gardening.
- **Current clip**: Senior woman in glasses and an apron shaping clay at a pottery wheel in a bright studio.
  - Source page: https://www.pexels.com/video/woman-molding-a-clay-6023338/
  - Direct file: https://videos.pexels.com/video-files/6023338/6023338-uhd_3840_2160_25fps.mp4
  - Creator: Kampus Production
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 8.85 s
  - Segment used: 0-8.8 s
- **Processed files**: `course-5-purpose.mp4`: 1280x720, 8.80 s, 0.51 MB (CRF 27); `course-5-purpose.jpg`: 1280x720, 83 KB (JPEG q80)
- **Notes**: Whole 8.85 s source used (8.8 s cut). No text.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium close-up.
  - Subject (age, diversity): Older adult aged 60-80, absorbed in a craft.
  - Action: Shaping clay, painting at an easel, or planting in a community garden.
  - Setting: Craft studio or garden.
  - Lighting and time of day: Window daylight.
  - Lens and camera movement: 50-85 mm, shallow depth of field, slow slider.
  - Mood: Absorbed, meaningful, flow.
  - Colour grade: Earthy warm tones with cool shadows.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "senior woman pottery wheel", "older man painting easel", "elderly community gardening", "retiree craft studio"

### `course-6-social`

- **Page section**: 02 Program journey: Stage 03, Course 6 "Social Connection and Longevity" (also Stage 03 card)
- **Meaning**: Multigenerational family, friends at a table, community.
- **Current clip**: Grandparents and granddaughter laughing together outdoors against a timber facade.
  - Source page: https://www.pexels.com/video/video-of-grandparents-and-their-granddaughter-7085104/
  - Direct file: https://videos.pexels.com/video-files/7085104/7085104-uhd_4096_2160_25fps.mp4
  - Creator: cottonbro studio
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 4096x2160 @ 25 fps, 45.56 s
  - Segment used: 26-36 s
- **Processed files**: `course-6-social.mp4`: 1280x720, 10.00 s, 0.85 MB (CRF 27); `course-6-social.jpg`: 1280x720, 81 KB (JPEG q80)
- **Notes**: Cut 26-36 s of a 45.6 s source, where all three faces are visible and laughing. Slight handheld drift.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium group shot.
  - Subject (age, diversity): Multigenerational family or friends, with members aged 60-80 and younger relatives.
  - Action: Sharing a meal, passing dishes, laughing together.
  - Setting: Outdoor table or home dining room.
  - Lighting and time of day: Warm late afternoon.
  - Lens and camera movement: 35-50 mm, slow arc.
  - Mood: Belonging, joy.
  - Colour grade: Warm skin, cool backgrounds.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "multigenerational family dinner table", "grandparents laughing with grandchildren", "senior friends sharing meal", "community lunch older adults"

### `stage-4-capstone`

- **Page section**: 02 Program journey: Stage 04, Capstone portfolio (also Stage 04 card and rail thumbnail)
- **Meaning**: Presenting to a small group, panel or video call.
- **Current clip**: Woman presenting to a small seated group in a bright library learning space, no screen.
  - Source page: https://www.pexels.com/video/a-woman-presenting-a-topic-to-officemates-5940455/
  - Direct file: https://videos.pexels.com/video-files/5940455/5940455-uhd_3840_2160_25fps.mp4
  - Creator: Kampus Production
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 12.84 s
  - Segment used: 1-11 s
- **Processed files**: `stage-4-capstone.mp4`: 1280x720, 10.00 s, 0.70 MB (CRF 27); `stage-4-capstone.jpg`: 1280x720, 104 KB (JPEG q80)
- **Notes**: No slides or screens; book covers on the shelves are not legible at 720p. The library setting echoes about-academic, but this is daytime and bright where that is dusk. Several alternatives were rejected for legible charts or flipcharts.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium-wide.
  - Subject (age, diversity): Adult professional aged 35-60 presenting to a panel of 3-5 assessors, diverse.
  - Action: Presenting a case or portfolio while the panel listens, nods and takes notes.
  - Setting: University seminar room, or a video-call panel with screens not readable.
  - Lighting and time of day: Daylight.
  - Lens and camera movement: 35-50 mm, slow push-in.
  - Mood: Accomplished, professional.
  - Colour grade: Neutral-cool.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "presentation to small panel seminar room", "professional presenting to committee", "adult learner oral exam", "capstone presentation"

### `live-online`

- **Page section**: 02 Program journey: Stage 01 Program start (Orientation), Stage 04 Final assessment, live-lesson panel
- **Meaning**: An educator teaching live on a video call (webcam point of view), used as the instructor tile of the live-classroom mockup and behind the orientation and final-assessment screens.
- **Current clip**: Educator in a blazer and glasses speaking and gesturing straight to camera, as if teaching a live online class, in front of bookshelves.
  - Source page: https://www.pexels.com/video/a-teacher-discussing-her-online-lesson-5200350/
  - Direct file: https://videos.pexels.com/video-files/5200350/5200350-uhd_3840_2160_25fps.mp4
  - Creator: Max Fischer
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 22.80 s
  - Segment used: 3.5-13.5 s
- **Processed files**: `live-online.mp4`: 1280x720, 10.00 s, 0.77 MB (CRF 27); `live-online.jpg`: 1280x720, 64 KB
- **Notes**: Replaced the first pick (a man studying at a laptop, Pexels 5762416), which showed a learner rather than an educator teaching. The source frame includes a classroom letterboard reading "CLASSWORK · MATHS · BREAK", which signals a children's school, so the clip is reframed with `crop=2420:1361:250:90` (from 3840x2160) to keep it out of shot; the remaining crop is still 1.9x the delivered width. Small continent labels on a wall map remain at the delivered size.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium or over-the-shoulder.
  - Subject (age, diversity): Educator aged 40-65 teaching live, or a mid-career professional aged 35-60 attending a live class.
  - Action: Speaking and gesturing to a laptop; or listening, nodding and taking handwritten notes.
  - Setting: Home office with books and warm practicals; no readable screen or logos.
  - Lighting and time of day: Soft window key plus screen glow.
  - Lens and camera movement: 35-50 mm, slow push-in.
  - Mood: Engaged, live, connected.
  - Colour grade: Navy shadows, warm skin.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "online class laptop notes adult learner", "teacher video call home office", "live webinar professional notes", "mature student e-learning"

### `opp-organizations`

- **Page section**: 04 Professional opportunities: "Lead wellbeing from the inside." (organizations)
- **Meaning**: Workplace workshop.
- **Current clip**: Diverse team in a workshop, posting sticky notes on a glass wall, filmed through the glass.
  - Source page: https://www.pexels.com/video/people-posting-sticky-notes-on-a-glass-panel-8632487/
  - Direct file: https://videos.pexels.com/video-files/8632487/8632487-uhd_3840_2160_25fps.mp4
  - Creator: Kampus Production
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 10.72 s
  - Segment used: 0.3-10.3 s
- **Processed files**: `opp-organizations.mp4`: 1280x720, 10.00 s, 1.11 MB (CRF 27); `opp-organizations.jpg`: 1280x720, 69 KB (JPEG q80)
- **Notes**: Sticky notes are blank or illegible at 720p. An alternative was rejected for a readable slogan.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium-wide.
  - Subject (age, diversity): Facilitator with diverse employees aged 25-65.
  - Action: Workshop discussion with sticky notes, nods and contributions.
  - Setting: Bright modern office meeting room; whiteboard or notes without legible text.
  - Lighting and time of day: Daylight.
  - Lens and camera movement: 35 mm, slow slider (through glass optional).
  - Mood: Collaborative, purposeful.
  - Colour grade: Cool neutral.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "workplace wellbeing workshop", "facilitator employees meeting room", "team workshop sticky notes glass", "corporate wellness session"

### `opp-individuals`

- **Page section**: 04 Professional opportunities: "Guide people, one plan at a time." (individuals; also Stage 04 Supervised practicum)
- **Meaning**: One-to-one advisory, note-taking.
- **Current clip**: Professional woman in an armchair listening to an off-screen client and taking notes in a notebook.
  - Source page: https://www.pexels.com/video/young-therapist-taking-notes-during-session-5330655/
  - Direct file: https://videos.pexels.com/video-files/5330655/5330655-uhd_3840_2160_25fps.mp4
  - Creator: Tima Miroshnichenko
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 17.76 s
  - Segment used: 0-10 s
- **Processed files**: `opp-individuals.mp4`: 1280x720, 10.00 s, 0.62 MB (CRF 27); `opp-individuals.jpg`: 1280x720, 86 KB (JPEG q80)
- **Notes**: The Pexels title says "therapist", but nothing in frame signals therapy or clinical care; it reads as an advisory or coaching session. Only the advisor is visible.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Medium or over-the-shoulder two-shot.
  - Subject (age, diversity): Advisor aged 35-60 with a client aged 50-75, diverse.
  - Action: Listening, note-taking, nodding; the client talks.
  - Setting: Warm home office or consulting lounge with armchairs; no clinical items.
  - Lighting and time of day: Soft daylight.
  - Lens and camera movement: 50-85 mm, over-the-shoulder, slow push-in.
  - Mood: Trust, attentiveness.
  - Colour grade: Warm-neutral.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "consultant client one to one notes", "coach listening client armchair", "advisor taking notes session", "wellbeing consultation older client"

### `opp-community`

- **Page section**: 04 Professional opportunities: "Build environments that support a long life." (community)
- **Meaning**: Seniors' group activity led by a facilitator.
- **Current clip**: Group of older adults on mats in a sunny park following an instructor through gentle stretches.
  - Source page: https://www.pexels.com/video/group-of-elderly-people-exercising-in-a-park-3191859/
  - Direct file: https://videos.pexels.com/video-files/3191859/3191859-uhd_3840_2160_25fps.mp4
  - Creator: Pressmaster
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 3840x2160 @ 25 fps, 8.84 s
  - Segment used: 0-8.8 s
- **Processed files**: `opp-community.mp4`: 1280x720, 8.80 s, 2.41 MB (CRF 29); `opp-community.jpg`: 1280x720, 209 KB (JPEG q75)
- **Notes**: Dense grass and leaf texture needed CRF 29 to fit the 2.5 MB target, and the poster is quality 75. Whole 8.84 s source used (8.8 s cut).
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Wide.
  - Subject (age, diversity): Older adults aged 60-85, diverse, with a facilitator.
  - Action: Following the facilitator through gentle movement (tai chi, stretching or a walking group), smiling.
  - Setting: Park or community centre.
  - Lighting and time of day: Morning sun.
  - Lens and camera movement: 24-35 mm, slow lateral move or crane.
  - Mood: Belonging, active.
  - Colour grade: Natural greens, slightly cool.
  - Ideal duration: 10 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "seniors group exercise park instructor", "community class older adults", "tai chi seniors park", "older adults group walk facilitator"

### `cta-final`

- **Page section**: Closing CTA: "Longer lives deserve better guidance."
- **Meaning**: Aspirational older adults at golden hour, different from hero-impact.
- **Current clip**: Older couple walking onto a lakeside dock at golden-hour sunset, seen from behind in near-silhouette, then standing arm in arm.
  - Source page: https://www.pexels.com/video/back-view-of-a-couple-enjoying-the-nature-8795945/
  - Direct file: https://videos.pexels.com/video-files/8795945/8795945-uhd_4096_2160_24fps.mp4
  - Creator: Anastasia Shuraeva
  - Licence: Pexels License (free commercial use, no attribution required, modification allowed; https://www.pexels.com/license/)
  - Source resolution: 4096x2160 @ 24 fps, 30.92 s
  - Segment used: 10-20 s
- **Processed files**: `cta-final.mp4`: 1280x720, 10.00 s, 0.59 MB (CRF 27); `cta-final.jpg`: 1280x720, 72 KB (JPEG q80)
- **Notes**: Same creator, and apparently the same couple, as hero-impact; treated as an intentional bookend. Here they are back-lit silhouettes at sunset by a lake, versus a frontal daytime meadow in the hero. Cut 10-20 s of a 30.9 s source; a bird crosses the sky briefly.
- **Artlist / Artgrid replacement brief**:
  - Shot type and scale: Wide.
  - Subject (age, diversity): Older couple or small group aged 65-80, diverse.
  - Action: Walking slowly to the water's edge, embracing, taking in the view.
  - Setting: Lake, coast or hilltop.
  - Lighting and time of day: Golden-hour backlight with a soft sun flare.
  - Lens and camera movement: 35-50 mm, slow push-in or crane-up.
  - Mood: Hopeful, grateful, open future.
  - Colour grade: Warm highlights rolling into cool navy shadows (it sits under CTA text).
  - Ideal duration: 10-15 s.
  - Aspect: 16:9 master (3840x2160 or larger). Mobile 9:16 safe area: a centred 9:16 crop keeps only the middle ~32% of the frame width (about 1215 px of 3840), so keep faces/hands/key action inside that centre column and avoid critical detail at the frame edges.
  - Search keywords: "senior couple sunset lake", "older adults golden hour", "elderly couple watching sunset", "seniors silhouette horizon"

## Sourcing notes

- Sources are Pexels (16 slots) plus one LLA production asset. Pixabay candidates were also reviewed for the science slots but rejected: one cell clip is AI-generated, one is a bright membrane diagram with a cut, and one is only 1080p. No French Atelier footage was used.
- Every resolution above comes from ffprobe on the downloaded original, not from the file name; one Pexels file named `uhd_4096_2160` turned out to be 2732x1440 and was rejected for a hero slot.
- Every chosen clip was checked visually: contact sheets, 1-second filmstrips of the cut, and 1:1 crops at the delivered resolution for logos and legible text.
- Rejected along the way, among others: clips with legible charts, flipcharts, slogans or screens; bike-share branding; 1080p and 1440p clips; vertical clips; foggy or dim hiking shots; and posed or fashion-styled stock.
