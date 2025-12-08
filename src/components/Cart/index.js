import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { increCount, decreCount, clearCart } from '../../store/modules/takeaway'
import './index.css'

const Cart = () => {
  const dispatch = useDispatch()
  const { cartList } = useSelector(state => state.foods)
  const [visible, setVisible] = useState(false)

  const totalCount = cartList.reduce((a, c) => a + c.count, 0)
  const totalPrice = cartList.reduce((a, c) => a + c.count * c.price, 0).toFixed(2)

  const onShow = () => {
    if (cartList.length > 0) {
      setVisible(!visible)
    }
  }

  const handleClear = () => {
    dispatch(clearCart())
    setVisible(false)
  }
  
  // Close cart if empty
  useEffect(() => {
    if (cartList.length === 0) {
        setVisible(false)
    }
  }, [cartList])

  return (
    <div className="cartContainer">
      {/* Mask */}
      {visible && <div className="cartOverlay" onClick={() => setVisible(false)}></div>}

      {/* Cart Popup */}
      <div className={classNames('cartPanel', { visible })}>
        <div className="header">
          <span className="title">购物车</span>
          <div className="clearCart" onClick={handleClear}>
            <span className="clearIcon">🗑️</span>
            清空购物车
          </div>
        </div>
        <div className="scrollArea">
          {cartList.map(item => (
            <div className="cartItem" key={item.id}>
              <div className="cartItemInfo">
                  <img className="cartItemImg" src={item.picture} alt={item.name} />
                  <div className="cartItemDetail">
                    <div className="cartItemTitle">{item.name}</div>
                    <div className="cartItemPrice">
                        <span className="currency">¥</span>{item.price}
                    </div>
                  </div>
              </div>
              <div className="cartItemOps">
                <button className="minus" onClick={() => dispatch(decreCount({ id: item.id }))}>-</button>
                <span className="count">{item.count}</span>
                <button className="plus" onClick={() => dispatch(increCount({ id: item.id }))}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="cartBar" onClick={onShow}>
        <div className="cartIcon">
          <img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/xitu_juejin_web/img/cart.png" alt="" />
          {totalCount > 0 && <div className="badge">{totalCount}</div>}
        </div>
        <div className="cartPrice">
          <div className="price">¥{totalPrice}</div>
          <div className="deliveryMsg">预估另需配送费 ¥5</div>
        </div>
        <div className={classNames('payBtn', { active: totalCount > 0 })}>
          {totalCount > 0 ? '去结算' : '¥0起送'}
        </div>
      </div>
    </div>
  )
}

export default Cart
