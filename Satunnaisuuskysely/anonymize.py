import csv
import secrets

# Lue alkuperäinen tiedosto (julkisessa versiossa malli)
fieldnames = []
rows = []
with open("example.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        rows.append(row)

# Poista aikaleima
fieldnames.remove("Timestamp")

# Kirjoita rivit uuteen tiedostoon satunnaisessa järjestyksessä
# Kyseessä on Fisherin-Yatesin sekoitus eli hatustanosto
with open("satunnaisuuskysely.csv", mode="w", encoding="utf-8") as f:
    writer = csv.DictWriter(f, dialect="unix", extrasaction="ignore", fieldnames=fieldnames)
    writer.writeheader()
    while len(rows) > 0:
        index = secrets.randbelow(len(rows))
        writer.writerow(rows[index])
        rows.remove(rows[index])
        
