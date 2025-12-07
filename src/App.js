import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, addToNum } from "./store/modules/counterStore";

function App() {
  const { count } = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return (
    <div className="App">
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <br></br>
      <button onClick={() => dispatch(decrement())}>-</button>
      <br></br>
      <button onClick={() => dispatch(addToNum(10))}>Add 10</button>
    </div>
  );
}
export default App;
