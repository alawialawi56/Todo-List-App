

export default function reducer(currentState, action){
    switch(action.type){
        case "added":{
                const newTodos = {
                    text:action.payload.newTask,
                    completed:false,
                    date: new Date().toDateString()
                }
                const updatedData = [...currentState,newTodos]
                localStorage.setItem("todo", JSON.stringify(updatedData))
                return updatedData

        }case "toggle":{
            const newTodos = [...currentState];
            newTodos[action.payload.index].completed = !newTodos[action.payload.index].completed;
            localStorage.setItem("todo", JSON.stringify(newTodos))
            return newTodos
        }case "delete":{    
            const newTodos = currentState.filter((_, i)=> i !==action.payload.index)
            localStorage.setItem("todo", JSON.stringify(newTodos))
            return newTodos
        }
        default:{
            throw Error("Unknown Action " + action.type)
        }
    }
}
