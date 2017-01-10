// landscape.js
// Koodi fraktaalimaiseman piirtämiseen

// Näiden on oltava samoja kuin HTML-elementissä
const CanvasWidth = 1280;
const CanvasHeight = 720;

const CloudCount = 15;
const CloudPoints = 129;
var CloudRecursiveFactor = 0.8;
const MountainLayerCount = 3;
const MountainPoints = 33;
const MountainColors = ["#697b90", "#404754", "#59544f"];
const MountainHeights = [0.12, 0.1, 0.08];
var MountainRecursiveFactor = 0.8;

// JavaScriptin oma satunnaislukugeneraattori ei ole toistettava.
// Seuraavat kaksi funktiota toteuttavat oman satunnaislukugeneraattorin.
// Generaattorin satunnaisuus ei ole kovin hyvä, mutta se on riittävä.

var randomSeed = 43889;
var storedRandomSeed = 43889;
function resetRandom() {
    randomSeed = storedRandomSeed;
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

// Luo piikkejä palaan korkeuskäyrää ja kutsuu itseään tämän palan osilla luodakseen vielä pienempiä piikkejä.
// Tämä on siis rekursiivinen funktio.
function fillHeightMap(section, factor) {
    if (section.length <= 2)
        return section;
    
    var left = section[0];
    var right = section[section.length - 1];
    var midIndex = Math.floor((section.length - 1) / 2);
    
    // Tasoita keskikohta kahden ääripään välille ja lisää siihen satunnaisuutta
    var mid = (left + right) / 2;
    mid += (random() - 0.4) * 2 * factor;
    section[midIndex] = Math.max(mid, 0); // Ei negatiivisia arvoja
    
    // Jaa pala puoliksi ja toista
    var leftSlice = fillHeightMap(section.slice(0, midIndex + 1), factor * factor).slice(0, midIndex);
    var rightSlice = fillHeightMap(section.slice(midIndex, section.length), factor * factor);
    
    return leftSlice.concat(rightSlice);
}

// Palauttaa korkeuskartan
function createHeightMap(recursiveFactor, widthPoints, maxPoint, maxEdgeHeight) {
    // Luo ja alusta korkeuksien taulukko
    var heights = [];
    heights[0] = random() * maxEdgeHeight;
    heights[widthPoints - 1] = random() * maxEdgeHeight;
    heights[maxPoint] = 1;
    
    // Täytä kumpikin puolisko huipun ympäriltä.
    // Kummassakin on viittaus huippuun, joten poistetaan se vasemmasta
    var leftSlice = fillHeightMap(heights.slice(0, maxPoint + 1), recursiveFactor).slice(0, maxPoint);
    var rightSlice = fillHeightMap(heights.slice(maxPoint, heights.length), recursiveFactor);
    return leftSlice.concat(rightSlice);
}

// Funktio kaikkien pilvien piirtämiseen
function drawClouds(context) {
    for (var i = 1; i <= CloudCount; i++) {
        // Pilven y-koordinaatti pienenee ja keskimääräinen koko kasvaa neliöllisesti etualalle tultaessa, jolloin syntyy perspektiivivaikutelma.
        var width = 0.4 * CanvasWidth * (0.8 + Math.pow((i / CloudCount), 2));
        var height = 0.12 * CanvasHeight * Math.pow((i / CloudCount), 2) + (0.05 * CanvasHeight);
        var y = (CanvasHeight * 0.95) - Math.pow((i / CloudCount), 2) * (CanvasHeight * 0.45);
        var x = (random() - 0.33) * CanvasWidth * 1.5;
        
        // Luo liukuväri pilvelle
        // Taka-alalla olevissa pilvissä tumma alue nousee pidemmälle, ja ne ovat muutenkin hieman tummempia
        var highColor = Math.floor(230 * (0.8 + (0.2 * i / CloudCount)));
        var lowColor = Math.floor(150 * (0.8 + (0.2 * i / CloudCount)));
        var gradient = context.createLinearGradient(0, y, 0, y - height);
        gradient.addColorStop(0.7, "rgb(" + highColor + "," + highColor + "," + highColor + ")");
        gradient.addColorStop((CloudCount - i) * 0.1 / CloudCount, "rgb(" + lowColor + "," + (lowColor + 20) + "," + (lowColor + 35) + ")");
        context.fillStyle = gradient;
        
        // Luo pilven muoto ja piirrä se
        var heights = createHeightMap(CloudRecursiveFactor, CloudPoints, Math.floor(CloudPoints / 2), 0);
        
        context.beginPath();
        context.moveTo(x, y);
        for (var j = 0; j < heights.length; j++) {
            context.lineTo(x + j * width / (heights.length - 1), y - height * heights[j]);
        }
        context.lineTo(x + width, y);
        context.fill();
    }
}

function drawMountains(context) {
    for (var i = 0; i < MountainLayerCount; i++) {
        context.fillStyle = MountainColors[i];
        
        // Piirrä ja täytä vuorta kuvaava murtoviiva
        var mountainTop = Math.floor(random() * MountainPoints);
        var heights = createHeightMap(MountainRecursiveFactor, MountainPoints, mountainTop, 0.2);
        
        context.beginPath();
        context.moveTo(0, CanvasHeight);
        for (var j = 0; j < heights.length; j++) {
            context.lineTo(CanvasWidth * (1.4 * j - 0.2) / (heights.length - 1), CanvasHeight * (1 - heights[j] * MountainHeights[i]));
        }
        context.lineTo(CanvasWidth, CanvasHeight);
        context.fill();
    }
}

// Funktio koko ruudun piirtämiseen
function drawScene() {
    // Piirrä joka kerta samalla tavalla
    resetRandom();
    
    // Hae piirtoalue
    var canvas = document.getElementById("mainCanvas");
    var context = canvas.getContext("2d");
    
    // Piirrä tausta liukuvärinä
    var skyGradient = context.createLinearGradient(0, 0, 0, CanvasHeight);
    skyGradient.addColorStop(0, "#4a7cb1"); // Värit sattumanvaraisesta valokuvasta
    skyGradient.addColorStop(1, "#779cb9");
    context.fillStyle = skyGradient;
    context.fillRect(0, 0, CanvasWidth, CanvasHeight);
    
    // Piirrä pilvet
    drawClouds(context);
    
    // Piirrä vuoret
    drawMountains(context);
}

// Valitsee uuden lähtöarvon satunnaisluvuille ja piirtää koko ruudun
function drawNewScene() {
    storedRandomSeed = Math.floor(Math.random() * 70657);
    drawScene();
}

// Päivittää parametrit ja piirtää ruudun uudelleen samalla satunnaisarvolla
function inputChanged() {
    MountainRecursiveFactor = document.getElementById("mountainRecFactor").value;
    CloudRecursiveFactor = document.getElementById("cloudRecFactor").value;
    drawScene();
}

// Tämä suoritetaan sivun latautuessa.
// Päivitä arvot ja piirrä alustava ruutu
inputChanged();
