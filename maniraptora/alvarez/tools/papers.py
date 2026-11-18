"""Paper keys used across the tools. PDFs live in ../papers/ (gitignored)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
PAPERS = os.path.join(HERE, '..', 'papers')
P = {
    'mak26': '2026_Makovickyetal.pdf',                    # Makovicky et al. 2026 Nature, Alnashetri
    'qin21': '1-s2.0-S0960982221008083-mainext.pdf',      # Qin et al. 2021 Curr Biol, miniaturization
    'xu18':  'PIIS0960982218309874.pdf',                  # Xu et al. 2018 Curr Biol, Bannykus & Xiyunykus
    'xu11':  'pnas.201011052.pdf',                        # Xu et al. 2011 PNAS, Linhenykus
    'cho10': 'science.1182143.pdf',                       # Choiniere et al. 2010 Science, Haplocheirus
    'lon09': '1-s2.0-S0195667108000943-main.pdf',         # Longrich & Currie 2009 Cret Res, Albertonykus
    'lu18':  '1-s2.0-S2096519219300047-main.pdf',         # Lü et al. 2018 China Geology, Qiupanykus
    'lee19': 's41598-019-52021-y.pdf',                    # Lee et al. 2019 Sci Rep, Nemegtonykus
}
def pdf(key):
    return os.path.join(PAPERS, P[key])
