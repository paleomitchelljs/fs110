# Spinosaurs

A lecture deck on the same engine as `abelisaurs/`. Per-paper notes are in `notes/`, one file per paper, with facts, verbatim quotes, figures and the specimens each skeleton shows. PDFs are in `papers/` (gitignored). Crops in `img/` come from `tools/figs_table.py` through `tools/crop_figs.py`.

## Levels

Press **L** (or `#L1` `#L2` `#L3`). 43 / 58 / 61 slides, about 121 / 154 / 158 minutes before questions. The therizinosaur deck is 100 at its full level, so L3 is about 1.5 times that. L1 is about twice the therizinosaur L1; move slides to tier 2 in `js/content.js` to shorten it.

## How it is built

| Part | Slides |
|---|---|
| No card | Cover; Gates 2016 tree, zoomed by group going up the tree, with spinosaurids in order and again at the end |
| 1 Spinosaurids by branch | Sereno 2026 tree; Barker tree (L2); *Iberospinus* (L2); *Baryonyx*; stomach; Wessex pair (L2); *Suchomimus*; snout nerves (L2); jaws (L2); conger (L3); *Ichthyovenator* (L2); *Irritator*; pterosaur tooth; *Angaturama* and *Oxalaia* |
| 2 Lost fossils | Stromer 1915 plates; "*Spinosaurus* B"; Munich 1944; CMN 50791 under three names (L2); snout MSNM V4047; oxygen isotopes |
| 3 2014 neotype | site; neotype alone; Fig S3 by source; claims; Hartman (L2); one species; two forms (L2); sail shape; sail function; Henderson; calcium (L2); eyes |
| 4 2020 tail | tail; flume; tooth counts (L2); grizzly or crocodile; tail spines (L2); depth (L3); bone density; Sereno skeleton; two skeletons (L2); flesh model; center of mass; second femur; bone exchange (L2); skull shape (L3); what counts as aquatic; hand length method; hand length; salt glands (L2); *S. mirabilis*; inland; predatory modes |
| End | who said what, by year; wall of evidence |

Each kind of evidence appears once. Floating is only Henderson. Fig S3 is taken apart once.

## Check before class

- **Flume control.** "Control ... beats it on both" is read by eye from Ibrahim 2020 Fig 3 (thrust about 0.028 vs 0.025, efficiency about 0.195 vs 0.125). The text states only the efficiency comparison.
- **April 1944.** From Brusatte 2021. Hone & Holtz 2017 Fig 2 says 1945. Smith et al. 2006, the primary source, is not in the folder.
- **"Same ranking on their own numbers?"** My reading of Myhrvold 2024 Table 9 from flattened text; check PDF p57.
- ***Ichthyovenator*, Aptian, Allain 2012,** and ***Suchomimus*, Sereno 1998:** cited through other papers. Neither original is in the folder.
- **Salt glands.** Cau 2026 in hand has no figures, so the slide shows Arden's frontals, and the caption says they are other specimens.
- **Who said what.** The row each paper sits in is the deck's sorting, not the authors'.
- **Sail shape.** "With a notch" and "No notch" are my reading of Henderson Fig 2 and Sereno Fig 1A. The "M" for Ibrahim's outline is Hone & Holtz 2021's word. Neither Sereno paper names its shape, and the rear spines in Fig 1A are gray.
- **Stromer quote.** "Extremely improbable" is my translation of "äußerst unwahrscheinlich," and it's about a fat hump in a predator.
- **Hand length method, "100 runs."** Main text and Methods say 100. Methods also says "each of the 1,000 iterations," and Table 1 says "10,000 times."
- **Which model scores theropods.** The paper doesn't say outright. By eye the Fig 5A lines sit at about 0.64 and 0.18, which match the all-amniote cutoffs (0.66, 0.18), not the archosaur ones (0.23, 0.37). The supplement on Figshare may settle it, and it isn't in the folder.

## Said aloud, not on the slides

- Sereno calculated the 2014 center of mass: "made by PCS," in Myhrvold 2024. Sereno 2022 blames "front-loading" instead and doesn't mention the error.
- The 2014 author list has Ibrahim, Sereno, Myhrvold, Fabbri, Dal Sasso and Martill on one paper. By 2022 they are on opposite sides.
- Charig & Milner 1997: "no flipper-like modifications of the limbs." They read side-set nostrils as "disadvantageous" in water. Later authors read retracted nostrils the other way.
- Sereno argues against "aquatic," not "semiaquatic": "a semiaquatic bipedal ambush piscivore."
- Gordon: "Such predictions are nevertheless tentative." Press: "We confidently recovered highly aquatic habits."
- Gordon's 0.66 is a predicted probability, not a hand ratio. The slide says "probability cutoff" for that reason, and it's an easy thing for students to mix up.
- Gordon's two groups are "highly/fully aquatic" or not, so the model can't test wading. "our results were able to directly predict or reject highly/fully aquatic lifestyles but not transiently/moderately aquatic (i.e., semi-aquatic) habits."
- Archosaurs only: AUC 0.49, which is coin-flip territory, and 68% of aquatic archosaurs missed. Gordon calls this "overly cautious" and argues it makes a positive more believable. My arithmetic: accuracy 0.91 at those rates means about 6 of 46 are positives, so answering "no" every time scores about 88%.
- Gordon's Fig 1C includes flat claws, the trait Ibrahim 2014 used for webbing. Result: "no consistent osteological correlates for interdigital webbing."
- Gordon's fossil call is a t-test on 10,000 simulated probabilities. At that n, very small differences come out significant. My point, not theirs.
- Most theropods in Gordon's Fig 5A aren't predicted at all: white circles are "fixed based on morphological considerations or direct observation."
- ROC curves: "originally developed by the U.S. Army Signal Corps in World War II."
- *Irritator*'s name and the dealer story: Martill 1996, not in the folder, so secondhand.
- Stromer worked through the sail in 1915. Muscle: spines "dürften ... kaum" have anchored it. Fat hump: "äußerst unwahrscheinlich" in a predator. He settled on a tall narrow crest, and he still found it striking that the spines were "so schwer und massiv." He also guessed the sexes might differ, because only male *Chamaeleo montanus* have the crest.
- Arden 2019 on holotype and neotype spines: "ontogenetic change or sexual dimorphism," or "taxonomic significance." That last one would make the neotype a different species from the holotype.
- Heat. Hone & Holtz 2021: "Thermoregulation, however, cannot be ruled out," and "specific modelling... would be needed." Sails also show up outside the hot Cenomanian: *Ouranosaurus*, *Concavenator*, *Ichthyovenator*.
- *Ichthyovenator*'s spines look very different from *Spinosaurus*'s. Hone & Holtz 2021 read that as "at least one of these was not under strong selection based on their mechanical performance."
- The sail can't fold. Gimsa admits "sailfish can fully withdraw" their fins, and Sereno 2022 calls the sailfish fin "fully retractable." Hone & Holtz 2021: the sail "would offer enormous pressure drag," and the M shape adds "further drag with two tips."
- Sereno 2026: the *S. mirabilis* crest "adds to the evidence that visual display, rather than aquatic propulsion," was the main function. The same paper says "a trunk sail of unknown shape," so the *S. mirabilis* sail in its skeleton is borrowed.

## Figure credits

Published figures, cropped, each credited on the slide. Art: Davide Bonadonna (cover, in Brusatte 2021), John Sibbick (Charig & Milner 1997), Dani Navarro (Sereno 2026). Skeletals: Scott Hartman, Genya Masukawa, Tyler Keillor. Plates: Stromer 1915, 1934.

## Papers not obtained

Sereno et al. 1998, Dal Sasso et al. 2005, Smith et al. 2006, Russell 1996, Allain et al. 2012, Malafaia et al. 2020, Smyth et al. 2020, Stromer 1936. Figures still worth getting at high resolution: Fig S3, Cau 2026 Figs 1, 3, 4, Ibrahim 2020 Fig 3.

## People

- **Ernst Stromer, Richard Markgraf.** 1912 find, 1915, 1934, 1936.
- **Nizar Ibrahim.** Lead 2014, signs the 2014 reply, lead 2020 twice, on Smyth 2020 and Beevor 2021, last author on Fabbri 2022. University of Chicago in 2014, Detroit Mercy in 2020.
- **Paul Sereno.** *Suchomimus* 1998. Coauthor of Ibrahim 2014, same University of Chicago department as Ibrahim. Coauthor of the 2020 Kem Kem monograph. Lead 2022, co-lead 2024, lead 2026. Named in 2024 as the source of the center of mass error.
- **Nathan Myhrvold.** Coauthor 2014, 2022, lead 2024, coauthor 2026. Intellectual Ventures.
- **Matteo Fabbri.** Coauthor 2014, signs the reply, coauthor 2020, lead 2022, lead of the "Sinking a giant" reply.
- **Cristiano Dal Sasso, Simone Maganuco.** Lead the giant snout 2005. Coauthors 2014, 2020, 2022.
- **David Martill, Samir Zouhri.** Martill on *Irritator* 2002 and the pterosaur tooth 2004. Both on 2014, 2020, Beevor 2021. Zouhri also on Arden 2019.
- **Donald Henderson.** Size in 2007, flotation in 2018, coauthor 2022, 2024.
- **David Hone, Tom Holtz.** 2017, 2019, 2021. Hone on D'Amore 2024.
- **Serjoscha Evers.** 2015, *Irritator* 2020 and 2023.
- **Andrea Cau.** Blog comparison cited by Hartman, 2024 tree, Cau & Paterna 2025, salt glands 2026.
- **Scott Hartman, Mark Witton.** The 2014 blog objection and 2020 withdrawal.
- **Frank Fish.** Swimming mechanics, 2022, 2024. **George Lauder, Stephanie Pierce.** The 2020 flume.
- **Caleb Gordon, Bhart-Anjan Bhullar.** Gordon leads the 2025 hand-length paper. Bhullar is on Fabbri 2022 and senior on Gordon 2025.
- **Steve Brusatte.** Outside overview, 2021, names both camps.

The first thing to show here: Ibrahim 2014's author list has Ibrahim, Sereno, Myhrvold, Fabbri, Dal Sasso and Martill on one paper, and they are on opposite sides by 2022.

## Skeletal figures and their specimens

Whole animals, *S. aegyptiacus*:
- **Ibrahim 2014 Fig S3** (`img/ibrsm-figS3.jpg`): adult composite, quadruped. Caption: red neotype FSAC-KK 11888; orange Stromer's bones; yellow isolated Kem Kem bones; green surrogate bones from *Suchomimus*, *Baryonyx*, *Irritator* or *Ichthyovenator*; blue inferred. Red dot: center of mass.
- **Ibrahim 2014 Fig 2A:** same composite in swim pose, > 15 m. All known bones red, no source coding.
- **Hartman 2014** (`papers/hartman-proportions-correction.png`): Fig S3 twice, lower panel with neotype pelvis and hindlimb x1.27. Withdrawn by Hartman in 2020.
- **Ibrahim 2020 Fig 1g:** about 10.5 m by scale bar. Caption names FSAC-KK 11888 only. All white, no coding. New tail.
- **Fabbri 2022 Fig 1b:** same drawing as Ibrahim 2020 Fig 1g. Orange = what FSAC-KK 11888 preserves. The only neotype-only skeleton.
- **Sereno 2022 Fig 1A:** adult, < 14 m. Holotype BSPG 1912 VIII 19 red, neotype blue, referred yellow, unknown gray. Overlap priority neotype, holotype, referred. All upsized to MSNM V4047.
- **Sereno 2022 Fig 9:** Fig 1A vs Ibrahim 2020's drawing, aligned at the ilium.
- **Hone & Holtz 2021 Fig 1:** Masukawa's skeletal, modified, "scaled to the size of the neotype." No numbers or coding.
- **Brusatte 2021 Fig 2:** same drawing in the same two poses, without arrows.
- **Myhrvold 2024 Fig 3E:** precaudal column only, not attributed as a whole.

Whole animals, other taxa:
- **Sereno 2026 Fig 3A:** *S. mirabilis*, ~8 m, scaled to holotype MNBH JEN1. Blue from several individuals (IGU11, JEN2, JEN9, IGU32, IGU40). All gray is *S. aegyptiacus* from Sereno 2022.
- **Sereno 2022 Fig 1F:** *Suchomimus*. MNBH GAD500 red, GAD70 blue, other referred yellow.
- **Fabbri 2022 Fig 1b:** *Baryonyx* NHM R 9951 alone. *Suchomimus* G51, G70, G94 pooled.
- **Hone & Holtz 2017 Fig 1:** *Baryonyx*, Hartman's skeletal, no number, no coding.
- **Myhrvold 2024 Fig 3A:** *Suchomimus* MNBH GAD500 precaudal column.

Skulls:
- **Arden 2019 Fig 6A:** FSAC-KK-3210 frontoparietals + MSNM V4047 rostrum + holotype mandible + *Irritator* skull.
- **Sereno 2026 Figs 2A, 2C:** *S. mirabilis*, *S. aegyptiacus*. Blue preserved, gray from *Irritator*.
- **Sales & Schultz 2017 Figs 4, 11:** named specimens aligned. Fig 11 shows real bone in black silhouettes.
- **Hone & Holtz 2021 Figs 5, 6; D'Amore Fig 5:** drawn skulls, no specimens named.

Inherit someone else's composite:
- **Henderson 2018 Figs 1E, 2, 5A:** mesh from Ibrahim 2014 Fig S3.
- **Gimsa 2016 Fig 1:** outline from Ibrahim 2014 "and averaged from images in the internet."
- **Hone & Holtz 2021 Fig 8:** outline from Ibrahim 2020. **Arden 2019 Fig 6B:** silhouette, source unnamed. **Amiot 2010 Fig 2:** after Bogdanov's art.

Real bones: Hone & Holtz 2017 Fig 2 (holotype); Ibrahim 2020 Figs 1b, 2; Sales & Schultz Fig 2 (*Irritator*).

No skeletal figure: Buffetaut 2004, Beevor 2021, Cooper 2026, Cau 2026 (skull roof only), Pittet 2026 (snout CT), Gordon 2025 (silhouettes as symbols, limbs of other animals; the measured flipper in Fig 1D names no specimen).

## Conflicts between papers

- **Center of mass.** Mid trunk (Ibrahim 2014, 2020), near hips (Henderson 2018 from the same proportions), over the feet (Sereno 2022). Myhrvold 2024: the 2014 figure was a sign error on air volume. Sereno 2022 blamed front-loading. Ibrahim 2020 still reports its own, per Sereno 2022, from a separate model.
- **Eyes.** Arden 2019: "placed the eyes atop the skull." Hone & Holtz 2021: "the eyes are not dorsally positioned." Sereno 2022: "alleged."
- **Dorsal stiffness.** Sereno 2022: "immobilized by interlocking articulations (hyposphene-hypantrum)." Hone & Holtz 2021: "not overly restricted with for example hyposphene-hypantra articulations."
- **Short hindlimb.** Anti-wading in Beevor 2021. Compatible with wading in Sereno 2026 and Hone & Holtz 2021.
- **Inland fossils.** Sereno 2022: "ranged far inland." Sereno 2026: *S. aegyptiacus* found "only in coastal deposits," and MNBH IGU11 moved to *S. mirabilis*.
- **"Aquatic."** Fabbri 2022 counts wading as an aquatic lifestyle. Sereno 2022 objects.
- **Bone density.** Fabbri 2022: ballast for submerged foraging. Sereno 2022 and Myhrvold 2024: weight support or body size.
- **Is the neotype one animal, or *Spinosaurus* at all?** Ibrahim 2020 histology: one individual. Arden 2019, Hartman 2020, Evers 2015: doubts.
- **Hand length.** Gordon 2025: Sereno 2022's forelimb reconstruction comes out highly aquatic, Fabbri 2022's doesn't, and the hindlimb model doesn't either. The paper says "tentative." The press release says "confidently." The input is about the least known part of the animal.
- ***Suchomimus*.** Fabbri 2022: not a subaqueous forager. Gordon 2025: forelimb highly aquatic. Myhrvold 2024 doubts Fabbri's *Suchomimus* sections are *Suchomimus*.
- **Webbing.** Ibrahim 2014 infers it from flat claws. Gordon 2025: "no unambiguous osteological correlates of interdigital webbing."
- **Length.** Over 15 m (Ibrahim 2014), 15 or 16 m (Brusatte 2021), under 14 m (Sereno 2022).
- **Sail size.** Henderson 2018, from Ibrahim's outline: 6.60 m2 in side view, 2.45 m2 of it bone, 335 kg. Sereno 2022: trunk sail 10.06 m2 on both sides, so about 5.03 a side, and 441 kg with the tail sail.
- **Sail shape.** Notched "M" (Ibrahim 2014, 2020, per Hone & Holtz 2021). "almost rectangular" (Gimsa 2016). No notch (Sereno 2022 Fig 1A).
- **Sail function.** Display (Ibrahim 2014, Arden 2019, Hone & Holtz 2021, Sereno 2022, 2026). Submerged use (Gimsa 2016).
- **Prey.** Hone & Holtz 2021 suggest hard prey. D'Amore 2024 (Hone coauthor): not durophagous.
- **Stromer on diet.** Sereno 2022: he stressed piscivory. Hone & Holtz 2017: he "did not speculate."
