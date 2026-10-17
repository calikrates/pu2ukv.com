# Programar o HT na repetidora

Para acessar uma repetidora você precisa de **três informações**, todas na [tabela de repetidoras](repetidoras.md):

| O quê | Exemplo | Para que serve |
|---|---|---|
| **Frequência de saída** | 146.610 MHz | É onde você escuta |
| **Offset (shift)** | −0,6 MHz | O rádio transmite deslocado: 146.010 MHz |
| **Tom CTCSS** | 123.0 Hz | "Chave" que abre a repetidora |

## Passo a passo (vale para quase todo HT)

1. **Modo VFO** — saia do modo memória/canal.
2. **Digite a frequência de saída** — ex.: `146.610`.
3. **Ajuste o offset** — direção (`−` ou `+`) e valor (`0.600` em VHF, `5.000` em UHF).
4. **Ative o tom de TX** — CTCSS / "T" / "TONE" com o valor da tabela (ex.: `123.0`).
5. **Teste** — aperte o PTT, identifique-se com o indicativo e solte. Se ouvir o "rabicho" (cauda) da repetidora, abriu.
6. **Salve na memória** — dê um nome curto (ex.: `ITAPEC`).

## Padrões de offset no Brasil

| Faixa | Saída | Offset |
|---|---|---|
| VHF 2 m | 145,2 – 145,5 MHz | −0,6 MHz |
| VHF 2 m | 146,6 – 146,99 MHz | −0,6 MHz |
| VHF 2 m | 147,0 – 147,39 MHz | +0,6 MHz |
| UHF 70 cm | 438 – 440 MHz | −5 MHz |

## Não abriu? Confira

- [ ] Offset na direção certa (`−` x `+`)
- [ ] Tom correto e ativado no **TX** (o "T", não só o "TSQL")
- [ ] Potência em alta para teste
- [ ] Antena original ou melhor — antena "borrachinha" curta perde muito
- [ ] Repetidora no ar? Escute alguns minutos antes

!!! tip "CHIRP"
    Para programar muitos canais de uma vez pelo computador, use o **CHIRP** (gratuito, suporta a maioria dos HTs). O CSV de repetidoras deste site serve de base.
