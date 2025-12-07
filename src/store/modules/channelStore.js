import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const channelStore = createSlice({
    name: "channel",
    initialState: {
        channels: [],
    },
    reducers: {
        setChannels(state, action) {
            state.channels = action.payload;
        },
    },
})
const { setChannels } = channelStore.actions;
// 异步请求
const fetchChannels = () => {
    return async (dispatch) => {
        try {
            const res = await axios.get("http://localhost:8080/channels");
            const data = res.data;
            dispatch(setChannels(data));
        } catch (error) {
            console.log(error);
        }
    }
}

const channelReducer = channelStore.reducer;
export { fetchChannels };
export default channelReducer;
