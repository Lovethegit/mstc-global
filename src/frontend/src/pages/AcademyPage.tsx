import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronLeft,
  Clock,
  Play,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const COURSES = [
  {
    id: 1,
    title: "RERA Fundamentals for Agents",
    category: "Legal",
    duration: "4 hours",
    level: "Beginner",
    instructor: "LexAI + Veda AI",
    enrolled: 142,
    rating: 4.8,
    lessons: 12,
    progress: 0,
  },
  {
    id: 2,
    title: "Property Valuation Masterclass",
    category: "Property",
    duration: "6 hours",
    level: "Intermediate",
    instructor: "ProphetAI",
    enrolled: 98,
    rating: 4.9,
    lessons: 18,
    progress: 0,
  },
  {
    id: 3,
    title: "Real Estate Investment Strategies",
    category: "Finance",
    duration: "8 hours",
    level: "Advanced",
    instructor: "FinanceAI",
    enrolled: 76,
    rating: 4.7,
    lessons: 24,
    progress: 0,
  },
  {
    id: 4,
    title: "Client Communication & Negotiation",
    category: "Sales",
    duration: "3 hours",
    level: "Beginner",
    instructor: "BrandAI",
    enrolled: 201,
    rating: 4.6,
    lessons: 10,
    progress: 0,
  },
  {
    id: 5,
    title: "Gujarat Market Intelligence 2026",
    category: "Market",
    duration: "2 hours",
    level: "All Levels",
    instructor: "ScaleAI",
    enrolled: 334,
    rating: 4.9,
    lessons: 8,
    progress: 0,
  },
  {
    id: 6,
    title: "Digital Marketing for Real Estate",
    category: "Marketing",
    duration: "5 hours",
    level: "Intermediate",
    instructor: "BrandAI",
    enrolled: 89,
    rating: 4.5,
    lessons: 16,
    progress: 0,
  },
  {
    id: 7,
    title: "Home Loan & Finance Advisory",
    category: "Finance",
    duration: "3.5 hours",
    level: "Beginner",
    instructor: "FinanceAI",
    enrolled: 115,
    rating: 4.7,
    lessons: 11,
    progress: 0,
  },
  {
    id: 8,
    title: "MSTC Operations Onboarding",
    category: "Operations",
    duration: "1.5 hours",
    level: "New Staff",
    instructor: "Aria AI",
    enrolled: 48,
    rating: 4.9,
    lessons: 6,
    progress: 100,
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-green-900/30 text-green-300 border-green-700/40",
  Intermediate: "bg-blue-900/30 text-blue-300 border-blue-700/40",
  Advanced: "bg-red-900/30 text-red-300 border-red-700/40",
  "All Levels": "bg-purple-900/30 text-purple-300 border-purple-700/40",
  "New Staff": "bg-gold-800/30 text-gold-300 border-gold-700/40",
};

const CATEGORIES = [
  "All",
  "Legal",
  "Property",
  "Finance",
  "Sales",
  "Market",
  "Marketing",
  "Operations",
];

export default function AcademyPage() {
  const [filter, setFilter] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([8]);

  const filtered =
    filter === "All" ? COURSES : COURSES.filter((c) => c.category === filter);
  const totalEnrolled = enrolledCourses.length;

  function enroll(id: number, title: string) {
    if (!enrolledCourses.includes(id)) {
      setEnrolledCourses((prev) => [...prev, id]);
      toast.success(`Enrolled in: ${title}`);
    } else {
      toast.info(`Continuing: ${title}`);
    }
  }

  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              to="/apps"
              className="p-2 rounded-lg border border-gold-800/30 hover:border-gold-600/50"
              data-ocid="academy.back_button"
            >
              <ChevronLeft className="w-4 h-4 text-gold-400" />
            </Link>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-gold-400"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                MSTC Academy
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered learning for staff, partners & clients
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Courses Available",
                value: COURSES.length.toString(),
                icon: BookOpen,
                color: "text-gold-400",
              },
              {
                label: "Enrolled",
                value: totalEnrolled.toString(),
                icon: Users,
                color: "text-blue-400",
              },
              {
                label: "Completed",
                value: enrolledCourses
                  .filter(
                    (id) => COURSES.find((c) => c.id === id)?.progress === 100,
                  )
                  .length.toString(),
                icon: TrendingUp,
                color: "text-green-400",
              },
              {
                label: "Total Learners",
                value: "1,234",
                icon: Star,
                color: "text-purple-400",
              },
            ].map((k, i) => (
              <div
                key={k.label}
                className="bg-card/80 border border-gold-800/30 rounded-xl p-4"
                data-ocid={`academy.stat.${i + 1}`}
              >
                <k.icon className={`w-5 h-5 mb-2 ${k.color}`} />
                <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  filter === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-gold-800/30 text-muted-foreground hover:text-gold-300"
                }`}
                data-ocid={`academy.filter.${c.toLowerCase()}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((course, i) => {
              const isEnrolled = enrolledCourses.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-card/80 border border-gold-800/30 rounded-2xl p-5 hover:border-gold-600/40 transition-all flex flex-col"
                  data-ocid={`academy.course.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <Badge
                      className={
                        LEVEL_COLORS[course.level] ??
                        "bg-muted/30 text-muted-foreground"
                      }
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground leading-snug mb-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    By {course.instructor} · {course.lessons} lessons
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.enrolled} enrolled
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                      {course.rating}
                    </span>
                  </div>

                  {isEnrolled && course.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-green-400">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted/30 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className={`mt-auto w-full text-xs ${
                      isEnrolled && course.progress === 100
                        ? "bg-green-900/30 text-green-300 border border-green-700/40"
                        : isEnrolled
                          ? "bg-primary/20 text-primary hover:bg-primary/30"
                          : "bg-primary text-primary-foreground"
                    }`}
                    onClick={() => enroll(course.id, course.title)}
                    data-ocid={`academy.course.enroll_button.${i + 1}`}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    {isEnrolled && course.progress === 100
                      ? "Completed ✓"
                      : isEnrolled
                        ? "Continue"
                        : "Enroll Now"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
