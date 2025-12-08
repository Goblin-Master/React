import React from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { changeActiveIndex } from '../../store/modules/takeaway'
import FoodItem from './FoodItem'
import './index.css'

const Menu = ({ foodsList, activeIndex }) => {
  const dispatch = useDispatch()

  const handleCategoryClick = (index) => {
    dispatch(changeActiveIndex(index))
  }

  const category = foodsList[activeIndex]

  return (
    <div className="menu-container">
      <div className="menu-sidebar">
        {foodsList.map((item, index) => (
          <div
            key={item.tag}
            className={classNames('menu-sidebar-item', { active: activeIndex === index })}
            onClick={() => handleCategoryClick(index)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="menu-content">
        {category && (
            <div key={category.tag} className="food-category-section">
                <h3 className="category-title">{category.name}</h3>
                {category.foods.map(food => (
                    <FoodItem key={food.id} {...food} />
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default Menu
