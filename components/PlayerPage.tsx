"use client";

import React from "react";
import BreadCrumbFragment from "./ui/BreadCrumbFragment";
import CourseTitle from "./ui/CourseTitle";
import { courseMock } from "@/data/course.mock";
import CustomPlayer from "./ui/CustomPlayer";

export default function PlayerPage() {
  const course = courseMock;

  return (
    <div>
      <div className="bg-baby-blue p-4">
        <BreadCrumbFragment />
        <CourseTitle title={course.title} />
      </div>

      {/* sticky on mobile, normal on md+ */}
      <div className="sticky top-0 z-40 md:static md:z-auto bg-white">
        <CustomPlayer
          src={course.media?.heroVideo?.src ?? ""}
          poster={course.media?.heroVideo?.posterUrl}
          autoPlay={course.media?.heroVideo?.autoplay}
          // optional extra classes:
          className=""
        />
      </div>

      {/* sample content under player */}
      <div className="p-4 space-y-6">
        <div className="h-80 rounded-xl bg-baby-blue/50" />
        <div className="h-80 rounded-xl bg-baby-blue/50" />
        <div className="h-80 rounded-xl bg-baby-blue/50" />
      </div>
    </div>
  );
}
