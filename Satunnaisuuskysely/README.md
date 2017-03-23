# Satunnaisuuskysely
Blogiteksti: [Satunnaisuuskyselyn tulokset](http://www.nollakohta.fi/2017/03/satunnaisuuskyselyn-tulokset.html) (3/2017)

Tässä kansiossa on vastausdata Nollakohdan suureen satunnaisuuskyselyyn sekä sen analysointiin käytettyjä työkaluja (hyvin nopeasti tehdyt sellaiset). Python-skriptit on lisensoitu MIT-lisenssillä, muut tiedostot [Creative Commons Nimeä 4.0](https://creativecommons.org/licenses/by/4.0/deed.fi) -lisenssillä.

Aineisto on anonymisoitu seuraavasti:
1. aikaleimasarake on poistettu,
2. rivien järjestys on sekoitettu.

## Tiedostolistaus

| Tiedostonimi | Kuvaus |
| --- | --- |
| `anonymize.py` | Skripti datan anonymisointiin |
| `coinflip.py` | Skripti kolikonheittotehtävän analysointiin |
| `example.csv` | Esimerkki lomakkeelta saadusta anonymisoimattomasta datasta |
| `koira.jpg` | Kyselyssä käytetty kuva koirasta |
| `satunnaisuuskysely.csv` | **Anonymisoitu data CSV-muodossa** (UTF-8, CRLF) |
| `satunnaisuuskysely.xlsx` | **Anonymisoitu data valmiiksi Excel 2007 -muodossa** |

## Kyselyn sisältö

- Viisi satunnaista lukua väliltä 0-19
- Yksi valinta vaihtoehdoista 1-4
- Yksi 1-4 vaihtoehdon valinta vaihtoehdoista 1-4
  - Kysymyksen asettelussa valintoja sai olla 0-4, mutta virheellinen validointilogiikka pakotti ruksaamaan ainakin yhden.
- Kolikonheitto kruuna/klaava, 6 heittoa
- Arvaa kuvassa esitetyn koiran paino. Oikea vastaus 27,5 kiloa.
- Arvaa lähimmäs kaikkien vastausten keskiarvoa välillä -100..100
- Kolme vaihtoehtoa, tavoitteena valita B 50 % osuudella
- Vapaaehtoinen taustakysymys matematiikan käytöstä
  - Työskentelen tai opiskelen matemaattis-luonnontieteellisellä alalla
  - Käytän matematiikkaa jonkin verran töissä tai opinnoissa
  - Vältän matematiikkaa kuin ruttoa
  - En halua vastata
- Vapaaehtoinen taustakysymys kätisyydestä
  - Vasen
  - Molemmat
  - Oikea
  - En halua vastata
- Vapaaehtoinen taustakysymys kengännumerosta kokonaislukuna
