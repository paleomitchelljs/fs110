/* The CV (copied from cv_6.tex) and the resume lines drawn from it. No DOM, so the tests can load it.
 * Run the checks with:  node cv/tests/data.test.js
 *
 * Text markup: **bold**, *italic*. In resume lines, {a|b|c} is a word you can click to cycle. */
(function (root) {
  'use strict';

  // A cell is 'role:text'. Split on the first colon only, so titles can hold colons.
  const row = (...cells) => cells.map(c => {
    const i = c.indexOf(':');
    return { role: c.slice(0, i), text: c.slice(i + 1) };
  });
  const ME = '**Mitchell, J.S.**';

  /* Roles: when (purple), who (teal), what (gold), where (orange), ref (green). Each section names them its own way. */
  const SECTIONS = [
    { id: 'head', name: 'Header', icon: 'person', layout: 'head', join: ' · ',
      legend: { who: 'Name', where: 'Website', ref: 'Email' },
      rows: [row('who:Jonathan S. Mitchell', 'where:jonsmitchell.com', 'ref:jonsmitch2@gmail.com')] },

    { id: 'edu', name: 'Education', icon: 'edu', left: true, join: ', ',
      legend: { rank: 'Title', what: 'Field', where: 'Institution', when: 'Dates' },
      rows: [
        row('rank:Asst. Prof.', 'where:Coe College', 'when:2023 - Current'),
        row('rank:Asst. Prof.', 'where:West Virginia University Institute of Technology', 'when:2017 - 2023'),
        row('rank:Postdoc', 'where:The University of Michigan', 'when:2015 - 2017'),
        row('rank:Ph.D.', 'where:Committee on Evolutionary Biology, The University of Chicago', 'when:June 2015'),
        row('rank:B.S.', 'what:Geology *magna cum laude*', 'where:Appalachian State University', 'when:2010'),
      ] },

    { id: 'pubs', name: 'Publications', icon: 'pubs', left: true, join: ' ',
      legend: { when: 'Year', who: 'Authors', what: 'Title', where: 'Journal', ref: 'Volume, pages, DOI' },
      rows: [
        row('when:ORCID', 'ref:https://orcid.org/0000-0002-8666-5825'),
        row('when:2026', 'who:Makovicky P.J., **Mitchell J.S.**, Meso J., Gianechini F.A., Cerda I., and Apesteguia S.', 'what:Argentine fossil rewrites evolutionary history of a baffling dinosaur clade.', 'where:Nature', 'ref:https://doi.org/10.1038/s41586-026-10194-3'),
        row('when:2025', 'who:Saitta E.T., Balaji L., **Mitchell J.S.**, and Makovicky P.J.', 'what:Feather evolution following flight loss in crown group birds: relaxed selection and developmental constraints.', 'where:Evolution', 'ref:79(5) https://doi.org/10.1093/evolut/qpaf020'),
        row('when:2022', 'who:Canale J.I., Apesteguia S, Gallina P.A., **Mitchell J.S.**, Smith N.D., Cullen T.M., Shinya A., Haluza A., Gianechini F.A., and Makovicky P.J.', 'what:New giant carnivorous dinosaur reveals convergent evolutionary trends in theropod arm reduction.', 'where:Current Biology', 'ref:https://doi.org/10.1016/j.cub.2022.05.057'),
        row('when:2022', 'who:Lopez-Antonanzas R., **Mitchell J.S.**, Simoes T.R., Condamine F.L., Aguilee R., Pelaez-Campomanes P., Renaud S., Rolland J., and Donoghue P.C.J.', 'what:Integrative Phylogenetics: Tools for Palaeontologists to Explore the Tree of Life.', 'where:MDPI Biology', 'ref:https://doi.org/10.3390/biology11081185'),
        row('when:2021', 'who:Smith N.A., Koeller K., Clarke J., Ksepka D., **Mitchell J.S.**, Nabavizadeh A., Ridgely R., and Witmer L.', 'what:Convergent Evolution In Dippers (Aves, Cinclidae): The Only Wing-propelled Diving Songbirds.', 'where:Anatomical Record', 'ref:https://doi.org/10.1002/ar.24820'),
        row('when:2020', 'who:Smith N.A., Stidham T.A., **Mitchell** J.S.', 'what:The First Fossil Owl (Aves, Strigiformes) From the Paleogene of Africa.', 'where:Diversity', 'ref:12(4), 163; https://doi.org/10.3390/d12040163'),
        row('when:2019', 'who:' + ME + ', Etienne, R and Rabosky D.L.', 'what:fossilBAMM: A General Multiprocess Diversification Model for Paleontological and Molecular Phylogenetic Data.', 'where:Systematic Biology', 'ref:68(1); https://doi.org/10.1093/sysbio/syy035'),
        row('when:2017', 'who:Rabosky D.L., **Mitchell J.S.**, and Chang, J.', 'what:Is BAMM flawed? Theoretical and practical concerns in the analysis of multi-rate diversification models.', 'where:Systematic Biology', 'ref:66:4 477 - 498'),
        row('when:2017', 'who:Zelditch M.L., Ye J., **Mitchell J.S.**, and Swiderski D. L.', 'what:Rare ecomorphological convergence on a complex adaptive landscape: Body size and diet mediate evolution of jaw shape in squirrels (Sciuridae).', 'where:Evolution', 'ref:71(3); doi:10.1111/evo.13168'),
        row('when:2017', 'who:Johnson, A.E, ' + ME + ', and Brown, M.B.', 'what:Convergent evolution in social swallows (Aves: Hirundinidae).', 'where:Ecology & Evolution', 'ref:7(2) 550-560 doi:10.1002/ece3.2641'),
        row('when:2016', 'who:Bernardi, M, Angielczyk, K.D., ' + ME + ', and Ruta, M.', 'what:Phylogenetic stability, tree shape, and character compatibility: A case study using early Tetrapods.', 'where:Systematic Biology', 'ref:doi: 10.1093/sysbio/syw049'),
        row('when:2016', 'who:' + ME + ' and Rabosky, D.L.', 'what:Bayesian model selection with BAMM: effects of the model prior on the inferred number of diversification shifts.', 'where:Methods in Ecology and Evolution', 'ref:65(5) 737-758 doi: 10.1111/2041-210X.12626'),
        row('when:2015', 'who:' + ME, 'what:Extant only comparative methods fail to recover the disparity preserved in the bird fossil record.', 'where:Evolution', 'ref:69(9) 2414-2424'),
        row('when:2015', 'who:' + ME, 'what:Preservation is predictable: Quantifying the impact of taphonomic biases on ecological disparity in birds.', 'where:Paleobiology', 'ref:41(2) 353-367 doi: http://dx.doi.org/10.1017/pab.2014.23'),
        row('when:2014', 'who:' + ME + ' and Makovicky, P.J.', 'what:Low ecological disparity in Early Cretaceous birds.', 'where:Proceedings of the Royal Society B.', 'ref:281(1787), doi:10.1098/rspb.2014.0608'),
        row('when:2012', 'who:' + ME + ', Roopnarine, P.D., Angielczyk K.D.', 'what:Late Cretaceous restructuring of dinosaur-bearing communities facilitated the End-Cretaceous mass extinction.', 'where:Proceedings of the National Academy of Sciences', 'ref:109(46):18857-61. doi: 10.1073/pnas.1202196109'),
        row('when:2012', 'who:Heckert, A.B., ' + ME + ', Schneider, V., and Olsen, P.E.', 'what:Diverse new microvertebrate assemblage from the Upper Triassic (Norian) Cumnock Formation, Sanford Subbasin, North Carolina, USA.', 'where:Journal of Paleontology', 'ref:86(2):368-390, doi: http://dx.doi.org/10.1666/11-098.1'),
        row('when:2010', 'who:' + ME + ', Heckert A. B., and Sues, H-D.', 'what:Grooves to tubes: Evolution of the venom delivery system in a Late Triassic "reptile".', 'where:Naturwissenschaften', 'ref:97:1117-1121'),
        row('when:2010', 'who:' + ME + ' and A. B. Heckert.', 'what:The setup, use and efficacy of sodium polytungstate separation methodology with respect to microvertebrate remains.', 'where:Journal of Paleontological Techniques', 'ref:7: 1-12'),
        row('when:2015', 'who:' + ME, 'what:Issues in Palaeobiology: a Global View. (book review)', 'where:Quarterly Review of Biology', 'ref:90:424-429'),
      ] },

    { id: 'teach', name: 'Teaching', icon: 'teach', left: true, hfill: true, join: ', ',
      legend: { when: 'Years', what: 'Course', where: 'Institution' },
      rows: [
        row('when:2024', 'what:Comparative Chordate Anatomy', 'where:Coe College'),
        row('when:2024, 2025', 'what:BIO 145 Cell & Molecular Biology', 'where:Coe College'),
        row('when:2024, 2025', 'what:BIO 315 Integrated Human Anatomy', 'where:Coe College'),
        row('when:2023, 2024, 2025', 'what:BIO 155 Organismal & Ecological Biology', 'where:Coe College'),
        row('when:2023, 2025', 'what:BIO 202 Topics in Evolution', 'where:Coe College'),
        row('when:2018, 2020, 2022', 'what:Comparative Vertebrate Anatomy', 'where:WVU Tech'),
        row('when:2018 - 2022', 'what:Evolution', 'where:WVU Tech'),
        row('when:2017, 2019, & 2021', 'what:Vertebrate Embryology', 'where:WVU Tech'),
        row('when:2018 - 2022', 'what:Human Anatomy & Physiology II', 'where:WVU Tech'),
        row('when:2017 - 2022', 'what:Human Anatomy & Physiology I', 'where:WVU Tech'),
        row('when:2020 & 2021', 'what:Geology', 'where:WVU Tech'),
        row('when:2019 - 2021', 'what:Freshmen Seminar', 'where:WVU Tech'),
        row('when:2022', 'what:Paleobiology', 'where:WVU Tech'),
      ] },

    { id: 'service', name: 'Professional service', icon: 'service', left: true, join: ' ',
      legend: { kind: 'Kind', what: 'Role', when: 'Dates' },
      rows: [
        row('kind:Committees', 'what:Committee on Academic Persistence and Enrollment, Coe College', 'when:(2024-Current)'),
        row('kind:', 'what:Faculty Evaluation Committee, WVU Tech', 'when:(2019, 2022)'),
        row('kind:', 'what:Legislative Committee, WVU Tech', 'when:(2020 - 2023)'),
        row('kind:', 'what:Election Committee, WVU Tech', 'when:(2020)'),
        row('kind:', 'what:Dean\'s Council, Biological Sciences, The University of Chicago', 'when:(2011-2015)'),
        row('kind:Peer Review', 'what:Paleobiology, Proceedings of the Royal Society B, Palaeontology, Ecology Letters, Current Biology, Naturwissenschaften, Fieldiana and Journal of Geophysical Research - Biogeosciences, Systematic Biology, TREE, Nature Communications, Journal of Biogeography, Biology Letters'),
        row('kind:Workshops', 'what:Presenter at K-Pg food web workshop at UC Berkeley, supported by the Welles Fund; Organized and ran a graduate student programming workshop series at the University of Chicago'),
        row('kind:Session Moderator', 'what:Society of Vertebrate Paleontology (2012), Society of Integrative Biology (2013), Evolution (2014)'),
        row('kind:Grant reviewer', 'what:UChicago Dean\'s Council Travel Grant Review Panel (2012-2015)'),
      ] },

    { id: 'outreach', name: 'Outreach', icon: 'outreach', left: true, join: ', ',
      legend: { when: 'Years', what: 'Activity' },
      rows: [
        row('when:2021', 'what:*The Final Ghouls* Podcast interview'),
        row('when:2018, 2020', 'what:Camp STEM, WVU Tech'),
        row('when:2019', 'what:Presenter Girl Scouts of America'),
        row('when:2014-2015', 'what:Advisor to undergraduate intern, Krista Kroeller, Field Museum'),
        row('when:2013-2015', 'what:Presenter for Geology Badge, Boy Scouts of America, Field Museum'),
        row('when:2012-2015', 'what:Dozin\' with the Dinos, Field Museum Public Outreach Program'),
        row('when:2010-2015', 'what:Ask-a-paleontologist outreach to Chicago Public Schools Kindergarten classes'),
        row('when:2009-2015', 'what:Over 20 presentations to middle-high school classrooms in rural North Carolina and Chicago Public Schools'),
        row('when:2014', 'what:"Wild Wednesday" Presenter, Garfield Park Conservatory, Chicago'),
        row('when:2013', 'what:Educator Open House, Field Museum'),
        row('when:2012', 'what:Presentation to undergraduate Geology Club, The University of Chicago'),
        row('when:2011', 'what:Proof-reader for Chicago Public Schools science materials, Field Museum'),
        row('when:2010', 'what:Public Lecture hosted by the New Mexico Friends of Paleontology'),
      ] },

    { id: 'grants', name: 'Grants', icon: 'grants', left: true, hfill: true, join: ' ',
      legend: { when: 'Year', what: 'Award', ref: 'Amount', where: 'Funder' },
      rows: [
        row('when:2025', 'what:Pochobradsky', 'ref:$6,000', 'where:Coe College'),
        row('when:2024', 'what:Pochobradsky & Coe Research Fund Grant', 'ref:$5,844', 'where:Coe College'),
        row('when:2012', 'what:Doctoral Dissertation Improvement Grant', 'ref:$14,960 (DEB-1311389)', 'where:NSF'),
        row('when:2012', 'what:Hinds Fund', 'ref:$500', 'where:The University of Chicago'),
        row('when:2011', 'what:Hinds Fund', 'ref:$1,520', 'where:The University of Chicago'),
        row('when:2011', 'what:Paleontological Society Student Grant', 'ref:$850', 'where:The Paleontological Society'),
        row('when:2010', 'what:East Asia and Pacific Summer Institute Grant', 'ref:$5,700 (OISE-1107676)', 'where:NSF'),
      ] },

    { id: 'training', name: 'Professional training', icon: 'training', left: true, hfill: true, join: ', ',
      legend: { when: 'Year', what: 'Training', where: 'Institution' },
      rows: [
        row('when:2014', 'what:Human Anatomy', 'where:Pritzker School of Medicine'),
        row('when:2013', 'what:K-Pg Food Web Workshop', 'where:UC Berkeley'),
        row('when:2011', 'what:Pedagogy in Evolutionary Biology', 'where:The University of Chicago'),
        row('when:2010', 'what:Analytical Methods in Paleobiology Workshop, Paleobiology Database', 'where:Macquarie University'),
      ] },

    { id: 'societies', name: 'Professional societies', icon: 'societies', join: ', ',
      legend: { what: 'Society' },
      rows: [
        row('what:Society for the Study of Evolution, Society of Integrative and Comparative Biology, Geological Society of America, Society of Vertebrate Paleontology'),
      ] },

    { id: 'media', name: 'Select media coverage', icon: 'media', join: ', ',
      legend: { where: 'Outlet', what: 'Story' },
      rows: [
        row('where:Business Insider', 'what:on *Meraxes*'),
        row('where:University of Chicago', 'what:early birds'),
        row('where:University of Chicago', 'what:food webs'),
        row('where:Nature News', 'what:*Uatchitodon*'),
        row('where:National Geographic', 'what:*Uatchitodon*'),
        row('where:University of Chicago', 'what:*Uatchitodon*'),
      ] },

    { id: 'field', name: 'Field work', icon: 'field', left: true, join: ', ',
      legend: { when: 'Years', where: 'Place', what: 'Rock unit & age' },
      rows: [
        row('when:2026', 'where:Missouri', 'what:Chronister Dinosaur Site, Campanian'),
        row('when:2012, 2013, 2015, 2020, 2021', 'where:Utah', 'what:Cedar Mountain Fm., Early Cretaceous'),
        row('when:2013-2014', 'where:Wyoming', 'what:Green River Fm., Eocene'),
        row('when:2013-2014', 'where:Argentina', 'what:Huincul Fm., Early Cretaceous'),
        row('when:2007, 2008, 2010', 'where:Arizona, New Mexico & Colorado', 'what:Chinle Fm., Late Triassic'),
        row('when:2008', 'where:Wyoming', 'what:Cloverly Fm., Early Cretaceous'),
        row('when:2008', 'where:North Carolina', 'what:Newark Group, Pekin Fm., Late Triassic'),
      ] },
  ];

  /* ---------- the resume ----------
   * Section names are the resume's, not the CV's: the CV's "Education" holds jobs and degrees, and a resume splits them.
   * Each entry is one line: t is the text, w the date at the right. */
  const RSECS = [
    { id: 'profile', name: 'Profile', icon: 'lines' },
    { id: 'exp', name: 'Experience', icon: 'exp' },
    { id: 'edu', name: 'Education', icon: 'edu' },
    { id: 'teach', name: 'Teaching', icon: 'teach' },
    { id: 'research', name: 'Research', icon: 'pubs' },
    { id: 'outreach', name: 'Outreach', icon: 'outreach' },
    { id: 'field', name: 'Field work', icon: 'field' },
    { id: 'service', name: 'Service', icon: 'service' },
  ];

  const E = {};
  const add = (sec, id, t, w) => { E[id] = { sec, t, w: w || '' }; };

  add('profile', 'p_teach', 'Biology professor. I {teach|design and teach} anatomy, evolution and ecology: 13 courses across two institutions since 2017.');
  add('profile', 'p_res', 'Paleobiologist studying fossil birds and dinosaurs. I {build|build and test} statistical models that put fossils directly into estimates of diversification and disparity.');
  add('profile', 'p_out', 'Paleontologist and biology professor. Since 2009 I have given {20+|more than 20} school talks, run Field Museum public programs, and worked with scout troops and camps.');

  add('exp', 'x_coe', '{Assistant Professor|Asst. Professor}, Coe College', '2023–present');
  add('exp', 'x_wvu', 'Assistant Professor, West Virginia University Institute of Technology', '2017–2023');
  add('exp', 'x_um', 'Postdoctoral researcher, University of Michigan', '2015–2017');

  add('edu', 'd_phd', 'Ph.D., Evolutionary Biology, University of Chicago', '2015');
  add('edu', 'd_bs', 'B.S., Geology (*magna cum laude*), Appalachian State University', '2010');

  add('teach', 't_coe', 'Coe College: Comparative Chordate Anatomy, Integrated Human Anatomy, Organismal & Ecological Biology, Cell & Molecular Biology, Topics in Evolution', '2023–present');
  add('teach', 't_anat', 'WVU Tech: Human Anatomy & Physiology I and II, Comparative Vertebrate Anatomy, Vertebrate Embryology', '2017–2022');
  add('teach', 't_evo', 'WVU Tech: Evolution, Paleobiology, Geology', '2018–2022');
  add('teach', 't_sem', '{First-year|Freshman} seminar, WVU Tech', '2019–2021');

  add('research', 'r_n', 'Selected from 19 journal articles (ORCID 0000-0002-8666-5825)');
  add('research', 'r_nat', 'Argentine fossil rewrites evolutionary history of a baffling dinosaur clade. *Nature*', '2026');
  add('research', 'r_feath', 'Feather evolution following flight loss in crown group birds: relaxed selection and developmental constraints. *Evolution*', '2025');
  add('research', 'r_cb', 'New giant carnivorous dinosaur reveals convergent evolutionary trends in theropod arm reduction. *Current Biology*', '2022');
  add('research', 'r_fb', 'fossilBAMM: A General Multiprocess Diversification Model for Paleontological and Molecular Phylogenetic Data. *Systematic Biology*', '2019');
  add('research', 'r_pp', 'Preservation is predictable: Quantifying the impact of taphonomic biases on ecological disparity in birds. *Paleobiology*', '2015');
  add('research', 'r_ext', 'Extant only comparative methods fail to recover the disparity preserved in the bird fossil record. *Evolution*', '2015');
  add('research', 'r_rspb', 'Low ecological disparity in Early Cretaceous birds. *Proceedings of the Royal Society B*', '2014');
  add('research', 'r_pnas', 'Late Cretaceous restructuring of dinosaur-bearing communities facilitated the End-Cretaceous mass extinction. *PNAS*', '2012');
  add('research', 'r_nw', 'Grooves to tubes: Evolution of the venom delivery system in a Late Triassic "reptile". *Naturwissenschaften*', '2010');


  add('outreach', 'o_20', '{Gave|Presented} over 20 talks in middle and high school classrooms, rural North Carolina and Chicago Public Schools', '2009–2015');
  add('outreach', 'o_aap', 'Ask-a-paleontologist visits to Chicago Public Schools kindergarten classes', '2010–2015');
  add('outreach', 'o_dozin', 'Dozin\' with the Dinos, Field Museum public outreach program', '2012–2015');
  add('outreach', 'o_bsa', '{Presented|Ran} the Geology Badge for Boy Scouts of America, Field Museum', '2013–2015');
  add('outreach', 'o_intern', 'Advised an undergraduate intern, Field Museum', '2014–2015');
  add('outreach', 'o_wild', '"Wild Wednesday" presenter, Garfield Park Conservatory, Chicago', '2014');
  add('outreach', 'o_stem', 'Camp STEM, WVU Tech', '2018, 2020');
  add('outreach', 'o_gs', 'Presenter for Girl Scouts of America', '2019');
  add('outreach', 'o_pod', '*The Final Ghouls* podcast interview', '2021');
  add('outreach', 'o_press', 'Covered by Business Insider, Nature News and National Geographic');

  add('field', 'f_mo', 'Missouri, Chronister Dinosaur Site (Campanian)', '2026');
  add('field', 'f_ut', 'Utah, Cedar Mountain Fm. (Early Cretaceous), five seasons', '2012–2021');
  add('field', 'f_wy', 'Wyoming, Green River Fm. (Eocene)', '2013–2014');
  add('field', 'f_ar', 'Argentina, Huincul Fm. (Early Cretaceous)', '2013–2014');
  add('field', 'f_tr', 'Arizona, New Mexico & Colorado, Chinle Fm. (Late Triassic), three seasons', '2007–2010');
  add('field', 'f_cl', 'Wyoming, Cloverly Fm. (Early Cretaceous)', '2008');
  add('field', 'f_nc', 'North Carolina, Newark Group, Pekin Fm. (Late Triassic)', '2008');

  add('service', 's_coe', 'Committee on Academic Persistence and Enrollment, Coe College', '2024–present');
  add('service', 's_leg', 'Legislative Committee, WVU Tech', '2020–2023');
  add('service', 's_fac', 'Faculty Evaluation Committee, WVU Tech', '2019, 2022');
  add('service', 's_dean', 'Dean\'s Council, Biological Sciences, University of Chicago', '2011–2015');
  add('service', 's_rev', '{Peer reviewer|Reviewer} for 13 journals, including *Paleobiology*, *Current Biology* and *Nature Communications*');
  add('service', 's_ws', 'Organized and ran a graduate programming workshop series, University of Chicago');
  add('service', 's_grant', 'UChicago Dean\'s Council Travel Grant Review Panel', '2012–2015');

  /* Three starting arrangements of the same lines. order lists every section; on lists what is on the page. */
  const PRESETS = {
    teach: {
      order: ['profile', 'teach', 'exp', 'edu', 'outreach', 'research', 'service', 'field'],
      on: {
        profile: ['p_teach'], teach: ['t_coe', 't_anat', 't_evo', 't_sem'], exp: ['x_coe', 'x_wvu', 'x_um'], edu: ['d_phd', 'd_bs'],
        outreach: ['o_20', 'o_bsa'], research: ['r_n', 'r_nat'], service: ['s_coe', 's_rev'],
      },
    },
    research: {
      order: ['profile', 'edu', 'research', 'exp', 'field', 'teach', 'service', 'outreach'],
      on: {
        profile: ['p_res'], edu: ['d_phd', 'd_bs'],
        research: ['r_n', 'r_nat', 'r_feath', 'r_cb', 'r_fb', 'r_pnas'],
        exp: ['x_coe', 'x_wvu', 'x_um'], field: ['f_mo'], service: ['s_rev'],
      },
    },
    outreach: {
      order: ['profile', 'outreach', 'exp', 'teach', 'edu', 'research', 'field', 'service'],
      on: {
        profile: ['p_out'], outreach: ['o_20', 'o_aap', 'o_dozin', 'o_bsa', 'o_wild', 'o_stem', 'o_gs', 'o_pod', 'o_press'],
        exp: ['x_coe', 'x_wvu', 'x_um'], teach: ['t_sem'], edu: ['d_phd', 'd_bs'], research: ['r_nat', 'r_nw'], field: ['f_mo'],
      },
    },
  };

  const api = { SECTIONS, RSECS, ENTRIES: E, PRESETS, SWAP: /\{([^{}|]+(?:\|[^{}|]+)+)\}/g };
  if (typeof module === 'object' && module.exports) module.exports = api; else root.CVData = api;
})(this);
