import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import AcademyTypes "../types/academy";

mixin (
  courses : List.List<AcademyTypes.Course>,
  enrollments : List.List<AcademyTypes.Enrollment>,
  academyState : { var nextCourseCounter : Nat; var nextLessonCounter : Nat; var nextEnrollmentCounter : Nat }
) {

  public shared ({ caller }) func createCourse(
    title : Text,
    description : Text,
    category : Text,
    instructor : Text
  ) : async { #ok : AcademyTypes.Course; #err : Text } {
    ignore caller;
    academyState.nextCourseCounter += 1;
    let course : AcademyTypes.Course = {
      id = "course-" # academyState.nextCourseCounter.toText();
      title;
      description;
      category;
      instructor;
      duration = 0;
      lessons = [];
      enrolledCount = 0;
      isPublished = false;
      createdAt = Time.now();
    };
    courses.add(course);
    #ok(course)
  };

  public query func listCourses() : async [AcademyTypes.Course] {
    courses.toArray()
  };

  public query func getCourse(courseId : Text) : async { #ok : AcademyTypes.Course; #err : Text } {
    switch (courses.find(func(c : AcademyTypes.Course) : Bool { c.id == courseId })) {
      case (?c) { #ok(c) };
      case null { #err("Course not found") };
    }
  };

  public shared ({ caller }) func addLesson(
    courseId : Text,
    title : Text,
    content : Text,
    order : Nat
  ) : async { #ok : AcademyTypes.Lesson; #err : Text } {
    ignore caller;
    academyState.nextLessonCounter += 1;
    let lesson : AcademyTypes.Lesson = {
      id = "lesson-" # academyState.nextLessonCounter.toText();
      courseId;
      title;
      content;
      videoUrl = null;
      order;
      duration = 0;
    };
    var found = false;
    courses.mapInPlace(func(c : AcademyTypes.Course) : AcademyTypes.Course {
      if (c.id == courseId) {
        found := true;
        let newLessons = c.lessons.concat([lesson]);
        { c with lessons = newLessons }
      } else { c }
    });
    if (not found) { return #err("Course not found") };
    #ok(lesson)
  };

  public shared ({ caller }) func enrollStudent(
    courseId : Text,
    studentId : Text
  ) : async { #ok : AcademyTypes.Enrollment; #err : Text } {
    ignore caller;
    switch (courses.find(func(c : AcademyTypes.Course) : Bool { c.id == courseId })) {
      case null { return #err("Course not found") };
      case (?_) {};
    };
    // Check duplicate enrollment
    switch (enrollments.find(func(e : AcademyTypes.Enrollment) : Bool {
      e.courseId == courseId and e.studentId == studentId
    })) {
      case (?_) { return #err("Already enrolled") };
      case null {};
    };
    academyState.nextEnrollmentCounter += 1;
    let enrollment : AcademyTypes.Enrollment = {
      id = "enroll-" # academyState.nextEnrollmentCounter.toText();
      courseId;
      studentId;
      progress = 0;
      completedLessons = [];
      enrolledAt = Time.now();
      completedAt = null;
    };
    enrollments.add(enrollment);
    // Increment enrolled count on course
    courses.mapInPlace(func(c : AcademyTypes.Course) : AcademyTypes.Course {
      if (c.id == courseId) { { c with enrolledCount = c.enrolledCount + 1 } } else { c }
    });
    #ok(enrollment)
  };

  public shared ({ caller }) func updateProgress(
    courseId : Text,
    studentId : Text,
    lessonId : Text
  ) : async { #ok : AcademyTypes.Enrollment; #err : Text } {
    ignore caller;
    var updated : ?AcademyTypes.Enrollment = null;
    enrollments.mapInPlace(func(e : AcademyTypes.Enrollment) : AcademyTypes.Enrollment {
      if (e.courseId == courseId and e.studentId == studentId) {
        // Add lesson if not already in completed list
        let alreadyDone = e.completedLessons.find<Text>(func(l) { l == lessonId }) != null;
        if (alreadyDone) {
          updated := ?e;
          e
        } else {
          let newCompleted = e.completedLessons.concat([lessonId]);
          let u = { e with completedLessons = newCompleted; progress = newCompleted.size() * 10 };
          updated := ?u;
          u
        }
      } else { e }
    });
    switch (updated) {
      case (?e) { #ok(e) };
      case null { #err("Enrollment not found") };
    }
  };

  public query func getEnrollments(studentId : Text) : async [AcademyTypes.Enrollment] {
    let all = enrollments.toArray();
    all.filter<AcademyTypes.Enrollment>(func(e) { e.studentId == studentId })
  };

};
