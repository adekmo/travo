'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Comment } from "@/types/comment";
import Image from "next/image";


const CommentSection = ({ storyId }: { storyId: string }) => {
  
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
        const res = await fetch(`/api/stories/${storyId}/comments`);
        const data = await res.json();
        setComments(data);
        } catch (err) {
        console.error("❌ Failed to fetch comments", err);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        setLoading(true);

        try {
        const res = await fetch(`/api/stories/${storyId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newComment }),
        });

        if (res.ok) {
            setNewComment("");
            await fetchComments();
        }
        } catch (err) {
        console.error("❌ Failed to post comment", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Komentar</h2>

      <div className="space-y-4">
        {comments.length === 0 && <p className="text-gray-500">Belum ada komentar.</p>}
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3 items-start border-t pt-3">
            <Image
              src={comment.userId.avatar || "/default-avatar.png"}
              alt={comment.userId.name}
              width={20}
              height={20}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{comment.userId.name}</p>
              <p className="text-sm text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {session?.user && (
        <div className="mt-6">
          <Textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar kamu..."
          />
          <Button className="mt-2" onClick={handlePostComment} disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Komentar"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default CommentSection