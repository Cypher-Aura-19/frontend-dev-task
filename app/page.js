"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ==========================================
// 1. Data Structures & Mock Databases
// ==========================================

const fallbackVideos = [
  {
    title: "Big Buck Bunny",
    videoUrl: "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4",
    thumbnailUrl: "",
    duration: "0:15",
    description: "A large friendly rabbit gets revenge on three pests."
  },
  {
    title: "Elephant Dream",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
    duration: "0:15",
    description: "Blender open movie cinematic dreamscapes."
  },
  {
    title: "Oceans Wild Life",
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    thumbnailUrl: "",
    duration: "0:46",
    description: "Majestic ocean waves and marine wildlife."
  },
  {
    title: "For Bigger Escapes",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&q=80",
    duration: "0:15",
    description: "High speed action and visual effects."
  },
  {
    title: "Tears of Steel",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&q=80",
    duration: "0:12",
    description: "Sci-fi robot invasion in Amsterdam city."
  }
];

const imagesDatabase = {
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80",
    "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&q=80"
  ],
  cyberpunk: [
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80",
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&q=80"
  ],
  city: [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80",
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80",
    "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=500&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80"
  ],
  forest: [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=500&q=80"
  ],
  space: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80",
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500&q=80",
    "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=500&q=80"
  ],
  car: [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500&q=80",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&q=80"
  ],
  anime: [
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80",
    "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=500&q=80",
    "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=500&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80",
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&q=80",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&q=80",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&q=80"
  ]
};

const imageIds = [
  1011, 1025, 1035, 1036, 1039, 1043, 1044, 1047,
  1050, 1055, 1059, 1060, 1062, 1067, 1069
];

const imageModels = [
  { text: "Flux Ultra", value: "flux-ultra" },
  { text: "Flux Schnell", value: "flux-schnell" },
  { text: "SD 3.5 Large", value: "sd-3-5" },
  { text: "Midjourney v6", value: "midjourney-v6" }
];

const videoModels = [
  { text: "Sora 1.0", value: "sora-1-0" },
  { text: "Runway Gen-3", value: "runway-gen-3" },
  { text: "Kling AI", value: "kling-ai" },
  { text: "Luma Dream Machine", value: "luma-dream" }
];

const cameraOptions = [
  { text: "Zoom In", value: "zoom-in" },
  { text: "Zoom Out", value: "zoom-out" },
  { text: "Pan Left", value: "pan-left" },
  { text: "Pan Right", value: "pan-right" },
  { text: "Tilt Up", value: "tilt-up" },
  { text: "Tilt Down", value: "tilt-down" },
  { text: "Static", value: "static" }
];

// Helper to match input keywords to video content
const findMatchedVideo = (promptText, index, db) => {
  const activeDb = db && db.length > 0 ? db : fallbackVideos;
  const lower = promptText.toLowerCase();
  
  let matches = [];
  if (lower.includes("bunny") || lower.includes("rabbit")) {
    matches = activeDb.filter(v => v.title.toLowerCase().includes("bunny"));
  } else if (lower.includes("dream") || lower.includes("elephant")) {
    matches = activeDb.filter(v => v.title.toLowerCase().includes("dream"));
  } else if (lower.includes("fire") || lower.includes("blaze") || lower.includes("light") || lower.includes("ocean") || lower.includes("sea") || lower.includes("water") || lower.includes("nature")) {
    matches = activeDb.filter(v => v.title.toLowerCase().includes("blazes") || v.title.toLowerCase().includes("ocean"));
  } else if (lower.includes("escape") || lower.includes("batman") || lower.includes("action")) {
    matches = activeDb.filter(v => v.title.toLowerCase().includes("escape"));
  } else if (lower.includes("tears") || lower.includes("steel") || lower.includes("robot") || lower.includes("sci-fi") || lower.includes("city")) {
    matches = activeDb.filter(v => v.title.toLowerCase().includes("tears"));
  } else if (lower.includes("sintel") || lower.includes("dragon") || lower.includes("fantasy") || lower.includes("girl")) {
    matches = activeDb.filter(v => v.title.toLowerCase().includes("sintel"));
  }

  if (matches.length > 0) {
    return matches[index % matches.length];
  }
  
  return activeDb[index % activeDb.length];
};

// ==========================================
// 2. Sub-components (Memoized)
// ==========================================

// Custom Accessible Dropdown Component
const CustomDropdown = React.memo(({ value, options, onChange, id, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const selectedText = options.find((o) => o.value === value)?.text || value;

  return (
    <div 
      className={`custom-dropdown ${isOpen ? "open" : ""}`} 
      ref={dropdownRef}
      id={id}
      data-value={value}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={isOpen ? `${id}-menu` : undefined}
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <div className="custom-dropdown__trigger">
        <span className="custom-dropdown__selected">{selectedText}</span>
        <span className="material-icons-outlined arrow">expand_more</span>
      </div>
      {isOpen && (
        <div className="custom-dropdown__menu" role="listbox" id={`${id}-menu`}>
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={`custom-dropdown__item ${value === opt.value ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
CustomDropdown.displayName = "CustomDropdown";

// Custom Slider Component
const FormSlider = React.memo(({ label, value, min, max, step, onChange, id, displayVal }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}: <span>{displayVal !== undefined ? displayVal : value}</span>
      </label>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
});
FormSlider.displayName = "FormSlider";

// Logo
const Logo = React.memo(() => (
  <div className="navbar__logo">
    <span className="logo-text">F</span>
  </div>
));
Logo.displayName = "Logo";

// Desktop Center Icons
const CenterNav = React.memo(({ activeTab, onTabClick }) => {
  const items = [
    { id: "home", icon: "home", label: "Home" },
    { id: "gallery-icon", icon: "collections", label: "Gallery" },
    { id: "video", icon: "videocam", label: "Video" },
    { id: "edit", icon: "edit", label: "Edit" },
    { id: "stop", icon: "stop_circle", label: "Stop" }
  ];

  return (
    <div className="navbar__center" id="navbar-center">
      <div className="nav-icons-wrapper">
        <div className="active-indicator" id="active-indicator"></div>
        <div className="nav-icons" id="nav-icons">
          {items.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`nav-icon-item ${activeTab === item.id ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); onTabClick(item.id); }}
              aria-label={item.label}
              title={item.label}
            >
              <span className="material-icons-outlined">{item.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});
CenterNav.displayName = "CenterNav";

// Desktop Right Actions
const RightNav = React.memo(({ activeTab, onTabClick, onThemeToggle, isMobileMenuOpen, onMobileMenuToggle }) => (
  <div className="navbar__right" id="navbar-right">
    <a 
      href="#"
      className={`nav-link ${activeTab === "gallery-link" ? "active" : ""}`}
      onClick={(e) => { e.preventDefault(); onTabClick("gallery-link"); }}
      aria-label="Camera Gallery"
    >
      <span className="material-icons-outlined nav-link-icon">photo_camera</span>
      <span className="nav-link-text">Gallery</span>
    </a>
    <a 
      href="#"
      className={`nav-link ${activeTab === "support-link" ? "active" : ""}`}
      onClick={(e) => { e.preventDefault(); onTabClick("support-link"); }}
      aria-label="Customer Support"
    >
      <span className="material-icons-outlined nav-link-icon">support_agent</span>
      <span className="nav-link-text">Support</span>
    </a>
    
    <button 
      className="theme-toggle" 
      onClick={onThemeToggle} 
      title="Toggle dark mode" 
      aria-label="Toggle dark mode"
      id="theme-toggle"
    >
      <span className="material-icons-outlined theme-icon theme-icon--light">dark_mode</span>
      <span className="material-icons-outlined theme-icon theme-icon--dark">light_mode</span>
    </button>

    <button 
      className={`hamburger-toggle ${isMobileMenuOpen ? "open" : ""}`}
      onClick={onMobileMenuToggle} 
      title="Open navigation menu" 
      aria-label="Open navigation menu"
      id="hamburger-toggle"
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>

    <div className="avatar" id="user-avatar">
      <Image src="https://i.pravatar.cc/40?img=47" width={40} height={40} alt="User Avatar" />
    </div>
  </div>
));
RightNav.displayName = "RightNav";

// History Card (Individual)
const HistoryCard = React.memo(({ item, index }) => {
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);

  useGSAP(() => {
    if (item.isInitial) return;
    gsap.from(cardRef.current, {
      width: 0,
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      ease: "back.out(1.6)",
      clearProps: "width"
    });
  }, { scope: cardRef });

  return (
    <div 
      className={`history__card ${loaded ? "loaded" : ""} ${item.type === "video" ? "video-history-card" : ""}`}
      title={item.title}
      ref={cardRef}
    >
      {item.type === "video" ? (
        <>
          <video 
            src={item.src} 
            loop 
            muted 
            playsInline 
            autoPlay 
            className={loaded ? "loaded" : ""}
            onLoadedData={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
          <span className="material-icons-outlined history-video-badge">play_circle</span>
        </>
      ) : (
        <Image 
          src={item.src} 
          alt={item.title} 
          width={72} 
          height={72} 
          className={loaded ? "loaded" : ""}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          priority={item.isInitial && index < 8}
        />
      )}
    </div>
  );
});
HistoryCard.displayName = "HistoryCard";

// History track component
const HistorySection = React.memo(({ historyItems }) => (
  <section className="history" id="history-section">
    <div className="history__label-container">
      <div className="history__label">
        <h2 className="history__title">History</h2>
        <a href="#" className="history__view-all" onClick={(e) => e.preventDefault()}>View All</a>
      </div>
      <div className="history__separator"></div>
    </div>
    <div className="history__track" id="history-track">
      {historyItems.map((item, index) => (
        <HistoryCard key={item.id} item={item} index={index} />
      ))}
    </div>
  </section>
));
HistorySection.displayName = "HistorySection";

// Image card inside generation grids
const ImageWorkspaceCard = React.memo(({ src, alt, priority }) => {
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);

  useGSAP(() => {
    if (!loaded) return;
    gsap.fromTo(
      cardRef.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.4, ease: "back.out(1.8)" }
    );
  }, [loaded]);

  return (
    <div className={`workspace-card ${loaded ? "loaded" : ""}`} ref={cardRef}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        style={{ objectFit: "cover" }}
        className={loaded ? "loaded" : ""}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        priority={priority}
      />
    </div>
  );
});
ImageWorkspaceCard.displayName = "ImageWorkspaceCard";

// Custom Player Card inside generation grids
const VideoWorkspaceCard = React.memo(({ item, durationLimit }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Synthesizing frames...");
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);

  const displayDuration = durationLimit ? durationLimit : duration;

  // Loading progress simulation
  useEffect(() => {
    const statuses = [
      "Synthesizing motion frames...",
      "Simulating motion vectors...",
      "Interpolating flow keyframes...",
      "Encoding multi-pass audio...",
      "Polishing visual elements..."
    ];
    let currentVal = 0;
    const interval = setInterval(() => {
      currentVal += Math.floor(Math.random() * 2) + 2;
      if (currentVal >= 100) {
        currentVal = 100;
        clearInterval(interval);
        setLoaded(true);
      }
      setLoadingProgress(currentVal);
      const statusIdx = Math.min(Math.floor(currentVal / 20), statuses.length - 1);
      setLoadingStatus(statuses[statusIdx]);
    }, 75);

    return () => clearInterval(interval);
  }, []);

  // Auto-play muted once loading animation finishes — shows real video frames
  useEffect(() => {
    if (!loaded || !videoRef.current) return;
    videoRef.current.play().then(() => {
      setPaused(false);
    }).catch(() => {
      // Autoplay blocked — user will click play manually
    });
  }, [loaded]);

  const togglePlay = useCallback((e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => console.log(err));
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  }, []);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    if (durationLimit && current >= durationLimit) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      setCurrentTime(current);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    if (videoRef.current.duration && videoRef.current.duration !== Infinity) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * displayDuration;
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPct = displayDuration > 0 ? (Math.min(currentTime, displayDuration) / displayDuration) * 100 : 0;

  return (
    <div className={`workspace-card video-card ${loaded ? "loaded" : ""} ${paused ? "paused" : "playing"}`}>
      <div className={`video-loading-overlay ${loaded ? "fade-out" : ""}`}>
        <div className="video-loading-spinner"></div>
        <div className="video-loading-status">{loadingStatus}</div>
        <div className="video-loading-progress">{loadingProgress}%</div>
        <div className="video-loading-bar-wrapper">
          <div className="video-loading-bar-fill" style={{ width: `${loadingProgress}%` }}></div>
        </div>
      </div>
      
      <video
        ref={videoRef}
        src={item.src}
        poster={item.thumb || undefined}
        preload="auto"
        loop
        muted={muted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
        onClick={togglePlay}
        className={loaded ? "loaded" : ""}
      />

      <div className="video-overlay" onClick={togglePlay}>
        <div className="video-overlay__center">
          <button 
            type="button"
            className="video-play-btn" 
            onClick={togglePlay}
            aria-label={paused ? "Play video" : "Pause video"}
          >
            <span className="material-icons-outlined">{paused ? "play_arrow" : "pause"}</span>
          </button>
        </div>
        <div className="video-controls-bottom" onClick={(e) => e.stopPropagation()}>
          <div className="video-progress-bar" onClick={handleProgressClick}>
            <div className="video-progress-fill" style={{ width: `${progressPct}%` }}></div>
          </div>
          <div className="video-time-row">
            <span className="video-time">
              {formatTime(Math.min(currentTime, displayDuration))} / {formatTime(displayDuration)}
            </span>
            <button 
              type="button"
              className="video-volume-btn" 
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              <span className="material-icons-outlined">{muted ? "volume_off" : "volume_up"}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="video-duration-badge">{formatTime(displayDuration)}</div>
    </div>
  );
});
VideoWorkspaceCard.displayName = "VideoWorkspaceCard";

// Generation row component
const GenerationRow = React.memo(({ row }) => {
  const rowRef = useRef(null);

  useGSAP(() => {
    if (row.id === "initial-row") return;
    gsap.fromTo(
      rowRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, { scope: rowRef });

  return (
    <div className="generation-row" ref={rowRef}>
      <div className="generation-row__info">
        <div className="generation-row__info-header">
          <span className="material-icons-outlined info-header-icon">
            {row.type === "video" ? "videocam" : "image"}
          </span>
          <span className="info-header-text">
            {row.type === "video" ? "Text-to-Video" : "Text-to-Image"}
          </span>
        </div>

        <div className="generation-row__prompt-container">
          <p className="generation-row__prompt" title={row.prompt}>{row.prompt}</p>
        </div>

        <div className="generation-row__badge-wrapper">
          <span className="generation-row__model-badge">
            <span className="material-icons-outlined badge-icon">auto_awesome</span>
            <span>{row.model}</span>
          </span>
          {row.type === "video" && (
            <>
              <span className="generation-row__model-badge">
                <span className="material-icons-outlined badge-icon">timer</span>
                <span>{row.duration}s</span>
              </span>
              <span className="generation-row__model-badge">
                <span className="material-icons-outlined badge-icon">motion_photos_on</span>
                <span>Motion: {row.motion}</span>
              </span>
              <span className="generation-row__model-badge">
                <span className="material-icons-outlined badge-icon">movie_filter</span>
                <span>{row.camera}</span>
              </span>
            </>
          )}
        </div>
      </div>
      <div className={`generation-row__images-grid layout-${row.ratio} ${row.type === "video" ? "video-grid" : ""}`}>
        {row.urls.map((urlInfo, idx) => {
          const item = {
            id: `${row.id}-${idx}`,
            src: urlInfo.videoUrl || urlInfo,
            thumb: urlInfo.thumbnailUrl || ""
          };
          if (row.type === "video") {
            return <VideoWorkspaceCard key={item.id} item={item} durationLimit={row.duration} />;
          } else {
            if (row.status === "loading") {
              return <div className="workspace-card" key={item.id} />;
            }
            return <ImageWorkspaceCard key={item.id} src={item.src} alt={`Generated AI ${idx + 1}`} priority={row.id === "initial-row"} />;
          }
        })}
      </div>
    </div>
  );
});
GenerationRow.displayName = "GenerationRow";

// Prompter Sidebar component
const Sidebar = React.memo(({ 
  currentMode, onModeChange,
  prompt, onPromptChange, onGenerate,
  count, onCountChange,
  ratio, onRatioChange,
  model, onModelChange,
  cfgScale, onCfgChange,
  steps, onStepsChange,
  negativePrompt, onNegativePromptChange,
  videoDuration, onVideoDurationChange,
  motionStrength, onMotionStrengthChange,
  cameraMotion, onCameraChange,
  selectedStyles, onToggleStyle
}) => {
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [isStylesOpen, setIsStylesOpen] = useState(false);
  
  const advContentRef = useRef(null);
  const stylesContentRef = useRef(null);
  const advArrowRef = useRef(null);
  const stylesArrowRef = useRef(null);

  // Toggle image/video count options
  const countOptions = [
    { text: "1", value: "1" },
    { text: "2", value: "2" },
    { text: "3", value: "3" },
    { text: "4", value: "4" }
  ];

  const ratioOptions = [
    { text: "1:1", value: "1-1" },
    { text: "16:9", value: "16-9" },
    { text: "9:16", value: "9-16" },
    { text: "4:3", value: "4-3" }
  ];

  const modelOptions = useMemo(() => {
    return currentMode === "video" ? videoModels : imageModels;
  }, [currentMode]);

  // Sync active options lists when mode changes
  useEffect(() => {
    // Make sure we select the first model of the new list when swapping mode
    onModelChange(currentMode === "video" ? "sora-1-0" : "flux-ultra");
  }, [currentMode, onModelChange]);

  const styleItems = [
    { key: "photorealistic", label: "Photorealistic" },
    { key: "anime", label: "Anime" },
    { key: "cyberpunk", label: "Cyberpunk" },
    { key: "watercolor", label: "Watercolor" },
    { key: "3d-render", label: "3D Render" },
    { key: "oil-painting", label: "Oil Painting" }
  ];

  // Animate Advance Accordion open/close
  useGSAP(() => {
    const content = advContentRef.current;
    const arrow = advArrowRef.current;
    if (!content || !arrow) return;

    if (isAdvanceOpen) {
      gsap.set(content, { height: "auto" });
      const targetHeight = content.offsetHeight;
      gsap.set(content, { height: 0 });
      gsap.to(content, {
        height: targetHeight,
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => gsap.set(content, { height: "auto" })
      });
      gsap.to(arrow, { rotation: 180, duration: 0.25, ease: "power1.out" });
    } else {
      gsap.to(content, { height: 0, duration: 0.35, ease: "power2.out" });
      gsap.to(arrow, { rotation: 0, duration: 0.25, ease: "power1.out" });
    }
  }, [isAdvanceOpen]);

  // Animate Styles Accordion open/close
  useGSAP(() => {
    const content = stylesContentRef.current;
    const arrow = stylesArrowRef.current;
    if (!content || !arrow) return;

    if (isStylesOpen) {
      gsap.set(content, { height: "auto" });
      const targetHeight = content.offsetHeight;
      gsap.set(content, { height: 0 });
      gsap.to(content, {
        height: targetHeight,
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => gsap.set(content, { height: "auto" })
      });
      gsap.to(arrow, { rotation: 180, duration: 0.25, ease: "power1.out" });
    } else {
      gsap.to(content, { height: 0, duration: 0.35, ease: "power2.out" });
      gsap.to(arrow, { rotation: 0, duration: 0.25, ease: "power1.out" });
    }
  }, [isStylesOpen]);

  // Slide Animation for Toggle Switcher
  const toggleSliderRef = useRef(null);
  useGSAP(() => {
    if (!toggleSliderRef.current) return;
    gsap.to(toggleSliderRef.current, {
      left: currentMode === "video" ? "50%" : "3px",
      duration: 0.3,
      ease: "power2.out"
    });
  }, [currentMode]);

  // Text Placeholder Slide Effect
  const promptInputRef = useRef(null);
  const handleModeToggle = (modeVal) => {
    if (currentMode === modeVal) return;
    
    const input = promptInputRef.current;
    const defaultPlaceholder = modeVal === "video" 
      ? "Describe your imaginations to be converted to high-definition cinematic video clip..."
      : "Describe your imaginations to be converted to piece of art...";

    // Premium slide & fade swap animation
    gsap.to(input, {
      opacity: 0,
      x: modeVal === "video" ? 20 : -20,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        onPromptChange("");
        onModeChange(modeVal);
        gsap.set(input, { x: modeVal === "video" ? -20 : 20 });
        gsap.to(input, {
          opacity: 1,
          x: 0,
          duration: 0.35,
          ease: "back.out(1.5)"
        });
      }
    });
    
    // Subtle pop on prompt box and buttons
    gsap.fromTo(".sidebar__prompt-box",
      { scale: 0.97, borderColor: "var(--accent)" },
      { scale: 1, borderColor: "var(--border-color)", duration: 0.45, ease: "back.out(2)" }
    );
    gsap.fromTo("#generate-btn",
      { scale: 0.93 },
      { scale: 1, duration: 0.4, ease: "back.out(2)" }
    );
  };

  return (
    <aside className="sidebar" id="prompter-sidebar">
      <div className="sidebar__inner">
        {/* Toggle Slider Switch */}
        <div className="sidebar__toggle">
          <div className="toggle-slider" ref={toggleSliderRef}></div>
          <button 
            className={`toggle-btn ${currentMode === "image" ? "active" : ""}`} 
            onClick={() => handleModeToggle("image")}
            type="button"
          >
            Image
          </button>
          <button 
            className={`toggle-btn ${currentMode === "video" ? "active" : ""}`} 
            onClick={() => handleModeToggle("video")}
            type="button"
          >
            Video
          </button>
        </div>

        {/* Prompt Input Area */}
        <div className="sidebar__prompt-box">
          <textarea 
            className="sidebar__prompt-input" 
            ref={promptInputRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={
              currentMode === "video"
                ? "Describe your imaginations to be converted to high-definition cinematic video clip..."
                : "Describe your imaginations to be converted to piece of art..."
            }
            aria-label="Art generation prompt"
          />
          <button className="sidebar__generate-btn" id="generate-btn" type="button" onClick={onGenerate}>
            <span className="material-icons-outlined generate-icon">
              {currentMode === "video" ? "videocam" : "auto_awesome"}
            </span>
            <span>Generate</span>
          </button>
        </div>

        {/* Tweak options dropdowns */}
        <div className="sidebar__tweaks">
          <div className="tweak-item">
            <label id="label-count-type">{currentMode === "video" ? "# Videos" : "# Images"}</label>
            <CustomDropdown
              value={String(count)}
              options={countOptions}
              onChange={(val) => onCountChange(parseInt(val, 10))}
              id="dropdown-count"
              label="Select item count"
            />
          </div>

          <div className="tweak-item">
            <label htmlFor="dropdown-ratio">Aspect</label>
            <CustomDropdown
              value={ratio}
              options={ratioOptions}
              onChange={onRatioChange}
              id="dropdown-ratio"
              label="Select aspect ratio"
            />
          </div>

          <div className="tweak-item">
            <label htmlFor="dropdown-model">Model</label>
            <CustomDropdown
              value={model}
              options={modelOptions}
              onChange={onModelChange}
              id="dropdown-model"
              label="Select generation model"
            />
          </div>
        </div>

        {/* Collapsible: Advance settings */}
        <div className="sidebar__accordion">
          <button 
            className={`accordion-header ${isAdvanceOpen ? "active" : ""}`} 
            onClick={() => setIsAdvanceOpen(!isAdvanceOpen)}
            type="button"
            aria-expanded={isAdvanceOpen}
          >
            <span className="accordion-header-title">Advance</span>
            <span className="material-icons-outlined arrow" ref={advArrowRef}>expand_more</span>
          </button>
          <div className="accordion-content" ref={advContentRef}>
            <div className="accordion-inner">
              <FormSlider
                label="CFG Scale"
                id="setting-cfg"
                min={1}
                max={15}
                step={0.5}
                value={cfgScale}
                onChange={onCfgChange}
              />
              <FormSlider
                label="Steps"
                id="setting-steps"
                min={10}
                max={60}
                step={5}
                value={steps}
                onChange={onStepsChange}
              />
              <div className="form-group">
                <label htmlFor="setting-negative">Negative Prompt</label>
                <textarea 
                  id="setting-negative" 
                  value={negativePrompt}
                  onChange={(e) => onNegativePromptChange(e.target.value)}
                  placeholder="Ugly, deformed, blurry, pixelated..."
                />
              </div>

              {/* Video Specific Settings */}
              {currentMode === "video" && (
                <>
                  <FormSlider
                    label="Duration"
                    id="setting-duration"
                    min={5}
                    max={15}
                    step={5}
                    value={videoDuration}
                    onChange={onVideoDurationChange}
                    displayVal={`${videoDuration}s`}
                  />
                  <FormSlider
                    label="Motion Strength"
                    id="setting-motion"
                    min={1}
                    max={10}
                    step={1}
                    value={motionStrength}
                    onChange={onMotionStrengthChange}
                  />
                  <div className="form-group">
                    <label htmlFor="dropdown-camera">Camera Motion</label>
                    <CustomDropdown
                      value={cameraMotion}
                      options={cameraOptions}
                      onChange={onCameraChange}
                      id="dropdown-camera"
                      label="Select camera motion type"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible: Styles badges */}
        <div className="sidebar__accordion">
          <button 
            className={`accordion-header ${isStylesOpen ? "active" : ""}`} 
            onClick={() => setIsStylesOpen(!isStylesOpen)}
            type="button"
            aria-expanded={isStylesOpen}
          >
            <span className="accordion-header-title">Styles</span>
            <span className="material-icons-outlined arrow" ref={stylesArrowRef}>expand_more</span>
          </button>
          <div className="accordion-content" ref={stylesContentRef}>
            <div className="accordion-inner">
              <div className="styles-grid">
                {styleItems.map((item) => (
                  <StyleBadge
                    key={item.key}
                    styleKey={item.key}
                    label={item.label}
                    active={selectedStyles.includes(item.key)}
                    toggleActive={onToggleStyle}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
});
Sidebar.displayName = "Sidebar";

// Style Badge buttons
const StyleBadge = React.memo(({ styleKey, label, active, toggleActive }) => (
  <button 
    className={`style-badge ${active ? "active" : ""}`} 
    onClick={() => toggleActive(styleKey)}
    type="button"
    data-style={styleKey}
  >
    {label}
  </button>
));
StyleBadge.displayName = "StyleBadge";

// Workspace component (scrolling list of rows)
const Workspace = React.memo(({ generations }) => (
  <section className="workspace" id="workspace-area">
    <div className="workspace__scrollable" id="workspace-scrollable">
      {generations.map((row) => (
        <GenerationRow key={row.id} row={row} />
      ))}
    </div>
  </section>
));
Workspace.displayName = "Workspace";

// Mobile Drawer Menu
const MobileMenu = React.memo(({ isOpen, onClose, activeTab, onTabClick }) => {
  const items = [
    { id: "home", icon: "home", label: "Home" },
    { id: "gallery-icon", icon: "collections", label: "Gallery" },
    { id: "video", icon: "videocam", label: "Video" },
    { id: "edit", icon: "edit", label: "Edit" },
    { id: "stop", icon: "stop_circle", label: "Stop" }
  ];

  const subItems = [
    { id: "gallery-link", icon: "photo_camera", label: "Camera Gallery" },
    { id: "support-link", icon: "support_agent", label: "Support" }
  ];

  const isFirstRender = useRef(true);
  const mobileMenuRef = useRef(null);
  const mobileMenuCloseRef = useRef(null);

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Set initial state
      gsap.set(mobileMenuRef.current, { xPercent: 100, autoAlpha: 0 });
      return;
    }

    const mobileMenu = mobileMenuRef.current;
    const mobileLinks = mobileMenu.querySelectorAll(".mobile-menu__link");
    const mobileMenuClose = mobileMenuCloseRef.current;

    if (isOpen) {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });
      tl.to(mobileMenu, {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.45
      });
      tl.fromTo(mobileLinks,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, stagger: 0.04 },
        "-=0.25"
      );
      tl.fromTo(mobileMenuClose,
        { rotate: -90, scale: 0.8, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)" },
        "-=0.3"
      );
    } else {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" }
      });
      tl.to(mobileLinks, {
        opacity: 0,
        x: 20,
        duration: 0.2,
        stagger: 0.02
      });
      tl.to(mobileMenu, {
        xPercent: 100,
        autoAlpha: 0,
        duration: 0.4
      }, "-=0.15");
    }
  }, [isOpen]);

  // Click outside to close drawer menu
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const menu = mobileMenuRef.current;
      const toggleBtn = document.getElementById("hamburger-toggle");
      if (isOpen && menu && !menu.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
        onClose();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen, onClose]);

  const handleLinkClick = (target) => {
    onTabClick(target);
    onClose();
  };

  return (
    <div className="mobile-menu-overlay" id="mobile-menu" ref={mobileMenuRef}>
      <div className="mobile-menu__header">
        <span className="logo-text">F</span>
        <button 
          className="mobile-menu__close" 
          id="mobile-menu-close" 
          onClick={onClose}
          ref={mobileMenuCloseRef}
          aria-label="Close menu"
          type="button"
        >
          <span className="material-icons-outlined">close</span>
        </button>
      </div>
      <div className="mobile-menu__content">
        <nav className="mobile-menu__nav">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`mobile-menu__link ${activeTab === item.id ? "active" : ""}`}
              type="button"
            >
              <span className="material-icons-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <div className="mobile-menu__divider"></div>
          {subItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`mobile-menu__link ${activeTab === item.id ? "active" : ""}`}
              type="button"
            >
              <span className="material-icons-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
});
MobileMenu.displayName = "MobileMenu";

// ==========================================
// 3. Main Page Component
// ==========================================

export default function Home() {
  const isInitialIndicatorRender = useRef(true);
  // Global States
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [videoDatabase, setVideoDatabase] = useState([]);

  // Prompter Controls States
  const [currentMode, setCurrentMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(4);
  const [ratio, setRatio] = useState("1-1");
  const [model, setModel] = useState("flux-ultra");
  const [cfgScale, setCfgScale] = useState(7.5);
  const [steps, setSteps] = useState(30);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [videoDuration, setVideoDuration] = useState(5);
  const [motionStrength, setMotionStrength] = useState(5);
  const [cameraMotion, setCameraMotion] = useState("zoom-in");
  const [selectedStyles, setSelectedStyles] = useState(["photorealistic"]);

  // Workspace Generations State
  const [generations, setGenerations] = useState([
    {
      id: "initial-row",
      prompt: "A professional portrait photograph of a smiling 31-year-old redheaded woman with warm brown eyes and softly tousled auburn hair framing her face. She is turned slightly towards the viewer, offering a genuine and approachable expression. She is wearing a cream-colored cashmere sweater and delicate gold earrings. The background is a softly blurred expanse of muted gray and beige tones, suggesting a modern art gallery. There is subtle directional lighting.",
      model: "Flux Ultra",
      type: "image",
      ratio: "1-1",
      urls: [
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=350&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=350&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=350&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=350&auto=format&fit=crop&q=80"
      ],
      status: "loaded"
    }
  ]);

  // History state
  const [historyItems, setHistoryItems] = useState(() => {
    return imageIds.map((id, index) => ({
      id: `initial-hist-${id}`,
      type: "image",
      src: `https://picsum.photos/id/${id}/200/200`,
      title: `AI Generated #${index + 1}`,
      isInitial: true
    }));
  });

  // Fetch video database from API on mount (Client-side)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("https://gist.githubusercontent.com/poudyalanil/1685db9c4f17c68d5cb9ffaa3f59e3a6/raw/");
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        
        // Clean video urls
        const workingVideoUrls = [
          "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4",
          "https://www.w3schools.com/html/movie.mp4",
          "https://vjs.zencdn.net/v/oceans.mp4",
          "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
          "https://www.w3schools.com/html/mov_bbb.mp4"
        ];
        const cleaned = data.map((item, idx) => {
          let url = item.videoUrl.replace(/^http:/, "https:");
          if (url.includes("commondatastorage.googleapis.com")) {
            url = workingVideoUrls[idx % workingVideoUrls.length];
          }
          return {
            title: item.title,
            videoUrl: url,
            thumbnailUrl: item.thumbnailUrl || "",
            duration: item.duration || "0:15",
            description: item.description || ""
          };
        });
        setVideoDatabase(cleaned);
      } catch (err) {
        console.warn("API fetch failed, utilizing robust fallback database:", err);
        setVideoDatabase(fallbackVideos);
      }
    };
    fetchVideos();
  }, []);

  // Animations: Initial entrance load animations
  useGSAP(() => {
    gsap.from(".navbar__logo", { opacity: 0, x: -20, duration: 0.6, ease: "power3.out", delay: 0.1 });
    gsap.from(".navbar__right", { opacity: 0, x: 20, duration: 0.6, ease: "power3.out", delay: 0.1 });
    gsap.from(".nav-icon-item", { opacity: 0, y: 12, duration: 0.5, ease: "power3.out", stagger: 0.07, delay: 0.2 });
    gsap.from(".sidebar", { opacity: 0, x: -25, duration: 0.65, ease: "power3.out", delay: 0.3 });
    gsap.from(".workspace", { opacity: 0, x: 25, duration: 0.65, ease: "power3.out", delay: 0.3 });
    gsap.from(".history", { opacity: 0, y: 15, duration: 0.5, ease: "power3.out", delay: 0.4 });
    gsap.from(".history__card", {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "back.out(1.4)",
      stagger: 0.04,
      delay: 0.6,
    });

    // Active indicator entrance animation (like vanilla version)
    gsap.from("#active-indicator", {
      scaleX: 0,
      duration: 0.5,
      ease: "power3.out",
      delay: 0.6,
    });

    // Position indicator on the initially active icon after layout settles
    const positionInitialIndicator = () => {
      const activeIcon = document.querySelector(".nav-icon-item.active");
      const indicator = document.getElementById("active-indicator");
      if (!activeIcon || !indicator) return;
      const iconRect = activeIcon.getBoundingClientRect();
      const parentWrapper = activeIcon.closest(".nav-icons-wrapper");
      if (!parentWrapper) return;
      const parentRect = parentWrapper.getBoundingClientRect();
      const activeWidth = parseFloat(getComputedStyle(indicator).width) || 28;
      const x = iconRect.left - parentRect.left + (iconRect.width - activeWidth) / 2;
      gsap.set(indicator, { x: x });
    };
    requestAnimationFrame(positionInitialIndicator);
    setTimeout(positionInitialIndicator, 100);
    setTimeout(positionInitialIndicator, 300);
  }, []);

  // Slide nav indicator when activeTab changes (skip first mount — handled by entrance animation)
  useGSAP(() => {
    if (isInitialIndicatorRender.current) {
      isInitialIndicatorRender.current = false;
      return; // Skip — initial position is handled by the entrance animation block
    }

    const activeIcon = document.querySelector(".nav-icon-item.active");
    const indicator = document.getElementById("active-indicator");
    if (!indicator) return;

    if (!activeIcon) {
      gsap.to(indicator, { scaleX: 0, duration: 0.35, ease: "power2.inOut" });
      return;
    }

    // Ensure indicator is visible
    gsap.to(indicator, {
      scaleX: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    const updatePosition = () => {
      const iconRect = activeIcon.getBoundingClientRect();
      const parentWrapper = activeIcon.closest(".nav-icons-wrapper");
      if (!parentWrapper) return;
      const parentRect = parentWrapper.getBoundingClientRect();
      const activeWidth = parseFloat(getComputedStyle(indicator).width) || 28;
      const x = iconRect.left - parentRect.left + (iconRect.width - activeWidth) / 2;

      gsap.to(indicator, {
        x: x,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    updatePosition();
    requestAnimationFrame(updatePosition);

    // Glow pulse
    gsap.fromTo(indicator,
      { boxShadow: "0 2px 10px var(--accent-glow)" },
      {
        boxShadow: "0 2px 20px var(--accent-glow)",
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      }
    );
  }, [activeTab]);

  // Recalculate nav indicator positioning on window resizing
  useEffect(() => {
    const handleResize = () => {
      const activeIcon = document.querySelector(`.nav-icon-item.active`);
      const indicator = document.getElementById("active-indicator");
      if (!activeIcon || !indicator) return;
      const iconRect = activeIcon.getBoundingClientRect();
      const parent = activeIcon.closest(".nav-icons-wrapper");
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const activeWidth = parseFloat(getComputedStyle(indicator).width) || 28;
      const x = iconRect.left - parentRect.left + (iconRect.width - activeWidth) / 2;
      gsap.set(indicator, { x: x });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Theme Swapper seamless clip-path wipe animation
  const isAnimatingTheme = useRef(false);
  const handleThemeToggle = useCallback(() => {
    if (isAnimatingTheme.current) return;
    isAnimatingTheme.current = true;

    const currentTheme = theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";

    const overlay = document.getElementById("theme-overlay");
    const navbar = document.getElementById("main-navbar");
    const history = document.getElementById("history-section");
    const content = document.querySelector(".page-content");

    if (!overlay || !navbar || !history || !content) {
      setTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      isAnimatingTheme.current = false;
      return;
    }

    overlay.innerHTML = "";

    // Pause all playing videos to prevent GPU lag during theme transition
    const allVideos = document.querySelectorAll(".workspace-card video, .history__card video");
    const wasPlaying = [];
    allVideos.forEach((vid) => {
      if (!vid.paused) {
        vid.pause();
        wasPlaying.push(vid);
      }
    });

    // Clone rendered DOM
    const navbarClone = navbar.cloneNode(true);
    const historyClone = history.cloneNode(true);
    const contentClone = content.cloneNode(true);

    // Strip IDs from clones to prevent duplicate elements in DOM
    navbarClone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    navbarClone.removeAttribute("id");
    historyClone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    historyClone.removeAttribute("id");
    contentClone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    contentClone.removeAttribute("id");

    // Strip heavy playing HTML5 video tags from clones to avoid duplicate decoders
    contentClone.querySelectorAll("video").forEach((vid) => vid.remove());
    historyClone.querySelectorAll("video").forEach((vid) => vid.remove());

    overlay.appendChild(navbarClone);
    overlay.appendChild(historyClone);
    overlay.appendChild(contentClone);

    // Render clone overlay in the new target theme
    overlay.setAttribute("data-theme", newTheme);

    // Animate mask clipPath from bottom-to-top wipe
    gsap.fromTo(overlay,
      { clipPath: "inset(100% 0 0 0)" },
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => {
          document.body.classList.add("no-transition");
          setTheme(newTheme);
          document.documentElement.setAttribute("data-theme", newTheme);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              overlay.style.clipPath = "inset(100% 0 0 0)";
              overlay.innerHTML = "";
              overlay.removeAttribute("data-theme");
              overlay.style.clipPath = "";

              requestAnimationFrame(() => {
                document.body.classList.remove("no-transition");
                isAnimatingTheme.current = false;

                // Resume videos that were playing before the theme switch
                wasPlaying.forEach((vid) => {
                  vid.play().catch(() => {});
                });
              });
            });
          });

          // Small button pop on the toggle
          gsap.fromTo("#theme-toggle",
            { scale: 0.9 },
            { scale: 1, duration: 0.25, ease: "back.out(2.5)" }
          );
        }
      }
    );
  }, [theme]);

  // Click handler on center nav items
  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
    
    // Animate clicked icon pop
    const targetBtn = document.querySelector(`.nav-icon-item.active`);
    if (targetBtn) {
      gsap.fromTo(targetBtn.querySelector(".material-icons-outlined"),
        { scale: 0.7, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" }
      );
    }
  }, []);

  // Prompter controllers callbacks
  const handleToggleStyle = useCallback((styleKey) => {
    setSelectedStyles((prev) => {
      if (prev.includes(styleKey)) {
        return prev.filter((s) => s !== styleKey);
      } else {
        return [...prev, styleKey];
      }
    });
  }, []);

  // Generation Trigger Logic
  const handleGenerate = useCallback(() => {
    let activePrompt = prompt.trim();
    if (!activePrompt) {
      activePrompt = currentMode === "video"
        ? "A cinematic space odyssey showing a spaceship escaping a black hole, neon lights, 4k"
        : "A high-tech cyberpunk cat looking out over a neon-lit futuristic city grid, detailed textures";
      setPrompt(activePrompt);
    }

    const rowId = `row-${Date.now()}`;
    const modelText = imageModels.find(m => m.value === model)?.text || videoModels.find(m => m.value === model)?.text || "Flux Ultra";

    if (currentMode === "video") {
      // ─────────────────────────────────────
      // Video Generation Branch
      // ─────────────────────────────────────
      const cameraText = cameraOptions.find(c => c.value === cameraMotion)?.text || "Zoom In";
      const matchedVideos = [];
      for (let i = 0; i < count; i++) {
        const mv = findMatchedVideo(activePrompt, i, videoDatabase);
        matchedVideos.push({
          videoUrl: mv.videoUrl,
          thumbnailUrl: mv.thumbnailUrl || ""
        });
      }

      const newRow = {
        id: rowId,
        prompt: activePrompt,
        model: modelText,
        type: "video",
        ratio: ratio,
        urls: matchedVideos,
        duration: videoDuration,
        motion: motionStrength,
        camera: cameraText,
        status: "loading" // internal loaders run in VideoWorkspaceCard
      };

      // Prepend to generations
      setGenerations((prev) => [newRow, ...prev]);

      // Video items are loaded individually in VideoWorkspaceCard. Once each loads,
      // it adds itself to history track. We can simulate adding the video history cards
      // with a slight staggered delay to mimic completion.
      matchedVideos.forEach((vidObj, index) => {
        setTimeout(() => {
          setHistoryItems((prev) => [
            {
              id: `hist-vid-${rowId}-${index}`,
              type: "video",
              src: vidObj.videoUrl,
              title: findMatchedVideo(activePrompt, index, videoDatabase).title,
              isInitial: false
            },
            ...prev
          ]);
        }, 3200 + index * 300); // slightly after simulated video rendering progress wraps
      });

    } else {
      // ─────────────────────────────────────
      // Image Generation Branch
      // ─────────────────────────────────────
      const lowerPrompt = activePrompt.toLowerCase();
      let matchedList = imagesDatabase.general;
      if (lowerPrompt.includes("cat") || lowerPrompt.includes("feline")) matchedList = imagesDatabase.cat;
      else if (lowerPrompt.includes("cyberpunk") || lowerPrompt.includes("neon") || lowerPrompt.includes("futuristic")) matchedList = imagesDatabase.cyberpunk;
      else if (lowerPrompt.includes("city") || lowerPrompt.includes("tokyo") || lowerPrompt.includes("street")) matchedList = imagesDatabase.city;
      else if (lowerPrompt.includes("forest") || lowerPrompt.includes("nature") || lowerPrompt.includes("tree")) matchedList = imagesDatabase.forest;
      else if (lowerPrompt.includes("space") || lowerPrompt.includes("galaxy") || lowerPrompt.includes("nebula") || lowerPrompt.includes("star")) matchedList = imagesDatabase.space;
      else if (lowerPrompt.includes("car") || lowerPrompt.includes("auto") || lowerPrompt.includes("race")) matchedList = imagesDatabase.car;
      else if (lowerPrompt.includes("anime") || lowerPrompt.includes("illustration") || lowerPrompt.includes("art")) matchedList = imagesDatabase.anime;

      // Select random images matching selected count
      const selectedUrls = [...matchedList].sort(() => 0.5 - Math.random()).slice(0, count);
      // Fail-safe pad if selectedUrls is smaller than count
      while (selectedUrls.length < count) {
        selectedUrls.push(matchedList[selectedUrls.length % matchedList.length]);
      }

      const newRow = {
        id: rowId,
        prompt: activePrompt,
        model: modelText,
        type: "image",
        ratio: ratio,
        urls: selectedUrls,
        status: "loading"
      };

      setGenerations((prev) => [newRow, ...prev]);

      // Simulate network synthesis duration delay
      setTimeout(() => {
        setGenerations((prev) => 
          prev.map((g) => (g.id === rowId ? { ...g, status: "loaded" } : g))
        );

        // Prep new items in history track
        selectedUrls.forEach((imgUrl, index) => {
          setHistoryItems((prev) => [
            {
              id: `hist-img-${rowId}-${index}`,
              type: "image",
              src: imgUrl,
              title: `AI Generated #${index + 1}`,
              isInitial: false
            },
            ...prev
          ]);
        });
      }, 2000);
    }
  }, [
    prompt, currentMode, count, ratio, model,
    cameraMotion, videoDuration, motionStrength, videoDatabase
  ]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* 1. Header Navigation */}
      <nav className="navbar" id="main-navbar">
        <Logo />
        <CenterNav activeTab={activeTab} onTabClick={handleTabClick} />
        <RightNav 
          activeTab={activeTab} 
          onTabClick={handleTabClick} 
          onThemeToggle={handleThemeToggle}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
      </nav>

      {/* 2. History Track Carousel */}
      <HistorySection historyItems={historyItems} />

      {/* 3. Page Main Workspace Area */}
      <main className="page-content">
        <div className="workspace-container">
          <Sidebar
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            count={count}
            onCountChange={setCount}
            ratio={ratio}
            onRatioChange={setRatio}
            model={model}
            onModelChange={setModel}
            cfgScale={cfgScale}
            onCfgChange={setCfgScale}
            steps={steps}
            onStepsChange={setSteps}
            negativePrompt={negativePrompt}
            onNegativePromptChange={setNegativePrompt}
            videoDuration={videoDuration}
            onVideoDurationChange={setVideoDuration}
            motionStrength={motionStrength}
            onMotionStrengthChange={setMotionStrength}
            cameraMotion={cameraMotion}
            onCameraChange={setCameraMotion}
            selectedStyles={selectedStyles}
            onToggleStyle={handleToggleStyle}
          />
          <Workspace generations={generations} />
        </div>
      </main>

      {/* 4. Mobile responsive Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
    </>
  );
}
