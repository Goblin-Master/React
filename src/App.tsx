import React, { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';

// ==========================================
// 模拟服务器端 Action (Server Action)
// ==========================================
// 在 Next.js 等框架中，这通常是一个运行在服务端的异步函数
// 这里我们模拟一个异步更新用户名的操作
// 成功时返回: { success: true, message: "..." }
// 失败时返回: { success: false, error: "..." }
async function updateNameAction(_prevState: any, formData: FormData) {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const name = formData.get('username') as string;
  
  if (!name || name.trim() === '') {
    return { success: false, error: '用户名不能为空！' };
  }

  if (name.toLowerCase() === 'admin') {
    return { success: false, error: '无法使用 "admin" 作为用户名' };
  }

  return { success: true, message: `更新成功！你好，${name}` };
}

// ==========================================
// 1. 传统写法 (React 18 及以前)
// ==========================================
// 需要手动管理 pending, error, data 等多个状态
const TraditionalForm = () => {
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 1. 必须阻止默认提交
    
    // 2. 手动重置状态
    setIsPending(true);
    setError(null);
    setMessage(null);

    try {
      // 3. 构造 FormData 或 JSON (这里为了对比逻辑，我们手动调模拟函数)
      // 注意：传统模式下通常是调用 fetch('/api/...')
      const formData = new FormData();
      formData.append('username', name);
      
      // 模拟调用 API (这里复用上面的逻辑，但通常这里是 fetch)
      // 为了适配上面的 updateNameAction 签名 (state, formData)，我们这里稍微 mock 一下
      const result = await updateNameAction(null, formData);
      
      if (result.success) {
        setMessage(result.message || null);
        setName(''); // 清空输入
      } else {
        setError(result.error || null);
      }
    } catch (err) {
      setError('网络错误');
    } finally {
      // 4. 手动关闭 loading
      setIsPending(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>👴 传统写法 (Manual States)</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label>用户名: </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            style={inputStyle}
          />
        </div>
        
        <button type="submit" disabled={isPending} style={buttonStyle}>
          {isPending ? '提交中...' : '更新'}
        </button>

        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        {message && <p style={{ color: 'green' }}>✅ {message}</p>}
      </form>
    </div>
  );
};

// ==========================================
// 2. React 19 写法 (useActionState + Actions)
// ==========================================
// 优势：
// 1. 自动处理 pending 状态 (通过 useFormStatus)
// 2. 自动管理表单返回值/错误 (通过 useActionState)
// 3. 渐进增强 (Progressive Enhancement) 支持
// 4. 代码更声明式，无需手动 e.preventDefault()

// 子组件：提交按钮
// 使用 useFormStatus 可以读取所在 form 的 pending 状态
// 这样我们就不需要把 isPending 从父组件透传下来了
const SubmitButton = () => {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending} style={buttonStyle}>
      {pending ? '正在更新 (Action)...' : '更新 (Action)'}
    </button>
  );
};

const React19Form = () => {
  // useActionState(actionFn, initialState)
  // state: 上一次 action 返回的结果 (成功或失败的消息)
  // formAction: 用于绑定到 <form action={...}> 或 <button formAction={...}> 的函数
  // isPending: (可选) 也可以直接在这里拿到 pending 状态，但推荐用 useFormStatus 在子组件处理 UI
  const [state, formAction] = useActionState(updateNameAction, null);

  return (
    <div style={cardStyle}>
      <h3>🚀 React 19 写法 (Actions)</h3>
      {/* 直接将 action 传递给 form，无需 onSubmit */}
      <form action={formAction} style={formStyle}>
        <div>
          <label>用户名: </label>
          {/* 这是一个非受控组件 (Uncontrolled)，我们可以利用 name 属性自动提取数据 */}
          <input 
            type="text" 
            name="username" 
            style={inputStyle}
          />
        </div>
        
        {/* 使用封装了 useFormStatus 的按钮 */}
        <SubmitButton />

        {state?.error && <p style={{ color: 'red' }}>❌ {state.error}</p>}
        {state?.success && <p style={{ color: 'green' }}>✅ {state.message}</p>}
      </form>
    </div>
  );
};

// ==========================================
// 主组件
// ==========================================
const App = () => {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React 19 Form Actions 教学</h1>
      <p style={{ lineHeight: '1.6', color: '#555' }}>
        对比 React 以前的手动表单管理与 React 19 引入的 Actions 模式。<br/>
        React 19 通过 <code>useActionState</code> 和 <code>useFormStatus</code> 极大简化了异步表单的状态管理。
      </p>

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
        <TraditionalForm />
        <React19Form />
      </div>
    </div>
  );
};

// 样式定义
const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '24px',
  background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  width: '100%',
  boxSizing: 'border-box'
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: '6px',
  border: 'none',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500
};

export default App;
