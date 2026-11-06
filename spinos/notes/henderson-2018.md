# Henderson 2018, "A buoyancy, balance and stability challenge to the hypothesis of a semi-aquatic Spinosaurus Stromer, 1915 (Dinosauria: Theropoda)"

*PeerJ* 6:e5409. DOI 10.7717/peerj.5409. File: `spinos/papers/peerj-5409.pdf`, 29 pages, CC-BY 4.0. PDF page = PeerJ page. Figs 1, 2, 5, 9 viewed. Figs 3, 4, 6, 7, 8, 10, 11, 12 known from captions and text.

Henderson is also a coauthor of [Sereno 2022](sereno-2022.md), so those two papers are not independent critics.

## Claim

Float a digital *Spinosaurus* and it is ordinary. The CM sits near the hips, it can't sink, and it tips onto its side. "Spinosaurus was not highly specialized for a semi-aquatic mode of life."

Henderson doesn't deny all water use: "may have been specialized for a shoreline or shallow water mode of life, but would still have been a competent terrestrial animal."

## Facts and quotes

Model source:
- "The digital Spinosaurus model used in the current study was based on the illustration provided in Fig. S3 of the Supplementary Materials of Ibrahim et al. (2014)." He tests Ibrahim's reconstruction, with Ibrahim's proportions, and he says why: "As the claims for a semi-aquatic mode of life for Spinosaurus were associated with this new restoration, it was the one used."
- That matters for Sereno's argument. Sereno blames front-heavy proportions for the mid-trunk CM. Here Ibrahim's own 2014 proportions, modeled independently, give a CM near the hips. So the skeleton can't be the whole explanation. (Sereno's percentages are against the 2020 silhouette, though it says trunk length was overstated "in both previous models.")
- The specific cause came out later. [Myhrvold 2024](myhrvold-2024.md), with Henderson and Sereno as coauthors: the 2014 calculation "erroneously shifted the center of mass forward from the hip by the addition, rather than the subtraction, of the estimated volume of internal air space." That fits Henderson's failure, below, to reproduce the number.
- No dorsal view available, so widths "were guided by reconstructions showing dorsal views of other large dinosaurs by palaeoartists, for example Greg Paul (1988)."
- Assumptions: axial tissue 1,000 gm/l; pre-caudal axial reduced 15% to 850 gm/l for air sacs; limbs 1,050; lung ~9% of axial volume.

Sail: lateral area 6.60 m2, bone 2.45 m2, assumed thickness 4.25 cm, mass 335 kg. 7.5% of axial mass. These are from the outline in Ibrahim 2014, not from a new reconstruction. [Sereno 2022](sereno-2022.md) gets about 5.03 m2 a side from its own model.

Results:
- CM: "the center of mass of Spinosaurus was much closer to the hips than previously estimated." Relative CM 15.3% of gleno-acetabular distance, less than *T. rex* at 20.9%.
- "Even with its rather short legs, the CM of Spinosaurus is still positioned above the leading foot."
- Tried to reproduce Ibrahim's CM, using a 2D silhouette and a uniform-density 3D mesh. "None of the three computed values for the CM for Spinosaurus in the present study can match that reported by Ibrahim et al. (2014)."
- Floats: "able to float with its head clear of the water surface," but so did *T. rex* (with 15 degree head tilt), *Coelophysis* (20 degrees), *Allosaurus*, *Struthiomimus*. "there is nothing special about the state of an immersed Spinosaurus."
- Won't sink: lungs deflated 75% gives density 885 gm/l, still positive. No air sacs at all + 75% deflation gives 986 gm/l, "still not able to sink." Alligator model sinks at 40-50% deflation.
- Bone ballast is small: solid bones in an *Allosaurus* leg raise total mass by "just over half of 1%." Calculated on *Allosaurus* and transferred to *Spinosaurus*.
- Roll: CM is "22 cm above the MC." A 2D disk tipped 20 degrees rolled over within 10 simulation cycles. The alligator disk righted itself over 42 cycles. So "Spinosaurus must have had to apply constant limb action to maintain an upright posture."
- Roll test is a single 2D cross-section. Limbs ignored as "a first approximation." Sail not in the disk, except through its density. (The disk's density is "the mean density of the whole model.") Ibrahim 2020 later suggests the tall tail reduces roll.
- Validation: alligator and emperor penguin models float correctly. Alligator 122 kg in the text (Table 2 prints 133) vs 129 kg observed for a smaller animal.
- Hindlimb mass: *Spinosaurus* 4.88% of body mass vs mean 12.6% (sd 1.87%) in the other five.
- Forelimbs: "one would expect that the forelimbs would also be reduced, similar to what is seen in the crocodilians. However, the forelimbs as restored for Spinosaurus are large enough to reach the ground."
- Composite objection, the strongest on specimens: "The colour codings of the vertebrae used in the reconstruction (Ibrahim et al., 2014, Fig. S3) clearly show that the majority of the vertebrae come from other animals and locations." "the hind limbs of the new restoration, although from a single individual, were not associated with a complete dorsal axial skeleton." "This does not seem like a good platform for building hypotheses about what this animal was like as a once living organism."
- Then he uses it anyway, explicitly because that's the claim under test. Worth saying aloud.

Number inconsistencies to avoid quoting without checking:
- Length: 15.55 m (methods) vs 16.0 m (Table 2).
- Mass: 6,500 kg (Table 2) vs 6,379 kg (results).
- Mean density: 833 (Table 2) vs "basic value of 823."
- Hindlimb: 4.88% vs "4.54%." *T. rex* 9,750 kg (Table 2) vs 9,360 kg (Fig 6 caption).

## Figures

No skeletal diagrams and no fossils in this paper. All whole-animal figures are 3D mesh models built from published illustrations. None is a specimen. Table 1 gives the source for each.

**Fig 1 (PDF p5): MESH MODELS, six theropods, dorsal and lateral.** A *Coelophysis*, B *Struthiomimus*, C *Allosaurus*, D *Suchomimus* (labelled *Baryonyx*), E *Spinosaurus*, F *T. rex*. Wireframe with lung cylinders and CM cross.
- E comes from Ibrahim 2014's composite (Fig S3). So it inherits that composite's specimens: FSAC-KK 11888, referred bones, Stromer's drawings, and gaps filled from other spinosaurids.
- A, B, C, F come from Paul 1988 and Currie 1997 drawings. D from Sereno 1998 and Hartman.
- Genus label caution: Henderson sinks *Suchomimus* into *Baryonyx*. Other papers don't.

**Fig 2 (PDF p6): DRAWN, after Ibrahim 2014.** Sail and neural spine outlines in gray, centroids marked. Body flat gray. Scale 2 m. Spine outlines are traced from Ibrahim Fig 2. Same composite.

**Fig 3 (PDF p8).** Alligator mesh, floating, as validation.

**Fig 4 (PDF p11).** Penguin mesh, floating in seawater.

**Fig 5 (PDF p13): the key image.** A: *Spinosaurus* mesh floating, waterline through the torso, sail high and dry, head above water, feet hanging. B: *Suchomimus* floating. Lateral and dorsal views. CM and CB nearly coincide.

**Fig 6 (PDF p14).** The other four theropods floating, 10.3 to 9,360 kg, all with heads clear.

**Fig 7 (PDF p15).** MC, CB, CM cross-sections for alligator vs *Spinosaurus*.

**Fig 8 (PDF p16).** Alligator disk tipped 20 degrees, self-rights in 42 cycles.

**Fig 9 (PDF p18).** *Spinosaurus* disk, frames 0-10, green above water and blue below, rolls to its side.

**Fig 10 (PDF p19).** *Allosaurus* hindlimb mesh with bones from Madsen 1976.

**Fig 11 (PDF p21).** Two CM attempts on a *Spinosaurus* silhouette and mesh.

**Fig 12 (PDF p24).** Hindlimb mass bar plot with mean and sd band.

## Ideal images

1. Fig 5A: floating mesh. Direct, simple, and the sail is obvious.
2. Fig 6 with Fig 5A: *T. rex* also floats, so floating isn't evidence of anything by itself. Good surprise.
3. Fig 9, next to Fig 8: same test, opposite outcome.
4. Fig 12: hindlimbs as an outlier, which actually supports Ibrahim's anatomy point even in a paper arguing against his conclusion.
5. Fig 1: the models as models. Useful when asking what a model can tell you.

Related: [Ibrahim 2014](ibrahim-2014.md), [Ibrahim 2020](ibrahim-2020.md), [Sereno 2022](sereno-2022.md), [Gimsa 2016](gimsa-2016.md), [Myhrvold 2024](myhrvold-2024.md), [Hartman 2014-2020](hartman-2014-2020.md).
