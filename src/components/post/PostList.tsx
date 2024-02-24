import { type Events, type Posts, type User } from "@prisma/client";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Loading } from "../Loading";
import { useState } from "react";

type PostListProps = { eventId: number };

const PostList = ({ eventId }: PostListProps) => {
  const { data: posts, isSuccess } = api.posts.posts.useQuery({ eventId });

  if (!isSuccess) {
    return <></>;
  }

  return (
    <>
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </>
  );
};

export default PostList;

type PostProps = { post: Posts & { author: User; events: Events } };

export const Post = (props: PostProps) => {
  const { post } = props;
  const { data: session } = useSession();

  const canDeletePost =
    session?.user.id === post.authorId ||
    session?.user.id === post.events.hostId;

  return (
    <div key={post.postId} className="w-full rounded border p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <span className="font-bold">
            {post.author.name ?? post.author.email ?? "Anonymous"}
          </span>
          <span className="text-sm italic">
            {post.createdAt.toLocaleString("en-GB", {
              month: "short",
              day: "numeric",
              minute: "numeric",
              hour: "numeric",
            })}
          </span>
        </div>
        {canDeletePost && <ConfirmDelete post={post} />}
      </div>

      <p className="py-2">{post.message}</p>
    </div>
  );
};

type ConfirmDeleteProps = { post: Posts & { author: User; events: Events } };

const ConfirmDelete = ({ post }: ConfirmDeleteProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const utils = api.useUtils();
  const deletePostMutation = api.posts.deletePost.useMutation();

  const deletePost = () => {
    deletePostMutation.mutate(
      { postId: post.postId },
      {
        onSuccess: () => {
          setDialogOpen(false);
          void utils.posts.posts.invalidate({ eventId: post.eventsId });
        },
      },
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button asChild variant={"ghost"}>
        <DialogTrigger>
          <Trash />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete post?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={deletePost}
              disabled={deletePostMutation.isLoading}
            >
              {!deletePostMutation.isLoading ? "Delete" : <Loading />}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
