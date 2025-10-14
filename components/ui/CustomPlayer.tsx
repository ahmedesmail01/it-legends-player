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
  /** Extra wrapper classes (e.g., to control stickiness outside) */
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

  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // sync duration/time/play state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => setDuration(v.duration || 0);
    const onTime = () => setCurrent(v.currentTime || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

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

  // Track fullscreen (ESC, browser UI, iOS events)
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
    v.currentTime = val;
    setCurrent(val);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  // Fullscreen toggle with state + iOS fallback
  const toggleFullscreen = async () => {
    const wrapper = wrapperRef.current;
    const v = videoRef.current as any;
    try {
      if (!isFullscreen) {
        if (wrapper?.requestFullscreen) {
          await wrapper.requestFullscreen();
        } else if (v?.webkitEnterFullscreen) {
          v.webkitEnterFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (v?.webkitExitFullscreen) {
          v.webkitExitFullscreen?.();
        }
        setIsFullscreen(false);
      }
    } catch {}
  };

  return (
    <div
      ref={wrapperRef}
      className={[
        "relative mx-auto p-4",
        "aspect-video md:aspect-auto",
        wide ? "md:max-w-none md:w-full" : "md:max-w-[780px] md:w-[780px]",
        className,
      ].join(" ")}
    >
      {/* Video (no native controls) */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className={[
          "w-full h-full bg-black",
          wide ? "rounded-none" : "rounded-lg",
        ].join(" ")}
        playsInline
      />

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4">
        <div className="pointer-events-auto rounded-lg bg-black/60 text-white backdrop-blur-sm">
          {/* Seek */}
          <div className="px-3 pt-3">
            <input
              type="range"
              min={0}
              max={Math.max(1, duration)}
              step={0.1}
              value={current}
              onChange={onSeek}
              className="w-full accent-white"
            />
          </div>

          {/* Row */}
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
              {/* Wide (desktop) */}
              <button
                onClick={() => setWide((v) => !v)}
                className="hidden md:inline-block rounded-md px-3 py-1 text-sm hover:bg-white/10"
                title="Wide"
              >
                {wide ? (
                  <GatewayOutlined style={{ fontSize: 20 }} />
                ) : (
                  <SplitCellsOutlined style={{ fontSize: 20 }} />
                )}
              </button>

              {/* Fullscreen */}
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
