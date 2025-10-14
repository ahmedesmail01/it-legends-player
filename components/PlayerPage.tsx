"use client";

import React, { useEffect, useRef, useState } from "react";
import BreadCrumbFragment from "./ui/BreadCrumbFragment";
import CourseTitle from "./ui/CourseTitle";
import { courseMock } from "@/data/course.mock";
import {
  CaretRightOutlined,
  FullscreenOutlined,
  PauseOutlined,
} from "@ant-design/icons";

export default function PlayerPage() {
  const DummyCourse = courseMock;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [wide, setWide] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // time helpers
  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // events
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

  // handlers
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
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
    if (val === 0) setMuted(true);
    else setMuted(false);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleMaximize = async () => {
    const el = wrapperRef.current || videoRef.current;
    try {
      if (el?.requestFullscreen) await el.requestFullscreen();
      else if ((videoRef.current as any)?.webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen(); // iOS
      }
    } catch {}
  };

  return (
    <div>
      <div className="bg-baby-blue p-4">
        <BreadCrumbFragment />
        <CourseTitle title={DummyCourse.title} />
      </div>

      {/* sticky on mobile, normal on md+ */}
      <div className="sticky top-0 z-40 md:static md:z-auto bg-white">
        <div
          ref={wrapperRef}
          className={[
            "relative mx-auto p-4",
            "aspect-video md:aspect-auto",
            wide ? "md:max-w-none md:w-full" : "md:max-w-[780px] md:w-[780px]",
          ].join(" ")}
        >
          {/* Video (no native controls) */}
          <video
            ref={videoRef}
            src={DummyCourse.media?.heroVideo?.src}
            poster={DummyCourse.media?.heroVideo?.posterUrl}
            autoPlay={DummyCourse.media?.heroVideo?.autoplay}
            className={[
              "w-full h-full bg-black",
              wide ? "rounded-none" : "rounded-2xl",
            ].join(" ")}
            playsInline
          />

          {/* Controls overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
            <div className="pointer-events-auto rounded-xl bg-black/60 text-white backdrop-blur-sm">
              {/* Seek bar */}
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

              {/* Buttons row */}
              <div className="flex items-center gap-2 px-3 py-2">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="rounded-md px-2 py-1 hover:bg-white/10"
                >
                  {playing ? (
                    <PauseOutlined
                      style={{
                        fontSize: 20,
                      }}
                    />
                  ) : (
                    <CaretRightOutlined
                      style={{
                        fontSize: 20,
                      }}
                    />
                  )}
                </button>

                {/* Time */}
                <span className="text-sm tabular-nums">
                  {fmt(current)} / {fmt(duration)}
                </span>

                {/* Volume + Mute */}
                <button
                  onClick={toggleMute}
                  className="ml-2 rounded-md px-2 py-1 hover:bg-white/10"
                  title="Mute"
                >
                  {muted || volume === 0 ? "Unmute" : "Mute"}
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
                  {/* Wide toggle (desktop) */}
                  <button
                    onClick={() => setWide((v) => !v)}
                    className="hidden md:inline-block rounded-md px-3 py-1 text-sm hover:bg-white/10"
                    title="Wide"
                  >
                    {wide ? "Normal" : "Wide"}
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={handleMaximize}
                    className="rounded-md px-3 py-1 text-sm hover:bg-white/10"
                    title="Maximize (Fullscreen)"
                  >
                    <FullscreenOutlined
                      style={{
                        fontSize: 20,
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* sample content to test sticky */}
      <div className="p-4 space-y-6">
        <div className="h-80 rounded-xl bg-baby-blue/50" />
        <div className="h-80 rounded-xl bg-baby-blue/50" />
        <div className="h-80 rounded-xl bg-baby-blue/50" />
      </div>
    </div>
  );
}
