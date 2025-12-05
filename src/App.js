import { useMemo, useState, useRef } from 'react';
import orderBy from 'lodash/orderBy';
import cx from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import  dayjs from 'dayjs';
function App() {
  const [comments, setComments] = useState([
    { id: uuidv4(), author: 'Alice', text: '第一条评论', createdAt: dayjs(new Date(Date.now() - 1000 * 60 * 60)).format('YYYY-MM-DD HH:mm:ss'), likes: 2, avatarSrc: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1' },
    { id: uuidv4(), author: 'Bob', text: 'React 很好用', createdAt: dayjs(new Date(Date.now() - 1000 * 60 * 10)).format('YYYY-MM-DD HH:mm:ss'), likes: 5, avatarSrc: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2' },
    { id: uuidv4(), author: 'Carol', text: '你好', createdAt: dayjs(new Date(Date.now() - 1000 * 60 * 120)).format('YYYY-MM-DD HH:mm:ss'), likes: 0, avatarSrc: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3' }
  ]);
  const [sortKey, setSortKey] = useState('time');
  const textareaRef = useRef(null);

  const sorted = useMemo(() => {
    const key = sortKey === 'time' ? 'createdAt' : 'likes';
    return orderBy(comments, [key], ['desc']);
  }, [comments, sortKey]);

  const like = (id) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)));
  };

  const handlePost = () => {
    const text = textareaRef.current.value.trim();
    if (!text) return;

    const newComment = {
      id: uuidv4(),
      author: 'Me',
      text,
      createdAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      likes: 0,
      avatarSrc: `https://api.dicebear.com/7.x/miniavs/svg?seed=${Date.now()}`
    };

    setComments([newComment, ...comments]);
    textareaRef.current.value = '';
    textareaRef.current.focus();
  };

  return (
    <div className="app" style={{ maxWidth: 720, margin: '24px auto', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '0 20px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>评论列表</h2>
      
      <div className="comment-input" style={{ marginBottom: 32 }}>
        <textarea
          ref={textareaRef}
          placeholder="发条友善的评论..."
          style={{ 
            width: '100%', 
            height: 80, 
            padding: '12px', 
            borderRadius: 4, 
            border: '1px solid #ddd', 
            marginBottom: 12, 
            resize: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handlePost}
            style={{ 
              padding: '8px 24px', 
              background: '#1890ff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 4, 
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            发布
          </button>
        </div>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: 24, borderBottom: '1px solid #f0f0f0', marginBottom: 24 }}>
        <div 
          className={cx('tab', { active: sortKey === 'time' })}
          onClick={() => setSortKey('time')}
          style={{ 
            cursor: 'pointer', 
            paddingBottom: 12, 
            color: sortKey === 'time' ? '#1890ff' : '#333',
            fontWeight: sortKey === 'time' ? 600 : 400,
            borderBottom: sortKey === 'time' ? '2px solid #1890ff' : 'none',
            marginBottom: -1
          }}
        >
          最新
        </div>
        <div 
          className={cx('tab', { active: sortKey === 'likes' })}
          onClick={() => setSortKey('likes')}
          style={{ 
            cursor: 'pointer', 
            paddingBottom: 12, 
            color: sortKey === 'likes' ? '#1890ff' : '#333',
            fontWeight: sortKey === 'likes' ? 600 : 400,
            borderBottom: sortKey === 'likes' ? '2px solid #1890ff' : 'none',
            marginBottom: -1
          }}
        >
          最热
        </div>
      </div>

      <ul className="comment-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sorted.map((c) => (
          <li key={c.id} className={cx('comment-item')} style={{ display: 'flex', gap: 16, padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
            <img 
              src={c.avatarSrc} 
              alt={c.author} 
              width={48} 
              height={48} 
              style={{ borderRadius: '50%', flexShrink: 0 }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#333', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>{c.author}</div>
              <div style={{ color: '#333', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{c.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: '#999', fontSize: 12 }}>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
                <span 
                  onClick={() => like(c.id)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: c.likes > 0 ? '#1890ff' : 'inherit' }}
                >
                  👍 {c.likes || '点赞'}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
