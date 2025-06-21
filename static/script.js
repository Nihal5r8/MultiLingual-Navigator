document.addEventListener("DOMContentLoaded", function () {
    const translateBtn = document.getElementById("translate-btn");
    const readAloudBtn = document.getElementById("read-aloud-btn");
    const copyBtn = document.getElementById("copy-btn");
    const clearBtn = document.getElementById("clear-btn");
    const voiceInputBtn = document.getElementById("voice-input-btn");
    const inputText = document.getElementById("input-text");
    const outputText = document.getElementById("output-text");
    const successNotification = document.getElementById("success-notification");
    const errorNotification = document.getElementById("error-notification");

    let latestAudioUrl = null;

    // Translate button
    translateBtn.addEventListener("click", async () => {
        const text = inputText.value.trim();
        const sourceLang = document.getElementById("source-lang").value;
        const targetLang = document.getElementById("target-lang").value;

        if (!text) {
            showError("Please enter text to translate.");
            return;
        }

        try {
            const response = await fetch("/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, source: sourceLang, target: targetLang })
            });

            if (!response.ok) throw new Error("Translation failed.");

            const data = await response.json();
            if (data.translated_text) {
                outputText.value = data.translated_text;
                latestAudioUrl = data.audio_url ? `${data.audio_url}?t=${new Date().getTime()}` : null;
            } else {
                throw new Error("No translation returned.");
            }
        } catch (error) {
            console.error("Error:", error);
            showError("An error occurred while translating.");
        }
    });

    // Read Aloud button
    readAloudBtn.addEventListener("click", () => {
        if (!latestAudioUrl) {
            showError("No translated text to read aloud.");
            return;
        }

        try {
            const audio = new Audio(latestAudioUrl);
            audio.play().catch(error => {
                console.error("Audio playback error:", error);
                showError("Unable to play the audio.");
            });
        } catch (error) {
            console.error("Error:", error);
            showError("An error occurred while trying to play the audio.");
        }
    });

    // Copy button
    copyBtn.addEventListener("click", () => {
        const text = outputText.value.trim();
        if (!text) {
            showError("Nothing to copy!");
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => showSuccess("Text copied to clipboard!"))
            .catch(error => {
                console.error("Copy error:", error);
                showError("Failed to copy text.");
            });
    });

    // Clear button
    clearBtn.addEventListener("click", () => {
        inputText.value = "";
        outputText.value = "";
        latestAudioUrl = null;
    });

    // Voice Input button (using backend /voice_input route)
    document.getElementById('voice-input-btn').addEventListener('click', () => {
    const listeningIndicator = document.getElementById('listening-indicator');
    listeningIndicator.classList.add('show');

    fetch('/voice_input', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        listeningIndicator.classList.remove('show');

        if (data.error) {
            showNotification(data.error, 'error');
        } else {
            document.getElementById('input-text').value = data.text;
        }
    })
    .catch(error => {
        listeningIndicator.classList.remove('show');
        showNotification('Voice input failed. Try again.', 'error');
        console.error('Error:', error);
    });
});


    // Notification functions
    function showSuccess(message) {
        const successMessage = document.getElementById("success-message");
        successMessage.textContent = message;
        successNotification.classList.add("show");
        setTimeout(() => successNotification.classList.remove("show"), 2000);
    }

    function showError(message) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = message;
        errorNotification.classList.add("show");
        setTimeout(() => errorNotification.classList.remove("show"), 2000);
    }
});
