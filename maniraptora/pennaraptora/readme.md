# Pennaraptora

A lecture deck on troodontids, dromaeosaurids, oviraptorosaurs and early birds, built to show one skill: pulling several lines of evidence together on one question, and seeing where each line is strong, where it is thin, and how the lines interact. Each line slide puts one paper's claim (a lens cut from the printed page), that paper's own figure, and plain facts about how much material and what was assumed. Sections end on a matrix. Plan: `plan.md`. Paper notes: `notes/` (index `notes/readme.md`). PDFs: `papers/` (gitignored).

Engine copied from `../alvarez` (deck.js, parts/util, intro, walk). New parts: `js/parts/facts.js` (fact chips), `js/parts/pair.js` (a silhouette beside a fossil, one caption under both).

## Order

Part 1: subgroups (each fossil beside a silhouette); phylogeny (three trees, support, recoding, egg characters); behavior (sleep, bonebed, solitary hunters, trackways, trackmaker, pack hunting, display, troodontid diet); reproduction (adults on nests, adult on eggs, which parent, pores, color, clutch size, incubation time, egg temperature, embryos, hatching order, partial burial, matrix). **Break.** Part 2: feathers (feather stages through leg feathers); flight (membrane wings, ground flapping, thresholds, feather counts, arm length, how many origins, equal tree length, wing bones, matrix); brains and the origin of birds (volume, shape, shrinking, rates, limb rates, oversampled characters); synthesis matrix; blank matrix for the students' report. Level 2 adds friends, shared matrices, eggs inside, five stages, shoulder girdle, wulst, ancestral size.

## Rebuilding

```
python3 tools/lines.py        # tools/quotes.py -> js/lines.js
python3 tools/crop_figs.py    # figures and lens pages -> img/, js/dims.js
python3 tools/silhouettes.py  # PhyloPic silhouettes -> img/sil-*.svg, js/dims.js
JSDOM=/path/to/jsdom node tests/deck.smoke.js
```
`tools/find.py KEY 'regex'` searches a paper's text; `tools/figboxes.py key:page` prints image boxes for crops.

Pictures: life restorations come before or beside the fossil, never after. Silhouettes are from PhyloPic, credited in the caption; where PhyloPic has no silhouette of the fossil's species, a close relative stands in and the caption says so (*Sinovenator* for *Mei long*, *Tianyuraptor* for *Zhenyuanlong*, *Citipati* for the Bi et al. oviraptorid). Measurements on slides need a job (a comparison or a scale); bones go by their names (tibiotarsus, not "shin").

## Still to do

- Bi et al. 2021 is a review manuscript; its lenses come from that copy. Swap in the published PDF if you get it.
- Not yet checked on a projector; two screenshot passes done and fixed. `img/` is ~39 MB, mostly lens page images; lower `PAGE_DPI` if size matters.

## Said aloud, not on the slides

Slide ids are in brackets. The judgments ("thin," "one specimen") belong here, not on the slides.

**Phylogeny**
- [trees] All three trees come from the same matrix family (TWiG), growing over time. One new specimen moved *Archaeopteryx*: adding *Xiaotingia* "shifts Archaeopteryx to the Deinonychosauria." Brusatte 2014 moved it back, as "basal-most avialan."
- [support] Pei 2020: "Bremer supports are typically between 1 and 2 for most paravian nodes." Hartman 2019 quotes Turner et al. 2012 needing only one step to put troodontids in Avialae while calling Deinonychosauria "well supported."
- [reuse] Hartman: "repeated phylogenetic results may result in a false impression of confidence." Three trees from the same scorings are not three tests.
- [recode] Agnolín et al. rescored one group (unenlagiids) in the same TWiG matrix and the base of Pennaraptora fell into a polytomy. That is Hartman's "1-2 steps" seen as a result. Then they set the tree aside and argue their preferred tree from selected characters, not an analysis. They are the group that named most unenlagiids, so where unenlagiids go matters to them.
- [eggtree] The egg tree is a different kind of data, which is its value. It is also 12 characters on 7 taxa, and adult contact is coded "absent" for *Maiasaura* and titanosaurs by assumption. Consistency index 1.0 on 12 characters isn't the same as on 853.

**Behavior**
- [sleep] Gao 2012: "three specimens representing two troodontid species in nearly identical positions suggests that the position of these animals is not random." The burial (volcanic, perhaps a lahar) is what makes sleep the reading. Gao: "Even a low energy lahar is likely to move a small animal out of a perimortem position," so they offer "sheltering within a burrow" as an alternative.
- [herd] Funston is careful: lekking is "consistent with, but not indicative of." The adults-only age structure rests on size and fusion, with no histology. "the specific behaviour that the Avimimus death assemblage represents cannot be assessed."
- [solitary] Roach & Brinkman set the null: no living diapsid hunts in mammal-style packs, so the burden is on the pack. Their ora analogy makes predictions: mobs at kills, fighting, cannibalism, juveniles kept away. The next two slides test two of them. Frederickson's isotopes ask whether young ate different prey (the reptile pattern); Li's trackways ask whether parallel tracks are just animals following a shore. Their own hedge: "evolution often behaves in nonparsimonious ways." Weak spot: the "combat" claw in a tail comes from a scattered quarry where, by their own account, bones can't be assigned to individuals.
- [tracks] Tracks are the only line here that records live animals at the same moment. Li: "a scenario in which six similarly sized individuals independently generated parallel, regularly spaced, nonoverlapping trackways is highly unlikely." Their own alternative: a shoreline or channel lines animals up. One bedding surface; the maker is read from foot shape and size ("comparable to *Achillobator*"); no body fossil of the maker is known from those beds. Group travel is not pack hunting: "Whether this behavior was specifically hunting cannot be ascertained." Xing 2018 is a second site: four small trackways, but two cross, and the two-toed reading rests partly on a missing toe trace. Roach & Brinkman's alternative for Mount Tom (last build): animals walking a shoreline toward a carcass, with four trackways going the other way. Li's answer is the spacing: regular and closer than a stride, which a shoreline doesn't produce.
- [maker] Tracks don't come labeled. Xing 2024 calls *Fujianipus* a troodontid from one toe ratio, then sizes it with a troodontid leg ratio (197 cm hip, "likely an overestimation"); the dromaeosaurid ratio gives 156 cm. The obvious alternative maker, *Achillobator*, is excluded by assuming a foot nobody has found. Tsukiji's chip: the same trackway is a walk at 6.1 or 4.6 km/h depending on which clade you assume, and for other trackways the gait itself changes.
- [pack] Logic of the test: pack-hunting mammals' young eat what the adults eat; asocial reptiles' young eat smaller prey. Crocodiles are the control and shift with size "like their modern counterparts." Ten teeth per bin used up 28-29% of the identified material, so more samples aren't coming soon. My copy is an uncorrected proof: the abstract and results give different means for medium crocodile teeth. The last quote is about a different animal: the *Utahraptor* block with an adult, a juvenile and a baby. It argues against Komodo-style solitude, not for a mammal-style pack.
- [display] The tail-fan argument rests on muscle models plus fans known in two early taxa (*Caudipteryx*, *Similicaudipteryx*). Persons: tails "may prove to be sexually dimorphic," untestable for now. Clark's sex call for *Plumadraco* is analogy to living birds; the specimen has no sex indicator of its own.
- [display] Li 2012's "iridescent" is a classifier call: 82% accurate on living birds, 58-100% for the fossil samples, no hue because keratin is gone. The narrow tail fan weakens earlier lift models.
- [diet] Fan's own words on gut contents and pellets: "a single data point," "the troodontid origin of these suspected gastric pellets cannot be confirmed." Each box in Fig 7 rests on a different amount of material; the isotope box is N = 5 individuals (Cullen & Cousens 2024). The predation traits are the skeleton's; the plant evidence is mostly indirect.

**Reproduction**
- [nests] Clark: four oviraptorids on nests among 17 Djadokhta adults, 23.5%, against none in that posture otherwise; "Other oviraptorid skeletons from the structureless sandstones ... are not in this position." Not laying: no eggs in the pelvis, though the pelvis is incomplete. Their limit, which Bi's isotopes later addressed: sitting on a nest is not the same as heating it, "an untestable assumption." *Nemegtomaia* (Fanti 2012) adds a second lineage, but insects ate at the body before final burial and there are no embryos or complete eggs. The egg-thief story: Osborn named *Oviraptor* as a nest robber "although there was no evidence to indicate predation."
- [brood] Bi 2021 is the first adult on a clutch with embryos inside. Embryos are late-stage, so "the adult clearly had tended the nest for an extended period and did not perish in the act of egg laying." No medullary bone, which "raises the possibility that the attending individual may have been male."
- [parent] Same kind of plot, opposite reading. Varricchio: 433 living archosaurs, three dinosaur points, best fit paternal (corrected Akaike weight 0.698 after a 2009 erratum for base-10 logs). Plus no medullary bone in eight clutch-associated adults. Birchard: 1254 birds; ostrich recoded as biparental, megapodes dropped, average not maximum clutch; maternal and paternal lines then coincide, and the real split is precocial vs altricial. In the one order with all three care types, paternal clutches are the smallest. Ask: is the paternal line a care line or a ratite line? Then Jin 2020 (female with eggs inside, no medullary bone) removes the histology leg.
- [laying] Jin 2020's female with eggs inside also lacks medullary bone: "caution is required in using 'medullary bone' or its absence as a gender indicator." That weakens Bi's hint that the brooder was male.
- [pores] For oviraptorosaurs the phylogenetic method gives 0.513 / 0.487: a coin toss. The non-phylogenetic method calls them open. Ask the class which they trust and why.
- [color] Measured color is olive-green. "Blue-green" comes after a "taphonomic correction" for pigment loss. Three eggshells, one sediment control.
- [clutch] The giant-clutch result rests on three *Macroelongatoolithus* clutches, and body masses come from a regression of clutch volume on living birds and crocodiles. Tanaka's own caveat: in giants brooding "may have been less effective ... because there may have been less contact with the eggs."
- [incub] One tooth, 31 lines counted, 8 added for the missing tip. The 47% conversion is crocodile timing. Robustness: with 0 or 16 added lines it's 60 or 90 days, still between the models. An in-between period could also come from warm burial without brooding; the paper doesn't test that.
- [temps] Seven eggs, two clean fits. Four gave temperatures above 45 °C and were set aside as altered, though their microstructure looked fine; a third fits only if its water loss is cut by two thirds. Bi 2021 used the same method with Amiot as co-author, so the two temperature estimates are one line, not two. The model's incubation length (44-56 days) is shorter than the *Troodon* tooth count (74 days).
- [embryo] MOR 246 was first published as *Orodromeus*. The fix: identify eggs "strictly on well-preserved, in-situ embryonic material and not associated skeletons." Same story as *Oviraptor*, "egg thief," whose eggs were once given to *Protoceratops*.
- [hatch] Same observation (embryos at different stages), opposite mechanism. Bi: upper eggs nearer the adult got more heat. Yang: no contact incubation, so the gap comes from laying in rings. Yang's exclusion cites their own companion paper (Yang et al. 2019, "Reconstruction of oviraptorid clutches illuminates their unique nesting ..."), not in the folder. Both name the same alternative: some embryos died earlier.
- [burial] Hogan's Egyptian plover sits on partly buried eggs at night and buries and wets them by day. The "indirect contact incubation" step has one lab experiment behind it (a heated surrogate over buried emu eggs).
- [repro-matrix] "Adult on the eggs" now has several specimens across genera, but none of the older ones has embryos; Bi's is the one that ties sitting to developed eggs. Columns with one entry versus three. "Eggs warmed" is where the lines collide; "Hatching" rests on one clutch of three eggs (Yang) and one of 24 (Bi).

**Feathers**
- [fstages] The sequence (filaments, branched, vaned, asymmetric) is agreed; where it starts isn't. The two dates differ by tens of millions of years because the answer depends on whether pterosaur and ornithischian filaments are feathers, and the deciding animals have no skin preserved. *Psittacosaurus*: hundreds of specimens, one with filaments; absence is weak evidence.
- [nofly] Talori's lift is "~8% of the body weight" at 8 m/s. Flapping "not explicitly modelled"; turning, "as apparently occurs in modern ostriches," not tested. Dececchi sets wing muscle at 10% of body mass, "likely significant overestimations for non-paravians," so a failure there is a strong failure.
- [bigwings] Lü & Brusatte: the arm-ratio difference from *Tianyuraptor* "is within the range of intraspecific variation" in *Microraptor* and *Archaeopteryx*. Three readings of the wings: flight (rejected), retention from flying ancestors (favored), display.
- [asym] Xu 2017's asymmetry is one tail feather; arm feather symmetry "cannot be determined." "Ancestral to Paraves" rests on that feather plus parsimony. Kiat & O'Connor's point: primary count changes slowly after flight is lost, asymmetry fast, so count "reflect[s] the ancestral condition" and asymmetry "current locomotor function."

- [legfeathers] Foth's argument is from patchiness: long foot feathers appear three separate times on their tree, so they read them as not built for flight, and "display" as the leftover function. Two assumptions: their tree (troodontids next to birds) and that missing leg feathers are really missing. Only *Microraptor*'s look aerodynamic. This and Kiat & O'Connor both use feathers on trees, and reach different flight stories.

**Flight**
- [membrane] *Ambopteryx* (Wang et al. 2019, *Nature*) is shown as the press restoration only; the paper isn't in the folder. Dececchi 2020 did not see the striations reported for *Yi*, saw feather filaments across the patches instead. The wing model they favor on anatomy (maniraptoran) fails as a glider; the models that pass (bat, pterosaur) are the ones the specimen least supports. *Ambopteryx* (Wang 2019) is the second specimen; not in the folder yet.
- [wair] Thresholds are set generously, so "none ... before Paraves" is the robust part. The *Archaeopteryx* pectoral muscle estimate is "only 0.5% of its body mass," against the 10% assumed.
- [thresh] Results depend on body mass, wing area, lift coefficient (1.6) and muscle power. Some passes need anaerobic muscle: "low muscle endurance would necessitate short-ranged aerial behaviors."
- [feathcount] Kiat & O'Connor on Pei: their results "place this taxon [*Anchiornis*] on the cut off." Their own hedge: "we refrain from making conclusive statements regarding this controversy."
- [arms] Hartman: "unambiguously non-flying taxa at the base of all clades regardless of topology." Below a ratio of ~0.70, no useful thrust. Arm length is one number per specimen and can't see feathers.
- [shoulder] Wu 2024 is a review of drawings, no new analysis. "It is still unclear what is the functional difference between a fused and separate scapula-coracoid joint."
- [origins] Three papers, mostly the same fossils, three answers: ≥3 origins (Pei), one with many losses (Kiat & O'Connor), parallel experiments with bird flight late (Hartman). Each weighs a different trait.
- [tie] Pei's own tree gives one origin plus 6-11 losses the same length as ≥3 origins. Parsimony can't choose; the choice rests on whether gaining or losing flight is easier, which the data don't say.
- [arch] Voeten: "avian powered flight must have originated before the latest Jurassic." Not a modern stroke: no keel, no supracoracoideus pulley.
- [flight-matrix] *Archaeopteryx* is where every line has an entry and they agree. Anchiornithines are where two lines disagree, and Pei's numbers put them at the threshold.

**Brains and the origin of birds**
- [brainvol] "bird-like encephalization indices evolved multiple times." The "flight-ready" brain argument borrows from the skeleton: "almost certainly the case given its postcranial morphology." Balanoff: "Endocranial volumes alone, of course, do not tell the whole story."
- [brainshape] Torres: *Ichthyornis* "had an Archaeopteryx-like brain shape," so the last reshaping is at crown birds. Its endocast is crushed side to side.
- [wulst] Balanoff called it a possible wulst in 2013; Torres 2021 says it was "later shown to be a taphonomic artefact." Good case of one line being withdrawn.
- [shrink] Ancestral sizes from Lee: tetanuran ~163 kg, coelurosaur ~27 kg, maniraptoran ~10 kg, paravian ~3 kg, bird ~0.8 kg. Femur length is the only size measure, used only up to Avialae.
- [limbrates] Same transition, different data, opposite pattern from Brusatte: limb proportions slow down near Avialae. Brusatte counts discrete character changes anywhere in the skeleton; Wang & Zhou measure six bone lengths. A wing can lock its proportions while other parts change fast. Ask what "rate" means in each.
- [bias] Same worry, two uses. Lee names it for the bird stem and gives three reasons it is "at least partly real." Brusatte uses it to set aside fast tyrannosaur rates while keeping fast bird rates. Ask what evidence would let you treat the two cases differently.
- [rates] Brusatte: "A Mesozoic naturalist would make no immediate distinction between a Velociraptor-type animal and an Archaeopteryx-type animal." Few characters separate birds from their relatives, which "may also help explain why so many alternative phylogenetic analyses have difficulty in placing certain taxa."
- [mass] 10.9 to 2.4 kg depending only on which stem birds are sampled. The ancestral state is a product of the sample.

**Synthesis**
- [matrix] Flight has four kinds of evidence; the physics models and the tracks each answer only one question. Brooding has the most lines but most are one or a few specimens. Groups and diet rest on the fewest kinds, though tracks are a kind no other row has.
- [yours] Students fill this in for their own question.
