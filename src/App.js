import { useMemo, useState, useRef, useEffect } from "react";
import orderBy from "lodash/orderBy";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import axios from "axios";
// 自定义 Hook：获取评论列表
function useGetComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchComments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/comments");
        if (cancelled) return;
        setComments((prev) => {
          const prevStr = JSON.stringify(prev);
          const nextStr = JSON.stringify(res.data);
          return prevStr === nextStr ? prev : res.data;
        });
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchComments();

    return () => {
      cancelled = true;
    };
  }, []);
  return {
    comments,
    setComments,
  };
}
//封装Item组件
function CommentItem({ comment, onLike, onDelete }) {
  return (
    <div className="comment-content" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <img
        src={comment.avatarSrc}
        alt={comment.author}
        width={56}
        height={56}
        style={{ display: "block", borderRadius: "50%", boxShadow: "0 1px 2px rgba(0,0,0,.06)" }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            color: "#111111ff",
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 6,
          }}
        >
          {comment.author}
        </div>
        <div
          style={{
            color: "#222",
            fontSize: 15,
            lineHeight: 1.7,
            marginBottom: 12,
            whiteSpace: "pre-wrap"
          }}
        >
          {comment.text}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#7e8b97",
            fontSize: 12,
          }}
        >
          <span>{dayjs(comment.createdAt).format("MM-DD HH:mm")}</span>
          <span
            onClick={() => onLike(comment.id)}
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "2px 10px",
              border: "1px solid #e5e7eb",
              borderRadius: 999,
              background: "#fff",
              color: comment.likes > 0 ? "#1890ff" : "inherit",
              transition: "all .15s ease"
            }}
          >
            👍 {comment.likes || "点赞"}
          </span>
          <span
            onClick={() => onDelete(comment.id)}
            style={{ marginLeft: "auto", color: "#9aa3aa", cursor: "pointer" }}
          >
            删除
          </span>
        </div>
      </div>
    </div>
  );
}
function App() {
  const { comments, setComments } = useGetComments();
  const [sortKey, setSortKey] = useState("time");
  const textareaRef = useRef(null);

  const sorted = useMemo(() => {
    const key = sortKey === "time" ? "createdAt" : "likes";
    return orderBy(comments, [key], ["desc"]);
  }, [comments, sortKey]);

  const likeComment = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)),
    );
  };

  const deleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handlePost = () => {
    const text = textareaRef.current.value.trim();
    if (!text) return;

    const newComment = {
      id: uuidv4(),
      author: "Me",
      text,
      createdAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      likes: 0,
      avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=${Date.now()}`,
    };

    setComments([newComment, ...comments]);
    textareaRef.current.value = "";
    textareaRef.current.focus();
  };

  return (
    <div
      className="app"
      style={{
        maxWidth: 720,
        margin: "24px auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "0 20px",
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
        评论列表
      </h2>

      <div className="comment-input" style={{ marginBottom: 32 }}>
        <textarea
          ref={textareaRef}
          placeholder="发条友善的评论..."
          style={{
            width: "100%",
            height: 80,
            padding: "12px",
            borderRadius: 4,
            border: "1px solid #ddd",
            marginBottom: 12,
            resize: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
        <div style={{ textAlign: "right" }}>
          <button
            onClick={handlePost}
            style={{
              padding: "8px 24px",
              background: "#1890ff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            发布
          </button>
        </div>
      </div>

      <div
        className="tabs"
        style={{
          display: "flex",
          gap: 24,
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 24,
        }}
      >
        <div
          className={cx("tab", { active: sortKey === "time" })}
          onClick={() => setSortKey("time")}
          style={{
            cursor: "pointer",
            paddingBottom: 12,
            color: sortKey === "time" ? "#1890ff" : "#333",
            fontWeight: sortKey === "time" ? 600 : 400,
            borderBottom: sortKey === "time" ? "2px solid #1890ff" : "none",
            marginBottom: -1,
          }}
        >
          最新
        </div>
        <div
          className={cx("tab", { active: sortKey === "likes" })}
          onClick={() => setSortKey("likes")}
          style={{
            cursor: "pointer",
            paddingBottom: 12,
            color: sortKey === "likes" ? "#1890ff" : "#333",
            fontWeight: sortKey === "likes" ? 600 : 400,
            borderBottom: sortKey === "likes" ? "2px solid #1890ff" : "none",
            marginBottom: -1,
          }}
        >
          最热
        </div>
      </div>

      <ul
        className="comment-list"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {sorted.map((comment) => (
          <li
            key={comment.id}
            className={cx("comment-item")}
            style={{ padding: 12, border: "1px solid #ffff", borderRadius: 8, background: "#fff" }}
          >
            <CommentItem comment={comment} onLike={likeComment} onDelete={deleteComment} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;