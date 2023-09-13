const gatoStates = [
    [null, null, null, null, null, null, null, null, null], // Mini Gato 0
    [null, null, null, null, null, null, null, null, null], // Mini Gato 1
    [null, null, null, null, null, null, null, null, null], // Mini Gato 2
    [null, null, null, null, null, null, null, null, null], // Mini Gato 3
    [null, null, null, null, null, null, null, null, null], // Mini Gato 4
    [null, null, null, null, null, null, null, null, null], // Mini Gato 5
    [null, null, null, null, null, null, null, null, null], // Mini Gato 6
    [null, null, null, null, null, null, null, null, null], // Mini Gato 7
    [null, null, null, null, null, null, null, null, null]  // Mini Gato 8
];
const Bigato = [null, null, null, null, null, null, null, null, null] //Gato Grande 
let timerInterval;
let flag = 0;
let gatoActivo = null;
const drawe = "=";
let currentPlayer = ''; // Inicia con el jugador X
let selectedColor, selectedColorOpp;
let remainingTime;
document.addEventListener("DOMContentLoaded", function() {
    const playerColorSelect = document.getElementById("player-color");
    const opponentColorSelect = document.getElementById("opponent-color");

    const player = document.getElementById("player");
    const opponent = document.getElementById("opponent");

    function setPlayerColor() {
        selectedColor = playerColorSelect.value;
        player.style.color = selectedColor;
    }

    function setOpponentColor() {
        selectedColorOpp = opponentColorSelect.value;
        opponent.style.color = selectedColorOpp;
    }

    function disableColors() {
        selectedColor = playerColorSelect.value;
        opponentColorSelect.querySelectorAll("option").forEach(option => {
            if (option.value === selectedColor) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });

        selectedColorOpp = opponentColorSelect.value;
        playerColorSelect.querySelectorAll("option").forEach(option => {
            if (option.value === selectedColorOpp) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    }

    setPlayerColor();
    setOpponentColor();
    disableColors();

    playerColorSelect.addEventListener("change", function() {
        setPlayerColor();
        disableColors();
    });

    opponentColorSelect.addEventListener("change", function() {
        setOpponentColor();
        disableColors();
    });
});

function startpart(){
    const supergatostyle = document.querySelector(`.super-gato`);
    const iniciostyle = document.querySelector(`.inicio`);
    supergatostyle.style.display = "flex";
    iniciostyle.style.display = "none";

    const playerStart = document.querySelector(`#first-player`)
    if(playerStart.value === "random"){
        const valorAleatorio = Math.random() < 0.5 ? "X" : "O";
        currentPlayer = valorAleatorio;
    }
    else{
        currentPlayer = playerStart.value;
    }
    const turno = document.querySelector(`.labelturno`);
    turno.textContent = currentPlayer;
    const timerValue = llamada();
    remainingTime = timerValue.value;
    if(timerValue.value !="infinite"){
        const timermst = document.querySelector(`.timer-value`);
        timermst.textContent = remainingTime + "s"; 
        startTimer();
    }
}
function llamada(){
    const timerValue = document.getElementById("turn-time");
    return timerValue;
}
// Implementa la funcion para que se pueda tirar solo en casillas libres y gatos no ganados
function makeMove(gatoIndex, cellIndex) {
    if (!gatoStates[gatoIndex][cellIndex] && !checkWin(gatoStates[gatoIndex])) {
        flag = 1;
        gatoStates[gatoIndex][cellIndex] = currentPlayer;
        
        const button = document.querySelector(`#gato${gatoIndex}-button${cellIndex}`);
        button.textContent = currentPlayer;
        if(currentPlayer === "X"){
            button.style.backgroundColor = selectedColor;
        }
        else{
            button.style.backgroundColor = selectedColorOpp;
        }
        // Comprobar empate en el gato pequeño
        if (checkDraw(gatoStates[gatoIndex])) {
            Bigato[gatoIndex] = drawe;
            // Marcar el gato pequeño como empate
            for (let i = 0; i < 9; i++) {
                const change = document.getElementById(`gato${gatoIndex}-button${i}`);
                change.style.display = "none";
            }
            const supercell = document.querySelector(`.super-cell#gato${gatoIndex}`);
            supercell.style.display = "block";
            const winnerMarker = document.querySelector(`#gato${gatoIndex} .winner-marker`);
            winnerMarker.style.display = "flex";
            winnerMarker.textContent = drawe;
        }
        CompWinAndHabitCell(gatoIndex,cellIndex);

        if(checkDraw(Bigato)){
            const letterx = document.querySelector(`#ecs`)
            const one = document.querySelector(`#one`)
            const two = document.querySelector(`#two`)
            const three = document.querySelector(`#three`)
            const four = document.querySelector(`#four`)
            const five = document.querySelector(`#five`)
            
            letterx.textContent = "E";
            one.style.width = "1em";
            one.textContent = "M";
            two.textContent = "P";
            three.textContent = "A";
            four.textContent = "T";
            five.textContent = "E";
            
            const victoryMessage = document.querySelector(".victory-message");
            victoryMessage.style.display = "flex";
            const superGato = document.querySelector(`.super-gato`)
            const inicio = document.querySelector(`.inicio`)
            setTimeout(() => {
                    clearInterval(timerInterval);
                    resetBoard();
                    victoryMessage.style.display = "none";
                    superGato.style.display = "none";
                    inicio.style.display = "flex";
                }, 4000);
        }
    }
}
// Función para iniciar el temporizador
function startTimer() {
    // Detener el intervalo anterior (si existe)
    clearInterval(timerInterval);

    const timerValue = llamada();
    remainingTime = timerValue.value;

    const timerValueElement  = document.querySelector(`.timer-value`);
    timerValueElement .textContent = remainingTime + "s"; // Mostrar inicial

    timerInterval = setInterval(function() {
        remainingTime--;
        timerValueElement.textContent = remainingTime + "s"; // Actualizar el tiempo en segundos
        if (remainingTime == 0) {
            clearInterval(timerInterval); // Detener el temporizador
            togglePlayer();
        }
    }, 1000); // Actualizar cada segundo
}
// Implementa la función checkWin() para verificar si alguien ha ganado en un "gato"
function checkWin(gatoState) {
    // Definir las combinaciones ganadoras en un "gato" 3x3
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    // Verificar cada combinación ganadora
    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (
            gatoState[a] !== null &&
            gatoState[a] === gatoState[b] &&
            gatoState[a] === gatoState[c]
        ) {
            return true; // Se encontró una combinación ganadora
        }
    }

    // Si no se encontró ninguna combinación ganadora
    return false;
}
// Implementa una función para alternar entre jugadores (X y O)
function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const turno = document.querySelector(`.labelturno`);
    turno.textContent = currentPlayer
    if(llamada().value !="infinite"){
        startTimer();
    }
}
function CompWinAndHabitCell(gatoIndex, cellIndex) {
    if (!checkWin(gatoStates[gatoIndex])) {
        if (Bigato[cellIndex] != null) {
            // Habilita todas las celdas si la celda ya ha sido ganada en el gato grande
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const gatoGrande = document.getElementById(`gato${i}-button${j}`);
                    gatoGrande.disabled = false;
                }
            }
        }else{
            for (let i = 0; i < 9; i++) {
                // Habilita o deshabilita las celdas correspondientes al botón
                for (let j = 0; j < 9; j++) {
                    const gatoGrande = document.getElementById(`gato${i}-button${j}`);
                    gatoGrande.disabled = i !== cellIndex ? true : false;
                }
            }
        }
        togglePlayer();
    } else {
        Bigato[gatoIndex] = currentPlayer;
        // Habilita todos los botones en el gato grande después de ganar
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const gatoGrande = document.getElementById(`gato${i}-button${j}`);
                gatoGrande.disabled = false;
            }
        }
        // Si ganó, quita los botones de la celda ganada
        for (let i = 0; i < 9; i++) {
            const change = document.getElementById(`gato${gatoIndex}-button${i}`);
            change.style.display = "none";
        }

        // Pone el div que muestra quién ganó
        const supercell = document.querySelector(`.super-cell#gato${gatoIndex}`);
        supercell.style.display = "block";
        const winnerMarker = document.querySelector(`#gato${gatoIndex} .winner-marker`);
        if(currentPlayer === "X"){
            winnerMarker.style.backgroundColor = selectedColor;
        }
        else{
            winnerMarker.style.backgroundColor = selectedColorOpp;
        }
        winnerMarker.style.display = "flex";
        winnerMarker.textContent = currentPlayer;

        // Verifica si el gato grande ha ganado
        if (Bigato[cellIndex] != null) {
            // Habilita todas las celdas si la celda ya ha sido ganada en el gato grande
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const gatoGrande = document.getElementById(`gato${i}-button${j}`);
                    gatoGrande.disabled = false;
                }
            }
        }

        if (checkWin(Bigato)) {
            setTimeout(() => {
                const letterx = document.querySelector(`#ecs`)
                const one = document.querySelector(`#one`)
                const two = document.querySelector(`#two`)
                const three = document.querySelector(`#three`)
                const four = document.querySelector(`#four`)
                const five = document.querySelector(`#five`)

                letterx.textContent = currentPlayer;
                one.textContent = " ";
                two.textContent = "G";
                three.textContent = "A";
                four.textContent = "N";
                five.textContent = "Ó";

                const victoryMessage = document.querySelector(".victory-message");
                victoryMessage.style.display = "flex";
                const superGato = document.querySelector(`.super-gato`)
                const inicio = document.querySelector(`.inicio`)
                setTimeout(() => {
                        clearInterval(timerInterval);
                        resetBoard();
                        victoryMessage.style.display = "none";
                        superGato.style.display = "none";
                        inicio.style.display = "flex";
                    }, 4000);
                
            }, 100);
        }
    }
    
 
}
// Funcion que resetea el juego al inicio
function resetBoard() {
    if (flag != 0){
        flag = 0;
        const turno = document.querySelector(`.labelturno`);
        turno.textContent = currentPlayer
        // Reiniciar el estado de todos los "gatos pequeños" a null
        for (let i = 0; i < gatoStates.length; i++) {
            for (let j = 0; j < gatoStates[i].length; j++) {
                gatoStates[i][j] = null;
            }
        }

        // Reiniciar el estado del "gato grande" a null
        for (let i = 0; i < Bigato.length; i++) {
            Bigato[i] = null;
        }

        const winnerMarker = document.querySelectorAll(`.winner-marker`);
        winnerMarker.forEach(marker => {
            marker.style.display = 'none';
        });
        const supercell = document.querySelectorAll(`.super-cell`);
        supercell.forEach(cell => {
            cell.style.display = 'grid';
        })
        // Vuelve a habilitar todos los botones
        const buttons = document.querySelectorAll('.super-cell button');
        buttons.forEach(button => {
            button.style.display = 'block';
            button.textContent = ''; // Limpia el texto de los botones
            button.disabled = false; // Habilita los botones
            button.style.backgroundColor = "#3498db";
        });
        const timervalor = document.querySelector(".timer-value")
        timervalor.textContent = " "
        clearInterval(timerInterval);
    } 
}
function checkDraw(gatoState) {
    for (const cell of gatoState) {
        if (cell === null) {
            return false; // Todavía hay al menos una casilla vacía, no es empate
        }
    }
    return true; // Todas las casillas están ocupadas, es empate
}
