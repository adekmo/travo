'use client'

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Comment } from "@/types/comment";
// import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { MessageCircle, MoreHorizontal, Reply, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";


const CommentSection = ({ storyId }: { storyId: string }) => {
  
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = useCallback(async () => {
      try {
        const res = await fetch(`/api/stories/${storyId}/comments`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("❌ Failed to fetch comments", err);
      }
    }, [storyId]);;

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
    }, [fetchComments]);

  return (
    <div className="mt-10">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Komentar ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          {session?.user && (
            <div className="space-y-3">
              <div className="flex gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={session?.user.avatar} alt={session?.user.name} />
                    <AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Tulis komentar Anda..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePostComment} disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Mengirim..." : "Kirim Komentar"}
                </Button>
              </div>
            </div>
          )}

          {/* Comment List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada komentar</p>
                <p className="text-sm text-gray-400">Jadilah yang pertama berkomentar!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={comment.userId.avatar} alt={comment.userId.name} />
                      <AvatarFallback>{comment.userId.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-50 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {comment.userId.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleString("id-ID")}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 ml-4">
                        {/* <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            comment.isLiked
                              ? "text-red-500"
                              : "text-gray-500 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${comment.isLiked ? "fill-current" : ""}`}
                          />
                          {comment.likes > 0 && <span>{comment.likes}</span>}
                        </button> */}
                        
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                          <Reply className="h-4 w-4" />
                          Balas
                        </button>
                        
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CommentSection