// course.types.ts
export type LessonType = "video" | "article" | "exercise" | "file" | "quiz";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  isLocked: boolean;
  durationMinutes?: number; // e.g. 10
  questionCount?: number; // e.g. 2
}

export interface WeekGroup {
  id: string;
  title: string; // e.g. "Week 1–4"
  subtitle?: string; // the gray line under the week title
  lessons: Lesson[];
}

export interface CourseStats {
  durationWeeks: number; // e.g. 3
  lessonsCount: number; // e.g. 8
  enrolledCount: number; // e.g. 65
  language: string; // e.g. "English"
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  dateISO: string; // ISO date
  text: string;
}

export interface CourseMedia {
  heroVideo?: {
    posterUrl?: string;
    src?: string;
    autoplay?: boolean;
  };
  shareLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  progressPercent?: number; // the green bar (e.g. 63)
  materials: CourseStats[]; // UI shows two cards with same numbers
  weeks: WeekGroup[];
  comments: Comment[];
  media?: CourseMedia;
}
