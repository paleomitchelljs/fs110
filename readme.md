# Sauropod neck posture

A drag-and-watch model of the Seymour vs. Taylor argument. Could a sauropod hold its head up, and what would it cost? The page has almost no words on purpose. The talking happens in the room.

## Running it

Open `index.html` in a browser. No build step, no install, no server. It works offline (it falls back to system fonts).

To put it on GitHub Pages: push this folder to `main`, then go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, and pick `main` and `/ (root)`. The site shows up at `https://paleomitchelljs.github.io/fs110/` a minute or so later.

## What you can grab

| On the diagram | What it does |
|---|---|
| Drag the head | Puts the head where you drop it (neck angle and neck length) |
| Drag the neck | Neck angle only |
| Drag the body up or down | Size. Mass goes with size³, and the default heart rate follows mass |
| Drag a front foot up | Rears up on the hind legs |
| Click the heart | Heart rate +15% (shift-click: −15%). The heart itself stays put |
| Drag or scroll any yellow, underlined number | Changes that input |
| Click a `?` | Shows that answer |
| Double-click the head (or press D) | Drinks: head down over 3 s, holds 5 s, back up over 3 s |

## Layers

Everything starts hidden. The icon bar (or keys 1–0) reveals one piece of the argument at a time.

| Key | Layer | Shows | You can change |
|---|---|---|---|
| 1 | Head above heart | Vertical distance, brain to heart | – |
| 2 | Blood pressure | Pressure at the heart and head; gauge with human (≈95) and giraffe (≈200) marks | Pressure the head needs (default 50) |
| 3 | Artery walls | Vessel drawn thicker where pressure is higher; wall rings at head, heart and feet; pressure at the feet | – |
| 4 | Heart | Heart drawn to scale against a normal one (dashed); left ventricle as % of body mass; beats at the set rate | Heart rate |
| 5 | Energy | Share of the energy budget spent circulating blood; reach sphere around the shoulders | Metabolic rate (× mammal) |
| 6 | Siphon | Neck veins; blue shading where blood is below air pressure; bubbles when blood would boil | Suction the veins can hold |
| 7 | Neck pumps | Pumps on the neck (click the neck to add, click a pump to remove). Turns the siphon off | Where the pumps are |
| 8 | Air sacs | Air in the neck; torque to hold the neck out; air-sac pressure squeezing the vessels | Air %, air-sac pressure |
| 9 | Bones | Neutral pose from bones alone (dashed) and with cartilage (dotted). Click the dotted neck to use it; click the neck to straighten | Cartilage % |
| 0 | Brain, live | Pressure at the brain as it happens, 30 s trace; the eye shuts on a faint, a star marks a burst vessel; mesh by the head toggles a rete | Reflex time τ |

The eye button hides answers until clicked (P). The half-circle switches whiteboard and chalkboard (T). The arrow starts over (click twice). Add `#all` to the address to open with every layer on and no answers hidden.

One order that works: 1, 2, then load the giraffe and check the model against it before trusting it for anything bigger. Then 3, 4, 5. Then the three rescues (6, 7, 8), then 9 for the other side, and 0 last.

## The model

Everything is in `js/model.js`, and none of it is hidden.

### Pressure

Each metre of blood above the heart is 1000 × 1.055 / 13.534 = 78 mmHg (Seymour 2009). Pressure at the heart = 78 × (head above heart) + what the head needs (50 mmHg, Seymour's allowance for flow), never less than 100 mmHg (what the body needs). Pressure at the feet adds the column from heart to ground.

### Walls

Force balance on a tube: wall thickness ÷ radius = pressure ÷ wall stress. The working stress (90 kPa) gives a human aorta its wall of 0.15 × radius at 100 mmHg.

### Heart

Blood flow from the Fick principle: metabolic rate (3.6 × mass^0.71 W, the mammal equation Seymour used) ÷ (20.1 J per mL O₂ × 50 mL O₂ extracted per L). Stroke volume = flow ÷ heart rate (default 241 × mass^−0.25 per minute). The left ventricle is a thick-walled sphere holding stroke volume ÷ 0.6; force balance gives (outer ÷ inner radius)² = 1 + pressure ÷ muscle stress. A muscle stress of 19.3 kPa makes a normal 100 mmHg ventricle's wall 0.30 × its radius, close to a human's.

### Energy

Seymour's (2009) two rules: blood flow is proportional to metabolic rate, and heart work is flow × pressure. At 100 mmHg the heart takes 10% of the budget. Everything else in the body stays at 90%, and the heart's cost scales with pressure. The share doesn't depend on metabolic rate, because flow scales with it and cancels. Heart size does depend on metabolic rate.

### Siphon

The veins can pull down to −(their suction limit), and never past −713 mmHg (blood at 37 °C boils at 47 mmHg absolute). Whatever suction they hold comes off what the heart has to supply.

### Neck pumps

Each pump lifts only the head's share of the flow (default 5%) from itself to the next pump. The main heart only has to reach the first pump.

### Air sacs

Neck mass comes from a tapered neck at tissue density minus the air. Torque is taken about the neck base. Air-sac pressure comes straight off the lift, which is the most generous reading possible.

### Cartilage

Taylor (2014): extension per joint ≈ cartilage thickness ÷ height of the joint surfaces above the centre of rotation. Measured values are used for Diplodocus (1.86° per joint per 1%) and Apatosaurus (1.18°); the rest assume 1.5°.

### Brain, live

The heart's pressure chases the pressure the current posture calls for, with a first-order lag τ (the reflex). Brain pressure = heart pressure − the column. A rete, when on, smooths the brain's pressure with a 1.5 s lag.

## How it compares with the papers

| Check | Paper | Model |
|---|---|---|
| mmHg per metre of blood | 78 (Seymour 2009) | 78.0 |
| Giraffatitan head above heart, mount pose | ≈9 m (Seymour 2009) | 8.9 m |
| Pressure at the heart for a 9 m column | 750 mmHg (Seymour 2009) | 752 |
| Giraffe pressure at the heart | 193–214 mmHg measured (Brøndum et al. 2009; Goetz et al. 1960) | 218 |
| Heart's share at giraffe pressure | ≈18% (Seymour 2009) | 18% |
| Total energy, circulation's share at 750 mmHg | 175%, 49% (Seymour 2009) | 165%, 45% |
| Ventricle at 750 vs. 100 mmHg | wall 5× thicker, 15× heavier (Seymour & Lillywhite 2000) | 5× thicker, 12× heavier |
| Siphon ceiling at giraffe pressure | ≈12 m (Hughes et al. 2016) | 11.9 m |
| Diplodocus, 10% cartilage | 18.6° per joint (Taylor 2014) | 18.6° |
| Drinking giraffe, pressure near the head | >300 mmHg (Aalkjær et al. 2025) | 311 |

The energy row doesn't match exactly. Seymour's 175% and 49% look like the new heart cost added on top of the original 100% (90 + 10 + 75), where the model replaces the old 10% (90 + 75). I couldn't confirm that from his text. Either way the answer is about half. `node tests/model.test.js` runs every row of this table.

## What it leaves out

- Mean pressures only. There is no pulse, so systolic peaks run higher than anything shown.
- All flow resistance is lumped into the 50 mmHg the head needs.
- The reflex is a perfect lag toward the right answer. Real reflexes overshoot and have limits.
- The rete is a pure delay. It can smooth a spike, but it can't remove a column that stays.
- Head tissue at negative pressure under the siphon is shaded but not penalized. Seymour & Lillywhite (2000) argue that is the fatal problem.
- Neck pumps are ideal. Nothing in a living vertebrate does this.
- Body dimensions are approximate, and sauropod mass estimates vary by a factor of two.

Settings not on the diagram (body's minimum pressure, wall and muscle stress, share of blood to the head, faint and burst thresholds, blood density) sit in the `FRESH` object at the top of `js/app.js`.

## Sources

- Aalkjær C, Damkjær M, Baandrup UT, et al. (2025) Hemodynamics and drinking in the giraffe. *Acta Physiologica* 241: e70046. doi:10.1111/apha.70046
- Badeer HS, Hicks JW (1996) Circulation to the head of *Barosaurus* revisited: theoretical considerations. *Comp Biochem Physiol A* 114: 197–203. doi:10.1016/0300-9629(95)02136-1
- Bakker RT (1978) Dinosaur feeding behaviour and the origin of flowering plants. *Nature* 274: 661–663. doi:10.1038/274661a0
- Brøndum E, Hasenkam JM, Secher NH, et al. (2009) Jugular venous pooling during lowering of the head affects blood pressure of the anesthetized giraffe. *Am J Physiol Regul Integr Comp Physiol* 297: R1058–R1065. doi:10.1152/ajpregu.90804.2008
- Choy DSJ, Altman P (1992) The cardiovascular system of *Barosaurus*: an educated guess. *Lancet* 340: 534–536. doi:10.1016/0140-6736(92)91722-K
- Christian A (2010) Some sauropods raised their necks—evidence for high browsing in *Euhelopus zdanskyi*. *Biol Lett* 6: 823–825. doi:10.1098/rsbl.2010.0359
- Goetz RH, Warren JV, Gauer OH, et al. (1960) Circulation of the giraffe. *Circ Res* 8: 1049–1058. doi:10.1161/01.RES.8.5.1049
- Hargens AR, Millard RW, Pettersson K, Johansen K (1987) Gravitational haemodynamics and oedema prevention in the giraffe. *Nature* 329: 59–60. doi:10.1038/329059a0
- Hicks JW, Badeer HS (1992) Gravity and the circulation: "open" vs. "closed" systems. *Am J Physiol* 262: R725–R732. doi:10.1152/ajpregu.1992.262.5.R725
- Hughes S, Barry J, Russell J, Bell R, Gurung S (2016) Neck length and mean arterial pressure in the sauropod dinosaurs. *J Exp Biol* 219: 1154–1161. doi:10.1242/jeb.137448
- Millard RW, Lillywhite HB, Hargens AR (1992) Cardiovascular system design and *Barosaurus*. *Lancet* 340: 914. doi:10.1016/0140-6736(92)93326-I
- Mitchell G, Bobbitt JP, Devries S (2008) Cerebral perfusion pressure in giraffe: modelling the effects of head-raising and -lowering. *J Theor Biol* 252: 98–108. doi:10.1016/j.jtbi.2008.01.017
- Mitchell G, Skinner JD (2009) An allometric analysis of the giraffe cardiovascular system. *Comp Biochem Physiol A* 154: 523–529. doi:10.1016/j.cbpa.2009.08.013
- Riede T, Goller F (2010) Peripheral mechanisms for vocal production in birds. *Brain Lang* 115: 69–80. doi:10.1016/j.bandl.2009.11.003
- Seymour RS (2009) Raising the sauropod neck: it costs more to get less. *Biol Lett* 5: 317–319. doi:10.1098/rsbl.2009.0096
- Seymour RS, Hargens AR, Pedley TJ (1993) The heart works against gravity. *Am J Physiol* 265: R715–R720. doi:10.1152/ajpregu.1993.265.4.R715
- Seymour RS, Lillywhite HB (2000) Hearts, neck posture and metabolic intensity of sauropod dinosaurs. *Proc R Soc B* 267: 1883–1887. doi:10.1098/rspb.2000.1225
- Smerup M, Damkjær M, Brøndum E, et al. (2016) The thick left ventricular wall of the giraffe heart normalises wall tension, but limits stroke volume and cardiac output. *J Exp Biol* 219: 457–463. doi:10.1242/jeb.132753
- Stevens KA, Parrish JM (1999) Neck posture and feeding habits of two Jurassic sauropod dinosaurs. *Science* 284: 798–800. doi:10.1126/science.284.5415.798
- Taylor MP (2009) A re-evaluation of *Brachiosaurus altithorax* Riggs 1903 and its generic separation from *Giraffatitan brancai* (Janensch 1914). *J Vertebr Paleontol* 29: 787–806. doi:10.1671/039.029.0309
- Taylor MP (2014) Quantifying the effect of intervertebral cartilage on neutral posture in the necks of sauropod dinosaurs. *PeerJ* 2: e712. doi:10.7717/peerj.712
- Taylor MP, Wedel MJ, Naish D (2009) Head and neck posture in sauropod dinosaurs inferred from extant animals. *Acta Palaeontol Pol* 54: 213–220. doi:10.4202/app.2009.0007
- Wedel MJ (2003) Vertebral pneumaticity, air sacs, and the physiology of sauropod dinosaurs. *Paleobiology* 29: 243–255. doi:10.1666/0094-8373(2003)029<0243:VPASAT>2.0.CO;2
- White CR, Blackburn TM, Seymour RS (2009) Phylogenetically informed analysis of the allometry of mammalian basal metabolic rate supports neither geometric nor quarter-power scaling. *Evolution* 63: 2658–2667. doi:10.1111/j.1558-5646.2009.00747.x
