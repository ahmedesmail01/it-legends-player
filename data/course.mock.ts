// course.mock.ts

import { Course } from "@/types/course.types";

export const courseMock: Course = {
  id: "course_seo_001",
  slug: "starting-seo-as-your-home",
  title: "Starting SEO as your Home",
  progressPercent: 63,

  // The UI shows the same stats in two cards—keep both to mirror the layout,
  // or collapse to a single entry if you prefer.
  materials: [
    {
      durationWeeks: 3,
      lessonsCount: 8,
      enrolledCount: 65,
      language: "English",
    },
    {
      durationWeeks: 3,
      lessonsCount: 8,
      enrolledCount: 65,
      language: "English",
    },
  ],

  weeks: [
    {
      id: "w1_4",
      title: "Week 1–4",
      subtitle:
        "Advanced story telling techniques for writers: Personas, Characters & Plots",
      lessons: [
        { id: "l1", title: "Introduction", type: "video", isLocked: true },
        { id: "l2", title: "Course Overview", type: "article", isLocked: true },
        // The UI shows a second “Course Overview” row that has metadata (0 questions, 10 min)
        {
          id: "l3",
          title: "Course Overview",
          type: "video",
          isLocked: true,
          durationMinutes: 10,
          questionCount: 0,
        },
        {
          id: "l4",
          title: "Course Exercise / Reference Files",
          type: "file",
          isLocked: true,
        },
        {
          id: "l5",
          title: "Code Editor Installation (Optional if you have one)",
          type: "article",
          isLocked: true,
        },
        {
          id: "l6",
          title: "Embedding PHP in HTML",
          type: "video",
          isLocked: true,
        },
      ],
    },
    {
      id: "w5_8_a",
      title: "Week 5–8",
      subtitle:
        "Advanced story telling techniques for writers: Personas, Characters & Plots",
      lessons: [
        {
          id: "l7",
          title: "Defining Functions",
          type: "video",
          isLocked: true,
        },
        {
          id: "l8",
          title: "Function Parameters",
          type: "video",
          isLocked: true,
        },
        {
          id: "l9",
          title: "Return Values From Functions",
          type: "video",
          isLocked: true,
          durationMinutes: 15,
          questionCount: 2,
        },
        {
          id: "l10",
          title: "Global Variable and Scope",
          type: "video",
          isLocked: true,
        },
        {
          id: "l11",
          title: "Newer Way of creating a Constant",
          type: "video",
          isLocked: true,
        },
        { id: "l12", title: "Constants", type: "video", isLocked: true },
      ],
    },
    // The layout repeats another Week 5–8 card at the bottom; include if you want to mirror it.
    {
      id: "w5_8_b",
      title: "Week 5–8",
      subtitle:
        "Advanced story telling techniques for writers: Personas, Characters & Plots",
      lessons: [
        {
          id: "l13",
          title: "Defining Functions",
          type: "video",
          isLocked: true,
        },
        {
          id: "l14",
          title: "Function Parameters",
          type: "video",
          isLocked: true,
        },
        {
          id: "l15",
          title: "Return Values From Functions",
          type: "video",
          isLocked: true,
          durationMinutes: 15,
          questionCount: 2,
        },
        {
          id: "l16",
          title: "Global Variable and Scope",
          type: "video",
          isLocked: true,
        },
        {
          id: "l17",
          title: "Newer Way of creating a Constant",
          type: "video",
          isLocked: true,
        },
        { id: "l18", title: "Constants", type: "video", isLocked: true },
      ],
    },
  ],

  comments: [
    {
      id: "c1",
      authorName: "Student Name Goes Here",
      dateISO: "2021-10-10",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: "c2",
      authorName: "Student Name Goes Here",
      dateISO: "2021-10-15",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: "c3",
      authorName: "Student Name Goes Here",
      dateISO: "2021-10-19",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ],

  media: {
    heroVideo: {
      posterUrl: "/images/poster.png",
      src: "/videos/sample-video-01.mp4",
      autoplay: false,
    },
    shareLinks: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      youtube: "#",
    },
  },
};
