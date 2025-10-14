"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CaretRightOutlined,
  PauseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  AudioMutedOutlined,
  SoundOutlined,
  GatewayOutlined,
  SplitCellsOutlined,
} from "@ant-design/icons";

type Props = {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
};

export default function CustomPlayer({
  src,
  poster,
  autoPlay,
  className = "",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [wide, setWide] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ⬇️ NEW: auto-hide
  const [showControls, setShowControls] = useState(true);
  const idleTimer = useRef<number | null>(null);
  const isScrubbing = useRef(false);
  const IDLE_MS = 2200;

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // helpers
  const clearIdle = () => {
    if (idleTimer.current) {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  };
  const startIdle = () => {
    clearIdle();
    // Only hide when playing and not scrubbing
    idleTimer.current = window.setTimeout(() => {
      if (playing && !isScrubbing.current) setShowControls(false);
    }, IDLE_MS) as unknown as number;
  };
  const nudgeControls = () => {
    setShowControls(true);
    startIdle();
  };

  // wire basic video events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => setDuration(v.duration || 0);
    const onTime = () => setCurrent(v.currentTime || 0);
    const onPlay = () => {
      setPlaying(true);
      nudgeControls(); // show briefly when playback starts
    };
    const onPause = () => {
      setPlaying(false);
      clearIdle();
      setShowControls(true); // stay visible when paused
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  // fullscreen tracking (incl. iOS)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);

    const v = videoRef.current as any;
    const onBeginIOS = () => setIsFullscreen(true);
    const onEndIOS = () => setIsFullscreen(false);
    v?.addEventListener?.("webkitbeginfullscreen", onBeginIOS);
    v?.addEventListener?.("webkitendfullscreen", onEndIOS);

    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      v?.removeEventListener?.("webkitbeginfullscreen", onBeginIOS);
      v?.removeEventListener?.("webkitendfullscreen", onEndIOS);
    };
  }, []);

  // global interactions that should reveal controls
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onMove = () => nudgeControls();
    const onEnter = () => nudgeControls();
    const onLeave = () => {
      // if playing and not scrubbing, hide a bit after leaving
      if (playing && !isScrubbing.current) startIdle();
    };
    const onTouch = () => nudgeControls();
    const onKey = (e: KeyboardEvent) => {
      // space/arrow keys commonly used
      if (
        [" ", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
      ) {
        nudgeControls();
      }
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [playing]);

  // controls
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    isScrubbing.current = true;
    setShowControls(true);
    v.currentTime = val;
    setCurrent(val);
  };
  const onSeekEnd = () => {
    isScrubbing.current = false;
    if (playing) startIdle();
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.volume = val;
    setVolume(val);
    setMuted(val === 0);
    nudgeControls();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    nudgeControls();
  };

  const toggleFullscreen = async () => {
    const wrapper = wrapperRef.current;
    const v = videoRef.current as any;
    try {
      if (!isFullscreen) {
        if (wrapper?.requestFullscreen) await wrapper.requestFullscreen();
        else if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement && document.exitFullscreen)
          await document.exitFullscreen();
        else v?.webkitExitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {}
    nudgeControls();
  };

  return (
    <div
      ref={wrapperRef}
      className={[
        "relative mx-auto w-full max-w-screen overflow-hidden",
        "aspect-video md:aspect-auto",
        "md:p-4",
        wide ? "md:max-w-none md:w-full" : "md:max-w-[780px] md:w-[780px]",
        className,
      ].join(" ")}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className={[
          "block w-full h-full bg-black",
          wide ? "rounded-none" : "rounded-lg",
        ].join(" ")}
        playsInline
        onClick={togglePlay} // tap = play/pause + reveal
        onPlay={nudgeControls}
        onPause={() => {
          clearIdle();
          setShowControls(true);
        }}
      />

      {/* Controls (auto-hide) */}
      <div
        className={[
          "absolute inset-x-0 bottom-0 px-3 pb-3 transition-all duration-200",
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        <div
          className={[
            "rounded-lg bg-black/60 text-white backdrop-blur-sm",
            // disable interactions when hidden
            showControls ? "pointer-events-auto" : "pointer-events-none",
          ].join(" ")}
          // keep visible while hovering the bar
          onMouseEnter={() => {
            clearIdle();
            setShowControls(true);
          }}
          onMouseLeave={() => {
            if (playing) startIdle();
          }}
        >
          <div className="px-3 pt-3">
            <input
              type="range"
              min={0}
              max={Math.max(1, duration)}
              step={0.1}
              value={current}
              onChange={onSeek}
              onMouseUp={onSeekEnd}
              onTouchEnd={onSeekEnd}
              className="w-full accent-white"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2">
            <button
              onClick={togglePlay}
              className="rounded-md px-2 py-1 hover:bg-white/10"
            >
              {playing ? (
                <PauseOutlined style={{ fontSize: 20 }} />
              ) : (
                <CaretRightOutlined style={{ fontSize: 20 }} />
              )}
            </button>

            <span className="text-sm tabular-nums">
              {fmt(current)} / {fmt(duration)}
            </span>

            <button
              onClick={toggleMute}
              className="ml-2 rounded-md px-2 py-1 hover:bg-white/10"
              title="Mute"
            >
              {muted || volume === 0 ? (
                <AudioMutedOutlined />
              ) : (
                <SoundOutlined />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={onVolume}
              className="w-28 accent-white"
            />

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => {
                  setWide((v) => !v);
                  nudgeControls();
                }}
                className="hidden md:inline-block rounded-md px-3 py-1 text-sm hover:bg-white/10"
                title="Wide"
              >
                {wide ? (
                  <GatewayOutlined style={{ fontSize: 20 }} />
                ) : (
                  <SplitCellsOutlined style={{ fontSize: 20 }} />
                )}
              </button>

              <button
                onClick={toggleFullscreen}
                className="rounded-md px-3 py-1 text-sm hover:bg-white/10"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <FullscreenExitOutlined style={{ fontSize: 20 }} />
                ) : (
                  <FullscreenOutlined style={{ fontSize: 20 }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
