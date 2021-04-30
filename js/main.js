'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
  }

  addToStorage() {
    localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.input.value = '';
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createElem, this);
    this.addToStorage();
  }

  createElem(item) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = item.key;
    li.insertAdjacentHTML('beforeend', `
      <input class="text-todo" value="${item.value}" disabled>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
      <div class="todo-delete"></div>
    `);

    if (item.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(event) {
    event.preventDefault();

    if (this.input.value.trim()) {
      this.input.classList.remove('error');
      this.input.placeholder = 'Какие планы?';

      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };

      this.todoData.set(newTodo.key, newTodo);
      this.render();
    } else {
      this.input.value = '';
      this.input.classList.add('error');
      this.input.placeholder = 'Нельзя добавить пустоту!';
    }
  }

  generateKey() {
    return Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
  }

  deleteAnimation(target) {
    const deleteLine = target.querySelector('.todo-delete');

    let opacity = 1;
    let width = 0;

    let animateId;

    const animate = () => {
      if (width <= 99) {
        width += 2;
        opacity -= 0.018;

        deleteLine.style.width = width + '%';
        target.style.opacity = opacity;

        animateId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animateId);
      }
    };

    animateId = requestAnimationFrame(animate);
  }

  deleteItem(target) {
    target = target.closest('.todo-item');
    this.todoData.forEach(item => {
      if (target.key === item.key) {
        this.deleteAnimation(target);

        setTimeout(() => {
          this.todoData.delete(item.key);
          this.render();
        }, 450);
      }
    });
  }

  completeAnimation(target) {
    let transform = 0;
    let start = new Date().getTime();

    let animateId;

    const animate = () => {
      if (transform > -100) {
        transform -= 3;

        target.style.transform = `translateX(${transform}%)`;

        animateId = requestAnimationFrame(animate);
      } else {
        console.log(new Date().getTime() - start);
        cancelAnimationFrame(animateId);
      }
    };

    animateId = requestAnimationFrame(animate);
  }

  completedItem(target) {
    target = target.closest('.todo-item');
    this.todoData.forEach(item => {
      if (target.key === item.key) {
        this.completeAnimation(target);
        setTimeout(() => {
          if (item.completed) {
            item.completed = false;
          } else {
            item.completed = true;
          }

          this.render();
        }, 250);
      }
    });
  }

  editItem(target) {
    target = target.closest('.todo-item');
    this.todoData.forEach(item => {
      if (target.key === item.key) {
        let input = target.querySelector('.text-todo');

        input.removeAttribute('disabled');
        input.setAttribute('contenteditable', 'true');

        input.focus();
        input.selectionStart = input.value.length;

        input.addEventListener('blur', () => {
          input.disabled = 'disabled';
          input.removeAttribute('contenteditable');

          item.value = input.value;
          this.render();
        });
      }
    });
  }

  handler() {
    document.querySelector('.todo-container').addEventListener('click', event => {
      let target = event.target;

      if (target.classList.contains('todo-remove')) {
        this.deleteItem(target);
        target.disabled = 'disabled';
      } else if (target.classList.contains('todo-complete')) {
        this.completedItem(target);
      } else if (target.classList.contains('todo-edit')) {
        this.editItem(target);
      }
    });
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();