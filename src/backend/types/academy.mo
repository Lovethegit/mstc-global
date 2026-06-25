import Types "common";

module {
  public type Lesson = {
    id : Text;
    courseId : Text;
    title : Text;
    content : Text;
    videoUrl : ?Text;
    order : Nat;
    duration : Nat; // minutes
  };

  public type Course = {
    id : Text;
    title : Text;
    description : Text;
    category : Text;
    instructor : Text;
    duration : Nat; // minutes
    lessons : [Lesson];
    enrolledCount : Nat;
    isPublished : Bool;
    createdAt : Types.Timestamp;
  };

  public type Enrollment = {
    id : Text;
    courseId : Text;
    studentId : Text;
    progress : Nat; // 0-100
    completedLessons : [Text];
    enrolledAt : Types.Timestamp;
    completedAt : ?Types.Timestamp;
  };
};
