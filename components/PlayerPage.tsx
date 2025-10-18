"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import BreadCrumbFragment from "./ui/BreadCrumbFragment";
import CourseTitle from "./ui/CourseTitle";
import { courseMock } from "@/data/course.mock";
import CustomPlayer from "./ui/CustomPlayer";

export default function PlayerPage() {
  const course = courseMock;

  const headerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const playerBoxRef = useRef<HTMLDivElement>(null);

  const [playerH, setPlayerH] = useState(0);
  const [pinned, setPinned] = useState(false);

  // measure player height for spacer
  useLayoutEffect(() => {
    const el = playerBoxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setPlayerH(el.getBoundingClientRect().height)
    );
    ro.observe(el);
    setPlayerH(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  // pin when sentinel scrolls past the top of the viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const io = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { root: null, rootMargin: "0px", threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-white">
      {/* Header (normal, scrolls away) */}
      <div ref={headerRef} className="bg-baby-blue p-4">
        <BreadCrumbFragment />
        <CourseTitle title={course.title} />
      </div>

      {/* Sentinel: sits just before the player */}
      <div ref={sentinelRef} />

      {/* Spacer only while fixed (prevents jump) */}
      {pinned && <div className="md:hidden" style={{ height: playerH }} />}

      {/* Player: normal flow -> fixed at top when pinned (mobile) */}
      <div
        ref={playerBoxRef}
        className={[
          "md:static md:z-auto",
          pinned ? "fixed left-0 right-0 z-40 md:static" : "",
        ].join(" ")}
        // header is NOT fixed, so the player should go to very top
        style={pinned ? { top: 0 } : undefined}
      >
        <CustomPlayer
          src={course.media?.heroVideo?.src ?? ""}
          poster={course.media?.heroVideo?.posterUrl}
          autoPlay={course.media?.heroVideo?.autoplay}
        />
      </div>

      {/* Page content */}
      <div className="p-4 space-y-6">
        <div className="h-80 rounded-xl bg-baby-blue/50" />
        <div className="h-80 rounded-xl bg-baby-blue/50" />
        <div className="h-80 rounded-xl bg-baby-blue/50" />
      </div>
    </div>
  );
}
