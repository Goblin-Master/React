import React from 'react'
import './index.css'

const NavBar = () => {
  return (
    <nav className="nav">
      <div className="menu">
        <div className="menu-item active">
          点菜
          <span className="underline"></span>
        </div>
        <div className="menu-item">
          评价<span className="count">1796</span>
        </div>
        <div className="menu-item">商家</div>
      </div>

      <div className="search-bar">
        <i className="search-icon">🔍</i>
        <span className="placeholder">请输入菜品名称</span>
      </div>
    </nav>
  )
}

export default NavBar
