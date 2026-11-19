# Talori et al. 2018, "Winged forelimbs of the small theropod dinosaur *Caudipteryx* could have generated small aerodynamic forces during rapid terrestrial locomotion"

Talori, Liu, Zhao, Sullivan, O'Connor & Li. *Scientific Reports* 8:17854 (2018). doi 10.1038/s41598-018-35966-4.

File: `papers/s41598-018-35966-4.pdf`, 14 pages. Read in full; all seven figures viewed. Supplementary videos not in the folder. Not to be confused with the same group's 2019 *PLoS Comp Biol* paper on a *Caudipteryx* robot on a juvenile ostrich.

## Claim

- Question: "why oviraptorosaurs possessed pennaceous feathers on their forelimbs" if they were "almost certainly non-volant." Test: could the wings of a running *Caudipteryx* make useful aerodynamic force?
- Model animal: 5 kg (femur-based estimates 4.74-5.18 kg across five specimens), weight 49 N, top speed 8 m/s. Wing 0.24 m long, area 0.018 m². Skeleton from BPM 0001; plumage from IVPP V12430 and V12344.
- Four approaches: classical lift/drag equations, flat-plate model, inclined airstream, ABAQUS simulation of a twisted wing at six downstroke angles; plus a plastic robot with real bird feathers in a wind stream.
- Results: "a Caudipteryx running at 8 m/s ... with wings fully extended would have experienced a total lift force of only ~1.4 N and a total drag force of only ~0.6 N." All analyses "under 4 N even at a running speed of 8 m/s ... a small fraction (~8%) of the body weight." Robot: 0.55 N lift, 0.29 N drag at 6 m/s. Thrust in the downstroke simulation "<0.05 N per wing ... no discernible effect."
- Conclusion: "consistent with suggestions that pennaceous feathers and indeed wings originally evolved for a function other than production of aerodynamic forces, such as display. In the oviraptorosaur lineage, the modifications needed to transform the wings into effective aerodynamic structures may simply never have occurred."
- Stated gaps: flapping "not explicitly modelled"; asymmetric use for "turning, as apparently occurs in modern ostriches" not tested.

Typos to watch if quoting numbers: Methods give aspect ratio "0.32" where the rest of the paper uses 3.2, and Reynolds number "1.29 × 10⁻⁵" for what must be 10⁵.

## Figures

- **Fig 1 (p2)**, two *Caudipteryx* specimens with yellow labels on forelimb bones and feathers, plus a grey wing-outline inset. Photos are busy and the feathers hard to see; labels help. Moderate.
- **Fig 2 (p3)**, wing outline over fossil (a), textbook Bernoulli diagram (b), lift and drag vs aspect ratio for many speeds (c, d, on pale green). Dense line charts with tiny labels.
- **Fig 3 (p4)**, flat-plate model and force vs angle-of-attack curves (four speeds, colored). Cleanest of the charts; (c) alone shows how little lift there is even at 10 m/s. Y-axis max ~3 N vs 49 N body weight, which the slide would have to state.
- **Fig 4 (p5)**, inclined-airflow diagram and two more chart panels. Skip.
- **Fig 5 (p6)**, 3D twisted-wing renders with force arrows (a-c) and a thrust/lift vs flapping-angle chart (d). Renders are attractive but the y-axis is ±0.06 N. Technical.
- **Fig 6 (p7)**, ABAQUS color maps of velocity, pressure, displacement, stress across six wing positions. Rainbow color maps; look impressive, explain little.
- **Fig 7 (p7)**, the robot: a white plastic *Caudipteryx* skeleton with real feathered wings on a stand, plus a close-up of the force sensors. The memorable image. Sharp; crop (a). Pair with the 0.55 N vs 49 N comparison.
