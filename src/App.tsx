import { useState } from 'react'
import './App.css'
import React from 'react';

// ==========================================
// 1. 泛型 Hook 教学：星际仓库管理器
// ==========================================

// 定义一些具体的类型（货物）
interface Planet {
  id: number;
  name: string;
  type: 'Gas' | 'Rock';
}

interface Spaceship {
  id: number;
  model: string;
  speed: number;
}

/**
 * 🎣 泛型 Hook: useGalaxyStorage<T>
 *
 * 想象这是一个 "万能次元口袋"。
 * 不管你给它装 星球(Planet) 还是 飞船(Spaceship)，
 * 它都能帮你管理：添加、删除、获取列表。
 *
 * T (Type) 就像是一个占位符，告诉 Hook："嘿，我这次要存的是这种类型的东西！"
 * <T extends { id: number }> 约束了存进来的东西必须得有一个 id，方便我们管理。
 */
function useGalaxyStorage<T extends { id: number }>(initialData: T[]) {
  const [items, setItems] = useState<T[]>(initialData);

  // 添加物品
  const add = (item: T) => {
    setItems((prev) => [...prev, item]);
  };

  // 删除物品 (利用 id)
  const remove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, add, remove };
}

// ==========================================
// 2. 泛型组件 教学：全息展示台
// ==========================================

/**
 * 📺 泛型组件: HologramList<T>
 *
 * 这是一个 "万能展示台"。
 * 它不关心展示的是什么，只负责把列表渲染出来。
 * 但是具体怎么展示每一项（比如星球要展示名字，飞船要展示速度），
 * 需要由使用者通过 renderItem 告诉它。
 */
interface HologramListProps<T> {
  title: string;
  items: T[];
  // 这里的 renderItem 是关键，它把决定权交回给了父组件
  renderItem: (item: T) => React.ReactNode;
  onRemove: (id: number) => void;
}

// 泛型组件的定义方式
function HologramList<T extends { id: number }>({
  title,
  items,
  renderItem,
  onRemove
}: HologramListProps<T>) {
  return (
    <div className="hologram-card">
      <h2>🔮 {title}</h2>
      {items.length === 0 ? (
        <p className="empty-state">仓库空空如也...</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id} className="item-row">
              {/* 渲染具体内容 */}
              <div className="item-content">{renderItem(item)}</div>
              <button
                className="delete-btn"
                onClick={() => onRemove(item.id)}
              >
                销毁
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ==========================================
// 3. 主程序：星际指挥中心
// ==========================================

const App: React.FC = () => {
  // 场景 1: 管理星球 (T 自动推断为 Planet)
  const planets = useGalaxyStorage<Planet>([
    { id: 1, name: 'Earth', type: 'Rock' },
    { id: 2, name: 'Jupiter', type: 'Gas' },
  ]);

  // 场景 2: 管理飞船 (T 自动推断为 Spaceship)
  const spaceships = useGalaxyStorage<Spaceship>([
    { id: 101, model: 'X-Wing', speed: 1050 },
  ]);

  return (
    <div className="command-center">
      <h1>🌌 星际指挥中心 (Generic Demo)</h1>
      <p className="subtitle">
        学习泛型 (Generics)：一套代码，管理万物。
      </p>

      <div className="panels">
        {/* 左边：星球管理 */}
        <div className="panel">
          <HologramList
            title="已发现星球"
            items={planets.items}
            onRemove={planets.remove}
            renderItem={(planet) => (
              <span>
                🌍 <b>{planet.name}</b> <span className={`tag ${planet.type.toLowerCase()}`}>{planet.type}</span>
              </span>
            )}
          />
          <button
            className="add-btn"
            onClick={() =>
              planets.add({
                id: Date.now(),
                name: `Planet-${Math.floor(Math.random() * 100)}`,
                type: Math.random() > 0.5 ? 'Gas' : 'Rock',
              })
            }
          >
            + 探索新星球
          </button>
        </div>

        {/* 右边：飞船管理 */}
        <div className="panel">
          <HologramList
            title="舰队机库"
            items={spaceships.items}
            onRemove={spaceships.remove}
            renderItem={(ship) => (
              <span>
                🚀 <b>{ship.model}</b> <small style={{color: '#aaa'}}>({ship.speed} km/h)</small>
              </span>
            )}
          />
           <button
            className="add-btn"
            onClick={() =>
              spaceships.add({
                id: Date.now(),
                model: `Viper-Mk${Math.floor(Math.random() * 10)}`,
                speed: 1000 + Math.floor(Math.random() * 500),
              })
            }
          >
            + 建造新飞船
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
