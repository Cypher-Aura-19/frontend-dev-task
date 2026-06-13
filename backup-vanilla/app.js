/* ===================================
   app.js – GSAP Animations for Theme Toggle & Active Nav
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
  const navIcons = document.querySelectorAll('.nav-icon-item');
  const indicator = document.getElementById('active-indicator');
  const themeToggle = document.getElementById('theme-toggle');
  const overlay = document.getElementById('theme-overlay');
  const html = document.documentElement;

  // ─────────────────────────────────────
  // 1. Active Indicator – Slide to active icon
  // ─────────────────────────────────────
  function moveIndicator(target, animate = true) {
    const iconRect = target.getBoundingClientRect();
    const parentRect = target.closest('.nav-icons-wrapper').getBoundingClientRect();

    const activeWidth = parseFloat(getComputedStyle(indicator).width) || 28;
    const x = iconRect.left - parentRect.left + (iconRect.width - activeWidth) / 2;

    if (animate) {
      gsap.to(indicator, {
        x: x,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: true,
      });

      // Glow pulse on the indicator
      gsap.fromTo(indicator,
        { boxShadow: `0 2px 10px var(--accent-glow)` },
        {
          boxShadow: `0 2px 20px var(--accent-glow)`,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
        }
      );
    } else {
      gsap.set(indicator, { x: x });
    }
  }

  // Set initial indicator position (no animation)
  const initialActive = document.querySelector('.nav-icon-item.active');
  if (initialActive) {
    // Small delay to let fonts load and layout settle
    requestAnimationFrame(() => {
      moveIndicator(initialActive, false);
    });
  }

  // Helper to sync active states to mobile menu links
  function syncMobileMenuLinkActive(targetSuffix) {
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    mobileLinks.forEach(l => {
      if (l.getAttribute('data-target') === targetSuffix) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });
  }

  // Click handler for nav icons
  navIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();

      // Skip if already active
      if (icon.classList.contains('active')) return;

      // Remove active class from all
      navIcons.forEach(i => i.classList.remove('active'));

      // Animate icon pop
      gsap.fromTo(icon.querySelector('.material-icons-outlined'),
        { scale: 0.7, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.7)' }
      );

      // Add active to clicked
      icon.classList.add('active');

      // Ensure the indicator is scaled in and visible
      gsap.to(indicator, { scaleX: 1, duration: 0.3, ease: 'power2.out' });

      // Slide indicator
      moveIndicator(icon, true);

      // Sync mobile active state
      const targetSuffix = icon.id.replace('nav-', '');
      syncMobileMenuLinkActive(targetSuffix);
    });
  });

  // Click handlers for right-side desktop links
  const rightLinks = [
    document.getElementById('nav-gallery-link'),
    document.getElementById('nav-support-link')
  ];

  rightLinks.forEach(link => {
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from center icons
        navIcons.forEach(i => i.classList.remove('active'));

        // Fade/scale out active indicator
        gsap.to(indicator, { scaleX: 0, duration: 0.35, ease: 'power2.inOut' });

        // Sync mobile active state
        const targetSuffix = link.id.replace('nav-', '');
        syncMobileMenuLinkActive(targetSuffix);
      });
    }
  });

  // Recalculate indicator on resize
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-icon-item.active');
    if (active) moveIndicator(active, false);
  });

  // ─────────────────────────────────────
  // 2. Theme Toggle – Seamless Clip-Path Wipe (bottom → top)
  //    Clones the page into the overlay with the NEW theme,
  //    then reveals it from bottom to top so bg + text + icons
  //    all change together at the clip boundary.
  // ─────────────────────────────────────
  let isAnimating = false;

  themeToggle.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    // 1) Clone the visible page content into the overlay
    overlay.innerHTML = '';

    const navbarClone = document.getElementById('main-navbar').cloneNode(true);
    const historyClone = document.getElementById('history-section').cloneNode(true);
    const contentClone = document.querySelector('.page-content').cloneNode(true);

    // Strip IDs from clones so there are no duplicates in the DOM
    navbarClone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    navbarClone.removeAttribute('id');
    historyClone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    historyClone.removeAttribute('id');
    contentClone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    contentClone.removeAttribute('id');

    overlay.appendChild(navbarClone);
    overlay.appendChild(historyClone);
    overlay.appendChild(contentClone);

    // 2) Apply the NEW theme to the overlay — CSS variables cascade
    //    so all cloned elements render in the target theme
    overlay.setAttribute('data-theme', newTheme);

    // 3) Single seamless wipe: reveal overlay from bottom → top
    gsap.fromTo(overlay,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.55,
        ease: 'power3.inOut',
        onComplete: () => {
          // 1. Kill all CSS transitions so swap is instant on the real page
          document.body.classList.add('no-transition');

          // 2. Swap theme on the real page
          html.setAttribute('data-theme', newTheme);

          // 3. Wait for the browser to paint the real page in the new theme
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // 4. Hide overlay (both are now in the same theme state, so this is seamless)
              overlay.style.clipPath = 'inset(100% 0 0 0)';
              overlay.innerHTML = '';
              overlay.removeAttribute('data-theme');
              overlay.style.clipPath = '';

              // 5. Re-enable transitions
              requestAnimationFrame(() => {
                document.body.classList.remove('no-transition');
                isAnimating = false;
              });
            });
          });

          // Subtle pop on the toggle button
          gsap.fromTo(themeToggle,
            { scale: 0.9 },
            { scale: 1, duration: 0.25, ease: 'back.out(2.5)' }
          );
        }
      }
    );
  });

  // ─────────────────────────────────────
  // 3. Entrance Animation on page load
  // ─────────────────────────────────────
  gsap.from('.navbar__logo', { opacity: 0, x: -20, duration: 0.6, ease: 'power3.out', delay: 0.1 });
  gsap.from('.navbar__right', { opacity: 0, x: 20, duration: 0.6, ease: 'power3.out', delay: 0.1 });

  gsap.from('.nav-icon-item', {
    opacity: 0,
    y: 12,
    duration: 0.5,
    ease: 'power3.out',
    stagger: 0.07,
    delay: 0.2,
  });

  gsap.from('#active-indicator', {
    scaleX: 0,
    duration: 0.5,
    ease: 'power3.out',
    delay: 0.6,
  });

  gsap.from('.sidebar', {
    opacity: 0,
    x: -25,
    duration: 0.65,
    ease: 'power3.out',
    delay: 0.3,
  });

  gsap.from('.workspace', {
    opacity: 0,
    x: 25,
    duration: 0.65,
    ease: 'power3.out',
    delay: 0.3,
  });

  // ─────────────────────────────────────
  // 4. History Component – Load images
  // ─────────────────────────────────────
  const historyTrack = document.getElementById('history-track');

  // Curated Picsum IDs for modern, artistic, AI-like images
  const imageIds = [
    1011, 1025, 1035, 1036, 1039, 1043, 1044, 1047,
    1050, 1055, 1059, 1060, 1062, 1067, 1069
  ];

  // Create skeleton cards first, then load images
  imageIds.forEach((id, index) => {
    const card = document.createElement('div');
    card.className = 'history__card';
    card.title = `AI Generated #${index + 1}`;

    const img = document.createElement('img');
    img.src = `https://picsum.photos/id/${id}/200/200`;
    img.alt = `AI Generated Image ${index + 1}`;
    img.loading = 'lazy';

    // When image loads, fade it in and remove skeleton
    img.onload = () => {
      img.classList.add('loaded');
      card.classList.add('loaded');
    };

    card.appendChild(img);
    historyTrack.appendChild(card);
  });

  // Stagger-animate history cards in
  gsap.from('.history', {
    opacity: 0,
    y: 15,
    duration: 0.5,
    ease: 'power3.out',
    delay: 0.4,
  });

  gsap.from('.history__card', {
    opacity: 0,
    scale: 0.8,
    duration: 0.4,
    ease: 'back.out(1.4)',
    stagger: 0.04,
    delay: 0.6,
  });

  // ─────────────────────────────────────
  // 5. Interactive Prompter Controls & Dynamic Adaptive Sidebar
  // ─────────────────────────────────────
  let currentMode = 'image'; // 'image' or 'video'

  const imageModels = [
    { text: 'Flux Ultra', value: 'flux-ultra' },
    { text: 'Flux Schnell', value: 'flux-schnell' },
    { text: 'SD 3.5 Large', value: 'sd-3-5' },
    { text: 'Midjourney v6', value: 'midjourney-v6' }
  ];

  const videoModels = [
    { text: 'Sora 1.0', value: 'sora-1-0' },
    { text: 'Runway Gen-3', value: 'runway-gen-3' },
    { text: 'Kling AI', value: 'kling-ai' },
    { text: 'Luma Dream Machine', value: 'luma-dream' }
  ];

  const btnImage = document.getElementById('btn-image');
  const btnVideo = document.getElementById('btn-video');
  const toggleSlider = document.getElementById('toggle-slider');

  if (btnImage && btnVideo && toggleSlider) {
    btnImage.addEventListener('click', () => {
      if (currentMode === 'image') return;
      currentMode = 'image';

      btnImage.classList.add('active');
      btnVideo.classList.remove('active');
      gsap.to(toggleSlider, { left: '3px', duration: 0.3, ease: 'power2.out' });

      // Change count label with subtle animation
      const labelCount = document.getElementById('label-count-type');
      if (labelCount) {
        gsap.fromTo(labelCount,
          { opacity: 0, y: -5 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', onStart: () => {
            labelCount.textContent = '# Images';
          }}
        );
      }

      // Update model choices
      updateModelDropdown(false);

      // Animate prompt box container
      const promptBox = document.querySelector('.sidebar__prompt-box');
      if (promptBox) {
        gsap.fromTo(promptBox,
          { scale: 0.97, borderColor: 'var(--accent)' },
          { scale: 1, borderColor: 'var(--border-color)', duration: 0.45, ease: 'back.out(2)' }
        );
      }

      // Animate prompt text swap using premium slide-and-fade transition
      const defaultImgPrompt = "Describe your imaginations to be converted to piece of art...";
      const input = document.getElementById('prompt-input');
      if (input) {
        gsap.to(input, {
          opacity: 0,
          x: -20,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            input.value = "";
            input.placeholder = defaultImgPrompt;
            gsap.set(input, { x: 20 });
            gsap.to(input, {
              opacity: 1,
              x: 0,
              duration: 0.35,
              ease: 'back.out(1.5)'
            });
          }
        });
      }

      // Animate generate button and icon context swap
      const generateIcon = document.querySelector('.generate-icon');
      if (generateIcon) {
        gsap.to(generateIcon, {
          rotate: -180,
          scale: 0.5,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            generateIcon.textContent = 'auto_awesome';
            gsap.to(generateIcon, {
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.35,
              ease: 'back.out(1.5)'
            });
          }
        });
      }

      const generateBtnEl = document.getElementById('generate-btn');
      if (generateBtnEl) {
        gsap.fromTo(generateBtnEl,
          { scale: 0.93 },
          { scale: 1, duration: 0.4, ease: 'back.out(2)' }
        );
      }

      // Hide video-only advance options
      gsap.to('.video-only-setting', {
        opacity: 0,
        height: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        stagger: 0.03,
        onComplete: () => {
          gsap.set('.video-only-setting', { display: 'none' });
          
          // Force height recalculation if accordion is open
          const advHeader = document.getElementById('accordion-advance-header');
          const advContent = document.getElementById('accordion-advance-content');
          if (advHeader && advHeader.classList.contains('active') && advContent) {
            gsap.set(advContent, { height: 'auto' });
          }
        }
      });
    });

    btnVideo.addEventListener('click', () => {
      if (currentMode === 'video') return;
      currentMode = 'video';

      btnVideo.classList.add('active');
      btnImage.classList.remove('active');
      gsap.to(toggleSlider, { left: '50%', duration: 0.3, ease: 'power2.out' });

      // Change count label with subtle animation
      const labelCount = document.getElementById('label-count-type');
      if (labelCount) {
        gsap.fromTo(labelCount,
          { opacity: 0, y: -5 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', onStart: () => {
            labelCount.textContent = '# Videos';
          }}
        );
      }

      // Update model choices
      updateModelDropdown(true);

      // Animate prompt box container
      const promptBox = document.querySelector('.sidebar__prompt-box');
      if (promptBox) {
        gsap.fromTo(promptBox,
          { scale: 0.97, borderColor: 'var(--accent)' },
          { scale: 1, borderColor: 'var(--border-color)', duration: 0.45, ease: 'back.out(2)' }
        );
      }

      // Animate prompt text swap using premium slide-and-fade transition
      const defaultVidPrompt = "Describe your imaginations to be converted to high-definition cinematic video clip...";
      const input = document.getElementById('prompt-input');
      if (input) {
        gsap.to(input, {
          opacity: 0,
          x: 20,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            input.value = "";
            input.placeholder = defaultVidPrompt;
            gsap.set(input, { x: -20 });
            gsap.to(input, {
              opacity: 1,
              x: 0,
              duration: 0.35,
              ease: 'back.out(1.5)'
            });
          }
        });
      }

      // Animate generate button and icon context swap
      const generateIcon = document.querySelector('.generate-icon');
      if (generateIcon) {
        gsap.to(generateIcon, {
          rotate: 180,
          scale: 0.5,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            generateIcon.textContent = 'videocam';
            gsap.to(generateIcon, {
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.35,
              ease: 'back.out(1.5)'
            });
          }
        });
      }

      const generateBtnEl = document.getElementById('generate-btn');
      if (generateBtnEl) {
        gsap.fromTo(generateBtnEl,
          { scale: 0.93 },
          { scale: 1, duration: 0.4, ease: 'back.out(2)' }
        );
      }

      // Show video-only advance options
      gsap.set('.video-only-setting', { display: 'flex', height: 0, opacity: 0 });
      gsap.to('.video-only-setting', {
        height: 'auto',
        opacity: 1,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.out',
        onComplete: () => {
          // Force height recalculation if accordion is open
          const advHeader = document.getElementById('accordion-advance-header');
          const advContent = document.getElementById('accordion-advance-content');
          if (advHeader && advHeader.classList.contains('active') && advContent) {
            gsap.set(advContent, { height: 'auto' });
          }
        }
      });
    });
  }

  // Collapsible Accordions
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const arrow = header.querySelector('.arrow');
      const isActive = header.classList.contains('active');

      if (isActive) {
        header.classList.remove('active');
        gsap.to(content, { height: 0, duration: 0.35, ease: 'power2.out' });
        gsap.to(arrow, { rotation: 0, duration: 0.25, ease: 'power1.out' });
      } else {
        header.classList.add('active');
        gsap.set(content, { height: 'auto' });
        const targetHeight = content.offsetHeight;
        gsap.set(content, { height: 0 });

        gsap.to(content, {
          height: targetHeight,
          duration: 0.4,
          ease: 'power3.out',
          onComplete: () => {
            if (header.classList.contains('active')) {
              gsap.set(content, { height: 'auto' });
            }
          }
        });
        gsap.to(arrow, { rotation: 180, duration: 0.25, ease: 'power1.out' });
      }
    });
  });

  // Sliders value feedback
  const cfgInput = document.getElementById('setting-cfg');
  const cfgVal = document.getElementById('val-cfg');
  if (cfgInput && cfgVal) {
    cfgInput.addEventListener('input', () => {
      cfgVal.textContent = cfgInput.value;
    });
  }

  const stepsInput = document.getElementById('setting-steps');
  const stepsVal = document.getElementById('val-steps');
  if (stepsInput && stepsVal) {
    stepsInput.addEventListener('input', () => {
      stepsVal.textContent = stepsInput.value;
    });
  }

  // Video duration and motion sliders feedback
  const durationInput = document.getElementById('setting-duration');
  const durationVal = document.getElementById('val-duration');
  if (durationInput && durationVal) {
    durationInput.addEventListener('input', () => {
      durationVal.textContent = durationInput.value + 's';
    });
  }

  const motionInput = document.getElementById('setting-motion');
  const motionVal = document.getElementById('val-motion');
  if (motionInput && motionVal) {
    motionInput.addEventListener('input', () => {
      motionVal.textContent = motionInput.value;
    });
  }

  // Styles selecting active toggling
  const styleBadges = document.querySelectorAll('.style-badge');
  styleBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      badge.classList.toggle('active');
    });
  });

  // ─────────────────────────────────────
  // 5.5. Custom Dropdown Select System & Dynamic Modifiers
  // ─────────────────────────────────────
  function setupDropdown(dropdown) {
    const trigger = dropdown.querySelector('.custom-dropdown__trigger');
    const selectedText = dropdown.querySelector('.custom-dropdown__selected');
    
    // Toggle trigger
    if (!trigger.dataset.bound) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-dropdown').forEach(other => {
          if (other !== dropdown) other.classList.remove('open');
        });
        dropdown.classList.toggle('open');
      });
      trigger.dataset.bound = "true";
    }

    // Toggle items
    const items = dropdown.querySelectorAll('.custom-dropdown__item');
    items.forEach(item => {
      // Recreate item to strip old listeners if any
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);

      newItem.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = newItem.getAttribute('data-value');
        const text = newItem.textContent;

        dropdown.setAttribute('data-value', value);
        selectedText.textContent = text;

        dropdown.querySelectorAll('.custom-dropdown__item').forEach(i => i.classList.remove('active'));
        newItem.classList.add('active');
        dropdown.classList.remove('open');
      });
    });
  }

  function updateModelDropdown(isVideo) {
    const dropdown = document.getElementById('dropdown-model');
    if (!dropdown) return;

    const selectedText = dropdown.querySelector('.custom-dropdown__selected');
    const menu = dropdown.querySelector('.custom-dropdown__menu');
    const models = isVideo ? videoModels : imageModels;

    gsap.fromTo(selectedText,
      { opacity: 1, scale: 1 },
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.15,
        onComplete: () => {
          selectedText.textContent = models[0].text;
          dropdown.setAttribute('data-value', models[0].value);

          menu.innerHTML = models.map((m, idx) => `
            <div class="custom-dropdown__item${idx === 0 ? ' active' : ''}" data-value="${m.value}">${m.text}</div>
          `).join('');

          setupDropdown(dropdown);

          gsap.to(selectedText, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' });
        }
      }
    );
  }

  // Setup all initial dropdowns
  const customDropdowns = document.querySelectorAll('.custom-dropdown');
  customDropdowns.forEach(dropdown => setupDropdown(dropdown));

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
  });

  // ─────────────────────────────────────
  // 5.8. Video Mock Database & Public API Integration
  // ─────────────────────────────────────
  let videoDatabase = [];

  const workingVideoUrls = [
    "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/echo-hereweare.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://www.w3schools.com/html/mov_bbb.mp4"
  ];

  function getWorkingUrl(originalUrl, index) {
    if (originalUrl && originalUrl.includes('commondatastorage.googleapis.com')) {
      return workingVideoUrls[index % workingVideoUrls.length];
    }
    return originalUrl;
  }

  const fallbackVideos = [
    {
      title: "Big Buck Bunny",
      videoUrl: workingVideoUrls[0],
      duration: "0:15",
      description: "A large friendly rabbit gets revenge on three pests."
    },
    {
      title: "Elephant Dream",
      videoUrl: workingVideoUrls[1],
      duration: "0:15",
      description: "Blender open movie cinematic dreamscapes."
    },
    {
      title: "For Bigger Blazes",
      videoUrl: workingVideoUrls[2],
      duration: "0:15",
      description: "Cinematic performance showcase."
    },
    {
      title: "For Bigger Escapes",
      videoUrl: workingVideoUrls[3],
      duration: "0:15",
      description: "High speed action and visual effects."
    },
    {
      title: "Tears of Steel",
      videoUrl: workingVideoUrls[4],
      duration: "0:12",
      description: "Sci-fi robot invasion in Amsterdam city."
    },
    {
      title: "Sintel",
      videoUrl: workingVideoUrls[0],
      duration: "0:15",
      description: "Cinematic dragon fantasy animation."
    }
  ];

  async function fetchVideoDatabase() {
    try {
      const response = await fetch('https://gist.githubusercontent.com/poudyalanil/1685db9c4f17c68d5cb9ffaa3f59e3a6/raw/');
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      videoDatabase = data.map((item, idx) => ({
        title: item.title,
        videoUrl: getWorkingUrl(item.videoUrl.replace(/^http:/, 'https:'), idx),
        duration: item.duration || "0:15",
        description: item.description || ""
      }));
      console.log('Video Database loaded from Gist API:', videoDatabase.length, 'videos');
    } catch (err) {
      console.warn('API fetch failed, utilizing robust fallback database:', err);
      videoDatabase = fallbackVideos;
    }
  }

  fetchVideoDatabase();

  // ─────────────────────────────────────
  // 6. Image Generation & Workspace Animation
  // ─────────────────────────────────────
  const generateBtn = document.getElementById('generate-btn');
  const promptInput = document.getElementById('prompt-input');
  const workspaceScrollable = document.getElementById('workspace-scrollable');

  // Helper functions for video player and controls
  function findMatchedVideo(prompt, index) {
    const db = videoDatabase.length > 0 ? videoDatabase : fallbackVideos;
    const lower = prompt.toLowerCase();
    
    let matches = [];
    if (lower.includes('bunny') || lower.includes('rabbit')) {
      matches = db.filter(v => v.title.toLowerCase().includes('bunny'));
    } else if (lower.includes('dream') || lower.includes('elephant')) {
      matches = db.filter(v => v.title.toLowerCase().includes('dream'));
    } else if (lower.includes('fire') || lower.includes('blaze') || lower.includes('light')) {
      matches = db.filter(v => v.title.toLowerCase().includes('blazes'));
    } else if (lower.includes('escape') || lower.includes('batman') || lower.includes('action')) {
      matches = db.filter(v => v.title.toLowerCase().includes('escape'));
    } else if (lower.includes('tears') || lower.includes('steel') || lower.includes('robot') || lower.includes('sci-fi') || lower.includes('city')) {
      matches = db.filter(v => v.title.toLowerCase().includes('tears'));
    } else if (lower.includes('sintel') || lower.includes('dragon') || lower.includes('fantasy') || lower.includes('girl')) {
      matches = db.filter(v => v.title.toLowerCase().includes('sintel'));
    }

    if (matches.length > 0) {
      return matches[index % matches.length];
    }
    
    return db[index % db.length];
  }

  function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function setupVideoControls(card, video) {
    const playBtn = card.querySelector('.video-play-btn');
    const playIcon = playBtn.querySelector('.material-icons-outlined');
    const volumeBtn = card.querySelector('.video-volume-btn');
    const volumeIcon = volumeBtn.querySelector('.material-icons-outlined');
    const progressFill = card.querySelector('.video-progress-fill');
    const timeText = card.querySelector('.video-time');
    const progressBar = card.querySelector('.video-progress-bar');

    function togglePlay() {
      if (video.paused) {
        video.play();
        playIcon.textContent = 'pause';
        gsap.fromTo(playBtn, { scale: 0.8 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
      } else {
        video.pause();
        playIcon.textContent = 'play_arrow';
        gsap.fromTo(playBtn, { scale: 0.8 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
      }
    }

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    card.querySelector('.video-overlay__center').addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    volumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      volumeIcon.textContent = video.muted ? 'volume_off' : 'volume_up';
      gsap.fromTo(volumeBtn, { scale: 0.8 }, { scale: 1, duration: 0.2 });
    });

    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        progressFill.style.width = pct + "%";
        timeText.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    });

    progressBar.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    });
  }
  function addVideoToHistory(matchedVideo) {
    const historyCard = document.createElement('div');
    historyCard.className = 'history__card video-history-card';
    historyCard.title = matchedVideo.title;

    const hVideo = document.createElement('video');
    hVideo.src = matchedVideo.videoUrl;
    hVideo.loop = true;
    hVideo.muted = true;
    hVideo.setAttribute('muted', '');
    hVideo.playsInline = true;
    hVideo.setAttribute('playsinline', '');
    hVideo.autoplay = true;

    const playBadge = document.createElement('span');
    playBadge.className = 'material-icons-outlined history-video-badge';
    playBadge.textContent = 'play_circle';

    let hasLoaded = false;
    const handleLoad = () => {
      if (hasLoaded) return;
      hasLoaded = true;
      hVideo.classList.add('loaded');
      historyCard.classList.add('loaded');
      hVideo.play().catch(err => console.log('History video play blocked:', err));
    };

    hVideo.addEventListener('loadeddata', handleLoad);
    hVideo.addEventListener('loadedmetadata', handleLoad);
    hVideo.addEventListener('canplay', handleLoad);
    hVideo.addEventListener('canplaythrough', handleLoad);
    hVideo.addEventListener('error', (e) => {
      console.warn('History video load failed:', e);
      handleLoad();
    });

    // Fail-safe fallback (1s)
    setTimeout(handleLoad, 1000);

    historyCard.appendChild(hVideo);
    historyCard.appendChild(playBadge);

    const track = document.getElementById('history-track');
    track.insertBefore(historyCard, track.firstChild);

    gsap.from(historyCard, {
      width: 0,
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      clearProps: 'width'
    });
  }

  function loadVideoForCard(card, matchedVideo, index) {
    const video = document.createElement('video');
    video.src = matchedVideo.videoUrl;
    video.loop = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.autoplay = true;

    // Append video element to the DOM immediately
    card.appendChild(video);

    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    overlay.innerHTML = `
      <div class="video-overlay__center">
        <button class="video-play-btn" aria-label="Play video">
          <span class="material-icons-outlined">pause</span>
        </button>
      </div>
      <div class="video-controls-bottom">
        <div class="video-progress-bar">
          <div class="video-progress-fill"></div>
        </div>
        <div class="video-time-row">
          <span class="video-time">0:00 / 0:15</span>
          <button class="video-volume-btn" aria-label="Mute/unmute video">
            <span class="material-icons-outlined">volume_off</span>
          </button>
        </div>
      </div>
    `;

    const durationBadge = document.createElement('div');
    durationBadge.className = 'video-duration-badge';
    durationBadge.textContent = matchedVideo.duration || '0:15';

    card.appendChild(overlay);
    card.appendChild(durationBadge);

    const loadingOverlay = card.querySelector('.video-loading-overlay');
    
    let hasLoaded = false;
    const handleLoad = () => {
      if (hasLoaded) return;
      hasLoaded = true;

      if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => loadingOverlay.remove(), 400);
      }
      card.classList.add('loaded');
      video.play().catch(err => console.log('Autoplay blocked:', err));
      
      gsap.fromTo(card,
        { scale: 0.96 },
        { scale: 1, duration: 0.4, ease: 'back.out(1.8)' }
      );
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('loadedmetadata', handleLoad);
    video.addEventListener('canplay', handleLoad);
    video.addEventListener('canplaythrough', handleLoad);
    video.addEventListener('error', (e) => {
      console.warn('Workspace video load failed:', e);
      handleLoad();
    });

    const updateDuration = () => {
      if (video.duration && video.duration !== Infinity) {
        const durationFormatted = formatTime(video.duration);
        durationBadge.textContent = durationFormatted;
        const timeText = overlay.querySelector('.video-time');
        if (timeText) {
          timeText.textContent = `0:00 / ${durationFormatted}`;
        }
      }
    };

    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('durationchange', updateDuration);

    // Fail-safe fallback (1.5s to ensure load catches)
    setTimeout(handleLoad, 1500);

    setupVideoControls(card, video);
    addVideoToHistory(matchedVideo);
  }

  // Curated modern image database for mock queries
  const imagesDatabase = {
    cat: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80',
      'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&q=80',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&q=80',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&q=80'
    ],
    cyberpunk: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&q=80'
    ],
    city: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80',
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80',
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=500&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80'
    ],
    forest: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=500&q=80'
    ],
    space: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80',
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500&q=80',
      'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=500&q=80'
    ],
    car: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&q=80'
    ],
    anime: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80',
      'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=500&q=80',
      'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=500&q=80'
    ],
    general: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&q=80'
    ]
  };

  if (generateBtn && promptInput && workspaceScrollable) {
    generateBtn.addEventListener('click', () => {
      let prompt = promptInput.value.trim();
      if (!prompt) {
        prompt = currentMode === 'video' 
          ? "A cinematic space odyssey showing a spaceship escaping a black hole, neon lights, 4k"
          : "A high-tech cyberpunk cat looking out over a neon-lit futuristic city grid, detailed textures";
        promptInput.value = prompt;
      }

      const countDropdown = document.getElementById('dropdown-count');
      const ratioDropdown = document.getElementById('dropdown-ratio');
      const modelSelectedSpan = document.querySelector('#dropdown-model .custom-dropdown__selected');

      const count = parseInt(countDropdown.getAttribute('data-value'), 10) || 4;
      const ratio = ratioDropdown.getAttribute('data-value') || '1-1';
      const modelText = modelSelectedSpan ? modelSelectedSpan.textContent : "Flux Ultra";

      const row = document.createElement('div');
      row.className = 'generation-row';

      const info = document.createElement('div');
      info.className = 'generation-row__info';

      const promptP = document.createElement('p');
      promptP.className = 'generation-row__prompt';
      promptP.textContent = prompt;

      const badgeWrapper = document.createElement('div');
      badgeWrapper.className = 'generation-row__badge-wrapper';

      const grid = document.createElement('div');

      info.appendChild(promptP);
      info.appendChild(badgeWrapper);

      // ─────────────────────────────────────
      // Video Mode Generation Logic
      // ─────────────────────────────────────
      if (currentMode === 'video') {
        const durationValText = document.getElementById('val-duration').textContent;
        const motionValText = document.getElementById('val-motion').textContent;
        const cameraSelectedSpan = document.querySelector('#dropdown-camera .custom-dropdown__selected');
        const cameraText = cameraSelectedSpan ? cameraSelectedSpan.textContent : "Zoom In";

        badgeWrapper.innerHTML = `
          <span class="generation-row__model-badge">${modelText}</span>
          <span class="generation-row__model-badge">${durationValText}</span>
          <span class="generation-row__model-badge">Motion: ${motionValText}</span>
          <span class="generation-row__model-badge">${cameraText}</span>
        `;

        const cardElements = [];
        for (let i = 0; i < count; i++) {
          const card = document.createElement('div');
          card.className = 'workspace-card video-card';
          card.innerHTML = `
            <div class="video-loading-overlay">
              <div class="video-loading-spinner"></div>
              <div class="video-loading-status">Synthesizing frames...</div>
              <div class="video-loading-progress">0%</div>
            </div>
          `;
          grid.appendChild(card);
          cardElements.push(card);
        }

        grid.className = `generation-row__images-grid layout-${ratio} video-grid`;
        row.appendChild(info);
        row.appendChild(grid);
        workspaceScrollable.insertBefore(row, workspaceScrollable.firstChild);

        gsap.fromTo(row, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });

        cardElements.forEach((card, idx) => {
          const progressEl = card.querySelector('.video-loading-progress');
          const statusEl = card.querySelector('.video-loading-status');
          
          const progressObj = { value: 0 };
          const statuses = [
            "Synthesizing motion frames...",
            "Simulating motion vectors...",
            "Interpolating flow keyframes...",
            "Encoding multi-pass audio...",
            "Polishing visual elements..."
          ];

          gsap.to(progressObj, {
            value: 100,
            duration: 2.0 + Math.random() * 0.8,
            ease: 'none',
            onUpdate: () => {
              const val = Math.floor(progressObj.value);
              progressEl.textContent = val + "%";
              const statusIdx = Math.min(Math.floor(val / 20), statuses.length - 1);
              statusEl.textContent = statuses[statusIdx];
            },
            onComplete: () => {
              const matchedVideo = findMatchedVideo(prompt, idx);
              loadVideoForCard(card, matchedVideo, idx);
            }
          });
        });

        return; // Complete generation branch
      }

      // ─────────────────────────────────────
      // Image Mode Generation Logic
      // ─────────────────────────────────────
      const modelBadge = document.createElement('span');
      modelBadge.className = 'generation-row__model-badge';
      modelBadge.textContent = modelText;
      badgeWrapper.appendChild(modelBadge);

      grid.className = `generation-row__images-grid layout-${ratio}`;

      const cardElements = [];
      for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'workspace-card';
        grid.appendChild(card);
        cardElements.push(card);
      }

      row.appendChild(info);
      row.appendChild(grid);

      workspaceScrollable.insertBefore(row, workspaceScrollable.firstChild);

      gsap.fromTo(row,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      const lowerPrompt = prompt.toLowerCase();
      let matchedList = imagesDatabase.general;
      if (lowerPrompt.includes('cat') || lowerPrompt.includes('feline')) matchedList = imagesDatabase.cat;
      else if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon') || lowerPrompt.includes('futuristic')) matchedList = imagesDatabase.cyberpunk;
      else if (lowerPrompt.includes('city') || lowerPrompt.includes('tokyo') || lowerPrompt.includes('street')) matchedList = imagesDatabase.city;
      else if (lowerPrompt.includes('forest') || lowerPrompt.includes('nature') || lowerPrompt.includes('tree')) matchedList = imagesDatabase.forest;
      else if (lowerPrompt.includes('space') || lowerPrompt.includes('galaxy') || lowerPrompt.includes('nebula') || lowerPrompt.includes('star')) matchedList = imagesDatabase.space;
      else if (lowerPrompt.includes('car') || lowerPrompt.includes('auto') || lowerPrompt.includes('race')) matchedList = imagesDatabase.car;
      else if (lowerPrompt.includes('anime') || lowerPrompt.includes('illustration') || lowerPrompt.includes('art')) matchedList = imagesDatabase.anime;

      const selectedUrls = [...matchedList].sort(() => 0.5 - Math.random()).slice(0, count);

      setTimeout(() => {
        cardElements.forEach((card, index) => {
          const imgUrl = selectedUrls[index] || matchedList[index % matchedList.length];
          const img = document.createElement('img');
          img.src = imgUrl;
          img.alt = `Generated AI Image ${index + 1}`;

          img.onload = () => {
            img.classList.add('loaded');
            card.classList.add('loaded');

            gsap.fromTo(card,
              { scale: 0.96 },
              { scale: 1, duration: 0.4, ease: 'back.out(1.8)' }
            );
          };

          card.appendChild(img);
        });

        selectedUrls.forEach((imgUrl, index) => {
          const historyCard = document.createElement('div');
          historyCard.className = 'history__card';
          historyCard.title = `AI Generated #${index + 1}`;

          const hImg = document.createElement('img');
          hImg.src = imgUrl;
          hImg.alt = `AI Generated History`;
          hImg.loading = 'lazy';

          hImg.onload = () => {
            hImg.classList.add('loaded');
            historyCard.classList.add('loaded');
          };

          historyCard.appendChild(hImg);

          const track = document.getElementById('history-track');
          track.insertBefore(historyCard, track.firstChild);

          gsap.from(historyCard, {
            width: 0,
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: 'back.out(1.6)',
            clearProps: 'width'
          });
        });

      }, 2000);
    });
  }

  // ─────────────────────────────────────
  // 7. Mobile Responsive Hamburger Overlay Menu
  // ─────────────────────────────────────
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  let isMenuOpen = false;

  // Set initial GSAP styles for the overlay
  gsap.set(mobileMenu, { xPercent: 100, autoAlpha: 0 });

  function openMobileMenu() {
    if (isMenuOpen) return;
    isMenuOpen = true;

    hamburgerToggle.classList.add('open');

    // Create opening animation timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // Animate menu slide-in from right
    tl.to(mobileMenu, {
      xPercent: 0,
      autoAlpha: 1,
      duration: 0.45
    });

    // Stagger slide-in links for smooth minimalist entry
    tl.fromTo(mobileLinks,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, stagger: 0.04 },
      '-=0.25'
    );

    // Bounce-in the close button
    tl.fromTo(mobileMenuClose,
      { rotate: -90, scale: 0.8, opacity: 0 },
      { rotate: 0, scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' },
      '-=0.3'
    );
  }

  function closeMobileMenu() {
    if (!isMenuOpen) return;
    isMenuOpen = false;

    hamburgerToggle.classList.remove('open');

    // Create closing animation timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    });

    // Fade and slide out links
    tl.to(mobileLinks, {
      opacity: 0,
      x: 20,
      duration: 0.2,
      stagger: 0.02
    });

    // Slide menu back to right
    tl.to(mobileMenu, {
      xPercent: 100,
      autoAlpha: 0,
      duration: 0.4
    }, '-=0.15');
  }

  // Toggle events
  hamburgerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMobileMenu();
  });

  // Handle clicking mobile menu links
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSuffix = link.getAttribute('data-target');
      
      // Select the correct desktop target item
      const desktopTarget = document.getElementById(`nav-${targetSuffix}`);
      if (desktopTarget) {
        // Trigger desktop nav click handler which handles state updates, indicator, animations
        desktopTarget.click();
        
        // Sync mobile active class immediately
        syncMobileMenuLinkActive(targetSuffix);

        // Smoothly close the menu
        closeMobileMenu();
      }
    });
  });

  // Close menu when clicking outside the menu container
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !mobileMenu.contains(e.target) && !hamburgerToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
});

