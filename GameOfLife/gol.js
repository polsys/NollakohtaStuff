// gol.js
// Koodi Game of Lifen piirtämiseen
// Huomautus: tämä ei ole alkuunkaan tehokas toteutus!

// Näiden on oltava samoja kuin HTML-elementissä
const CanvasWidth = 1280;
const CanvasHeight = 720;

// Pelikentän koko
const GameWidth = 160;
const GameHeight = 90;
var gameField;

const CellWidth = CanvasWidth / GameWidth;
const CellHeight = CanvasHeight / GameHeight;

// Pelin tila
var gameRunning = false;
var gameTimer = 0;

// Piirtää pelikentän
function draw() {
    // Aloita tyhjentämällä piirtoalue
    var ctx = document.getElementById("mainCanvas").getContext("2d");
    ctx.fillStyle = "#EEF";
    ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
    ctx.fillStyle = "grey";
    
    for (var x = 0; x < GameWidth; x++) {
        for (var y = 0; y < GameHeight; y++) {
            // Jos solu elää, piirrä se
            if (gameField[x][y]) {
                ctx.fillRect(x * CellWidth, y * CellHeight, CellWidth, CellHeight);
            }
        }
    }
}

// Päivittää pelikentän ja piirtää sen
function tick() {
    // Luo tilapäinen kopio edellisestä tilasta.
    // Array.slice() kopioi vain yksiulotteisia taulukoita.
    var lastState = new Array(GameWidth);
    for (var i = 0; i < GameWidth; i++)
        lastState[i] = gameField[i].slice();
    
    // Päivitä jokainen solu
    for (var x = 0; x < GameWidth; x++) {
        for (var y = 0; y < GameHeight; y++) {
            // Laske elävien naapurien määrä
            var living = 0;
            for (var xi = -1; xi <= 1; xi++) {
                for (var yi = -1; yi <= 1; yi++) {
                    if (xi == 0 && yi == 0)
                        continue;
                    // Miksikö (x + xi + GameWidth)? Koska JavaScriptin jakojäännös ottaa jaettavan merkin: -1 % 10 = -1 eikä 9.
                    if (lastState[(x + xi + GameWidth) % GameWidth][(y + yi + GameHeight) % GameHeight])
                        living += 1;
                }
            }
            
            // Toimi tämän perusteella:
            // 3 = synny, <2 tai >3 = kuole, 2 = ei muutosta
            if (living == 2)
                gameField[x][y] = lastState[x][y];
            else if (living == 3)
                gameField[x][y] = true;
            else
                gameField[x][y] = false;
        }
    }
    
    draw();
}

// Käynnistää tai pysäyttää pelin
function toggleGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameTimer = window.setInterval(tick, 100);
        tick();
    }
    else {
        window.clearInterval(gameTimer);
        gameRunning = false;
    }
}

// Alustaa pelikentän
function resetGame() {
    gameField = new Array(GameWidth);
    for (var x = 0; x < GameWidth; x++) {
        gameField[x] = new Array(GameHeight);
        for (var y = 0; y < GameHeight; y++) {
            gameField[x][y] = Math.random() < 0.1;
        }
    }
    
    // Aja ja piirrä yksi kierros
    tick();
}

// Ajaa yhden kierroksen ja pelin ollessa päällä pysäyttää sen
function singleStep() {
    if (gameRunning)
        toggleGame();
    tick();
}

// Alusta pelikenttä satunnaisella kuviolla
resetGame();
