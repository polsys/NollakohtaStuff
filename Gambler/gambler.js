// Näiden on oltava samoja kuin HTML-elementissä
const CanvasWidth = 1280;
const CanvasHeight = 720;

const InitialValue = 5;
const MaxTurns = 100;
const PlayerCount = 1;
const PlayerColors = [ "red", "green", "blue" ];

const CanvasXFactor = CanvasWidth / MaxTurns;
const CanvasYFactor = 30;

var WinningChance = 0.5;

// JavaScriptin oma satunnaislukugeneraattori ei ole toistettava.
// Seuraavat kaksi funktiota toteuttavat oman satunnaislukugeneraattorin.
// Generaattorin satunnaisuus ei ole kovin hyvä, mutta se on riittävä.

var randomSeed = 43889;
var storedRandomSeed = 43889;
function resetRandom(offset) {
    randomSeed = storedRandomSeed + offset;
}

// Luo satunnaisluku välillä [0.0; 1.0)
function random() {
    // Muistuttaa xorshift-algoritmia, mutta on paljon huonompi - älä kopioi!
    randomSeed ^= randomSeed >> 7;
    randomSeed += 48611;
    randomSeed ^= randomSeed << 11;
    
    // Lukitse palautettava arvo halutulle välille
    var result = Math.abs(randomSeed) % 1299709;
    return (result / 1299709);
}

// Heittää kolikkoa ja palauttaa totuusarvon: toden todennäköisyys annetaan parametrina
function coinFlip(chance) {
    return random() < chance;
}

// Palauttaa arvoa vastaavan y-koordinaatin
function y(value) {
    return CanvasHeight - (value + 2) * CanvasYFactor;
}

// Simuloi ja piirtää kuvaajan
function drawGraph() {
    // Hae piirtoalue
    var canvas = document.getElementById("mainCanvas");
    var context = canvas.getContext("2d");
    
    // Piirrä liukuväritausta
    var gradient = context.createLinearGradient(0, 0, 0, CanvasHeight);
    gradient.addColorStop(0, "#EEE");
    gradient.addColorStop(1, "#DDD");
    context.fillStyle = gradient;
    context.fillRect(0, 0, CanvasWidth, CanvasHeight);
    
    // Piirrä nollaviiva
    context.strokeStyle = "#000";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, y(0));
    context.lineTo(CanvasWidth, y(0));
    context.stroke();
    
    // Piirrä lähtötasoviiva
    context.strokeStyle = "#888";
    context.beginPath();
    context.moveTo(0, y(InitialValue));
    context.lineTo(CanvasWidth, y(InitialValue));
    context.stroke();
    
    // Piirrä voiton todennäköisyys
    context.fillStyle = "#000";
    context.font = "32px sans-serif";
    context.fillText(Math.round(WinningChance * 100) + " %", 10, 30);
    
    // Simuloi ja piirrä kukin kuvaaja
    for (player = 0; player < PlayerCount; player++) {
        // Nollaa satunnaislukugeneraattori kullekin pelaajalle erikseen
        resetRandom(player);
        
        context.strokeStyle = PlayerColors[player];
        context.fillStyle = PlayerColors[player];
        context.font = "24px sans-serif";
        context.beginPath();
        
        var value = InitialValue;
        context.moveTo(0, y(value));
        
        for (i = 1; i <= MaxTurns; i++) {
            value += coinFlip(WinningChance) ? 1 : -1;
            context.lineTo(i * CanvasXFactor, y(value));
            
            if (value <= 0) {
                // Peli ohi
                context.fillText(i, i * CanvasXFactor, y(-1));
                break;
            }
        }
        
        context.stroke();
    }
}

// Valitsee uuden lähtöarvon satunnaisluvuille ja piirtää koko kuvaajan
function drawNewGraph() {
    storedRandomSeed = Math.floor(Math.random() * 70657);
    drawGraph();
}

// Päivittää parametrit ja piirtää ruudun uudelleen samalla satunnaisarvolla
function inputChanged() {
    WinningChance = document.getElementById("chanceSlider").value * 0.01;
    drawGraph();
}

// Tämä suoritetaan sivun latautuessa.
// Päivitä arvot ja piirrä alustava ruutu
inputChanged();
