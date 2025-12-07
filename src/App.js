import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, addToNum } from "./store/modules/counterStore";
import { fetchChannels } from "./store/modules/channelStore";
import { useEffect } from "react";

function App() {
  const { count } = useSelector((state) => state.counter);
  const { channels } = useSelector((state) => state.channel);
  const dispatch = useDispatch();
  // 异步请求
  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);
  return (
    <div className="App">
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(addToNum(10))}>Add 10</button>
      <br></br>
      <h2>Channels:</h2>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>
    </div>
  );
}
export default App;
