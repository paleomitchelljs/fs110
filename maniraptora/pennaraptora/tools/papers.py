"""Paper keys used across the tools. PDFs live in ../papers/ (gitignored); notes in ../notes/."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
PAPERS = os.path.join(HERE, '..', 'papers')
P = {
    # groups and anatomy
    'xn04':  'xu2004.pdf',                                   # Xu & Norell 2004, Mei long
    'gao12': 'meilong2.pdf',                                 # Gao et al. 2012, second Mei
    'lu15':  '10.1038@srep11775.pdf',                        # Lü & Brusatte 2015, Zhenyuanlong
    'nov09': 'CONICET_Digital_Nro.1ff24baa-b5aa-44f0-bf40-0645ee8d819c_A.pdf',  # Novas et al. 2009, Austroraptor
    'zhe10': 'zheng2009.pdf',                                # Zheng et al. 2010, Tianyuraptor
    'xu11l': 'ponetrood.pdf',                                # Xu et al. 2011, Linhevenator
    'poust20': 'poust2020.pdf',                              # Poust et al. 2020, Wulong
    'xu15':  'Xuetal2015Yiqi.pdf',                           # Xu et al. 2015, Yi
    'xu17':  'ncomms14972.pdf',                              # Xu et al. 2017, Jianianhualong
    'xu23':  'A-new-avialan-theropod-from-an-emerging-Jurassic-terrestrial-fauna.pdf',  # Xu et al. 2023, Fujianvenator
    'oc25a': 'Chicago-Archaeopteryx-informs-on-the-early-evolution-of-the-avian-bauplan.pdf',  # O'Connor et al. 2025, Archaeopteryx
    'bin25': '460.pdf',                                      # Bindellini et al. 2025, Velociraptor
    # phylogeny and the bird line
    'xia11': 'An_Archaeopteryx-like_theropod_from_China_and_the_.pdf',  # Xu et al. 2011, Xiaotingia
    'bru14': 'PIIS0960982214010471.pdf',                     # Brusatte et al. 2014
    'lee14': 'Leeetal.2014sustainedminiaturizationandanatomicalinnovationinthedinosaurianancestryofbirds.pdf',  # Lee et al. 2014
    'har19': 'hartman2019.pdf',                              # Hartman et al. 2019, Hesperornithoides
    'pei20': 'PIIS0960982220309994.pdf',                     # Pei et al. 2020
    # behavior
    'fun16': 'srep35782.pdf',                                # Funston et al. 2016, Avimimus bonebed
    'fre20': '10172318.pdf',                                 # Frederickson et al. 2020, Deinonychus isotopes
    'per14': 'app.2012.0093.pdf',                            # Persons et al. 2014, oviraptorosaur tails
    'li10':  'Li-et-al-2010-Science.pdf',                    # Li et al. 2010, Anchiornis color
    'cla26': 'journal.pone.0347641.pdf',                     # Clark et al. 2026, Plumadraco
    'fan26': 'Biological Reviews - 2026 - Fan - Diet of bird‐like troodontid dinosaurs  synthesis of a contentious clade.pdf',  # Fan et al. 2026
    'ma20':  'jevbio0178.pdf',                               # Ma et al. 2020, oviraptorosaur skulls
    # reproduction
    'bi21':  'Bi et al. accepted.pdf',                       # Bi et al. 2021, adult on embryo clutch
    'jin20': 'jin2019.pdf',                                  # Jin et al. 2020, adult with eggs, Jiangxi
    'var02': 'varricchio2002.pdf',                           # Varricchio et al. 2002, Troodon embryos
    'zel08': 'Palaeontology - 2008 - ZELENITSKY - PHYLOGENETIC ANALYSIS OF REPRODUCTIVE TRAITS OF MANIRAPTORAN THEROPODS AND ITS.pdf',
    'tan15': 'tanaka2015.pdf',                               # Tanaka et al. 2015, porosity
    'vj16':  'auk0654.pdf',                                  # Varricchio & Jackson 2016
    'wie17': 'peerj-3706.pdf',                               # Wiemann et al. 2017, egg color
    'tan18': 'rsbl20180135.pdf',                             # Tanaka et al. 2018, clutch size
    'var18': 's41598-018-30085-6.pdf',                       # Varricchio et al. 2018, incubation
    'yan19': 'yang2019.pdf',                                 # Yang et al. 2019, hatching asynchrony
    'hog23': 'rstb.2022.0144.pdf',                           # Hogan & Varricchio 2023
    # feathers and flight
    'tal18': 's41598-018-35966-4.pdf',                       # Talori et al. 2018, Caudipteryx
    'dec16': 'peerj-2159.pdf',                               # Dececchi et al. 2016, WAIR
    'dec20': 'dececchi2020.pdf',                             # Dececchi et al. 2020, Yi gliding
    'voe18': 'voeten2018.pdf',                               # Voeten et al. 2018, Archaeopteryx bones
    'kia24': 'kiat-oconnor2024.pdf',                         # Kiat & O'Connor 2024, feathers
    'wu24':  'pectoral2024.pdf',                             # Wu et al. 2024, shoulder girdle
    # brains
    'bal13': '075_Balanoff_et_al_Brains_2013.pdf',           # Balanoff et al. 2013
    'tor21': 'torres2021.pdf',                               # Torres et al. 2021
    'bro25': 'Neuroanatomical-convergence-between-pterosaurs-and-non-avian-paravians-in-the-evolution-of.pdf',  # Bronzati et al. 2025
}
def pdf(key):
    return os.path.join(PAPERS, P[key])
