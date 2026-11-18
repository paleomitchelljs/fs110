# Alvarezsaurs

A lecture deck on the same engine as `spinos/`. It walks through one paper, Makovicky et al. 2026, in the order the paper is written. The point is synthesis: each slide puts a line of the paper beside the earlier work it rests on, so students watch a new report get built out of old data.

Every walk slide has the same shape. The page sits on the left, with the lines highlighted on the printed page and blown up in a lens. The right side holds whatever those lines point at: a figure from this paper, another paper's own words, or a small model of the method. The words in a lens are cut out of the PDF a word at a time and set again at a readable size, so they can only be what the paper printed.

Per-paper notes are in `notes/`. PDFs are in `papers/` (gitignored).

## Levels

Press **L** (or `#L1` `#L2` `#L3`). 34 / 37 / 39 slides, about 103 / 113 / 119 minutes before questions. Level 2 adds the olecranon lever, the support model and up-and-down body size. Level 3 adds wildcards and time-scaling.

## How it is built

| Part | Slides |
|---|---|
| No card | Cover; the eight papers by year, which ones Makovicky cites |
| 1 Abstract and introduction | What they are; social insects (Longrich & Currie, Lü); miniaturization (Qin, with the ref-list entry); Qin Fig 3; dispersal (Xu 2011); the three claims |
| 2 The new skeleton | Specimen; teeth; forelimb; olecranon (L2); hand; "mosaic" in three papers; growth lines |
| 3 The tree | The tree; support (L2); wildcards (L3); *Haplocheirus*; two old Laurasian taxa; ghost lineages; time-scaling (L3) |
| 4 Where they lived | Origin in four papers; back-and-forth dispersal; land and sea; Pangaea |
| 5 Body size | Under 1 kg; size and diet; four models; Akaike weights; Qin's correction; the ancestor; up and down (L2) |
| End | Who said what: seven papers by four questions, in their own words |

## The models

None of them is the paper's analysis. Each shows what one number means.
- **Four models.** One fixed tree, a trait run four ways. BM wanders. Lambda pulls the internal branches toward a star as λ drops. OU pulls toward θ, with α as a half-life. White noise ignores the tree. "Again" redraws.
- **Akaike weights.** Drag an AICc score. weight ∝ e^(−Δ/2). The scores are made up.
- **Support.** Characters for and against a group, each dropped or doubled at the same chance, 10,000 times. Bremer is for minus against in this toy, where every character costs one step.
- **Ghost lineages.** First appearances read by eye from Makovicky Fig 2b. Node ages are the oldest descendant. MIG sums every branch. GER = 1 − (MIG − Gmin)/(Gmax − Gmin). This is GER, not GER*, which needs permutations.
- **Land and sea.** P(at least one dispersal) = 1 − e^(−d·m·T), with d = 0.0098 from ED Fig 8d, m = 1 or 0.0001, and T dragged.
- **Olecranon.** In-lever over out-lever, against the values printed in Longrich & Currie 2009 Fig 13.
- **Growth lines.** A generic von Bertalanffy curve, fitted to no animal.
- **Ancestor.** Brownian ML root (contrasts) on a toy tree. Polytomies wherever the papers disagree. Masses from Qin 2021 Table 1; *Alnashetri* 0.7 kg from Makovicky Fig 2; *Aorun*, the Morrison taxon and *Calamosaurus* read by eye from Makovicky ED Fig 9b. Ages from Makovicky Fig 2b, *Haplocheirus* from Choiniere 2010.

Numbers the models give, checked in `tests/data.test.js`:
- Ghost, Makovicky's placement: MIG 115 My, GER 0.77. *Alnashetri* beside the other South American taxa: MIG 82, GER 0.95. Dropping the Morrison taxon and *Calamosaurus* leaves MIG at 115 and drops GER to 0.69. Filling a gap with fossils doesn't shorten the ghost lineages, but it does improve the fit. That's the same move Choiniere makes for *Haplocheirus* ("0.41 to 0.48").
- Ancestor: Qin's taxa give about 16 kg (Qin's own answer is 23). Makovicky's give about 3 kg. Taking *Aorun* alone out of Makovicky's set gives about 23 kg. One small taxon on a short branch at the root moves the estimate about eightfold.
- Land and sea over 64 My: 0.47 across land, 6.3 × 10⁻⁵ across sea.

## Check before class

- **The ancestor slide is about our paper.** The toy says *Aorun* at about 1.3 kg does most of the work at the root. Qin 2021 calls the *Aorun* holotype "likely a hatchling" and says such taxa "should either be removed ... or their adult body masses could be estimated." I can't tell from the main text which Makovicky did; the supplement may say. Know the answer before a student asks.
- ***Haplocheirus* isn't in the main text.** ED Fig 7a puts it outside Alvarezsauroidea, between Ornithomimosauria and the node with Therizinosauroidea. *Tugulusaurus* sits near *Zuolong*. Choiniere 2010 isn't in the reference list.
- **Ref 2 year.** Makovicky cites Qin et al. as "Curr. Biol. 31, 3687–3693 (2020)." It's 2021.
- **Ref 27 year.** Printed as "(Wiley-Blackwell, 1991)." I think *Dinosaurs of the Isle of Wight* came out in 2001 from the Palaeontological Association, but that's from memory, not from anything in the folder.
- **"No support for a clade-wide trend."** None of the four models fitted is a trend model. The claim rests on OU (Qin's reading of miniaturization) losing to white noise and lambda.
- **ED Fig 9a x-axis** runs to about 40,000; the caption says 41,200.
- **Symmetric resampling P = 25%.** The model drops and doubles at 25% each. Check whether TNT's P splits between the two.
- **Mosaic card, Xu 2011.** Xu numbers the digits II–IV; Makovicky numbers the same digits I–III.
- **The 2009 abstract quote** ends "consistent with the hypothesis that the alvarezsaurs originated in South America." It's their reading of their own tree, not a separate analysis.

## Said aloud, not on the slides

- Qin's correction: "we arbitrarily chose the 'equal' method ... which indeed returns a preference for our data fitting an OU model." With "mbl," BM wins. "we can no longer robustly support selective pressure for smaller body sizes." Makovicky's 100 calibrations per topology are that test done on purpose.
- Xu 2018 named the alternative before it won: "spreading throughout Pangaea before the Aptian, with different species ending up on different continents as Pangaea broke apart."
- Xu 2018 again: "Our results illustrate the potential of increased taxon sampling to change biogeographic inferences."
- Choiniere 2010: the ornithomimosaur placement for alvarezsauroids was "one step longer than the optimal tree."
- Xu 2011's own caveat: "the Jurassic fossil record of alvarezsauroids is scant, and this group is currently unknown from the Lower Cretaceous."
- Longrich & Currie's five predictions for a myrmecophage: anterior diastema, reduced simple teeth, long narrow jaws, weak mandibles, reduced jaw joints. Makovicky speaks to the teeth: 21 dentary positions, in sockets, "not diminutive."
- Longrich & Currie: "Ants were a minor part of the ecosystem during the Cretaceous." Qin points to termites in mid-Cretaceous Burmese amber instead.
- Lü 2018 lists burial "by coincidence" as the first of its own three possibilities for the eggshell.
- Lee 2019: three alvarezsaurids in under 0.5 m² with oviraptorids.

## Papers worth getting

In rough order of what they'd add.
1. **Makovicky et al. 2026 Supplementary Information.** Supp. Table 1 (BioGeoBEARS AICc), the measurements, and what was done with *Aorun*'s mass.
2. **Meso et al. 2024**, *Cladistics* 41:135–155 (ref 3). Source of the "under 1 kg" mass, and its title says "miniaturisation from a much smaller common ancestor." Same first author as the 2026 coauthor. It would make a strong slide beside the 2026 abstract.
3. **Makovicky, Apesteguía & Gianechini 2012**, *Fieldiana* (ref 7). The *Alnashetri* holotype.
4. **Makovicky 1997**, *JVP* 17:755 (ref 26), and **Naish, Hutt & Martill** (ref 27, printed as 1991). The original Morrison theropod and *Calamosaurus* descriptions, for a then-and-now slide.
5. **Qin et al. 2021 supplement**, Figure S3B, corrected and original, for the correction slide.
6. **Milewski et al. 1994**, *J. Biogeogr.* (ref 37). The mammal myrmecophage mass range.
7. **Altangerel et al. 1993**, *Nature* (ref 1). "Flightless bird," for the opening.
8. **Senter 2005** (ref 4) and **Qin et al. 2023** (ref 5). Forelimb and claw function.
9. **Rougier et al. 2011** (ref 35). The dryolestoid parallel; there's no slide for it without a figure.

## Rebuilding the pictures

```
python3 maniraptora/alvarez/tools/lines.py      # quotes.py -> js/lines.js
python3 maniraptora/alvarez/tools/crop_figs.py  # figures, pages, thumbnails -> img/, js/dims.js
maniraptora/alvarez/tools/shoot.sh OUT L3/5.1 L3/23.4   # headless screenshots
```

Add a line to `tools/quotes.py` as (paper, first words, last words); punctuation and citation numbers don't matter. A quote can't cross a page. Crop boxes in `crop_figs.py` only need to be close; each crop is trimmed to its ink.

## Figure credits

Published figures, cropped, credited on each slide. Skeletal drawing in Makovicky Fig 1: Jorge Antonio Gonzalez. Silhouettes in Fig 2: Viktor Radermacher. Photos in the Extended Data: P. Makovicky. Histology: I. Cerda. Life scene in Lü 2018: Zhao Chuang.

`img/pages/` holds whole rendered pages (17 MB), not crops, committed on purpose: the walk slides show the page itself.
