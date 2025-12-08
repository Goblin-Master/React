import React from 'react'
import { useDispatch } from 'react-redux'
import { addCart } from '../../store/modules/takeaway'
import './FoodItem.css'

const FoodItem = ({
  id,
  picture,
  name,
  unit,
  description,
  food_tag_list,
  month_saled,
  like_ratio_desc,
  price,
  tag
}) => {
  const dispatch = useDispatch()

  const handleAdd = () => {
    dispatch(addCart({ id, picture, name, unit, description, food_tag_list, month_saled, like_ratio_desc, price, tag }))
  }

  return (
    <div className="food-item">
      <div className="food-pic">
        <img src={picture} alt={name} />
      </div>
      <div className="food-info">
        <div className="food-title">{name}</div>
        <div className="food-desc">
            {unit} {description && <span>{description}</span>}
        </div>
        <div className="food-tags">
            {food_tag_list.map(tag => (
                <span key={tag} className="food-tag">{tag}</span>
            ))}
        </div>
        <div className="food-sales">
          <span>月售{month_saled}</span>
          <span className="food-like">{like_ratio_desc}</span>
        </div>
        <div className="food-price-action">
          <div className="food-price">
            <span className="currency">¥</span>
            <span className="price-val">{price}</span>
          </div>
          <button className="add-btn" onClick={handleAdd}>
            <span className="plus-icon">+</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodItem
