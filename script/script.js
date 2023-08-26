document.addEventListener("DOMContentLoaded", () => {
    const addListButton = document.getElementById("add-list-button");
    const listsContainer = document.getElementById("lists-container");
  
    let listsData = JSON.parse(localStorage.getItem("listsData")) || [];
  
    addListButton.addEventListener("click", () => {
      const newListName = prompt("Enter the name for the new list:");
      if (newListName) {
        createList(newListName);
      }
    });
  
    const saveListsToLocalStorage = () => {
      localStorage.setItem("listsData", JSON.stringify(listsData));
    };
  
    const createList = (listName) => {
      const newListData = { name: listName, tasks: [] };
      listsData.push(newListData);
      saveListsToLocalStorage();
      renderLists();
    };
  
    const createTask = (tasksList, taskName, listIndex, isCompleted) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");
      taskItem.innerHTML = `
        <div class="task-header">
          <input type="checkbox" class="complete" ${isCompleted ? "checked" : ""}>
          <span class="task ${isCompleted ? "completed" : ""}">${taskName}</span>
          <button class="remove-task-button">Remove</button>
        </div>
      `;
  
      const taskHeader = taskItem.querySelector(".task-header");
      const removeTaskButton = taskHeader.querySelector(".remove-task-button");
      const completeCheckbox = taskHeader.querySelector(".complete");
      const taskText = taskHeader.querySelector(".task");
  
      removeTaskButton.addEventListener("click", () => {
        const taskIndex = Array.from(tasksList.children).indexOf(taskItem);
        listsData[listIndex].tasks.splice(taskIndex, 1);
        saveListsToLocalStorage();
        renderLists();
      });
  
      completeCheckbox.addEventListener("change", () => {
        const taskIndex = Array.from(tasksList.children).indexOf(taskItem);
        listsData[listIndex].tasks[taskIndex].completed = completeCheckbox.checked;
        taskText.classList.toggle("completed", completeCheckbox.checked);
        saveListsToLocalStorage();
      });
  
      tasksList.appendChild(taskItem);
    };
  
    const renderLists = () => {
      listsContainer.innerHTML = "";
      listsData.forEach((listData, listIndex) => {
        const list = document.createElement("div");
        list.classList.add("list");
  
        const listHeader = document.createElement("div");
        listHeader.classList.add("list-header");
        listHeader.textContent = listData.name;
  
        const tasksList = document.createElement("ul");
  
        list.appendChild(listHeader);
        list.appendChild(tasksList);
  
        const removeListButton = document.createElement("button");
        removeListButton.textContent = "Remove List";
        removeListButton.addEventListener("click", () => {
          listsData.splice(listIndex, 1);
          saveListsToLocalStorage();
          renderLists();
        });
  
        const addTaskButton = document.createElement("button");
        addTaskButton.textContent = "Add To List";
        addTaskButton.addEventListener("click", () => {
          const newTaskName = prompt("What do you want to add?:");
          if (newTaskName) {
            listsData[listIndex].tasks.push({ name: newTaskName, completed: false });
            saveListsToLocalStorage();
            renderLists();
          }
        });
  
        listHeader.appendChild(removeListButton);
        listHeader.appendChild(addTaskButton);
  
        listData.tasks.forEach((task) => {
          createTask(tasksList, task.name, listIndex, task.completed);
        });
  
        listsContainer.appendChild(list);
      });
    };
  
    renderLists();
  });
  