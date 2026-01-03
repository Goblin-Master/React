import React, { Suspense, use, useState, useContext } from 'react';

// ==========================================
// 1. 模拟数据请求与缓存机制
// ==========================================
const promiseCache = new Map<string, Promise<string>>();

function fetchData(id: string): Promise<string> {
  if (!promiseCache.has(id)) {
    const promise = new Promise<string>((resolve) => {
      console.log(`[API] 开始请求用户 ${id} 数据...`);
      setTimeout(() => {
        console.log(`[API] 用户 ${id} 数据返回`);
        resolve(`用户 ${id} 的详细信息 - ${new Date().toLocaleTimeString()}`);
      }, 2000); // 模拟 2秒 延迟
    });
    promiseCache.set(id, promise);
  }
  return promiseCache.get(id)!;
}

// ==========================================
// 2. 子组件：使用 use() 读取 Promise
// ==========================================
const UserProfile = ({ id }: { id: string }) => {
  const data = use(fetchData(id));
  return (
    <div style={{ padding: '20px', border: '2px solid #4CAF50', borderRadius: '8px', background: '#e8f5e9' }}>
      <h3>👤 用户资料 (use + Suspense)</h3>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Data:</strong> {data}</p>
    </div>
  );
};

// ==========================================
// 3. 对比：use() vs useContext() 读取 Context
// ==========================================
const ThemeContext = React.createContext('light');

const ThemeDemo = () => {
  const [mode, setMode] = useState<'traditional' | 'modern'>('traditional');
  const [show, setShow] = useState(false);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
      <h3>Context 读取方式对比</h3>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '15px' }}>
          <input 
            type="radio" 
            checked={mode === 'traditional'} 
            onChange={() => setMode('traditional')} 
          /> 
          传统 useContext (必须顶层调用)
        </label>
        <label>
          <input 
            type="radio" 
            checked={mode === 'modern'} 
            onChange={() => setMode('modern')} 
          /> 
          React 19 use() (可在条件/循环中使用)
        </label>
      </div>

      <button onClick={() => setShow(!show)} style={{ marginBottom: '10px' }}>
        {show ? '隐藏组件' : '显示组件'}
      </button>

      {show && (
        mode === 'traditional' ? <TraditionalContextComponent /> : <ModernContextComponent />
      )}
    </div>
  );
};

// ❌ 传统方式：useContext 必须在组件顶层
// 如果尝试把 useContext 放在 if (earlyReturn) 之后，React 会报错 "Rendered more hooks than during the previous render"
const TraditionalContextComponent = () => {
  // 必须无条件在最顶层调用
  const theme = useContext(ThemeContext);
  
  // 假设有一些耗时的逻辑或者条件判断
  const [isReady, setIsReady] = useState(false);
  
  if (!isReady) {
    // 即使在这里 return，上面的 useContext 也已经被执行了
    // 在旧模式下，无法根据条件决定是否订阅 Context
    return <button onClick={() => setIsReady(true)}>点击初始化 (Traditional)</button>;
  }

  return <div style={{ background: '#eee', padding: '10px' }}>当前主题: {theme} (Traditional)</div>;
};

// ✅ 新方式：use() 可以在条件语句、循环中调用
const ModernContextComponent = () => {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return <button onClick={() => setIsReady(true)}>点击初始化 (Modern use API)</button>;
  }

  // 核心区别：只有当 isReady 为 true，代码执行到这里时，才会读取 Context
  // 这允许按需订阅 Context，或者在某些分支下读取不同的 Context
  if (true) { // 模拟任意条件块
    const theme = use(ThemeContext);
    return <div style={{ background: '#d1e7dd', padding: '10px' }}>当前主题: {theme} (Modern use API)</div>;
  }
  
  return null;
};

// ==========================================
// 4. 主组件
// ==========================================
const App: React.FC = () => {
  const [userId, setUserId] = useState('1');

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>React 19: Suspense & use() 教学</h1>
      
      {/* 演示 use(Promise) */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setUserId('1')} style={{ marginRight: '5px' }}>用户 1</button>
        <button onClick={() => setUserId('2')} style={{ marginRight: '5px' }}>用户 2</button>
        <button onClick={() => setUserId('3')}>用户 3</button>
      </div>

      <Suspense fallback={<div style={{ padding: '20px', background: '#f5f5f5' }}>⏳ Loading...</div>}>
        <UserProfile id={userId} />
      </Suspense>

      {/* 演示 use(Context) vs useContext */}
      <ThemeContext.Provider value="dark">
        <ThemeDemo />
      </ThemeContext.Provider>
    </div>
  );
};

export default App;
