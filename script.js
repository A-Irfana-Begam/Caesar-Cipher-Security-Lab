
const messageInput = document.getElementById("message");
const shiftInput = document.getElementById("shift");

const output = document.getElementById("output");
const status = document.getElementById("status");
const transformation = document.getElementById("transformation");
const bruteForce = document.getElementById("bruteForce");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const bruteBtn = document.getElementById("bruteBtn");

let animationTimer = null;
let lastResult = "";

/* Caesar Cipher */

function caesarCipher(text, shift) {
    return text.split("").map(char => {
        const code = char.charCodeAt(0);

        if (code >= 65 && code <= 90) {
            return String.fromCharCode(
                ((code - 65 + shift) % 26 + 26) % 26 + 65
            );
        }

        if (code >= 97 && code <= 122) {
            return String.fromCharCode(
                ((code - 97 + shift) % 26 + 26) % 26 + 97
            );
        }

        return char;
    }).join("");
}

/* Get Shift */

function getShift() {
    let shift = parseInt(shiftInput.value);

    if (isNaN(shift)) shift = 0;

    return ((shift % 26) + 26) % 26;
}

/* Status */

function setStatus(message, success = true) {
    status.textContent = message;
    status.style.color = success ? "#35e68b" : "#ff626b";
}

/* Active Button */

function setActiveButton(activeBtn) {
    [encryptBtn, decryptBtn].forEach(btn => {
        btn.classList.remove("active");
    });

    activeBtn.classList.add("active");
}

/* Terminal Output Animation */

function animateOutput(text) {
    clearInterval(animationTimer);

    output.textContent = "";
    output.classList.remove("scanning");

    void output.offsetWidth;
    output.classList.add("scanning");

    let index = 0;

    animationTimer = setInterval(() => {
        output.textContent += text[index];
        index++;

        if (index >= text.length) {
            clearInterval(animationTimer);
            animationTimer = null;
        }
    }, 18);
}

/* Encrypt */

encryptBtn.addEventListener("click", () => {
    const message = messageInput.value;

    if (!message.trim()) {
        setStatus("Message required.", false);
        output.textContent = "Please enter a message.";
        return;
    }

    const shift = getShift();
    const encrypted = caesarCipher(message, shift);

    lastResult = encrypted;

    setActiveButton(encryptBtn);
    animateOutput(encrypted);

    setStatus(`ENCRYPTION COMPLETE // SHIFT ${shift}`);

    showTransformation(message, encrypted);
});

/* Decrypt */

decryptBtn.addEventListener("click", () => {
    const message = messageInput.value;

    if (!message.trim()) {
        setStatus("Message required.", false);
        output.textContent = "Please enter a message.";
        return;
    }

    const shift = getShift();
    const decrypted = caesarCipher(message, -shift);

    lastResult = decrypted;

    setActiveButton(decryptBtn);
    animateOutput(decrypted);

    setStatus(`DECRYPTION COMPLETE // SHIFT ${shift}`);

    showTransformation(message, decrypted);
});

/* Character Transformation Animation */

function showTransformation(original, result) {
    transformation.innerHTML = "";

    for (let i = 0; i < original.length; i++) {
        const box = document.createElement("div");
        box.className = "char-box";

        const originalChar = document.createElement("span");
        originalChar.className = "char-original";
        originalChar.textContent =
            original[i] === " " ? "SPACE" : original[i];

        const resultChar = document.createElement("span");
        resultChar.className = "char-result";
        resultChar.textContent =
            result[i] === " " ? "SPACE" : result[i];

        box.append(originalChar, resultChar);
        transformation.appendChild(box);
    }
}

/* Copy Output */

copyBtn.addEventListener("click", async () => {
    if (!lastResult) {
        setStatus("Nothing to copy.", false);
        return;
    }

    try {
        await navigator.clipboard.writeText(lastResult);

        setStatus("OUTPUT COPIED SUCCESSFULLY");

        copyBtn.classList.add("copied");
        copyBtn.textContent = "COPIED ✓";

        setTimeout(() => {
            copyBtn.classList.remove("copied");
            copyBtn.textContent = "Copy";
        }, 1600);

    } catch {
        setStatus("Copy failed. Check browser permissions.", false);
    }
});

/* Clear */

clearBtn.addEventListener("click", () => {
    clearInterval(animationTimer);
    animationTimer = null;

    messageInput.value = "";
    shiftInput.value = "3";

    lastResult = "";

    output.textContent = "Your result will appear here...";
    output.classList.remove("scanning");

    transformation.innerHTML =
        "<p>Enter a message and encrypt it to see the transformation.</p>";

    bruteForce.innerHTML = "";

    setStatus("SYSTEM CLEARED");

    [encryptBtn, decryptBtn].forEach(btn => {
        btn.classList.remove("active");
    });

    copyBtn.classList.remove("copied");
    copyBtn.textContent = "Copy";
});

/* Brute Force Analysis */

bruteBtn.addEventListener("click", () => {
    const message = messageInput.value;

    if (!message.trim()) {
        bruteForce.textContent = "Please enter a message first.";
        setStatus("INPUT REQUIRED", false);
        return;
    }

    bruteForce.innerHTML = "";

    setStatus("BRUTE FORCE ANALYSIS RUNNING...");

    for (let shift = 0; shift < 26; shift++) {
        const result = caesarCipher(message, shift);

        const item = document.createElement("div");
        item.className = "brute-item";

        const heading = document.createElement("strong");
        heading.textContent = `SHIFT ${String(shift).padStart(2, "0")}`;

        const content = document.createElement("span");
        content.textContent = result;

        item.append(heading, content);

        item.addEventListener("click", () => {
            shiftInput.value = shift;
            output.textContent = result;
            lastResult = result;

            messageInput.focus();

            bruteForce.querySelectorAll(".brute-item")
                .forEach(element => element.classList.remove("selected"));

            item.classList.add("selected");

            setStatus(`SHIFT ${shift} SELECTED`);
        });

        bruteForce.appendChild(item);
    }

    setStatus("26 POSSIBLE SHIFTS GENERATED");
});

/* Live Shift Preview */

shiftInput.addEventListener("input", () => {
    const message = messageInput.value;

    if (!message.trim()) return;

    const preview = caesarCipher(message, getShift());

    setStatus(`LIVE PREVIEW // SHIFT ${getShift()}`);
});

/* Keyboard Shortcut */

document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        encryptBtn.click();
    }
});

/* Prevent HTML Injection */

function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
