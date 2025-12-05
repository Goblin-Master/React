import { useMemo, useState } from 'react';
import orderBy from 'lodash/orderBy';
import cx from 'classnames';

function App() {
  const [comments, setComments] = useState([
    { id: 1, author: 'Alice', text: '第一条评论', createdAt: Date.now() - 1000 * 60 * 60, likes: 2, avatarSrc: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1' },
    { id: 2, author: 'Bob', text: 'React 很好用', createdAt: Date.now() - 1000 * 60 * 10, likes: 5, avatarSrc: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2' },
    { id: 3, author: 'Carol', text: '你好', createdAt: Date.now() - 1000 * 60 * 120, likes: 0, avatarSrc: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3' }
  ]);
  const [sortKey, setSortKey] = useState('time');

  const sorted = useMemo(() => {
    const key = sortKey === 'time' ? 'createdAt' : 'likes';
    return orderBy(comments, [key], ['desc']);
  }, [comments, sortKey]);

  const like = (id) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)));
  };

  return (
    <div className="app" style={{ maxWidth: 720, margin: '24px auto', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '0 20px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>评论列表</h2>
      
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
