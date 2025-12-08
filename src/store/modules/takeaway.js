import { createSlice } from '@reduxjs/toolkit'
// import axios from 'axios'

const foodsList = [
  {
    "tag": "318569657",
    "name": "一人套餐",
    "foods": [
      {
        "id": 8078956697,
        "name": "烤羊肉串(10串)",
        "like_ratio_desc": "好评度100%",
        "month_saled": 40,
        "unit": "10串",
        "food_tag_list": ["点评网友推荐"],
        "price": 90,
        "picture": "https://p1.meituan.net/codeman/f502807cf5149eff756f6271ed3739be2619721.png",
        "description": "",
        "tag": "318569657"
      },
      {
        "id": 7384994860,
        "name": "腊味煲仔饭",
        "like_ratio_desc": "好评度81%",
        "month_saled": 100,
        "unit": "1人份",
        "food_tag_list": [],
        "price": 39,
        "picture": "https://p1.meituan.net/codeman/18ce727de55a453844f1411c5cd7881c321387.png",
        "description": "",
        "tag": "318569657"
      },
      {
        "id": 2305772036,
        "name": "鸡腿胡萝卜焖饭",
        "like_ratio_desc": "好评度91%",
        "month_saled": 300,
        "unit": "1人份",
        "food_tag_list": [],
        "price": 34.32,
        "picture": "https://p1.meituan.net/codeman/85526a4728d4951c055813e32e143891254421.png",
        "description": "主料：大米、鸡腿、胡萝卜",
        "tag": "318569657"
      },
      {
        "id": 2233861812,
        "name": "小份酸汤莜面鱼鱼+肉夹馍套餐",
        "like_ratio_desc": "好评度100%",
        "month_saled": 600,
        "unit": "1人份",
        "food_tag_list": ["口味好", "分量足"],
        "price": 24,
        "picture": "https://p1.meituan.net/codeman/7476332168582736b47209798539659e139369.png",
        "description": "酸汤莜面鱼鱼，主料：莜面、番茄、金针菇",
        "tag": "318569657"
      }
    ]
  },
  {
    "tag": "318569658",
    "name": "特色烧烤",
    "foods": [
        {
            "id": 8078956698,
            "name": "烤羊肉串(5串)",
            "like_ratio_desc": "好评度99%",
            "month_saled": 50,
            "unit": "5串",
            "food_tag_list": [],
            "price": 45,
            "picture": "https://p1.meituan.net/codeman/f502807cf5149eff756f6271ed3739be2619721.png",
            "description": "",
            "tag": "318569658"
        }
    ]
  },
  {
    "tag": "318569659",
    "name": "杂粮主食",
    "foods": [
         {
            "id": 8078956699,
            "name": "五谷杂粮饭",
            "like_ratio_desc": "好评度100%",
            "month_saled": 20,
            "unit": "1人份",
            "food_tag_list": [],
            "price": 15,
            "picture": "https://p1.meituan.net/codeman/18ce727de55a453844f1411c5cd7881c321387.png",
            "description": "",
            "tag": "318569659"
        }
    ]
  }
]

const foodsStore = createSlice({
  name: 'foods',
  initialState: {
    foodsList: [],
    activeIndex: 0,
    cartList: []
  },
  reducers: {
    setFoodsList (state, action) {
      state.foodsList = action.payload
    },
    changeActiveIndex (state, action) {
      state.activeIndex = action.payload
    },
    addCart (state, action) {
      const item = state.cartList.find(item => item.id === action.payload.id)
      if (item) {
        item.count++
      } else {
        state.cartList.push({ ...action.payload, count: 1 })
      }
    },
    increCount (state, action) {
      const item = state.cartList.find(item => item.id === action.payload.id)
      if (item) {
        item.count++
      }
    },
    decreCount (state, action) {
      const item = state.cartList.find(item => item.id === action.payload.id)
      if (item) {
        if (item.count === 1) {
          state.cartList = state.cartList.filter(i => i.id !== action.payload.id)
        } else {
          item.count--
        }
      }
    },
    clearCart (state) {
      state.cartList = []
    }
  }
})

const { setFoodsList, changeActiveIndex, addCart, increCount, decreCount, clearCart } = foodsStore.actions

const fetchFoodsList = () => {
  return async (dispatch) => {
    // Simulate async request
    // const res = await axios.get('http://localhost:3004/takeaway')
    // dispatch(setFoodsList(res.data))
    
    // Using local mock data
    setTimeout(() => {
        dispatch(setFoodsList(foodsList))
    }, 500)
  }
}

export { fetchFoodsList, changeActiveIndex, addCart, increCount, decreCount, clearCart }

export default foodsStore.reducer
