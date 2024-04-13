export const initialState = false

export const reducer = (state , action) => {
    if(action.type === "Student" || action.type === "Teacher")
        return action.payload;
    
    return state;
}
// 