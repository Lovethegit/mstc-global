import { createActor } from "@/backend";
import type { BlogPost } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";

export type { BlogPost };

export function usePublishedBlogPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BlogPost[]>({
    queryKey: ["published-blog-posts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const res = await actor.getPublishedBlogPosts();
        return res;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
