# Frequências de emergência

Quando o celular cai — enchente, serra sem sinal, apagão —, saber **onde escutar e onde chamar** faz diferença. Aqui estão as frequências de emergência do radioamadorismo no Brasil e de outros serviços que vale a pena conhecer.

!!! danger "Primeiro, os telefones"
    Se houver sinal, **ligue antes de tudo**: **193** Bombeiros · **192** SAMU · **190** Polícia Militar · **199** Defesa Civil · **191** PRF (rodovias federais).

## A frequência para gravar no HT hoje

<div class="ficha" markdown>

| | |
|---|---|
| **146.520 MHz · FM simplex** | Frequência nacional de chamada e a **principal frequência de emergência em VHF** (LABRE). |
| **DMR · TG 724193** | Talk group de coordenação de emergência, quando disponível nas redes. |

</div>

Foi em **146.520** que radioamadores montaram uma rede rádio-a-rádio nas **enchentes do RS em maio de 2024**, quando a maioria das repetidoras ficou sem energia. Em 2025, Anatel, LABRE-RS e Defesa Civil assinaram um protocolo para a próxima vez.

!!! tip "Por que simplex"
    Em desastre, **repetidora depende de energia e de torre** — e são as primeiras coisas a cair. Simplex funciona rádio a rádio, sem infraestrutura. Por isso a frequência de emergência é simplex.

## Radioamador — VHF e UHF

<div class="tabela-livre" markdown>

| Frequência | Modo | Uso |
|---|---|---|
| **146.520 MHz** | FM simplex | Chamada nacional e emergência — escuta prioritária |
| **439.000 MHz** | FM | RENER em UHF (simplex e repetidoras) |
| **145.100 MHz** | Digital | RENER — modos digitais em VHF |
| **TG 724193** | DMR | Coordenação de emergência (BrandMeister) |

</div>

[:material-download: Canais de emergência para CHIRP (CSV)](../assets/arquivos/emergencia-chirp.csv){ .md-button }

O arquivo grava 146.520, 439.000 e o canal 16 marítimo (**só para escuta**). Veja como gravar em [Programar o HT](programar-ht.md).

## Radioamador — HF

**Centros de atividade de emergência da IARU** — adotados em todas as regiões; o Brasil fica na **Região 2**:

| Faixa | Frequência (kHz) |
|---|---|
| 80 m | **3.750** · **3.985** |
| 40 m | **7.060** · **7.240** · **7.275** |
| 20 m | **14.300** |
| 17 m | **18.160** |
| 15 m | **21.360** |

**RENER** — frequências da Rede Nacional de Emergência de Radioamadores (Portaria MI nº 331/2009):

| Faixa | Fonia (kHz) | Digital (kHz) |
|---|---|---|
| 80 m | 3.765 | 3.550 |
| 40 m | **7.080 (prioritária)** · 7.130 | 7.040 |
| 20 m | 14.180 | — |
| 15 m | 21.230 | 21.040 · 21.070 · 21.340 |
| 10 m | 28.290 | 28.040 · 28.120 · 28.680 |

"Centro de atividade" **não é frequência exclusiva**: é onde o tráfego de emergência se concentra. Quando houver um evento, **deixe livre e só escute**.

!!! warning "Classe C: confira o que você pode usar"
    As faixas e modos permitidos variam por classe. Em HF, boa parte das frequências de fonia acima **não é liberada para a classe C**. Confirme no **Ato nº 926/2024** antes de transmitir — escutar, todo mundo pode.

Se a LABRE ativar uma rede nacional de emergência, ela divulga as frequências e os coordenadores pelos canais oficiais e pelas LABREs estaduais.

## Outros serviços

<div class="tabela-livre" markdown>

| Serviço | Canal | Frequência | Uso |
|---|---|---|---|
| **PX** (Faixa do Cidadão) | 9 | 27.065 MHz AM | Emergência |
| **PX** | 19 | 27.185 MHz AM | Estradas e caminhoneiros |
| **Marítimo** | 16 | 156.800 MHz FM | Socorro, segurança e chamada |
| **Aviação** | — | 121.500 MHz AM | Emergência aeronáutica — monitorada por aeronaves e controle |

</div>

Muitos HTs **recebem** 156.800 MHz, e alguns recebem AM aeronáutico. **Escutar é útil; transmitir nessas faixas exige outra licença** — o indicativo de radioamador não cobre o marítimo nem a aviação.

!!! info "E em perigo de vida?"
    O Regulamento de Radiocomunicações da UIT prevê que uma estação **em perigo real** pode usar **qualquer meio** de comunicação ao seu alcance para pedir socorro. Isso vale para **perigo de vida**, não para pane mecânica ou atraso de comboio.

## Como chamar em emergência

1. **Escute antes** — veja se a frequência está ocupada com tráfego de emergência.
2. Se for urgente, entre com **"BREAK BREAK"** — quem ouvir deve encerrar o QSO comum e dar passagem.
3. Diga **quem é** (indicativo), **onde está** (cidade, rodovia e km, ou coordenada do GPS) e **o que aconteceu**.
4. Informe **quantas pessoas** e se há feridos.
5. Peça para quem ouvir **repassar** ao 193/192/190 — e confirme que a mensagem chegou.
6. Seja **breve**, repita o essencial e **não ocupe a frequência** com conversa paralela.

Para soletrar nomes e localizações, use o [alfabeto fonético](alfabeto-fonetico.md).

!!! warning "Nunca simule emergência"
    Teste de equipamento ou brincadeira em frequência de emergência atrapalha quem precisa e é falta grave. Para testar, use simplex comum ou uma [repetidora da região](repetidoras.md).

## Monte o seu plano

- [ ] **146.520** gravado no HT (e no rádio do carro)
- [ ] Repetidoras da sua região na memória — veja [Repetidoras da região](repetidoras.md)
- [ ] Bateria carregada, bateria reserva ou cabo de carregamento no carro
- [ ] Antena melhor que a de borracha original (faz mais diferença que potência)
- [ ] Combine com a família **uma frequência e um horário** para se falarem se o celular cair
- [ ] Conheça a LABRE do seu estado e a rede local de emergência

## Referências

- [LABRE — Frequências de emergência do radioamadorismo (jul/2026)](https://www.labre.org.br/frequencias-de-emergencia-do-radioamadorismo-uma-responsabilidade-de-todos/)
- [Jus.com.br — Rede Nacional de Emergência de Radioamadores (RENER)](https://jus.com.br/artigos/28110/rede-nacional-de-emergencia-de-radioamadores)
- [MMSN — IARU Global Centers of Activity](https://mmsn.org/news/iaru.html)
- [Escola de Rádio — enchentes do RS em 2024](https://www.escoladeradio.com.br/post/radioamador-emergencia-enchentes-rs-2024)
- [Rancho da Amizade — QRGs de emergência (PX, marítimo e aviação)](https://www.ranchodaamizade.com.br/qrgs-de-emergencia/)
- [Cartilha do Serviço de Radioamador — Anatel (2026)](https://www.gov.br/anatel/pt-br/assuntos/noticias/anatel-simplifica-regras-e-fortalece-o-radioamadorismo-no-brasil/cartilha_radioamador.pdf/@@download/file)
