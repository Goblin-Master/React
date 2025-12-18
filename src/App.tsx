import React, { useRef, useImperativeHandle, forwardRef } from 'react';

/**
 * 定义 Ref 暴露给父组件的方法接口
 * 使用 useImperativeHandle 的核心目的是：控制反转，只暴露我们想暴露的方法，
 * 而不是把整个 DOM 节点都交给父组件。
 */
export interface CustomInputHandle {
  focus: () => void;      // 聚焦方法
  clear: () => void;      // 清空方法
  setValue: (v: string) => void; // 设置值的方法
}

interface CustomInputProps {
  label: string;
  placeholder?: string;
}

/**
 * 子组件：CustomInput
 * 
 * 1. 使用 forwardRef 包裹组件，以便接收父组件传来的 ref
 * 2. 泛型参数说明：<暴露给父组件的句柄类型, 组件Props类型>
 */
const CustomInput = forwardRef<CustomInputHandle, CustomInputProps>((props, ref) => {
  // 内部创建一个真实的 ref 指向 input DOM 元素
  // 这个 inputRef 只有当前组件自己能访问，父组件访问不到
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * useImperativeHandle
   * 参数1: forwardRef 传进来的 ref (父组件的 ref)
   * 参数2: 工厂函数，返回一个对象。这个对象会被赋值给父组件 ref.current
   * 参数3: 依赖数组 (可选)，类似于 useEffect
   */
  useImperativeHandle(ref, () => ({
    // 暴露 focus 方法：调用内部 input 的 focus
    focus: () => {
      console.log('父组件调用了子组件的 focus 方法');
      inputRef.current?.focus();
    },
    // 暴露 clear 方法：清空内部 input 的值
    clear: () => {
      console.log('父组件调用了子组件的 clear 方法');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    // 暴露 setValue 方法：允许父组件设置值
    setValue: (value: string) => {
      // 注意：这里直接修改 DOM，不会触发任何 React 组件的重新渲染
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    }
  }));

  return (
    <div style={{ border: '1px dashed #ccc', padding: '20px', margin: '10px 0' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>子组件 (CustomInput)</p>
      <label style={{ marginRight: '10px' }}>{props.label}:</label>
      {/* 这里绑定的是内部的 inputRef，而不是父组件传来的 ref */}
      <input 
        ref={inputRef} 
        type="text" 
        placeholder={props.placeholder}
        style={{ padding: '5px' }}
      />
    </div>
  );
});

const App: React.FC = () => {
  // 这里的 ref 类型是 CustomInputHandle，而不是 HTMLInputElement
  // 因为子组件通过 useImperativeHandle 修改了 ref 的指向
  const childRef = useRef<CustomInputHandle>(null);

  // 观察点：每次 App 渲染时都会打印
  // 你会发现，点击下方的按钮修改值，App 组件并不会重新渲染
  console.log('App 组件渲染了 (注意：Ref 的操作不会触发重新渲染)');

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>forwardRef & useImperativeHandle 教学案例</h1>
      <p>点击下方按钮，父组件将通过 ref 调用子组件内部暴露的方法。</p>
      
      {/* 将 ref 传递给子组件 */}
      <CustomInput 
        ref={childRef} 
        label="用户名" 
        placeholder="请输入..." 
      />

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => childRef.current?.focus()}>
          聚焦输入框 (Focus)
        </button>
        <button onClick={() => childRef.current?.setValue('Hello World')}>
          设置默认值 (Set Value)
        </button>
        <button onClick={() => childRef.current?.clear()}>
          清空内容 (Clear)
        </button>
      </div>
    </div>
  );
};

export default App;