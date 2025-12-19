import React, { useEffect } from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

/**
 * 教学目标：
 * 1) 创建一个类型安全的 Zustand 全局状态
 * 2) 使用选择器 (selector) 避免不必要的组件重渲染
 * 3) 定义动作 (actions) 以不可变方式更新状态
 * 4) 订阅 store 变更，做调试/副作用
 */

type AppStore = {
  username: string;
  count: number;
  setUsername: (name: string) => void;
  clearUsername: () => void;
  increment: () => void;
  reset: () => void;
};

/**
 * 创建全局 store：返回一个 React Hook (useAppStore)
 * - set: 用于更新状态
 * - get: 用于读取当前状态
 */
export const useAppStore = create<AppStore>((set) => ({
  username: '',
  count: 0,
  setUsername: (name: string) => set({ username: name }),
  clearUsername: () => set({ username: '' }),
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ username: '', count: 0 }),
}));

/**
 * 组件A：用户名输入面板
 * - 通过选择器只订阅 username 与相关 actions，从而减少重渲染
 */
const UsernameInput: React.FC = () => {
  const username = useAppStore((s) => s.username);
  const setUsername = useAppStore((s) => s.setUsername);
  const clearUsername = useAppStore((s) => s.clearUsername);
  console.log('Render: UsernameInput');

  return (
    <div style={{ border: '1px dashed #ccc', padding: '16px', marginBottom: '12px' }}>
      <h3>用户名输入</h3>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="请输入用户名..."
        style={{ padding: '6px', marginRight: '8px' }}
      />
      <button onClick={clearUsername}>清空</button>
      <p style={{ marginTop: 8 }}>当前用户名：{username || '(空)'}</p>
    </div>
  );
};

/**
 * 组件B：计数器面板
 * - 使用 shallow 对象比较避免因为引用变化导致的重渲染
 */
const CounterPanel: React.FC = () => {
  const { count, increment, reset } = useAppStore(
    useShallow((s) => ({ count: s.count, increment: s.increment, reset: s.reset })),
  );
  console.log('Render: CounterPanel');

  return (
    <div style={{ border: '1px dashed #ccc', padding: '16px', marginBottom: '12px' }}>
      <h3>计数器</h3>
      <p>计数：{count}</p>
      <button onClick={increment} style={{ marginRight: 8 }}>+1</button>
      <button onClick={reset}>重置</button>
    </div>
  );
};

/**
 * 组件C：调试面板
 * - 展示整个 store 的快照，并演示 subscribe 订阅变化
 */
const DebugPanel: React.FC = () => {
  const snapshot = useAppStore();

  useEffect(() => {
    const unsub = useAppStore.subscribe((state, prevState) => {
      console.log('Zustand 变化:', { state, prevState });
    });
    return unsub;
  }, []);
  console.log('Render: DebugPanel');

  return (
    <div style={{ border: '1px dashed #ccc', padding: '16px' }}>
      <h3>调试快照</h3>
      <pre style={{ background: '#f7f7f7', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(snapshot, null, 2)}
      </pre>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Zustand 教学案例</h1>
      <p>演示创建全局状态、使用选择器优化渲染、触发动作更新、订阅状态变化。</p>

      <UsernameInput />
      <CounterPanel />
      <DebugPanel />
    </div>
  );
};

export default App;