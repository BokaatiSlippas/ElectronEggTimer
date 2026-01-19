class EggTimer {
    constructor() {
        this.totalSeconds = 5; // default to 8.5 mins cuz lowest
        this.timeLeft = this.totalSeconds;
        this.timerInterval = null;
        this.isRunning = false;
        this.currentStage = "Gooey";
        this.elapsedSeconds = 0;

        this.eggStages = {
            Gooey: {
                images: ["Egg0.png", "Egg1.png"], // will alternate periodically for animation vibe
                interval: 500,
                message: "" // might not bother
            },
            Soft: {
                images: ["Egg2.png", "Egg3.png"], // will alternate periodically for animation vibe
                interval: 500,
                message: "" // might not bother
            },
            Hard: {
                images: ["Egg4.png", "Egg5.png"], // will alternate periodically for animation vibe
                interval: 500,
                message: "" // might not bother
            },
            Stupid: {
                images: ["Egg6.png", "Egg6.png"], // don't rly care abt overhead cuz js meh
                interval: 500,
                message: "" // might not bother
            }
        };
        this.currentImageIndex = 0;
        this.imageInterval = null; // might not bother

        this.initElements(); // will implement
        this.bindEvents();
        this.updateDisplay();
        this.updateEggAnimation();
    }

    initElements() {
        this.minutesElement = document.querySelector(".minutes");
        this.secondsElement = document.querySelector(".seconds");
        this.eggImage = document.getElementById("eggImage");
        this.startBtn = document.getElementById("startBtn");
        this.pauseBtn = document.getElementById("pauseBtn");
        this.resetBtn = document.getElementById("resetBtn");
        this.eggOptions = document.querySelectorAll(".egg-type");
    }

    bindEvents() {
        this.startBtn.addEventListener("click", () => this.start());
        this.pauseBtn.addEventListener("click", () => this.pause());
        this.resetBtn.addEventListener("click", () => this.reset());
        
        

        this.eggOptions.forEach(option => {
            option.addEventListener("click", (e) => {
                this.eggOptions.forEach(opt =>
                    opt.classList.remove("active")
                );

                e.target.classList.add("active");

                const time = parseInt(e.target.dataset.time);
                this.setTimer(time);
                this.updateStage(time);
            });
        });
    }

    updateStage(totalSeconds) {
        if (totalSeconds <= 5) {
            this.currentStage = "Gooey";
        } else if (totalSeconds <= 10) {
            this.currentStage = "Soft";
        } else if (totalSeconds <= 15) {
            this.currentStage = "Hard";
        } else {
            this.currentStage = "Stupid";
        }
        
        // Update image animation based on stage
        this.updateEggAnimation();
    }

    updateEggAnimation() {
        clearInterval(this.imageInterval);

        const stage = this.eggStages[this.currentStage];

        this.imageInterval = setInterval(() => {
            this.currentImageIndex =
                (this.currentImageIndex + 1) % stage.images.length;

            this.eggImage.src = `assets/${stage.images[this.currentImageIndex]}`;
        }, stage.interval);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        this.minutesElement.textContent = minutes.toString().padStart(2, "0");
        this.secondsElement.textContent = seconds.toString().padStart(2, "0");
        
        // Visual feedback when time is running low
        if (this.timeLeft <= 60) { // Last minute
            document.querySelector(".timer-display").style.animation = "pulse 1s infinite alternate";
        } else {
            document.querySelector(".timer-display").style.animation = "";
        }
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.elapsedSeconds++;

            const newStage = this.getStageByElapsed(this.elapsedSeconds);

            if (newStage !== this.currentStage) {
                this.currentStage = newStage;
                this.currentImageIndex = 0;
                this.updateEggAnimation();
            }

            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
        
        // Add cooking effect
        document.querySelector(".egg-display-container").classList.add("cooking");
    }

    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.timerInterval);
        
        // Pause egg animation
        if (this.imageInterval) {
            clearInterval(this.imageInterval);
        }
        
        // Remove cooking effect
        document.querySelector(".egg-display-container").classList.remove("cooking");
    }

    reset() {
        this.pause();
        this.elapsedSeconds = 0;
        this.timeLeft = this.totalSeconds;
        this.currentStage = "Gooey";
        this.currentImageIndex = 0;
        this.updateEggAnimation();
        this.updateDisplay();
    }
    
    setTimer(seconds) {
        this.totalSeconds = seconds;
        this.timeLeft = seconds;
        this.updateDisplay();
    }

    getStageByElapsed(elapsed) {
        if (elapsed < 5) return "Gooey";
        if (elapsed < 10) return "Soft";
        if (elapsed < 15) return "Hard";
        return "Stupid";
    }

    complete() {
        this.pause();
        
        // Show completion animation
        this.eggImage.src = "assets/EggDone.png";
        
        // Celebration effect
        document.querySelector(".egg-display-container").style.animation = "celebrate 1s ease-in-out";
        
        this.playCompletionSound();
        
        // Notification
        if (Notification.permission === "granted") {
            new Notification("Egg Timer Complete!", {
                body: "Your eggs are ready!",
                icon: "assets/Egg0.png"
            });
        }
        
        // Reset after celebration
        setTimeout(() => {
            document.querySelector(".egg-display-container").style.animation = "";
        }, 1000);
    }
    
    playCompletionSound() {
        const audio = new Audio("assets/bell.mp3");
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const timer = new EggTimer();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
    
    // Add CSS for pulse animation
    const style = document.createElement("style");
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }
        
        @keyframes celebrate {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(5deg) scale(1.1); }
            50% { transform: rotate(-5deg) scale(1.1); }
            75% { transform: rotate(5deg) scale(1.1); }
            100% { transform: rotate(0deg) scale(1); }
        }
        
        .cooking {
            background: radial-gradient(circle at center, #ffeb3b 0%, #ff9800 100%);
            animation: cooking-glow 2s infinite alternate;
        }
        
        @keyframes cooking-glow {
            0% { box-shadow: 0 0 20px rgba(255, 152, 0, 0.5); }
            100% { box-shadow: 0 0 40px rgba(255, 152, 0, 0.8); }
        }
    `;
    document.head.appendChild(style);
});