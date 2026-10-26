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


/* Caesar Cipher */

function caesarCipher(text, shift) {

    return text
        .split("")
        .map(char => {

            const code = char.charCodeAt(0);

            // Uppercase letters
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(
                    ((code - 65 + shift) % 26 + 26) % 26 + 65
                );
            }

            // Lowercase letters
            if (code >= 97 && code <= 122) {
                return String.fromCharCode(
                    ((code - 97 + shift) % 26 + 26) % 26 + 97
                );
            }

            // Numbers, spaces and symbols remain unchanged
            return char;
        })
        .join("");
}


/* Get Shift */

function getShift() {

    let shift = parseInt(shiftInput.value);

    if (isNaN(shift)) {
        shift = 0;
    }

    shift = ((shift % 26) + 26) % 26;

    return shift;
}


/* Encrypt */

encryptBtn.addEventListener("click", () => {

    const message = messageInput.value;

    if (!message.trim()) {
        output.textContent = "Please enter a message.";
        status.textContent = "Message required.";
        status.style.color = "#ef4444";
        return;
    }

    const shift = getShift();

    const encrypted = caesarCipher(message, shift);

    output.textContent = encrypted;

    status.textContent = `Encrypted successfully using shift ${shift}.`;
    status.style.color = "#22c55e";

    showTransformation(message, encrypted);
});


/* Decrypt */

decryptBtn.addEventListener("click", () => {

    const message = messageInput.value;

    if (!message.trim()) {
        output.textContent = "Please enter a message.";
        status.textContent = "Message required.";
        status.style.color = "#ef4444";
        return;
    }

    const shift = getShift();

    const decrypted = caesarCipher(message, -shift);

    output.textContent = decrypted;

    status.textContent = `Decrypted successfully using shift ${shift}.`;
    status.style.color = "#22c55e";

    showTransformation(message, decrypted);
});


/* Character Transformation */

function showTransformation(original, result) {

    transformation.innerHTML = "";

    for (let i = 0; i < original.length; i++) {

        const box = document.createElement("div");
        box.className = "char-box";

        const originalChar = document.createElement("span");
        originalChar.className = "char-original";

        const resultChar = document.createElement("span");
        resultChar.className = "char-result";

        originalChar.textContent =
            original[i] === " " ? "SPACE" : original[i];

        resultChar.textContent =
            result[i] === " " ? "SPACE" : result[i];

        box.appendChild(originalChar);
        box.appendChild(resultChar);

        transformation.appendChild(box);
    }
}


/* Copy Output */

copyBtn.addEventListener("click", async () => {

    const text = output.textContent;

    if (
        !text ||
        text === "Your result will appear here..."
    ) {
        status.textContent = "Nothing to copy.";
        status.style.color = "#ef4444";
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        status.textContent = "Output copied to clipboard.";
        status.style.color = "#22c55e";

    } catch {

        status.textContent = "Copy failed.";
        status.style.color = "#ef4444";
    }
});


/* Clear */

clearBtn.addEventListener("click", () => {

    messageInput.value = "";
    shiftInput.value = "3";

    output.textContent = "Your result will appear here...";

    transformation.innerHTML =
        "<p>Enter a message and encrypt it to see the transformation.</p>";

    bruteForce.innerHTML = "";

    status.textContent = "";
});


/* Brute Force Analysis */

bruteBtn.addEventListener("click", () => {

    const message = messageInput.value;

    if (!message.trim()) {

        bruteForce.innerHTML =
            "<p style='color:#ef4444;'>Please enter a message first.</p>";

        return;
    }

    bruteForce.innerHTML = "";

    for (let shift = 0; shift < 26; shift++) {

        const result = caesarCipher(message, shift);

        const item = document.createElement("div");

        item.className = "brute-item";

        item.innerHTML = `
            <strong>Shift ${shift}</strong>
            <br>
            ${escapeHTML(result)}
        `;

        bruteForce.appendChild(item);
    }
});


/* Prevent HTML Injection in Brute Force Output */

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}