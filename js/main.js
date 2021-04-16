'use strict';

const todoControl   = document.querySelector('.todo-control');
const headerInput   = document.querySelector('.header-input');
const todoList      = document.querySelector('.todo-list');
const todoCompleted = document.querySelector('.todo-completed');

let todoData = [];

const render = () => {
  todoList.textContent = '';
  todoCompleted.textContent = '';

  todoData = JSON.parse(localStorage.todoData) || [];

  todoData.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');

    li.innerHTML = `
      <span class="text-todo">${item.value}</span>
      <div class="todo-buttons">
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `;

    if (item.completed) {
      todoCompleted.append(li);
    } else {
      todoList.append(li);
    }
    
    const todoCompleteBtn = li.querySelector('.todo-complete');
    const todoRemoveBtn   = li.querySelector('.todo-remove');

    todoCompleteBtn.addEventListener('click', () => {
      item.completed = !item.completed;
      localStorage.setItem('todoData', JSON.stringify(todoData));
      render();
    });

    todoRemoveBtn.addEventListener('click', () => {
      const index = todoData.indexOf(item);
      todoData.splice(index, 1);
      localStorage.setItem('todoData', JSON.stringify(todoData));

      li.parentNode.removeChild(li);
    });
  });
};

todoControl.addEventListener('submit', (event) => {
  event.preventDefault();

  if (headerInput.value.trim()) {
    const newTodo = {
      value: headerInput.value,
      completed: false,
    };

    headerInput.value = '';

    todoData = JSON.parse(localStorage.getItem('todoData')) || [];
    todoData.push(newTodo);
    localStorage.setItem('todoData', JSON.stringify(todoData));

    render();
  }
});

render();