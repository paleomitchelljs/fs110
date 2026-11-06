# Gordon et al. 2025, "Limb proportions predict aquatic habits and soft-tissue flippers in extinct amniotes"

Gordon, Freisem, Griffin, Gauthier & Bhullar. *Current Biology* 35:5982-5998.e7, 15 Dec 2025. DOI 10.1016/j.cub.2025.10.068.

Files:
- `spinos/papers/gordon-2025-current-biology.pdf`, published, 25 pages, 300 dpi images. PDF page = journal page minus 5980. Copied from `abelisaurs/papers/`, where the original still sits.
- `spinos/papers/2025.06.25.661573.full.pdf`, bioRxiv preprint, 27 June 2025. Has no theropod results at all. They were added in review. Use the published one.

Read in full, including STAR Methods. The Figshare supplement (https://doi.org/10.6084/m9.figshare.30395887) isn't in the folder. Figs 1, 2, 3, 5, 6 viewed. Fig 4 from its caption. Fig 5A viewed at 420 dpi.

## Claim

Relative hand length predicts flippers and highly or fully aquatic habits across amniotes, with over 90% accuracy. Webbing can't be predicted from bones. Applied to fossils, the model recovers highly aquatic habits for spinosaurids, weakly and with limits that the paper states.

## The *Spinosaurus* result

All in the text around Fig 5A:
- "Among theropods, hand-zeugopodium length ratios predicted highly/fully aquatic habits for one32 of two31,32 existing 3D Spinosaurus aegyptiacus forelimb reconstructions, the available Suchomimus tenerensis forelimb material,32 and for the compsognathid Juravenator starki (Figure 5A)."
- Ref 31 is [Fabbri 2022](fabbri-2022.md). Ref 32 is [Sereno 2022](sereno-2022.md). So the reconstruction that comes out highly aquatic is the one from "Spinosaurus is not an aquatic dinosaur." The one from the aquatic side falls short.
- "The corresponding hindlimb model (using Lfoot/Lzeugopodium ratios) did not recover highly aquatic habits in any sampled theropods."
- Their reason for favoring the forelimb: "given the greater tendency of both models toward false negatives, the positive results of the forelimb model are more likely to reflect an accurate interpretation of aquatic habitat." "Forelimb models for archosaurs as a whole were prone to high specificity, with high false negative and true negative rates (Figure 3), making false positives unlikely."
- "the results for spinosaurids and Juravenator suggest multiple independent commitments to a predominantly aquatic lifestyle among non-avian dinosaurs."

The paper's own limits:
- "Such predictions are nevertheless tentative, as they rely on the accuracy of existing spinosaurid forelimb reconstructions."
- "the predictive accuracies of their associated logistic regression models must be compared with those of alternative histological, biomechanical, isotopic, and cranial morphometric lines of evidence for aquatic affinity before we can confidently resolve the habitat preferences of spinosaurids."
- "Most critically, our results were able to directly predict or reject highly/fully aquatic lifestyles but not transiently/moderately aquatic (i.e., semi-aquatic) habits." So it can't test wading as such.
- "our best predictive models appear sensitive to taxonomic sampling and seem to require large (n > 10) samples for all of the groups compared. Our predictive models for atlantogenatans and archosaurs were trained on n < 10 highly/fully aquatic specimens, which may explain their relatively poorer overall performances."
- "cross-clade predictive accuracies were even higher than those reported above when archosaurs were removed."
- Fig 5 callouts: "Conflicting model predictions possible, albeit rare for models with higher accuracies." "Model accuracy may vary across tree space."

Press vs paper, worth saying plainly:
- Gordon in the Yale release on ScienceDaily (25 Oct 2026): "We confidently recovered highly aquatic habits for Spinosaurus, indicating that it spent the vast majority of its time submerged in the water." Headline: "New evidence suggests spinosaurus spent most of its life underwater."
- Paper: "tentative," and "before we can confidently resolve."

## What specimens go into that number

The predictor is hand length over forearm length. That's about the least known part of the animal. No single specimen preserves it.
- [Sereno 2022](sereno-2022.md): the neotype has only "partial manual digit II," and "Our reconstruction of the manus is based on a recently described forelimb of the close relative Irritator." "The proportions of more proximal forelimb segments and the pectoral girdle are based on the holotypic specimens of Baryonyx and Suchomimus." In Sereno Fig 1A, the forelimb is yellow and blue.
- Mickey Mortimer, Dinosaur Mailing Group, 27 Nov 2025 (commentary, not peer reviewed; https://groups.google.com/g/dinosaurmailinggroup/c/iqczZUW3iwQ): for *Spinosaurus* "the aforementioned II-1 and base of II-2, combined with isolated ulna, I-1, III-2, III-3 and unguals (fictional ratio of 2.32)." For *Suchomimus* "just unguals and a partial metacarpal III, with a referred I-1 (fictional ratio of ~1.72)." "I'd hardly call it data."
- Why the two could split (my arithmetic, not theirs). Sereno 2022 Fig 9 puts its radius-ulna at 89% and manus at 93% of Ibrahim 2020's. That makes hand/forearm about 4.5% higher in Sereno's. Fabbri Fig 1b uses Ibrahim 2020's drawing, though I haven't confirmed that's the source of Gordon's Fabbri numbers. If so, a difference of a few percent in how isolated bones are assembled moves the animal across the threshold.

Fig 5A reading (420 dpi): *Spinosaurus*, n = 2, forelimb point with an error bar straddling the green threshold line. Mean just above, low end just below. By eye the threshold is about 0.65. *Suchomimus* (n = 1) and *Juravenator* (n = 1) a little above it. Hindlimb points sit near the magenta line, not significantly above.

Conflicts:
- [Fabbri 2022](fabbri-2022.md) has *Suchomimus* as not a subaqueous forager, while this has its forelimb as highly aquatic. Fabbri and Gordon share Bhullar as an author.
- Gordon cites the Fabbri bone result as support ("histological evidence for diving behavior"). [Myhrvold 2024](myhrvold-2024.md)'s critique of that result is not in Gordon's reference list.
- [Sereno 2022](sereno-2022.md): "incapable of diving, given its buoyancy and incompressible trunk." Gordon's category is "only occasionally leaves water," which a floating animal could meet, so those aren't strictly exclusive. Gordon's press line, "submerged," does conflict. Limb proportions don't address buoyancy.
- *Juravenator* comes out highly aquatic, which the authors accept: "make sense of its piscivorous dentition and hypothesized integumentary sense organs." See [Pittet 2026](pittet-2026.md) for that skin argument. Jaime Headden on the same list: "a lot of these assumptions were dealt with in Hone and Holtz (2021)."

## Method

The order the deck's method slide follows. Methods are on PDF pp. 20-25 (journal e2-e7).

1. Score. "In most cases, we scored extant taxa for aquatic affinity using field guides and primary natural history literature. However, for a select few fossil groups (i.e., ichthyosaurs, plesiosaurs, mosasaurids, and metriorhynchids), morphological considerations were used to infer fully aquatic habits a priori." The five bins collapse to two: "binary 'highly/fully aquatic' and 'not highly/fully aquatic' categories." Their reason is that "the most drastic change in forelimb morphometry" falls at that line.
2. Candidates, Fig 1C: hand outline, limb region proportions, proximal phalanx shape, claw shape. "flattened unguals" is the trait [Ibrahim 2014](ibrahim-2014.md) used for webbing.
3. Measure. "Linear measurements were collected on 759 specimens: 469 extant, 290 extinct." Physical skeletons 365, 3D meshes 115, photographs 279. Hand: "the combined length of the metacarpal and the un-clawed phalanges of either digit III (for reptiles) or the longest digit (for mammals and outgroups)." Forearm: "Radius and ulna lengths were averaged."
4. Compare. Fig 2F, phylogenetic ANOVA and Levene's tests. By eye, the aquatic pan-archosaur median is about 0.5, below the non-aquatic median of about 0.9, with a very long upper range. So many aquatic archosaurs in the sample don't have long hands, which fits the 32% below.
5. Train and test. "the dataset of taxa with known phenotypes was split randomly into thirds, two thirds of the data was used to fit (or 'train') a phybLR model, and the remaining third was fed into the trained model to test its performance." Repeated across eight supertrees for the sensitivity tests. ROC analysis "was originally developed by the U.S. Army Signal Corps in World War II."
   - Run counts don't agree within the paper. Main text and Methods: 100 runs. Methods also: "each of the 1,000 iterations." Table 1: "fit to the data 10,000 times." The slide says 100.
6. Cutoff, from Youden's J (TPR minus FPR). Table 1, highly/fully aquatic from hand/zeugopodium: AUC 0.91, cutoff 0.66, n 466, TPR 0.76, FPR 0.02, TNR 0.98, FNR 0.24, accuracy 0.91. The cutoff is a predicted probability, not a hand ratio.
7. Archosaurs only. Fig 3B, hand/zeugopodium: AUC 0.49, cutoff 0.23, n 46, TPR 0.32, FPR 0.01, TNR 0.99, FNR 0.68, accuracy 0.91. Foot/zeugopodium: AUC 0.69, cutoff 0.37, n 68, TPR 0.48, FPR <0.01, TNR >0.99, FNR 0.52, accuracy 0.96. Their words: "significant but overly cautious predictors."
   - My arithmetic, not theirs. Accuracy 0.91 at those rates implies about 12% positives, so about 6 of 46, which fits their "n < 10." Answering "no" every time would score about 88%. An AUC of 0.49 is what a coin flip gets.
8. Fossils. "these 'best' phybLR models were used to derive a normal distribution of n=10,000 predicted probabilities for each of the tip taxa in our dataset with ambiguous phenotypes." A taxon gets the phenotype "if and only if its mean predicted probability of having the phenotype was significantly higher than the ideal binary classification threshold," by one-tailed t-test.
   - Which model scores theropods? Not stated outright. By eye the Fig 5A lines sit at about 0.64 and 0.18. Those match Table 1's all-amniote cutoffs (0.66, 0.18), not the archosaur ones (0.23, 0.37). So the archosaur numbers look like the argument for trusting a positive, not the model doing the scoring. My reading.
   - With n = 10,000 simulated values, a t-test calls very small differences significant, so "significantly higher" depends partly on how many simulations were drawn. My point, not theirs. Worth asking about for a *Spinosaurus* point whose range straddles the line.
   - Fig 5 legend: white circles are "fixed based on morphological considerations or direct observation." That covers most theropods in Fig 5A. Filled forelimb points are only *Suchomimus*, *Spinosaurus*, *Juravenator* and *Halszkaraptor*.

## Other facts and quotes

- Five bins, Fig 1: Fully Terrestrial "never intentionally enters water"; Transiently Aquatic "only occasionally enters water"; Moderately Aquatic "regularly crosses land and water"; Highly Aquatic "only occasionally leaves water"; Fully Aquatic "never intentionally leaves water." Useful definitions for the argument over the word "aquatic" between [Sereno 2022](sereno-2022.md) and [Fabbri 2022](fabbri-2022.md).
- Sample: ">11,000 original measurements," 759 specimens. Preprint: "11,410 linear measurements on n = 747 specimens."
- Webbing, a direct hit on [Ibrahim 2014](ibrahim-2014.md)'s foot, which says flat claws "suggest that the foot may have been adapted to traversing soft substrates or webbed for paddling." Preprint highlights: "Interdigital webbing cannot be predicted from the bones alone using previously suggested correlates." Also "interdigital webbing is most typical of moderately aquatic species."
- Long hands come late: "a lineage's limb morphometry reflects its adaptation to aquatic habits only once it spends the vast majority of its time in the water."
- Scoring of living animals is "from the natural history literature (see Table S1)."
- Halszkaraptor sits at the threshold: "we cannot rule out consistent terrestrial ties." *Mesosaurus* and other Paleozoic reptiles not highly aquatic. All ichthyosauromorphs are.
- Method claim: "simple input data (length measurements and ratios) that are easy to obtain from fragmentary specimens." The *Spinosaurus* case shows the catch: the ratio needs bones that one fragmentary specimen doesn't have.

## Figures

No dinosaur skeletons. Silhouettes and limbs of other animals.

**Fig 1 (PDF p4).** a: five labelled bins with cartoon water levels. b: webbed vs flippered limb icons. c: proposed correlates. d: where measurements are taken, on a flipper. Clean.

**Fig 1D (PDF p4).** One flippered forelimb with the measurements drawn on it. The legend names no species or specimen.

**Fig 2 (PDF p5).** Ternary plots, box plots of relative hand length (F), ROC curves (G). G's left panel compares the four candidate traits for highly/fully aquatic habits.

**Fig 3 (PDF p8).** ROC by clade with a table of rates. This is where archosaur forelimb accuracy is shown.

**Fig 4 (PDF p10, caption only).** Trees with probabilities for extinct pan-reptiles.

**Fig 5A (PDF p11): the theropod result.** Tree from *Eoraptor* to Avialae, with silhouettes as symbols, and two strips: forelimb model (green threshold), hindlimb model (magenta). Dark blue silhouettes for *Suchomimus*, *Spinosaurus*, *Juravenator*. A dotted box groups the three where the models disagree. Silhouettes are not specimens. Fig 5B turtles, Fig 5C mammals on the same page.

**Fig 6 (PDF p12).** Named forelimb skeletons colored by limb region (*Keichousaurus*, *Elasmosaurus*, *Ichthyosaurus*, *Chelonia*, *Ectenosaurus*; *Mesoplodon*, *Balaenoptera*, *Feresa*, *Zalophus*, *Trichechus*). Ratio table by clade, for example sauropterygians 1.91-10.6, cetaceans 0.80-3.52, pinnipeds 0.89-1.66, sirenians 0.99-1.16. Strip plot of flippered vs not, on black. Values from the preprint version of this figure, so check on the published page. By eye, non-flippered runs up to about 2, so Mortimer's 2.32 sits just above.

## Ideal images

1. Fig 5A, zoomed to the theropods. The straddling *Spinosaurus* point, and "whose reconstruction?"
2. Sereno 2022 Fig 1A, forelimb zoomed, next to it: "Which bones make this number?"
3. Fig 1a: five bins, for defining "aquatic."
4. Fig 6a-b: flippers are long-handed. Direct and easy.

Related: [Sereno 2022](sereno-2022.md), [Fabbri 2022](fabbri-2022.md), [Ibrahim 2014](ibrahim-2014.md), [Hone & Holtz 2021](hone-holtz-2021.md), [Myhrvold 2024](myhrvold-2024.md), [Brusatte 2021](brusatte-2021.md).
