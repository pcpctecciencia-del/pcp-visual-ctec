/**
 * Cadastro de Formulas Quimicas e Vinculo Produto x Formula
 */
const FORMULAS= [
  {
    "name": "TEC CLOR PREMIUM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 49.75
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.2
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 20.0
      },
      {
        "material": "AMINA OXIDA 30% (EMB-MOX)",
        "pct": 0.03
      },
      {
        "material": "HIPOCLORITO DE SODIO 11%",
        "pct": 30.0
      }
    ]
  },
  {
    "name": "TEC CLOR",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 61.75
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.2
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 18.0
      },
      {
        "material": "AMINA OXIDA 30% (EMB-MOX)",
        "pct": 0.03
      },
      {
        "material": "HIPOCLORITO DE SODIO 11%",
        "pct": 20.0
      }
    ]
  },
  {
    "name": "TEC CID",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 70.11
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.3
      },
      {
        "material": "ALCOOL ETOXILADO PROPOXILADO C8-10 (TRITON DF-16)",
        "pct": 0.09
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 3.5
      },
      {
        "material": "ACIDO NITRICO 53%",
        "pct": 26.0
      }
    ]
  },
  {
    "name": "TEC OXI",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 38.0
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.0
      },
      {
        "material": "ACIDO ACETICO 80%",
        "pct": 28.0
      },
      {
        "material": "PEROXIDO DE HIDROGENIO 50%",
        "pct": 33.0
      }
    ]
  },
  {
    "name": "TEC CLOR FOAM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 74.23
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.2
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.5
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.57
      },
      {
        "material": "HIPOCLORITO DE SODIO 11%",
        "pct": 20.0
      },
      {
        "material": "AMINA OXIDA 30% (EMB-MOX)",
        "pct": 0.5
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 0.0
      }
    ]
  },
  {
    "name": "REMOLIMP ALCA",
    "status": "VARIAÇÃO",
    "base": "TEC CLOR FOAM",
    "note": "Água e Lauril diferentes; sal conforme análise.",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 74.72
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.2
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.5
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.08
      },
      {
        "material": "HIPOCLORITO DE SODIO 11%",
        "pct": 20.0
      },
      {
        "material": "AMINA OXIDA 30% (EMB-MOX)",
        "pct": 0.5
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 0.0
      }
    ]
  },
  {
    "name": "NEUTEC",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.605
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.45
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 4.0
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 5.0
      },
      {
        "material": "AMIDA 60%",
        "pct": 2.5
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.14
      },
      {
        "material": "HIDANTOINA DMDMH",
        "pct": 0.3
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.005
      }
    ]
  },
  {
    "name": "IODO BLOCK",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 79.01
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.12
      },
      {
        "material": "POVIDONA K30 (PVPK-30)",
        "pct": 0.4
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "POLIVINILPIROLIDONA IODO (PVPI)",
        "pct": 1.0
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 11.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.068
      },
      {
        "material": "IODO METALICO (PA)",
        "pct": 0.9
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 7.0
      }
    ]
  },
  {
    "name": "LEMON TEC",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 76.8
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 4.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 5.0
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 5.0
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.5
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "D-LIMONENO",
        "pct": 2.0
      },
      {
        "material": "ALCOOL GRAXO ETOXILADO C9-11",
        "pct": 4.0
      },
      {
        "material": "AMIDA 60%",
        "pct": 1.2
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.005
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 1.4
      }
    ]
  },
  {
    "name": "TEC TOWEL",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 56.16
      },
      {
        "material": "ACIDO DIPICOLINICO",
        "pct": 0.02
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.3
      },
      {
        "material": "BRANQUEADOR OPTICO",
        "pct": 0.02
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.0
      },
      {
        "material": "PEROXIDO DE HIDROGENIO 50%",
        "pct": 42.5
      }
    ]
  },
  {
    "name": "SUPREME CLEAN",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 43.5
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 5.0
      },
      {
        "material": "AMIDO DE MILHO",
        "pct": 1.0
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.5
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 50.0
      }
    ]
  },
  {
    "name": "REMOCAL",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 82.11
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.3
      },
      {
        "material": "ALCOOL ETOXILADO PROPOXILADO C8-10 (TRITON DF-16)",
        "pct": 0.09
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 3.5
      },
      {
        "material": "ACIDO NITRICO 53%",
        "pct": 14.0
      }
    ]
  },
  {
    "name": "REMOLIMP",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 88.127
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 2.023
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.0
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 6.5
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.35
      }
    ]
  },
  {
    "name": "TEC FOAM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 93.23
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 1.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.88
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.003
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.017
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.143
      }
    ]
  },
  {
    "name": "PEROXITEC",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 94.315
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 0.4
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 0.5
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 0.7
      },
      {
        "material": "PEROXIDO DE HIDROGENIO 50%",
        "pct": 1.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.95
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.005
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.0
      }
    ]
  },
  {
    "name": "TEC DIP PLUS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 85.033
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.2
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.5
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 9.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 0.5
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 2.0
      },
      {
        "material": "TRIGLICERIDES DO ACIDO CAPRICO CAPRILICO (MYRITOL)",
        "pct": 0.2
      },
      {
        "material": "EXTRATO DE PROPOLIS",
        "pct": 0.35
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.4
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.2
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.032
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.185
      }
    ]
  },
  {
    "name": "TEC SOLUTION",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 87.32
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.25
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.5
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 2.0
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% 1ªG.",
        "pct": 0.1
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.25
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 1.7
      },
      {
        "material": "AROMA TUTTI-FRUTI",
        "pct": 0.25
      },
      {
        "material": "CORANTE VERMELHO CR CI 45100",
        "pct": 0.03
      }
    ]
  },
  {
    "name": "TEC SOLUTION FOAM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 94.9493
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.04
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 0.7
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.95
      },
      {
        "material": "PEROXIDO DE HIDROGENIO 50%",
        "pct": 0.98
      },
      {
        "material": "AROMA TUTTI-FRUTI",
        "pct": 0.25
      },
      {
        "material": "CORANTE VERMELHO CR CI 45100",
        "pct": 0.0007
      }
    ]
  },
  {
    "name": "TEC PRO FILM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 87.77
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.1
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.5
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.5
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 2.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 0.5
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.11
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.35
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% 1ªG.",
        "pct": 0.1
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.2
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.15
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.125
      }
    ]
  },
  {
    "name": "TEC CASCO",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 91.43
      },
      {
        "material": "CLOREXIDINA 20%",
        "pct": 1.0
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% 1ªG.",
        "pct": 0.12
      },
      {
        "material": "CLORETO CETIL TRIMETIL AMONIO (DEHYQUART)",
        "pct": 0.4
      },
      {
        "material": "QUERATINA LIQUIDA",
        "pct": 0.5
      },
      {
        "material": "BIOTINA LIQUIDA",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 4.0
      },
      {
        "material": "BIGUANIDA 20% PHMB",
        "pct": 1.0
      },
      {
        "material": "HIDANTOINA DMDMH",
        "pct": 1.0
      },
      {
        "material": "CORANTE AZUL DE METILENO CI 52015",
        "pct": 0.05
      }
    ]
  },
  {
    "name": "PED CASCO",
    "status": "BASE",
    "base": "",
    "note": "Fórmula canônica do PED CASCO = antiga fórmula PED CASCO PLUS. GLOBO CASCO usa a mesma.",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 92.09
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% 1ªG.",
        "pct": 0.01
      },
      {
        "material": "BACQUAT ECO 80G",
        "pct": 2.5
      },
      {
        "material": "ALCOOL GRAXO ETOXILADO C9-11",
        "pct": 0.5
      },
      {
        "material": "HIDANTOINA DMDMH",
        "pct": 1.0
      },
      {
        "material": "FENOXYETANOL (CONSERV NOVAMIT)",
        "pct": 0.5
      },
      {
        "material": "BIGUANIDA 20% PHMB",
        "pct": 0.5
      },
      {
        "material": "AMIDA 60%",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "CORANTE AZUL DE METILENO CI 52015",
        "pct": 0.5
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.4
      }
    ]
  },
  {
    "name": "UMBISEC",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 45.33
      },
      {
        "material": "ALCOOL POLIVINILICO",
        "pct": 1.0
      },
      {
        "material": "CLOREXIDINA 20%",
        "pct": 1.0
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% / DDAC",
        "pct": 0.12
      },
      {
        "material": "BIGUANIDA 20% PHMB",
        "pct": 0.5
      },
      {
        "material": "HIDANTOINA DMDMH",
        "pct": 1.0
      },
      {
        "material": "FENOXYETANOL (CONSERV NOVAMIT)",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 50.0
      },
      {
        "material": "ALT AZUL CT 05",
        "pct": 0.05
      }
    ]
  },
  {
    "name": "ACTIVE FOAM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 88.84
      },
      {
        "material": "POVIDONA K30 (PVPK-30)",
        "pct": 0.12
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.1
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 0.8
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.55
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 3.2
      },
      {
        "material": "IODO METALICO (PA)",
        "pct": 0.24
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 2.0
      },
      {
        "material": "CORANTE CASTANHO CI 19140,16185,42090",
        "pct": 0.15
      }
    ]
  },
  {
    "name": "ACTIVE FILM PLUS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 83.68
      },
      {
        "material": "POVIDONA K30 (PVPK-30)",
        "pct": 0.15
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 2.0
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.68
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 9.5
      },
      {
        "material": "IODO METALICO (PA)",
        "pct": 0.24
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.1
      },
      {
        "material": "CORANTE CASTANHO CI 19140,16185,42090",
        "pct": 0.15
      }
    ]
  },
  {
    "name": "MASTIGREEN",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 84.89
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.1
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.2
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 8.0
      },
      {
        "material": "TRIGLICERIDES DO ACIDO CAPRICO CAPRILICO (MYRITOL)",
        "pct": 0.1
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 2.5
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 2.42
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.035
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.11
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.046
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "MASTIVAC",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 90.9
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "EDTA DISSODICO (PO)",
        "pct": 0.1
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 2.5
      },
      {
        "material": "COCO AMIDO PROPIL BETAINA",
        "pct": 1.0
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 2.5
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 1.9
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.005
      }
    ]
  },
  {
    "name": "MAMIVAC PLUS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 91.24
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.0072
      },
      {
        "material": "HIDROXIETILCELULOSE (NATROSOL)",
        "pct": 0.83
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.0
      },
      {
        "material": "CLOREXIDINA 20%",
        "pct": 0.8
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% 1ªG.",
        "pct": 0.12
      },
      {
        "material": "CORANTE AZUL DE METILENO CI 52015",
        "pct": 0.01
      }
    ]
  },
  {
    "name": "MAMILAC",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.47
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.07
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.2
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.5
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 2.5
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 2.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.11
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.1
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.1
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.15
      }
    ]
  },
  {
    "name": "MASTIVAC PREV",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 90.27
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "POVIDONA K30 (PVPK-30)",
        "pct": 0.12
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.1
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 3.2
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.02
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 0.8
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 2.0
      },
      {
        "material": "IODO METALICO (PA)",
        "pct": 0.24
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.0
      },
      {
        "material": "CORANTE CASTANHO CI 19140,16185,42090",
        "pct": 0.15
      }
    ]
  },
  {
    "name": "MAMIVAC ACTION",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.76
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "POVIDONA K30 (PVPK-30)",
        "pct": 0.15
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 9.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.1
      },
      {
        "material": "IODO METALICO (PA)",
        "pct": 0.24
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.0
      },
      {
        "material": "CORANTE CASTANHO CI 19140,16185,42090",
        "pct": 0.15
      }
    ]
  },
  {
    "name": "MASTIVAC OXI",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 92.315
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 2.07
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.18
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 1.0
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 0.7
      },
      {
        "material": "PEROXIDO DE HIDROGENIO 50%",
        "pct": 1.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.6
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.005
      }
    ]
  },
  {
    "name": "MAMIVAC ÁCIDO LÁTICO",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 71.63
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 10.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 10.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 7.6
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.042
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.025
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.1
      }
    ]
  },
  {
    "name": "ROBÔ TEC ALCA",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 39.8
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 60.0
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "ROBÔ TEC ACID",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 44.7
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.3
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 5.0
      },
      {
        "material": "ACIDO NITRICO 53%",
        "pct": 50.0
      },
      {
        "material": "ALCOOL ETOXILADO PROPOXILADO C8-10 (TRITON DF-16)",
        "pct": 0.0
      }
    ]
  },
  {
    "name": "ROBÔ TEC DIP",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 88.56
      },
      {
        "material": "HIDROXIETILCELULOSE (NATROSOL)",
        "pct": 0.02
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 0.4
      },
      {
        "material": "CLOREXIDINA 20%",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 8.0
      },
      {
        "material": "BACQUAT ECO 80G",
        "pct": 0.12
      },
      {
        "material": "CORANTE AZUL DE METILENO CI 52015",
        "pct": 0.004
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.9
      }
    ]
  },
  {
    "name": "ROBÔ TEC ACTIVE",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 85.77
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.1
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 9.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.0
      },
      {
        "material": "IODO METALICO (PA)",
        "pct": 0.24
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.0
      },
      {
        "material": "POVIDONA K30 (PVPK-30)",
        "pct": 0.12
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.67
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 0.1
      },
      {
        "material": "CITRATO DE SODIO",
        "pct": 0.0
      }
    ]
  },
  {
    "name": "AMINO DROP FLOWER",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 46.27
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "ACIDO BORICO - SOL. 17%",
        "pct": 5.88
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 3.0
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.6
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.4
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 7.5
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.0
      },
      {
        "material": "CLORETO DE CALCIO DIHIDRATADO - SOL.27%",
        "pct": 9.0
      },
      {
        "material": "CLORETO MAGNESIO HEXAHIDRATADO - SOL.8,5%",
        "pct": 22.0
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 2.5
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 1.25
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.5
      }
    ]
  },
  {
    "name": "AMINO DROP FORCE",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 56.335
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "UREIA 46%",
        "pct": 22.0
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.2
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 15.0
      },
      {
        "material": "ACIDO HUMICO",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.365
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 1.0
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.0
      }
    ]
  },
  {
    "name": "AMINO DROP FULL",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 59.5
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "AMINOACIDO L-CISTEINA MONO (PO)",
        "pct": 0.5
      },
      {
        "material": "QUELATO DE COBRE EDTA - SOL.13,8%",
        "pct": 5.5
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.4
      },
      {
        "material": "AMINOACIDO SUPRAMINO MATURACAO (PROD.3)",
        "pct": 30.0
      },
      {
        "material": "AMINOACIDO L-TRIPTOFANO",
        "pct": 2.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 1.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.5
      }
    ]
  },
  {
    "name": "AMINO DROP MATURATION",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 45.05
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "CARBONATO DE POTASSIO - SOL.67,9%",
        "pct": 30.0
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 1.5
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.25
      },
      {
        "material": "ACIDO ACETICO 80%",
        "pct": 2.0
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 1.0
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 5.0
      },
      {
        "material": "AMINOACIDO SUPRAMINO MATURACAO (PROD.3)",
        "pct": 10.0
      },
      {
        "material": "EXTRATO DE ALGAS",
        "pct": 0.6
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 1.0
      }
    ]
  },
  {
    "name": "AMINO DROP MN",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 69.8
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "ACIDO HUMICO",
        "pct": 0.2
      },
      {
        "material": "SULFATO DE MANGANES MONOHIDRATADO- SOL.31%",
        "pct": 26.5
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.4
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 3.0
      }
    ]
  },
  {
    "name": "AMINO DROP MULTI",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 36.5
      },
      {
        "material": "CLORETO MAGNESIO HEXAHIDRATADO - SOL.8,5%",
        "pct": 12.0
      },
      {
        "material": "SULFATO DE MANGANES MONOHIDRATADO- SOL.31%",
        "pct": 6.5
      },
      {
        "material": "CLORETO DE CALCIO DIHIDRATADO - SOL.27%",
        "pct": 1.0
      },
      {
        "material": "CLORETO DE POTASSIO - SOL.61%",
        "pct": 7.0
      },
      {
        "material": "CLORETO DE ZINCO ANIDRO - SOL.46%",
        "pct": 2.15
      },
      {
        "material": "ACIDO BORICO - SOL. 17%",
        "pct": 3.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 4.0
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 5.0
      },
      {
        "material": "UREIA 46%",
        "pct": 10.0
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.4
      },
      {
        "material": "SULFATO COBRE PENTAHIDRATADO - SOL.25%",
        "pct": 2.2
      },
      {
        "material": "SULFATO DE COBALTO HEPTAHIDRATADO - SOL.20%",
        "pct": 0.25
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 7.0
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 3.0
      }
    ]
  },
  {
    "name": "AMINO DROP NPLUS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 51.9
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "UREIA 46%",
        "pct": 45.0
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 2.0
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.00045
      }
    ]
  },
  {
    "name": "AMINO DROP PRECURSOR",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 68.7
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.3
      },
      {
        "material": "EXTRATO DE ALGAS",
        "pct": 6.0
      },
      {
        "material": "SULFATO DE MANGANES MONOHIDRATADO- SOL.31%",
        "pct": 13.0
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.3
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 10.0
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.7
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      }
    ]
  },
  {
    "name": "TEC SOIL COMOZINI",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 58.2
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.3
      },
      {
        "material": "EXTRATO DE ALGAS",
        "pct": 1.5
      },
      {
        "material": "SULFATO DE COBALTO HEPTAHIDRATADO - SOL.20%",
        "pct": 0.5
      },
      {
        "material": "SULFATO DE NIQUEL HEXAHIDRATADO - SOL.22%",
        "pct": 5.8
      },
      {
        "material": "CLORETO DE ZINCO ANIDRO - SOL.46%",
        "pct": 3.6
      },
      {
        "material": "AMINOACIDO SUPRAMINO ENRAIZAMENTO (PROD.3)",
        "pct": 15.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 1.2
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.5
      },
      {
        "material": "MOLIBDATO DE SODIO HIDRATADO - SOL.39%",
        "pct": 13.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.3
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.0
      }
    ]
  },
  {
    "name": "TEC SOIL ENRAIZ",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 63.75
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.3
      },
      {
        "material": "ACIDO HUMICO",
        "pct": 3.0
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.25
      },
      {
        "material": "AMINOACIDO SUPRAMINO ENRAIZAMENTO (PROD.3)",
        "pct": 30.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 1.2
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.5
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.0
      }
    ]
  },
  {
    "name": "SURFA DROP ADHESIVE",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 82.1
      },
      {
        "material": "UREIA 46%",
        "pct": 2.0
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.1
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.5
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.5
      },
      {
        "material": "ALCOOL GRAXO ETOXILADO C9-11",
        "pct": 8.0
      },
      {
        "material": "AMIDA 60%",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 4.0
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.5
      },
      {
        "material": "ANTIDERIVA (AD760-POLIOXIETILENO)",
        "pct": 0.7
      }
    ]
  },
  {
    "name": "SURFA DROP ACELERA FIX",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 77.45
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.93
      },
      {
        "material": "ALCOOL GRAXO ETOXILADO C9-11",
        "pct": 5.78
      },
      {
        "material": "D-LIMONENO",
        "pct": 2.5
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 1.93
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 0.39
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 0.77
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.04
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.0057
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.0057
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.2
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 8.0
      }
    ]
  },
  {
    "name": "SURFA DROP CONTROL",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 61.25
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "FOSFATO MONOSODICO (FM 100)",
        "pct": 0.8
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.6
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.25
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 1.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 5.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.5
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.5
      },
      {
        "material": "ANTIDERIVA (AG2003-TRIDECANOLETOXILENO)",
        "pct": 8.0
      },
      {
        "material": "CORANTE AMARELO ML CI 13065",
        "pct": 0.5
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 15.0
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 2.0
      }
    ]
  },
  {
    "name": "SURFA DROP D-LEMON",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 56.87
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 5.0
      },
      {
        "material": "ALCOOL GRAXO ETOXILADO C9-11",
        "pct": 15.0
      },
      {
        "material": "D-LIMONENO",
        "pct": 6.5
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 5.0
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 1.5
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 2.0
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.015
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.015
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 3.2
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 4.8
      }
    ]
  },
  {
    "name": "SURFA DROP FOAM OFF",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 84.393
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.3
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.3
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 15.0
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.0055
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.002
      }
    ]
  },
  {
    "name": "SURFA DROP NEUTROL",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 69.71
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.4
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 5.0
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.24
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.5
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 1.5
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.5
      },
      {
        "material": "ANTIDERIVA (AG2003-TRIDECANOLETOXILENO)",
        "pct": 15.0
      },
      {
        "material": "CORANTE VIOLETA KYG CI 42650",
        "pct": 0.05
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 2.0
      }
    ]
  },
  {
    "name": "TEC CLEAN TANK",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 69.247
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 3.5
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.0
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 12.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 1.5
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.0022
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 1.0
      },
      {
        "material": "D-LIMONENO",
        "pct": 2.5
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.001
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.25
      }
    ]
  },
  {
    "name": "PROTEVET FILM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 87.53
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.5
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.1
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 3.0
      },
      {
        "material": "EXTRATO GLICOILICO DE BABOSA (ALOE VERA)",
        "pct": 0.1
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.05
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.05
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.075
      }
    ]
  },
  {
    "name": "PROTEVET PRÉ FOAM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 91.79
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.2
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 3.0
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.88
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.0003
      }
    ]
  },
  {
    "name": "PROTEVET GREEN",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.36
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.05
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 8.0
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.1
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.25
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.05
      },
      {
        "material": "EXTRATO GLICOILICO DE BABOSA (ALOE VERA)",
        "pct": 0.1
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.046
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.042
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 3.0
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "FARMA GREEN PREMIUM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.6
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.1
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.2
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.3
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.04
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.18
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 3.0
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.03
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.05
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.3
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.4
      }
    ]
  },
  {
    "name": "PROTEX PÓS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.4
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.5
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.5
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.98
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 1.8
      },
      {
        "material": "FENOXYETANOL (CONSERV NOVAMIT)",
        "pct": 0.5
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.15
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.125
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.35
      }
    ]
  },
  {
    "name": "UBER PÓS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 87.25
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.2
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.0
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.2
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.98
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 1.8
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.7
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.035
      },
      {
        "material": "IPBC 30 DPG OMACIDE",
        "pct": 0.01
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.004
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.025
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "AMAMILK PRÉ DIPPING",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 92.75
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.2
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 2.0
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.316
      }
    ]
  },
  {
    "name": "AMAMILK PÓS DIPPING GREEN",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 88.21
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.05
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 2.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.6
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.035
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.046
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.161
      }
    ]
  },
  {
    "name": "AMAMILK PÓS DIPPING PREMIUM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 87.54
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.5
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 3.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.05
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.1
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.215
      }
    ]
  },
  {
    "name": "MART LACT GREEN",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 87.37
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.05
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.2
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 8.0
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.2
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.4
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.05
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.6
      },
      {
        "material": "TRIGLICERIDES DO ACIDO CAPRICO CAPRILICO (MYRITOL)",
        "pct": 0.1
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.046
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.042
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.14
      }
    ]
  },
  {
    "name": "MART LACT FOAM",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 93.09
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.2
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 0.5
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.6
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.88
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.0009
      }
    ]
  },
  {
    "name": "DERMACTIVE",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 93.49
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.2
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 0.5
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "EXTRATO GLICOILICO DE BABOSA (ALOE VERA)",
        "pct": 0.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.88
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.00045
      }
    ]
  },
  {
    "name": "BIOCARE",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 88.33
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.2
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 2.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.2
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.03
      },
      {
        "material": "EXTRATO GLICOILICO DE BABOSA (ALOE VERA)",
        "pct": 0.3
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.001
      },
      {
        "material": "CORANTE VERMELHO CR CI 45100",
        "pct": 0.04
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.3
      }
    ]
  },
  {
    "name": "BIOSOFT",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 88.14
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.5
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 2.5
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.1
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.06
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.1
      }
    ]
  },
  {
    "name": "DORUM PRÉ FOAM PLUS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 93.96965
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.9
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "PEROXIDO DE HIDROGENIO 50%",
        "pct": 1.0
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.00035
      }
    ]
  },
  {
    "name": "DORUM PÓS DIP",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.29
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 9.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 2.5
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.1
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.15
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.24
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% 1ªG.",
        "pct": 0.12
      }
    ]
  },
  {
    "name": "DORUM PÓS FILME PLUS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 83.839
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.2
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 9.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 5.0
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.001
      },
      {
        "material": "CORANTE VERMELHO CR CI 45100",
        "pct": 0.04
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% 1ªG.",
        "pct": 0.12
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "DORUM PÓS GEL",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 91.445
      },
      {
        "material": "HIDROXIETILCELULOSE (NATROSOL)",
        "pct": 0.83
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.0
      },
      {
        "material": "CLORETO DE BENZALCONIO 80% 1ªG.",
        "pct": 0.2
      },
      {
        "material": "CLOREXIDINA 20%",
        "pct": 0.5
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 0.0
      },
      {
        "material": "CORANTE AZUL DE METILENO CI 52015",
        "pct": 0.01
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.015
      }
    ]
  },
  {
    "name": "DORUM PÓS GREEN",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 83.25
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.05
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 9.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 5.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.3
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.05
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.05
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.05
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.2
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.35
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.1
      }
    ]
  },
  {
    "name": "DORUM PRÉ FORTY",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 92.38
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 2.41
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 1.5
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.3
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.00035
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.18
      }
    ]
  },
  {
    "name": "PRÉ BIGGER",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 94.22
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.03
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 1.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 1.0
      },
      {
        "material": "POLIGLUCOSIDEO (PLANTACARE 2000 UP)",
        "pct": 0.7
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 1.95
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.005
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.0
      }
    ]
  },
  {
    "name": "PÓS BIGGER",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.36
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 10.0
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.0
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.05
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.1
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.095
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "AMAMILK NEUTRO",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.25
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 5.0
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.42
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.5
      },
      {
        "material": "AMIDA 60%",
        "pct": 2.5
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.5
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.125
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.005
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 0.7
      }
    ]
  },
  {
    "name": "DORUM AMINO MIX",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 35.25
      },
      {
        "material": "EXTRATO DE ALGAS",
        "pct": 0.5
      },
      {
        "material": "CLORETO MAGNESIO HEXAHIDRATADO - SOL.8,5%",
        "pct": 12.0
      },
      {
        "material": "SULFATO DE MANGANES MONOHIDRATADO- SOL.31%",
        "pct": 8.5
      },
      {
        "material": "CLORETO DE CALCIO DIHIDRATADO - SOL.27%",
        "pct": 1.0
      },
      {
        "material": "CLORETO DE POTASSIO - SOL.61%",
        "pct": 3.5
      },
      {
        "material": "CLORETO DE ZINCO ANIDRO - SOL.46%",
        "pct": 6.0
      },
      {
        "material": "ACIDO BORICO - SOL. 17%",
        "pct": 4.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 5.0
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 10.0
      },
      {
        "material": "UREIA 46%",
        "pct": 5.0
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.3
      },
      {
        "material": "SULFATO COBRE PENTAHIDRATADO - SOL.25%",
        "pct": 2.2
      },
      {
        "material": "SULFATO DE COBALTO HEPTAHIDRATADO - SOL.20%",
        "pct": 0.25
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 3.5
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 3.0
      }
    ]
  },
  {
    "name": "DORUM MIX",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 52.38
      },
      {
        "material": "EXTRATO DE ALGAS",
        "pct": 0.12
      },
      {
        "material": "CLORETO MAGNESIO HEXAHIDRATADO - SOL.8,5%",
        "pct": 12.0
      },
      {
        "material": "SULFATO DE MANGANES MONOHIDRATADO- SOL.31%",
        "pct": 4.0
      },
      {
        "material": "CLORETO DE CALCIO DIHIDRATADO - SOL.27%",
        "pct": 1.0
      },
      {
        "material": "CLORETO DE POTASSIO - SOL.61%",
        "pct": 3.5
      },
      {
        "material": "CLORETO DE ZINCO ANIDRO - SOL.46%",
        "pct": 0.45
      },
      {
        "material": "ACIDO BORICO - SOL. 17%",
        "pct": 0.6
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 1.0
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 6.5
      },
      {
        "material": "UREIA 46%",
        "pct": 11.0
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.3
      },
      {
        "material": "SULFATO COBRE PENTAHIDRATADO - SOL.25%",
        "pct": 0.6
      },
      {
        "material": "SULFATO DE COBALTO HEPTAHIDRATADO - SOL.20%",
        "pct": 0.05
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 3.5
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 3.0
      }
    ]
  },
  {
    "name": "DORUM MATURAÇÃO",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 42.05
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "CARBONATO DE POTASSIO - SOL.67,9%",
        "pct": 23.0
      },
      {
        "material": "UREIA 46%",
        "pct": 6.6
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 1.5
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.25
      },
      {
        "material": "ACIDO ACETICO 80%",
        "pct": 2.0
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 5.0
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 5.0
      },
      {
        "material": "AMINOACIDO SUPRAMINO MATURACAO (PROD.3)",
        "pct": 10.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 1.0
      }
    ]
  },
  {
    "name": "DORUM ENRAIZAMENTO",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 80.15
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.3
      },
      {
        "material": "MOLIBDATO DE SODIO HIDRATADO - SOL.39%",
        "pct": 3.0
      },
      {
        "material": "CLORETO DE ZINCO ANIDRO - SOL.46%",
        "pct": 1.0
      },
      {
        "material": "ACIDO BORICO - SOL. 17%",
        "pct": 1.0
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.0
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.25
      },
      {
        "material": "EXTRATO DE ALGAS",
        "pct": 1.5
      },
      {
        "material": "SULFATO DE COBALTO HEPTAHIDRATADO - SOL.20%",
        "pct": 0.1
      },
      {
        "material": "AMINOACIDO SUPRAMINO ENRAIZAMENTO (PROD.3)",
        "pct": 10.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 1.2
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.5
      }
    ]
  },
  {
    "name": "TEC DIP PLUS EXPORTAÇÃO",
    "status": "VARIAÇÃO",
    "base": "TEC DIP PLUS",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 86.08
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.5
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.2
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 9.0
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.2
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 0.5
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.33
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "TRIGLICERIDES DO ACIDO CAPRICO CAPRILICO (MYRITOL)",
        "pct": 0.2
      },
      {
        "material": "EXTRATO DE PROPOLIS",
        "pct": 0.35
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.039
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "TEC PRO FILM EXPORTAÇÃO",
    "status": "VARIAÇÃO",
    "base": "TEC PRO FILM",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 88.28
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.5
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.5
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.2
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 0.5
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 0.4
      },
      {
        "material": "LACTATO DE SODIO 60% (PURASAL)",
        "pct": 1.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.5
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.1
      },
      {
        "material": "CORANTE VERMELHO ESCARLATE CI 22890",
        "pct": 0.15
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.125
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.05
      }
    ]
  },
  {
    "name": "GRAN SAFE N EXPORTAÇÃO",
    "status": "VARIAÇÃO",
    "base": "SURFA DROP CONTROL",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 61.05
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "FOSFATO MONOSODICO (FM 100)",
        "pct": 0.8
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.6
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 0.25
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 1.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 5.0
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.5
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.5
      },
      {
        "material": "ANTIDERIVA (AG2003-TRIDECANOLETOXILENO)",
        "pct": 8.0
      },
      {
        "material": "CORANTE AMARELO ML CI 13065",
        "pct": 0.5
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 2.0
      },
      {
        "material": "ACIDO FOSFORICO 85%",
        "pct": 15.0
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "GRAN PERFORMACCE N EXPORTAÇÃO",
    "status": "VARIAÇÃO",
    "base": "SURFA DROP NEUTROL",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 67.21
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "UREIA 46%",
        "pct": 2.3
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.4
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 5.0
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.24
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.5
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 1.5
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.5
      },
      {
        "material": "ANTIDERIVA (AG2003-TRIDECANOLETOXILENO)",
        "pct": 15.0
      },
      {
        "material": "CORANTE VIOLETA KYG CI 42650",
        "pct": 0.05
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 0.2
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 2.0
      }
    ]
  },
  {
    "name": "GRAN ORANGE N EXPORTAÇÃO",
    "status": "VARIAÇÃO",
    "base": "SURFA DROP D-LEMON",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 54.77
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 5.0
      },
      {
        "material": "ALCOOL GRAXO ETOXILADO C9-11",
        "pct": 15.0
      },
      {
        "material": "D-LIMONENO",
        "pct": 6.5
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 5.0
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 1.5
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 2.0
      },
      {
        "material": "UREIA 46%",
        "pct": 2.3
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.015
      },
      {
        "material": "CORANTE LARANJA CI 15510",
        "pct": 0.015
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 3.0
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 4.8
      }
    ]
  },
  {
    "name": "DROP MAX EFFICENCY N EXPORTAÇÃO",
    "status": "VARIAÇÃO",
    "base": "TEC CLEAN TANK",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 66.7468
      },
      {
        "material": "UREIA 46%",
        "pct": 2.3
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 3.5
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.0
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 12.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 1.5
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.0022
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 7.0
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 1.0
      },
      {
        "material": "D-LIMONENO",
        "pct": 2.5
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.001
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 0.25
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 0.2
      }
    ]
  },
  {
    "name": "AMINO DROP FLOWER EXPORTAÇÃO",
    "status": "VARIAÇÃO",
    "base": "AMINO DROP FLOWER",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 45.75
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "ACIDO BORICO - SOL. 17%",
        "pct": 6.0
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 2.4
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.0
      },
      {
        "material": "ACIDO CITRICO",
        "pct": 1.6
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.4
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 7.5
      },
      {
        "material": "CLORETO DE CALCIO DIHIDRATADO - SOL.27%",
        "pct": 9.0
      },
      {
        "material": "CLORETO MAGNESIO HEXAHIDRATADO - SOL.8,5%",
        "pct": 22.0
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 2.5
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 1.25
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.5
      }
    ]
  },
  {
    "name": "DORUM FORCE",
    "status": "VARIAÇÃO",
    "base": "AMINO DROP FORCE",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 49.635
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "SULFATO DE MANGANES MONOHIDRATADO- SOL.31%",
        "pct": 8.5
      },
      {
        "material": "UREIA 46%",
        "pct": 22.0
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.2
      },
      {
        "material": "AMINOACIDO FERAMI AA20 (PROD.3)",
        "pct": 15.0
      },
      {
        "material": "ACIDO HUMICO",
        "pct": 0.2
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 3.365
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 1.0
      }
    ]
  },
  {
    "name": "DORUM NEUTRAL",
    "status": "VARIAÇÃO",
    "base": "SURFA DROP NEUTROL",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 69.737
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.4
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 5.0
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 1.2
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.5
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 1.5
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.5
      },
      {
        "material": "ANTIDERIVA (AG2003-TRIDECANOLETOXILENO)",
        "pct": 15.0
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.06
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.003
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 2.0
      }
    ]
  },
  {
    "name": "DORUM CITRUS",
    "status": "VARIAÇÃO",
    "base": "SURFA DROP D-LEMON",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 69.41
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.25
      },
      {
        "material": "ALCOOL GRAXO ETOXILADO C9-11",
        "pct": 9.75
      },
      {
        "material": "D-LIMONENO",
        "pct": 4.23
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 3.25
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 0.65
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.3
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.07
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.01
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 2.08
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 6.0
      }
    ]
  },
  {
    "name": "DORUM CITRUS PLUS",
    "status": "VARIAÇÃO",
    "base": "DORUM CITRUS",
    "note": "Produto novo no cadastro de engenharia; não constava na lista mestre original.",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 69.14
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 3.25
      },
      {
        "material": "ALCOOL GRAXO ETOXILADO C9-11",
        "pct": 9.75
      },
      {
        "material": "D-LIMONENO",
        "pct": 4.5
      },
      {
        "material": "ACIDO SULFONICO 90%",
        "pct": 3.25
      },
      {
        "material": "ANTIESPUMA SILICONE (SILFOAM SE 39)",
        "pct": 0.65
      },
      {
        "material": "ACIDO ETIDRONICO (SEQUEST HEDP EXTRA)",
        "pct": 1.3
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.07
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.01
      },
      {
        "material": "HIDROXIDO DE SODIO 50% (SODA CAUSTICA)",
        "pct": 2.08
      },
      {
        "material": "CLORETO DE SODIO (SAL)",
        "pct": 6.0
      }
    ]
  },
  {
    "name": "DORUM REDUX PH",
    "status": "PENDENTE",
    "base": "",
    "note": "Fórmula deixada em aberto pelo usuário.",
    "pending": true,
    "components": []
  },
  {
    "name": "DERMA PÓS",
    "status": "BASE",
    "base": "",
    "note": "",
    "pending": false,
    "components": [
      {
        "material": "AGUA",
        "pct": 85.42
      },
      {
        "material": "ISOTIAZOLINONAS MISTURA (CONSERVE CX)",
        "pct": 0.1
      },
      {
        "material": "DIOXIDO DE TITANIO (BRANQUEADOR)",
        "pct": 0.2
      },
      {
        "material": "BENTONITA SODICA",
        "pct": 0.5
      },
      {
        "material": "GOMA XANTANA MESH 200",
        "pct": 0.5
      },
      {
        "material": "GLICERINA BIDESTILADA VEGETAL",
        "pct": 8.0
      },
      {
        "material": "TRICLOROCALBANILIDA (TCC BIO)",
        "pct": 0.2
      },
      {
        "material": "ALCOOL ETILICO GL 96",
        "pct": 0.7
      },
      {
        "material": "ACIDO SALICILICO",
        "pct": 0.15
      },
      {
        "material": "ACIDO LATICO 85%",
        "pct": 1.98
      },
      {
        "material": "L-MENTOL FLOCOS",
        "pct": 0.035
      },
      {
        "material": "CORANTE AZUL CB CI 42090",
        "pct": 0.032
      },
      {
        "material": "CORANTE AMARELO 23 CI 19140",
        "pct": 0.185
      },
      {
        "material": "LAURIL ETER SULFATO DE SODIO 70% (TEXAPON/LESS)",
        "pct": 0.2
      },
      {
        "material": "DIETANOLAMINA 85%",
        "pct": 1.8
      }
    ]
  }
];

const PROD_FORMULA= [
  {
    "product": "Iodo Block",
    "formula": "IODO BLOCK",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Lemon Tec",
    "formula": "LEMON TEC",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Neutec",
    "formula": "NEUTEC",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tablete Clor",
    "formula": "",
    "relation": "SEM FÓRMULA",
    "note": "Somente rotulagem — não passa pelo tanque/mistura.",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Cid",
    "formula": "TEC CID",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Clor Foam",
    "formula": "TEC CLOR FOAM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Clor Premium",
    "formula": "TEC CLOR PREMIUM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Clor",
    "formula": "TEC CLOR",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Oxi",
    "formula": "TEC OXI",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Towel",
    "formula": "TEC TOWEL",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Robô Tec Acid",
    "formula": "ROBÔ TEC ACID",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Robô Tec Alca",
    "formula": "ROBÔ TEC ALCA",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Neutec Exportação",
    "formula": "NEUTEC",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Cid Exportação",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Clor Foam Exportação",
    "formula": "TEC CLOR FOAM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Clor Premium Exportação",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Oxi Exportação",
    "formula": "TEC OXI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Mami Iodo",
    "formula": "IODO BLOCK",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Remobac",
    "formula": "TEC OXI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Remocal",
    "formula": "REMOCAL",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Remocal Premium",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Remograx",
    "formula": "TEC CLOR",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Remograx Premium",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Remolimp",
    "formula": "REMOLIMP",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Remolimp Alca",
    "formula": "REMOLIMP ALCA",
    "relation": "VARIAÇÃO",
    "note": "Água e Lauril diferentes; sal conforme análise.",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Protevet Ácido",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Protevet Alcalino",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Protevet Alcafoam",
    "formula": "TEC CLOR FOAM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Maxfilm",
    "formula": "IODO BLOCK",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Neuvet",
    "formula": "NEUTEC",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Oxyvet",
    "formula": "TEC OXI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Vet Cid",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Vet Clor",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Acid Dorum",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Clor Premium Dorum",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Iodo Pro Dorum",
    "formula": "IODO BLOCK",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Neutro Dorum",
    "formula": "NEUTEC",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Dorum Peracid Oxi",
    "formula": "TEC OXI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Acid Force",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Alca Force",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Amamilk Ácido",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Amamilk Alcalino",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Amamilk Neutro",
    "formula": "AMAMILK NEUTRO",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Amamilk Sani",
    "formula": "TEC OXI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Alcamart",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "MartCid",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "MartClor Foam",
    "formula": "TEC CLOR FOAM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "MartSani Power",
    "formula": "TEC OXI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Prime Acid",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Prime Barrier",
    "formula": "IODO BLOCK",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Prime Clor",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Prime Sani",
    "formula": "TEC OXI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Supreme Clean",
    "formula": "SUPREME CLEAN",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Acid Ultra Premium",
    "formula": "TEC CID",
    "relation": "IGUAL",
    "note": "Marca terceirizada ANVISA — fabricação interna.",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Alca Ultra Premium",
    "formula": "TEC CLOR PREMIUM",
    "relation": "IGUAL",
    "note": "Marca terceirizada ANVISA — fabricação interna.",
    "active": true,
    "line": "ANVISA"
  },
  {
    "product": "Tec Dip Plus",
    "formula": "TEC DIP PLUS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Tec Dip Plus Exportação",
    "formula": "TEC DIP PLUS EXPORTAÇÃO",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Tec Foam",
    "formula": "TEC FOAM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Peroxitec",
    "formula": "PEROXITEC",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Peroxitec Exportação",
    "formula": "PEROXITEC",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Tec Pro Film",
    "formula": "TEC PRO FILM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Tec Pro Film Exportação",
    "formula": "TEC PRO FILM EXPORTAÇÃO",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Tec Solution",
    "formula": "TEC SOLUTION",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Tec Solution Foam",
    "formula": "TEC SOLUTION FOAM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Active Film",
    "formula": "",
    "relation": "DESCONTINUADO",
    "note": "Produto descontinuado; manter ACTIVE FILM PLUS.",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Active Foam",
    "formula": "ACTIVE FOAM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Tec Casco",
    "formula": "TEC CASCO",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Ped Casco",
    "formula": "PED CASCO",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Robô Tec Dip",
    "formula": "ROBÔ TEC DIP",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Robô Tec Active",
    "formula": "ROBÔ TEC ACTIVE",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Active Film Plus",
    "formula": "ACTIVE FILM PLUS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Umbisec",
    "formula": "UMBISEC",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Active Film Plus Exportação",
    "formula": "ACTIVE FILM PLUS",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Ped Casco Plus",
    "formula": "PED CASCO",
    "relation": "DESCONSIDERADO",
    "note": "Nome desconsiderado; PED CASCO usa a antiga fórmula PED CASCO PLUS.",
    "active": false,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mastigreen",
    "formula": "MASTIGREEN",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mamivac Plus",
    "formula": "MAMIVAC PLUS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mastivac",
    "formula": "MASTIVAC",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mastivac Oxi",
    "formula": "MASTIVAC OXI",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mamilac",
    "formula": "MAMILAC",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Globo Casco",
    "formula": "PED CASCO",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mastivac Prev",
    "formula": "MASTIVAC PREV",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mamivac Action",
    "formula": "MAMIVAC ACTION",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Protevet Film",
    "formula": "PROTEVET FILM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Protevet Pré Foam",
    "formula": "PROTEVET PRÉ FOAM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Protevet Green",
    "formula": "PROTEVET GREEN",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Biosoft",
    "formula": "BIOSOFT",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Biocare",
    "formula": "BIOCARE",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Dermactive",
    "formula": "DERMACTIVE",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Pós Dip",
    "formula": "DORUM PÓS DIP",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Pós Film Plus",
    "formula": "DORUM PÓS FILME PLUS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Pós Gel",
    "formula": "DORUM PÓS GEL",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Pós Green",
    "formula": "DORUM PÓS GREEN",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Pré Foam Plus",
    "formula": "DORUM PRÉ FOAM PLUS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Pré Forty",
    "formula": "DORUM PRÉ FORTY",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Pós Bigger",
    "formula": "PÓS BIGGER",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Pré Bigger",
    "formula": "PRÉ BIGGER",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Farma Green Premium",
    "formula": "FARMA GREEN PREMIUM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mart Lact Green",
    "formula": "MART LACT GREEN",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Mart Lact Foam",
    "formula": "MART LACT FOAM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Amamilk Pós Dipping Premium",
    "formula": "AMAMILK PÓS DIPPING PREMIUM",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Amamilk Pós Dipping Green",
    "formula": "AMAMILK PÓS DIPPING GREEN",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Amamilk Pré Dipping",
    "formula": "AMAMILK PRÉ DIPPING",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Uber Pré",
    "formula": "PEROXITEC",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Uber Pós",
    "formula": "UBER PÓS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Derma Pós",
    "formula": "DERMA PÓS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Protex Pós",
    "formula": "PROTEX PÓS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA VETERINÁRIO"
  },
  {
    "product": "Amino Drop Force",
    "formula": "AMINO DROP FORCE",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Flower",
    "formula": "AMINO DROP FLOWER",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Full",
    "formula": "AMINO DROP FULL",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Maturation",
    "formula": "AMINO DROP MATURATION",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Precursor",
    "formula": "AMINO DROP PRECURSOR",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Tec Soil Enraiz",
    "formula": "TEC SOIL ENRAIZ",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Nplus",
    "formula": "AMINO DROP NPLUS",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Multi",
    "formula": "AMINO DROP MULTI",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Mn",
    "formula": "AMINO DROP MN",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Tec Soil Comozini",
    "formula": "TEC SOIL COMOZINI",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Gran Performacce N EXPORTAÇÃO",
    "formula": "GRAN PERFORMACCE N EXPORTAÇÃO",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Gran Safe N EXPORTAÇÃO",
    "formula": "GRAN SAFE N EXPORTAÇÃO",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Gran Orange N EXPORTAÇÃO",
    "formula": "GRAN ORANGE N EXPORTAÇÃO",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Drop Max Efficency N EXPORTAÇÃO",
    "formula": "DROP MAX EFFICENCY N EXPORTAÇÃO",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Force EXPORTAÇÃO",
    "formula": "AMINO DROP FORCE",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Flower EXPORTAÇÃO",
    "formula": "AMINO DROP FLOWER EXPORTAÇÃO",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Full EXPORTAÇÃO",
    "formula": "AMINO DROP FULL",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Maturation EXPORTAÇÃO",
    "formula": "AMINO DROP MATURATION",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Precursor EXPORTAÇÃO",
    "formula": "AMINO DROP PRECURSOR",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Tec Soil Enraiz EXPORTAÇÃO",
    "formula": "TEC SOIL ENRAIZ",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Nplus EXPORTAÇÃO",
    "formula": "AMINO DROP NPLUS",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Multi EXPORTAÇÃO",
    "formula": "AMINO DROP MULTI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Amino Drop Mn EXPORTAÇÃO",
    "formula": "AMINO DROP MN",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "DORUM AMINO MIX",
    "formula": "DORUM AMINO MIX",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "DORUM MIX",
    "formula": "DORUM MIX",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "DORUM MATURAÇÃO",
    "formula": "DORUM MATURAÇÃO",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "DORUM FORCE",
    "formula": "DORUM FORCE",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "DORUM ENRAIZAMENTO",
    "formula": "DORUM ENRAIZAMENTO",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA FERTILIZANTES"
  },
  {
    "product": "Tec Clean Tank",
    "formula": "TEC CLEAN TANK",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Surfa Drop Desaloj",
    "formula": "",
    "relation": "SEM FÓRMULA",
    "note": "Envase + rotulagem — produto pronto, sem mistura.",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Surfa drop Control",
    "formula": "SURFA DROP CONTROL",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Surfa drop adhesive",
    "formula": "SURFA DROP ADHESIVE",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Surfa drop d-lemon",
    "formula": "SURFA DROP D-LEMON",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Sani drop oxi",
    "formula": "TEC OXI",
    "relation": "IGUAL",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Tec Soil Bac",
    "formula": "",
    "relation": "SEM FÓRMULA",
    "note": "Envase + rotulagem — produto pronto, sem mistura.",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Tec Bio Destroy",
    "formula": "",
    "relation": "SEM FÓRMULA",
    "note": "Envase + rotulagem — produto pronto, sem mistura.",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Surfa drop Foam Off",
    "formula": "SURFA DROP FOAM OFF",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Surfa Drop Neutrol",
    "formula": "SURFA DROP NEUTROL",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Tec Soil Liquibac",
    "formula": "",
    "relation": "SEM FÓRMULA",
    "note": "Somente rotulagem — revenda, sem mistura.",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "Surfa Drop Acelera Fix",
    "formula": "SURFA DROP ACELERA FIX",
    "relation": "BASE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "DORUM CITRUS",
    "formula": "DORUM CITRUS",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "DORUM NEUTRAL",
    "formula": "DORUM NEUTRAL",
    "relation": "VARIAÇÃO",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "DORUM REDUX PH",
    "formula": "DORUM REDUX PH",
    "relation": "PENDENTE",
    "note": "",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  },
  {
    "product": "DORUM CITRUS PLUS",
    "formula": "DORUM CITRUS PLUS",
    "relation": "VARIAÇÃO",
    "note": "Novo produto informado pelo usuário; variação do DORUM CITRUS.",
    "active": true,
    "line": "MAPA AGRÍCOLA ADJUVANTES"
  }
];
