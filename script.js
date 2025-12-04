document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. MUSIC ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');

    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => { musicIcon.textContent = '🔊'; }).catch(error => {
            document.body.addEventListener('click', () => { bgMusic.play(); musicIcon.textContent = '🔊'; }, { once: true });
        });
    }
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.paused) { bgMusic.play(); musicIcon.textContent = '🔊'; } else { bgMusic.pause(); musicIcon.textContent = '🔇'; }
    });

    // --- 2. PASSWORD ---
    const modal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const unlockBtn = document.getElementById('unlockBtn');
    const closeBtn = document.querySelector('.close-modal');
    const errorMsg = document.getElementById('errorMsg');
    let currentCard = null;

    document.querySelectorAll('.gift-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (this.classList.contains('flipped')) return;
            if (this.dataset.locked === "true") {
                currentCard = this;
                modal.classList.add('active');
                passwordInput.value = '';
                errorMsg.style.display = 'none';
                passwordInput.focus();
            } else { flipCard(this); }
        });
    });

    function closeModal() { modal.classList.remove('active'); currentCard = null; }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

    function attemptUnlock() {
        const input = passwordInput.value.trim().toUpperCase();
        if (input === "5OZZ" || input === "50ZZ") {
            if (currentCard) { currentCard.dataset.locked = "false"; flipCard(currentCard); }
            closeModal();
        } else {
            errorMsg.style.display = 'block';
            passwordInput.classList.add('shake');
            setTimeout(() => passwordInput.classList.remove('shake'), 500);
        }
    }
    unlockBtn.addEventListener('click', attemptUnlock);
    passwordInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') attemptUnlock(); });

    function flipCard(card) { card.classList.add('flipped'); playConfetti(); }

    // --- 3. RUNAWAY BUTTON + FLASH ---
    const btnWrapper = document.getElementById('escapeBtnWrapper');
    const btn = document.getElementById('escapeButton');
    const flashOverlay = document.getElementById('flash-overlay');
    let lastFlashTime = 0;

    if (btnWrapper && btn) {
        let posX = 0, posY = 0, velX = 0, velY = 0;

        document.addEventListener('mousemove', (e) => {
            const rect = btnWrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(centerX - e.clientX, centerY - e.clientY);

            if (dist < 150) {
                const angle = Math.atan2(centerY - e.clientY, centerX - e.clientX);
                const force = (150 - dist) * 1.5;
                velX += Math.cos(angle) * force;
                velY += Math.sin(angle) * force;

                // FLASH LOGIC
                const now = Date.now();
                if (now - lastFlashTime > 1200) { // Cooldown between flashes (1.2s)

                    // Show image
                    flashOverlay.classList.add('active');

                    // Hide after 800ms (0.8 seconds) - Slower vanish
                    setTimeout(() => {
                        flashOverlay.classList.remove('active');
                    }, 800);

                    if(Math.random() < 0.5) showTaunt(rect.left, rect.top - 20);
                    lastFlashTime = now;
                }
            }
        });

        function updatePhysics() {
            velX *= 0.92; velY *= 0.92;
            posX += velX; posY += velY;
            if (posX > 300) velX -= 2; if (posX < -300) velX += 2;
            if (posY > 100) velY -= 2; if (posY < -100) velY += 2;
            btnWrapper.style.transform = `translate(${posX}px, ${posY}px)`;
            requestAnimationFrame(updatePhysics);
        }
        updatePhysics();

        btn.addEventListener('click', (e) => {
            e.stopPropagation(); playConfetti(); alert("OKAY FINE YOU CAUGHT IT! 🎉");
        });
    }

    function showTaunt(x, y) {
        const msgs = ["Too slow!", "5oze!", "Nope!", "Try harder!"];
        const el = document.createElement('div');
        el.className = 'taunt-text';
        el.innerText = msgs[Math.floor(Math.random() * msgs.length)];
        el.style.left = x + 'px'; el.style.top = y + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    // --- 4. EXTRAS ---
    window.copyToClipboard = function(button) {
        event.stopPropagation();
        const input = button.previousElementSibling;
        navigator.clipboard.writeText(input.value).then(() => {
            const original = button.innerText; button.innerText = "Copied!"; button.style.background = "#fff"; button.style.color = "#000";
            setTimeout(() => { button.innerText = original; button.style.background = ""; button.style.color = ""; }, 2000);
        });
    };

    function playConfetti() {
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            c.className = 'confetti'; c.innerHTML = Math.random() > 0.5 ? '🎉' : '✨';
            c.style.left = Math.random() * 100 + 'vw'; c.style.top = '-10px';
            c.style.fontSize = (Math.random() * 20 + 10) + 'px';
            c.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
            document.body.appendChild(c); setTimeout(() => c.remove(), 4000);
        }
    }
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fall { to { transform: translateY(100vh) rotate(360deg); } }`;
    document.head.appendChild(style);

    document.addEventListener('mousemove', function(e) {
        const trailContainer = document.getElementById('mouse-trail');
        if (!trailContainer) return;
        const dot = document.createElement('div');
        dot.className = 'trail-element';
        dot.style.left = e.pageX + 'px'; dot.style.top = e.pageY + 'px';
        const size = Math.random() * 10 + 5;
        dot.style.width = size + 'px'; dot.style.height = size + 'px';
        dot.style.background = ['#b366ff', '#ff66cc', '#66e6ff'][Math.floor(Math.random()*3)];
        dot.style.boxShadow = `0 0 ${size}px ${dot.style.background}`;
        trailContainer.appendChild(dot);
        setTimeout(() => { dot.style.transform = 'scale(0)'; dot.style.opacity = '0'; }, 50);
        setTimeout(() => dot.remove(), 500);
    });
});