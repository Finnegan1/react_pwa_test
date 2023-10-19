import './App.css';
import { networkStatus, useNetworkStore } from './stores/networkStore';
import { todo, useTodoStore } from './stores/todoStore';
import { useEffect } from 'react';

function App() {
  let todoStore = useTodoStore();
  useNetworkStatus()
  useLoadTodos(todoStore);

  return (
    <div className="App">
      <p>React TODO App</p>
      <button onClick={() => todoStore.loadTodos()}>Load Todos</button>
      <button onClick={() => todoStore.addTodo(newTodo())}>Add Todo</button>
      <button onClick={() => todoStore.syncTodos()}>Sync Todos</button>

      <div style={{display:"flex", flexDirection:"column"}}>

      {
        todoStore.todos.map((todo) => (
          <div key={todo.id}>
            <br/>
            <p>{`todo: ${todo.todo}`}</p>
            <p>{`status: ${todo.completed}`}</p>
            <button onClick={() => todoStore.removeTodo(todo)} >Remove</button>
            <br/>
          </div>
        ))
      }

      </div>
    </div>
  );
}

function useLoadTodos(todoStore: any) {
  useEffect(() => {
    todoStore.loadTodos();
  }, []);
}

function useNetworkStatus() {
  const handleOnline = () => useNetworkStore.setState({status: networkStatus.online});
  const handleOffline = () => useNetworkStore.setState({status: networkStatus.offline});

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Cleanup
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  }
}



function newTodo(): todo {
  let newTodo:todo = {
    id: Math.floor(Math.random() * 1000),
    userId: 1,
    todo: "test",
    completed: false
  }
  return newTodo;
}

export default App;
