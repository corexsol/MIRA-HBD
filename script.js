/* ============================================
GIFT CARD FLIP ANIMATION
============================================ */
document.addEventListener('DOMContentLoaded', function() {
  // Get all gift cards
  const giftCards = document.querySelectorAll('.gift-card');

  // Add click event to each gift card
  giftCards.forEach(card => {
    card.addEventListener('click', function() {
      // Toggle the flipped class
      this.classList.toggle('flipped');

      // Play confetti animation when card is revealed
      if (this.classList.contains('flipped')) {
        playConfetti();
      }
    });

    // Also add touch support for mobile
    card.addEventListener('touchend', function(e) {
      e.preventDefault();
      this.classList.toggle('flipped');
      if (this.classList.contains('flipped')) {
        playConfetti();
      }
    });
  });
});

/* ============================================
COPY TO CLIPBOARD FUNCTIONALITY
============================================ */
function copyToClipboard(button) {
  // Get the input field associated with this button
  const input = button.previousElementSibling;
  const code = input.value;

  // Copy to clipboard
  navigator.clipboard.writeText(code).then(() => {
    // Change button appearance to show success
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    button.classList.add('copied');

    // Reset button after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    // Fallback for older browsers
    console.error('Failed to copy:', err);
    alert('Gift code: ' + code);
  });
}

/* ============================================
CONFETTI ANIMATION
============================================ */
function playConfetti() {
  const confettiPieces = ['🎉', '✨', '🎊', '💝', '🎁', '⭐', '💫', '🌟'];
  const numberOfPieces = 30;

  for (let i = 0; i < numberOfPieces; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.textContent = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];

      // Random horizontal position
      const randomX = Math.random() * window.innerWidth;
      confetti.style.left = randomX + 'px';
      confetti.style.top = '0px';

      // Random animation delay
      confetti.style.animationDelay = (Math.random() * 0.5) + 's';

      // Random rotation
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      document.body.appendChild(confetti);

      // Remove confetti element after animation completes
      setTimeout(() => {
        confetti.remove();
      }, 2500);
    }, i * 30);
  }
}

/* ============================================
MOUSE TRAIL EFFECT
============================================ */
document.addEventListener('mousemove', function(e) {
  const trailContainer = document.getElementById('mouse-trail');
  if (!trailContainer) return;

  const trailElement = document.createElement('div');
  trailElement.className = 'trail-element';
  trailElement.style.left = e.pageX + 'px';
  trailElement.style.top = e.pageY + 'px';

  // Random size and color for a chaotic/magical feel
  const size = Math.random() * 10 + 5; // 5px to 15px
  trailElement.style.width = size + 'px';
  trailElement.style.height = size + 'px';

  const colors = ['var(--color-accent-purple)', 'var(--color-accent-pink)', 'var(--color-accent-cyan)'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  trailElement.style.background = randomColor;
  trailElement.style.boxShadow = `0 0 ${size}px ${randomColor}`;

  trailContainer.appendChild(trailElement);

  // Animate the element to fade out and shrink
  setTimeout(() => {
    trailElement.style.transform = 'scale(1)';
    trailElement.style.opacity = '0.8';
  }, 10); // Start animation shortly after creation

  setTimeout(() => {
    trailElement.style.transform = 'scale(0)';
    trailElement.style.opacity = '0';
  }, 100); // Start fade out

  // Remove the element after the animation is complete
  setTimeout(() => {
    trailElement.remove();
  }, 600);
});

/* ============================================
BACKGROUND MUSIC TOGGLE
============================================ */
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', function() {
    if (bgMusic.paused) {
      // Play music
      bgMusic.play().catch(err => {
        console.log('Audio playback failed:', err);
        // Some browsers require user interaction before playing
      });
      musicToggle.textContent = '🔊';
    } else {
      // Pause music
      bgMusic.pause();
      musicToggle.textContent = '🔇';
    }
  });
}

/* ============================================
SMOOTH SCROLL ENHANCEMENT
============================================ */
// Add smooth scroll behavior to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ============================================
SCROLL ANIMATIONS (Optional Enhancement)
============================================ */
// Observe elements for scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

/* ============================================
HILARIOUS MOUSE-AVOIDANCE BUTTON 😈
============================================ */
const escapeButton = document.getElementById('escapeButton');
const buttonWrapper = document.querySelector('.cta-button-wrapper');

if (escapeButton && buttonWrapper) {
  let escapeCount = 0;
  let isSpinning = false;
  let speedMultiplier = 1;
  let lastEscapeTime = 0;

  // Track incremental translation instead of absolute jumps
  let offsetX = 0;
  let offsetY = 0;

  const taunts = [
    " 5OZE!",
    " 5OZE 3NEE!",
    " HRM?",
    " 8RASHE!"
  ];

  // Create taunt message element
  const tauntElement = document.createElement('div');
  tauntElement.style.position = 'fixed';
  tauntElement.style.pointerEvents = 'none';
  tauntElement.style.fontSize = '1.5rem';
  tauntElement.style.fontWeight = 'bold';
  tauntElement.style.color = 'var(--color-accent-pink)';
  tauntElement.style.textShadow = '0 0 10px var(--color-glow-pink)';
  tauntElement.style.zIndex = '9999';
  tauntElement.style.opacity = '0';
  tauntElement.style.transition = 'opacity 0.3s ease';
  document.body.appendChild(tauntElement);

  function showTaunt(x, y) {
    const taunt = taunts[Math.floor(Math.random() * taunts.length)];
    tauntElement.textContent = taunt;
    tauntElement.style.left = x + 'px';
    tauntElement.style.top = (y - 50) + 'px';
    tauntElement.style.opacity = '1';

    setTimeout(() => {
      tauntElement.style.opacity = '0';
    }, 1000);
  }

  function makeButtonSpin() {
    if (!isSpinning) {
      isSpinning = true;
      escapeButton.style.animation = 'crazy-spin 0.5s ease-in-out';
      setTimeout(() => {
        escapeButton.style.animation = '';
        isSpinning = false;
      }, 500);
    }
  }

  // Add crazy spin and shake animations to CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes crazy-spin {
      0% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(90deg) scale(1.2); }
      50% { transform: rotate(180deg) scale(0.8); }
      75% { transform: rotate(270deg) scale(1.2); }
      100% { transform: rotate(360deg) scale(1); }
    }

    @keyframes shake-button {
      0%, 100% { transform: translateX(0); }
      10% { transform: translateX(-5px) rotate(-5deg); }
      20% { transform: translateX(5px) rotate(5deg); }
      30% { transform: translateX(-5px) rotate(-5deg); }
      40% { transform: translateX(5px) rotate(5deg); }
      50% { transform: translateX(-5px) rotate(-5deg); }
      60% { transform: translateX(5px) rotate(5deg); }
      70% { transform: translateX(-5px) rotate(-5deg); }
      80% { transform: translateX(5px) rotate(5deg); }
      90% { transform: translateX(-5px) rotate(-5deg); }
    }

    .cta-button-wrapper.panic {
      animation: shake-button 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('mousemove', function(e) {
    const currentTime = Date.now();
    const buttonRect = buttonWrapper.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate distance between mouse and button
    const distX = buttonCenterX - mouseX;
    const distY = buttonCenterY - mouseY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Dynamic difficulty
    const baseEscapeDistance = 120 + (escapeCount * 8);
    const escapeDistance = Math.min(baseEscapeDistance, 260);
    speedMultiplier = 1 + (escapeCount * 0.08);

    if (distance < escapeDistance) {
      buttonWrapper.classList.add('panic');
      setTimeout(() => buttonWrapper.classList.remove('panic'), 300);

      // Direction away from mouse
      const angle = Math.atan2(distY, distX);
      const randomAngle = angle + (Math.random() - 0.5) * 0.4;

      const escapeIntensity = 1 - (distance / escapeDistance);
      const step =
        (40 + Math.random() * 20) *
        speedMultiplier *
        (0.4 + escapeIntensity);

      let deltaX = Math.cos(randomAngle) * step;
      let deltaY = Math.sin(randomAngle) * step;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const futureX = buttonCenterX + deltaX;
      const futureY = buttonCenterY + deltaY;

      const margin = 80;
      // Bounce from edges
      if (futureX < margin || futureX > viewportWidth - margin) {
        deltaX = -deltaX * 0.6;
        makeButtonSpin();
      }
      if (futureY < margin || futureY > viewportHeight - margin) {
        deltaY = -deltaY * 0.6;
        makeButtonSpin();
      }

      offsetX += deltaX;
      offsetY += deltaY;

      const rotation = Math.random() * 30 - 15;
      buttonWrapper.style.transition = `transform ${0.18 / speedMultiplier}s ease-out`;
      buttonWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;

      // Throttled taunts and special behavior
      if (currentTime - lastEscapeTime > 800) {
        escapeCount++;
        showTaunt(buttonCenterX, buttonCenterY);
        lastEscapeTime = currentTime;

        if (escapeCount % 5 === 0) {
          makeButtonSpin();
          setTimeout(() => {
            // Small random "teleport" relative to current offset
            offsetX += (Math.random() - 0.5) * 120;
            offsetY += (Math.random() - 0.5) * 120;
            buttonWrapper.style.transition = 'transform 0.12s ease-out';
            buttonWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          }, 250);
        }
      }
    } else {
      // Ease back to origin when mouse is far away
      if (distance > escapeDistance + 80) {
        offsetX *= 0.9;
        offsetY *= 0.9;

        if (Math.abs(offsetX) < 0.5) offsetX = 0;
        if (Math.abs(offsetY) < 0.5) offsetY = 0;

        buttonWrapper.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        buttonWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(0deg)`;

        if (distance > escapeDistance + 160) {
          escapeCount = Math.max(0, escapeCount - 1);
          speedMultiplier = Math.max(1, speedMultiplier - 0.05);
        }
      }
    }
  });

  // When button is actually clicked, show victory message
  escapeButton.addEventListener('click', function() {
    tauntElement.style.fontSize = '2rem';
    tauntElement.textContent = '🎉 You got me! 🎉';
    tauntElement.style.left = '50%';
    tauntElement.style.top = '20%';
    tauntElement.style.transform = 'translateX(-50%)';
    tauntElement.style.opacity = '1';

    // Add celebration
    playConfetti();

    setTimeout(() => {
      tauntElement.style.opacity = '0';
    }, 2000);
  });
}

/* ============================================
CARD ENTRANCE ANIMATIONS
============================================ */
window.addEventListener('load', function() {
  const impossibleCards = document.querySelectorAll('.impossible-card');
  impossibleCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });

  const roastItems = document.querySelectorAll('.roast-item');
  roastItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    setTimeout(() => {
      item.style.transition = 'all 0.5s ease-out';
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
    }, index * 80);
  });
});
