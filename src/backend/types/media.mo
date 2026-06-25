import Types "common";

module {
  public type MediaCategory = Text; // blog | social | press | video

  public type MediaPost = {
    id : Text;
    title : Text;
    content : Text;
    category : MediaCategory;
    author : Text;
    tags : [Text];
    isPublished : Bool;
    publishedAt : ?Types.Timestamp;
    createdAt : Types.Timestamp;
    views : Nat;
  };
};
