# Makovicky et al. 2026, "Argentine fossil rewrites evolutionary history of a baffling dinosaur clade"

Makovicky, Mitchell, Meso, Gianechini, Cerda & Apesteguía. *Nature*, doi 10.1038/s41586-026-10194-3. Received 24 Jan 2025, accepted 26 Jan 2026. The rendered PDF says published online 25 Feb 2026; the text layer still says "xx xx xxxx."

File: `papers/2026_Makovickyetal.pdf`, 21 pages. Main text pp. 1-5, Methods pp. 6-7, Extended Data Figs 1-10 on pp. 8-17, Reporting Summary pp. 18-21. The Supplementary Information and the Figshare data (doi 10.6084/m9.figshare.30569894) aren't in the folder.

Read in full. All figures viewed; Fig 2 at 200 dpi.

## Claim

Abstract, three moves:
- "Here we describe a skeleton of the alvarezsauroid Alnashetri cerropoliciensis7 representing to our knowledge the most complete and smallest South American taxon to date."
- "Phylogenetic analysis recovers Alnashetri among basal non-alvarezsaurids, rendering South American taxa polyphyletic." And "our biogeographical analyses infer a Pangaean ancestral distribution for Alvarezsauroidea, with vicariance dominating the early history of the clade."
- "we find no support for evolutionary miniaturization but, rather, find support for repeated evolution within a narrow body size range."

## The specimen

- MPCA Pv 377, Candeleros Formation, Cerro Policía, La Buitrera, Río Negro. Collected 2014.
- "missing only the skull roof, postdentary bones, right manus, lower right leg and much of the tail."
- Referred on femoral trochanters, paired grooves on the distal tibia, and metatarsal and digit III proportions (ED Fig 2). A second specimen, MPCA Pv 477, is used for histology and ED Fig 2.
- Teeth: four small unserrated premaxillary teeth. "There are 25–26 tooth positions in the maxillae and 21 in the left dentary." In sockets, "not diminutive like those of Shuvuuia and Jaculinykus13."
- Sternum unfused, unkeeled, trapezoidal. No uncinate processes. No furcula.
- "The forelimb is 61% the length of the whole hindlimb," vs parvicursorines, where it is "less than half the length of the femur alone."
- Olecranon "relatively short, in contrast to the hypertrophied one of alvarezsaurids."
- Manus tridactyl, metacarpals II-III subequal. Alvarezsaurid features on digit I: grooved I-1, enclosed foramen on the I-2 claw groove, ridge-like flexor process "as also observed in Alvarezsaurus."
- Hindlimb: full trochanteric crest like *Mononykus*, but not arctometatarsal and long digit IV phalanges.
- Mass "under 1 kg (ref. 3)." Fig 2 caption: *Alnashetri* 0.7 kg, *Shuvuuia* 3.1 kg.
- Histology (Fig 3, ED Fig 10): "neither is fully grown," Pv 377 a subadult "based on the number and spacing of growth lines." "possible medullary bone indicative of sexually maturity."

## Tree

- TWiG matrix via Gianechini et al. 2018. 12 characters added (904-916), 23 inactivated as duplicates, char 763 split into three. 148 additive.
- TNT, EW and IW. "we used K = 15 for all IW analyses." K = 16 "almost identical."
- 100,000 MPTs. Strict consensus "very low" resolution. iterPCR finds wildcards. Fig 2a is a reduced consensus with wildcard ranges as colored polygons: *Calamosaurus*, *Albertonykus*, *Kol*.
- Support: symmetric resampling (P = 25%) above nodes, Bremer below. 10,000 replicates.
- Result: *Aorun* first, then Morrison taxon, then *Alnashetri*, then *Bannykus* + *Xiyunykus*, then Alvarezsauridae. *Alnashetri* "patristically removed from other South American species."
- Two Laurasian taxa recognized: the Morrison Formation cervicals YPM 1996 and 1997 (ED Fig 5; Makovicky 1997) and *Calamosaurus foxi* NHM UK R901, Isle of Wight (ED Fig 6). Shared with alvarezsaurids: "ball-and-socket intervertebral joints between cervical centra and a ventral depression between the parapophyses that continues caudally as a sulcus flanked by raised ridges."

ED Fig 7a (EW, 3752 steps) is worth looking at for what the main text doesn't say:
- *Haplocheirus* sits outside Alvarezsauroidea, between Ornithomimosauria and the node with Therizinosauroidea.
- *Tugulusaurus* sits near *Zuolong*, outside Tyrannosauroidea.
- Neither name appears in the main text or Methods. [Choiniere 2010](choiniere-2010.md) made *Haplocheirus* the basal alvarezsauroid. [Xu 2018](xu-2018.md) "places Haplocheirus firmly within Alvarezsauria." [Qin 2021](qin-2021.md) counts both as alvarezsauroids in its body-mass analysis.
- *Shishugounykus* and *Qiupanykus* aren't in the tree at all. The Reporting Summary: "A few very poorly preserved and incomplete species were omitted from the phylogenetic analysis."

## Time-scaling

- 100,000 MPTs filtered to 4,120 topologies. cal3, 100 calibrations each: 41,200 trees.
- Rates: "speciation rates were normally distributed around 0.5, extinction rates were uniformly distributed as 80–99% of speciation rates, and preservation rates were normally distributed around 0.25."
- One tree for Fig 2b: sorted by GER* descending, then MIG ascending, "in Microsoft Excel."

## Biogeography

- RASP 4.2, S-DIVA and S-DEC across all 41,200 trees. Up to four continents per ancestral range.
- ED Fig 8b: "we disallowed South America to group with Laurasian continents as possible ancestral areas after the Early Cretaceous (Aptian, approximately 130 million years ago)." "This constraint has the effect of forcing dispersal."
- BioGeoBEARS on the ten best-GER* trees, stratified into 23 time slices: "d = 1" with a land connection, "d = 0.0001" across sea. AICc weights in Supplementary Table 1, which isn't in the folder.
- ED Fig 8d header: "global optim, 4 areas max. d=0.0098; e=0; j=0; LnL= 20.89." So DEC with no founder events in that run.
- Fig 2b root and early nodes: "Pan." Then "A,E,S" down the stem.
- The text: "among the first to reconstruct alvarezsauroids as having a widespread ancestral range covering multiple continents before the Late Cretaceous." "The disjunct Late Cretaceous distribution ... results from a combination of vicariance and likely regional extirpation in addition to dispersal, presumably coupled with biases in preservation and collection efforts."
- Parallel: dryolestoid mammals, "two Cretaceous South American lineages, each with a long ghost lineage."

## Body size

- "Alnashetri evolved small body size independently3 from parvicursorines2,25."
- Forelimb "only incipiently modified," so "miniaturization in alvarezsauroids did not necessarily co-evolve with either negative forelimb allometry or fossorial specialization."
- Teeth "not reduced to the degree that is seen in Shuvuuia."
- Four models: BM, OU, Lambda, White Noise, on each of 41,200 trees, AICc weights.
- "in contrast to previous studies2,25, our analyses ... recovered no support for a clade-wide trend of body mass evolution (Extended Data Fig. 9a) and, instead, overwhelmingly favour models in which species traits evolve independently with low phylogenetic inertia, but within a constrained range at the lower end of theropod mass distribution that interestingly overlaps with the body mass range of extant mammalian myrmecophages37."
- ED Fig 9a by eye: white noise rises from about 0 to about 0.8 of the weight across the sorted trees. Lambda takes most of the rest. BM appears only at the low end. OU is a sliver at the far left. The x-axis runs to about 40,000; the caption says 41,200.
- ED Fig 9b by eye: *Aorun* at log10 mass about 0.1, roughly 1.3 kg. The Morrison taxon, *Calamosaurus*, *Bannykus* near 1.5 (about 30 kg). *Alnashetri* about -0.15. *Parvicursor* about -0.85.

## Things to check

- Ref 2 is cited as "Curr. Biol. 31, 3687–3693 (2020)." Qin et al. is 2021 (published 6 July 2021).
- *Aorun* is the root taxon and sits small. [Qin 2021](qin-2021.md) calls the *Aorun* holotype "likely a hatchling" and says such taxa "should either be removed ... or their adult body masses could be estimated." I don't see which choice this paper made. The supplement may say.
- "two other early-diverging alvarezsauroid taxa." Fig 2a labels the Morrison taxon but shows *Calamosaurus* as a polygon.
