# Pennaraptora

A lecture deck on troodontids, dromaeosaurids, oviraptorosaurs and early birds, built to show one skill: pulling several lines of evidence together on one question, and seeing where each line is strong, where it is thin, and how the lines interact. Each line slide puts one paper's claim (a lens cut from the printed page), that paper's own figure, and plain facts about how much material and what was assumed. Sections end on a matrix. Plan: `plan.md`. Paper notes: `notes/` (index `notes/readme.md`). PDFs: `papers/` (gitignored).

Engine copied from `../alvarez` (deck.js, parts/util, intro, walk). New part: `js/parts/facts.js` (fact chips).

## Order

Part 1: the groups; phylogeny (three trees, support, egg characters); behavior (sleep, bonebed, pack hunting, display, troodontid diet); reproduction (adult on eggs, pores, color, clutch size, incubation time, embryos, hatching order, partial burial, matrix). **Break.** Part 2: feathers; flight (membrane wings, ground flapping, thresholds, feather counts, arm length, how many origins, equal tree length, wing bones, matrix); brains and the origin of birds (volume, shape, shrinking, rates); closing matrix; blank matrix for the students' report. Level 2 adds friends, shared matrices, eggs inside, five stages, shoulder girdle, wulst, ancestral size.

## Rebuilding

```
python3 tools/lines.py        # tools/quotes.py -> js/lines.js
python3 tools/crop_figs.py    # figures and lens pages -> img/, js/dims.js
JSDOM=/path/to/jsdom node tests/deck.smoke.js
```
`tools/find.py KEY 'regex'` searches a paper's text; `tools/figboxes.py key:page` prints image boxes for crops.

## Still to do

- Bi et al. 2021 is a review manuscript; its lenses come from that copy. Swap in the published PDF if you get it.
- Not yet checked on a projector; one screenshot pass done and fixed. `img/` is ~49 MB, mostly lens page images; lower `PAGE_DPI` if size matters.
- No homepage card added.

## Said aloud, not on the slides

Slide ids are in brackets. The judgments ("thin," "one specimen") belong here, not on the slides.

**Phylogeny**
- [trees] All three trees come from the same matrix family (TWiG), growing over time. One new specimen moved *Archaeopteryx*: adding *Xiaotingia* "shifts Archaeopteryx to the Deinonychosauria." Brusatte 2014 moved it back, as "basal-most avialan."
- [support] Pei 2020: "Bremer supports are typically between 1 and 2 for most paravian nodes." Hartman 2019 quotes Turner et al. 2012 needing only one step to put troodontids in Avialae while calling Deinonychosauria "well supported."
- [reuse] Hartman: "repeated phylogenetic results may result in a false impression of confidence." Three trees from the same scorings are not three tests.
- [eggtree] The egg tree is a different kind of data, which is its value. It is also 12 characters on 7 taxa, and adult contact is coded "absent" for *Maiasaura* and titanosaurs by assumption. Consistency index 1.0 on 12 characters isn't the same as on 853.

**Behavior**
- [sleep] Gao 2012: "three specimens representing two troodontid species in nearly identical positions suggests that the position of these animals is not random." The burial (volcanic, perhaps a lahar) is what makes sleep the reading. Gao: "Even a low energy lahar is likely to move a small animal out of a perimortem position," so they offer "sheltering within a burrow" as an alternative.
- [herd] Funston is careful: lekking is "consistent with, but not indicative of." The adults-only age structure rests on size and fusion, with no histology. "the specific behaviour that the Avimimus death assemblage represents cannot be assessed."
- [pack] Logic of the test: pack-hunting mammals' young eat what the adults eat; asocial reptiles' young eat smaller prey. Crocodiles are the control and shift with size "like their modern counterparts." Ten teeth per bin used up 28-29% of the identified material, so more samples aren't coming soon. My copy is an uncorrected proof: the abstract and results give different means for medium crocodile teeth.
- [display] The tail-fan argument rests on muscle models plus fans known in two early taxa (*Caudipteryx*, *Similicaudipteryx*). Persons: tails "may prove to be sexually dimorphic," untestable for now. Clark's sex call for *Plumadraco* is analogy to living birds; the specimen has no sex indicator of its own.
- [diet] Fan's own words on gut contents and pellets: "a single data point," "the troodontid origin of these suspected gastric pellets cannot be confirmed." Each line in Fig 7 has a different sample size; the isotope line is N = 5.

**Reproduction**
- [brood] Bi 2021 is the first adult on a clutch with embryos inside. Embryos are late-stage, so "the adult clearly had tended the nest for an extended period and did not perish in the act of egg laying." No medullary bone, which "raises the possibility that the attending individual may have been male."
- [laying] Jin 2020's female with eggs inside also lacks medullary bone: "caution is required in using 'medullary bone' or its absence as a gender indicator." That weakens Bi's hint that the brooder was male.
- [pores] For oviraptorosaurs the phylogenetic method gives 0.513 / 0.487: a coin toss. The non-phylogenetic method calls them open. Ask the class which they trust and why.
- [color] Measured color is olive-green. "Blue-green" comes after a "taphonomic correction" for pigment loss. Three eggshells, one sediment control.
- [clutch] The giant-clutch result rests on three *Macroelongatoolithus* clutches, and body masses come from a regression of clutch volume on living birds and crocodiles. Tanaka's own caveat: in giants brooding "may have been less effective ... because there may have been less contact with the eggs."
- [incub] One tooth, 31 lines counted, 8 added for the missing tip. The 47% conversion is crocodile timing. Robustness: with 0 or 16 added lines it's 60 or 90 days, still between the models. An in-between period could also come from warm burial without brooding; the paper doesn't test that.
- [embryo] MOR 246 was first published as *Orodromeus*. The fix: identify eggs "strictly on well-preserved, in-situ embryonic material and not associated skeletons." Same story as *Oviraptor*, "egg thief," whose eggs were once given to *Protoceratops*.
- [hatch] Same observation (embryos at different stages), opposite mechanism. Bi: upper eggs nearer the adult got more heat. Yang: no contact incubation, so the gap comes from laying in rings. Yang's exclusion cites their own companion paper (Yang et al. 2019, "Reconstruction of oviraptorid clutches illuminates their unique nesting ..."), not in the folder. Both name the same alternative: some embryos died earlier.
- [burial] Hogan's Egyptian plover sits on partly buried eggs at night and buries and wets them by day. The "indirect contact incubation" step has one lab experiment behind it (a heated surrogate over buried emu eggs).
- [repro-matrix] Columns with one entry versus three. "Eggs warmed" is where the lines collide; "Hatching" rests on one clutch of three eggs (Yang) and one of 24 (Bi).

**Feathers**
- [nofly] Talori's lift is "~8% of the body weight" at 8 m/s. Flapping "not explicitly modelled"; turning, "as apparently occurs in modern ostriches," not tested. Dececchi sets wing muscle at 10% of body mass, "likely significant overestimations for non-paravians," so a failure there is a strong failure.
- [bigwings] Lü & Brusatte: the arm-ratio difference from *Tianyuraptor* "is within the range of intraspecific variation" in *Microraptor* and *Archaeopteryx*. Three readings of the wings: flight (rejected), retention from flying ancestors (favored), display.
- [asym] Xu 2017's asymmetry is one tail feather; arm feather symmetry "cannot be determined." "Ancestral to Paraves" rests on that feather plus parsimony. Kiat & O'Connor's point: primary count changes slowly after flight is lost, asymmetry fast, so count "reflect[s] the ancestral condition" and asymmetry "current locomotor function."

**Flight**
- [membrane] Dececchi 2020 did not see the striations reported for *Yi*, saw feather filaments across the patches instead. The wing model they favor on anatomy (maniraptoran) fails as a glider; the models that pass (bat, pterosaur) are the ones the specimen least supports. *Ambopteryx* (Wang 2019) is the second specimen; not in the folder yet.
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
- [shrink] Lee names his bias: "oversampling of characters on this lineage (by avian-centric researchers)." Brusatte dismissed high tyrannosaur rates for the same reason ("an overinflation of taxa and characters"). Ask why the same bias is dismissed in one group and accepted in the other.
- [rates] Brusatte: "A Mesozoic naturalist would make no immediate distinction between a Velociraptor-type animal and an Archaeopteryx-type animal." Few characters separate birds from their relatives, which "may also help explain why so many alternative phylogenetic analyses have difficulty in placing certain taxa."
- [mass] 10.9 to 2.4 kg depending only on which stem birds are sampled. The ancestral state is a product of the sample.

**Putting lines together**
- [matrix] Flight has four kinds of evidence; the physics models answer only one question. Brooding has the most lines but most are one or a few specimens.
- [yours] Students fill this in for their own question.
