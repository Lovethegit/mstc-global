import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import MediaTypes "../types/media";

mixin (
  mediaPosts : List.List<MediaTypes.MediaPost>,
  mediaState : { var nextPostCounter : Nat }
) {

  public shared ({ caller }) func createMediaPost(
    title : Text,
    content : Text,
    category : Text,
    author : Text,
    tags : [Text]
  ) : async { #ok : MediaTypes.MediaPost; #err : Text } {
    ignore caller;
    mediaState.nextPostCounter += 1;
    let post : MediaTypes.MediaPost = {
      id = "post-" # mediaState.nextPostCounter.toText();
      title;
      content;
      category;
      author;
      tags;
      isPublished = false;
      publishedAt = null;
      createdAt = Time.now();
      views = 0;
    };
    mediaPosts.add(post);
    #ok(post)
  };

  public query func listMediaPosts() : async [MediaTypes.MediaPost] {
    mediaPosts.toArray()
  };

  public query func getMediaPost(postId : Text) : async { #ok : MediaTypes.MediaPost; #err : Text } {
    switch (mediaPosts.find(func(p : MediaTypes.MediaPost) : Bool { p.id == postId })) {
      case (?p) { #ok(p) };
      case null { #err("Post not found") };
    }
  };

  public shared ({ caller }) func publishMediaPost(
    postId : Text
  ) : async { #ok : MediaTypes.MediaPost; #err : Text } {
    ignore caller;
    var updated : ?MediaTypes.MediaPost = null;
    mediaPosts.mapInPlace(func(p : MediaTypes.MediaPost) : MediaTypes.MediaPost {
      if (p.id == postId) {
        let u = { p with isPublished = true; publishedAt = ?Time.now() };
        updated := ?u;
        u
      } else { p }
    });
    switch (updated) {
      case (?p) { #ok(p) };
      case null { #err("Post not found") };
    }
  };

  public shared ({ caller }) func incrementPostViews(postId : Text) : async () {
    ignore caller;
    mediaPosts.mapInPlace(func(p : MediaTypes.MediaPost) : MediaTypes.MediaPost {
      if (p.id == postId) { { p with views = p.views + 1 } } else { p }
    });
  };

};
