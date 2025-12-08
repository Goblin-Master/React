import React, { useEffect } from 'react'
import NavBar from './components/NavBar'
import Menu from './components/Menu'
import Cart from './components/Cart'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFoodsList } from './store/modules/takeaway'
import './App.css'

const App = () => {
  const dispatch = useDispatch()
  const { foodsList, activeIndex } = useSelector(state => state.foods)

  useEffect(() => {
    dispatch(fetchFoodsList())
  }, [dispatch])

  return (
    <div className="app">
      <NavBar />
      <div className="content-wrap">
        <Menu foodsList={foodsList} activeIndex={activeIndex} />
      </div>
      <Cart />
    </div>
  )
}

export default App
