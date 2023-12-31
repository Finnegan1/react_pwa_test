

import { todo } from "./stores/todoStore";
import { networkStatus, useNetworkStore } from "./stores/networkStore";
import { ChangeType, useChangeStore } from "./stores/changeStore";
import { useTodoStore } from "./stores/todoStore";

export class DataManager {

    base_url: string;


    constructor() {
      // base_url = 'http://localhost:3001';
      this.base_url = 'https://taskbackend-rfwi.onrender.com'
    }



    loadTasks() {
      if(useNetworkStore.getState().status === networkStatus.online){
        //load from server
        fetch( this.base_url + '/todos')
        .then( response => response.json() )
        .then( data => {
          console.log(data);
          let newTodoList = data.map((todo: any) => {
            return {
              id: todo.id,
              userId: todo.userId,
              completed: todo.completed,
              todo: todo.todo
            }
          })
          console.log("newTodoList");
          console.log(newTodoList);
          useTodoStore.setState({todos: newTodoList});
        });


      } else {
        console.log("offline, loaded nothing");
      }
    }

    addTask(todo: todo) {
      if(useNetworkStore.getState().status === networkStatus.online){
        //add to server
        console.log("add to server");
        fetch(this.base_url + '/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(todo),
        })
        .then(response => {
          this.loadTasks()
        })
      } else {
        console.log("add to querry Queue");
        useChangeStore.getState().addChange({type: ChangeType.AddTodo, data: todo});
      }
    }

    removeTask(todo: todo) {
      if(useNetworkStore.getState().status === networkStatus.online){
        //remove from server
        fetch(this.base_url + '/todos/' + todo.id, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          this.loadTasks()
        })
      } else {
        console.log("add to querry Queue");
        useChangeStore.getState().addChange({type: ChangeType.RemoveTodo, data: todo});
      }
    }

    syncTasks() {
      if(useNetworkStore.getState().status === networkStatus.online){
        console.log("sync to server");
        const requests = useChangeStore.getState().offlineChanges.map(change => {
          if(change.type === ChangeType.AddTodo){
            return fetch(this.base_url + '/todos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(change.data),
            }).then(response => {
              response.ok ? useChangeStore.getState().removeChange(change) : console.log("error");
            })
          }
          else if(change.type === ChangeType.RemoveTodo){
            return fetch(this.base_url + '/todos/' + change.data.id, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            }).then(response => {
              response.ok ? useChangeStore.getState().removeChange(change) : console.log("error");
            })
          }else{
            return new Promise((resolve, reject) => {
              resolve('');
            })
          }
        })

        Promise.all(requests).then(() => {
          this.loadTasks();
        })
      }
    }
}
