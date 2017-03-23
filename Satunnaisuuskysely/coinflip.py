import csv

def coin_to_bin(s):
    if s == "Kruuna":
        return "0"
    elif s == "Klaava":
        return "1"
    else:
        raise

def process_row(row):
    # Kukin binääririvi
    key = ""
    for i in range(1, 7):
        key += coin_to_bin(row["Kolikonheitto [{0}. heitto]".format(i)])
    strings[key] += 1

    # Kruunien ja klaavojen kokonaismäärä
    for i in range(1, 7):
        heads_tails[row["Kolikonheitto [{0}. heitto]".format(i)]] += 1

    # Putkien pituus
    prev = None
    currowlength = 0
    maxrowlength = 0
    for i in range(1, 7):
        cur = row["Kolikonheitto [{0}. heitto]".format(i)]
        if cur != prev:
            maxrowlength = max(currowlength, maxrowlength)
            prev = cur
            currowlength = 1
        else:
            currowlength += 1
    maxrowlength = max(currowlength, maxrowlength)
    row_lengths[maxrowlength] += 1


strings = {}
for i in range(2**6):
    strings["{0:06b}".format(i)] = 0
heads_tails = { "Kruuna": 0, "Klaava": 0 }
row_lengths = [0] * 7

with open("satunnaisuuskysely.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        process_row(row)

for key in strings:
    print(key, strings[key])
print()
for key in heads_tails:
    print(key, heads_tails[key])
print()
for i in range(0, 7):
    print(i, row_lengths[i])
