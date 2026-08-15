const flame = document.getElementById("flame");
const statusText = document.getElementById("status");
const button = document.getElementById("startBtn");
const smokeContainer = document.getElementById("smoke");
// const confettiContainer =  document.getElementById("confetti-container")

let audioContext;
let analyser;
let microphone;
let dataArray;
let candleBlownOut = false;

const music = document.getElementById("birthdayMusic");

button.onclick = async () => {
    try {
        await music.play();
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        dataArray = new Uint8Array(analyser.fftSize);
        button.style.display = "none";
        statusText.innerHTML = "You can now blow the candle..."
        listen();
    } catch (error) {
        console.log(error);
        statusText.innerHTML = "Microphone permission is required";
    }
};

function listen() {
    if (candleBlownOut) {
        return;
    }

    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const value = (dataArray[i] - 128) / 128;
        sum += value * value;
    }

    const volume = Math.sqrt(sum / dataArray.length);

    if (volume > 0.02) {
        const movement = Math.min(volume * 100, 25);
        flame.style.transform = `translateX(-50%) rotate(${movement}deg)`;
    }

    if (volume > 0.12) {
        blowOutCandle();
        return;
    }

    requestAnimationFrame(listen);
}

function blowOutCandle() {
    if (candleBlownOut) {
        return;
    }

    candleBlownOut = true;

    flame.classList.add("off");
    flame.style.transform = "translateX(-50%)";
    statusText.innerHTML = "God bless you richly!";

    createSmoke();
    // createConfetti();
    music.volume = 0.8;
}

function createSmoke() {
    smokeContainer.innerHTML = "";
    smokeContainer.style.opacity = "1";
    for (let i = 0; i < 6; i++) {
        const smoke = document.createElement("div");
        smoke.className = "smoke";
        const offset = (Math.random() - 0.5) * 20;
        smoke.style.left = `calc(50% + ${offset}px)`;
        const size = 12 + Math.random() * 15;
        smoke.style.width = `${size}px`;
        smoke.style.height = `${size}px`;
        smoke.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
        smoke.style.animationDelay = `${i * 0.12}s`;
        smokeContainer.appendChild(smoke);
    }
}

// function createConfetti() {
//     confettiContainer.innerHTML = "";
//     const numberOfPieces = 120;
//     for (let i = 0; i< numberOfPieces; i++) {
//         const piece = document.createElement("div");
//         piece.className = "confetti";
//         const colors = [
//             "#ff4d6d",
//             "#ffd166",
//             "#06d6a0",
//             "#118ab2",
//             "#8338ec",
//             "#ff9f1c",
//             "#ffffff"
//         ];
//         piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
//         piece.style.left = "50%";
//         piece.style.top = "45%";
//         const angle = Math.random() * Math.PI * 2;
//         const distance = -150 + Math.random() * 400;
//         const x = Math.cos(angle) * distance;
//         const y = Math.sin(angle) * distance;
//         const rotation = (Math.random() - 0.5) * 1440;
//         const duration = 1.5 + Math.random() * 2;
//         piece.style.setProperty("--x", `${x}px`);
//         piece.style.setProperty("--y", `${y}px`);
//         piece.style.setProperty("--rotation", `${rotation}px`);
//         piece.style.setProperty("--duration", `${duration}px`);
//         const width = 6 + Math.random() * 8;
//         const height = 8 + Math.random() * 14;
//         piece.style.width = `${width}px`;
//         piece.style.height = `${height}px`;
//         piece.style.borderRadius = Math.random() > 0.5? "50%" : "2px";
//         confettiContainer.appendChild(piece);
//         setTimeout(() => {
//             piece.remove();
//         }, duration * 1000 + 100);
//     }
// }
