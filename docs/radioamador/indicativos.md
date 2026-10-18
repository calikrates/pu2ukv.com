---
hide:
  - toc
---

# Consulta de indicativos

Digite um indicativo para ver **o que ele diz sobre a estação** — classe, estado ou região, se é efetivo, especial ou de ilha oceânica — e abrir os perfis do operador nas principais bases de radioamadorismo.

{{ consulta_indicativo }}

!!! info "Por que o nome do operador não aparece aqui?"
    A Anatel **não tem consulta pública** de titulares: o sistema dela (MOSAICO › MMAR) exige login gov.br, consulta um indicativo por vez e só informa se ele está **vago ou ocupado** — sem mostrar quem é o titular. Por isso nome, cidade e QSL vêm de bases onde o próprio radioamador se cadastra, como **QRZ.com** e **HamQTH**. Se o colega não se cadastrou, não haverá perfil.

## Como ler um indicativo brasileiro

Pelas regras atuais da Anatel ([Ato nº 3448/2026](https://informacoes.anatel.gov.br/legislacao/atos-de-requisitos-operacionais-de-outorga-e-licenciamento/2148-ato-3448-26)):

| Tipo | Formato | Exemplo |
|---|---|---|
| **Classe C** | `PU` + dígito da região + 3 letras (em SP também `PV2`) | PU2UKV |
| **Classes A e B** | prefixo da UF + dígito + 2 ou 3 letras | PY2AA · PY2ABC |
| **Ilhas oceânicas e Antártica** | `PY0` / `PU0` + letra do local (F, M, R, S, T, A) | PY0F… (Fernando de Noronha) |
| **Especial (eventos)** | séries `ZV`–`ZZ` ou `PP`–`PX` reservadas, até 10 caracteres | ZW2… |
| **Estrangeiro licenciado no Brasil** | prefixo da UF + sufixo de 3 letras iniciado por `Z` | PY2Z… |

### Prefixos das classes A e B por estado

| Região | Estados e prefixos |
|---|---|
| **1** | RJ `PY1` · ES `PP1` |
| **2** | SP `PY2` `PR2` · DF `PT2` · GO `PP2` · TO `PQ2` |
| **3** | RS `PY3` |
| **4** | MG `PY4` |
| **5** | PR `PY5` · SC `PP5` |
| **6** | BA `PY6` · SE `PP6` |
| **7** | PE `PY7` · AL `PP7` · PB `PR7` · RN `PS7` · CE `PT7` |
| **8** | PA `PY8` · AM `PP8` · AP `PQ8` · MA `PR8` · PI `PS8` · AC `PT8` · RR `PV8` · RO `PW8` |
| **9** | MT `PY9` · MS `PT9` |

Na **classe C** todos usam `PU` + o dígito da região — por isso um `PU2` pode ser de SP, DF, GO ou TO. A UF exata depende da faixa do sufixo.

!!! tip "Quer saber se um indicativo está vago?"
    Entre em [apps.anatel.gov.br/acesso](https://apps.anatel.gov.br/acesso/) com sua conta gov.br › **MOSAICO** › **MMAR Licenciamento de Radioamador** › *Opções* › **Consulta de Indicativo**.
