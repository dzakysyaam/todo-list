document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.querySelector('.task-list');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const container = document.querySelector('.container');
    const body = document.body;
    const progressBar = document.querySelector('.progress');
    const modal = document.querySelector('.modal');
    const fab = document.querySelector('.fab');
    const closeModal = document.querySelector('.close');
    const newTaskInput = document.querySelector('.new-task-input');
    const completedCountEl = document.getElementById('completed-count');
    const totalCountEl = document.getElementById('total-count');

    let tasks = []; // Client-side task list for rendering

    // Fetch tasks from the server and render them
    function fetchTasks() {
        fetch('/')
            .then(response => response.json())
            .then(data => {
                tasks = data.tasks;
                renderTasks();
            });
    }

    function renderTasks() {
        taskList.innerHTML = ''; // Clear the task list

        tasks.forEach((task) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task' + (task.completed ? ' completed' : '');
            taskItem.setAttribute('data-task-id', task._id);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `task${task._id}`;
            checkbox.checked = task.completed;

            const label = document.createElement('label');
            label.setAttribute('for', `task${task._id}`);
            label.className = 'task-label';
            label.textContent = task.name;

            const category = document.createElement('span');
            category.className = 'task-category';
            category.textContent = 'Tasks';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-task';
            deleteButton.textContent = 'Delete';

            taskItem.appendChild(checkbox);
            taskItem.appendChild(label);
            taskItem.appendChild(category);
            taskItem.appendChild(deleteButton);

            taskList.appendChild(taskItem);
        });

        updateProgressBar();
        updateTaskCounter();
    }

    function toggleTaskCompletion(taskId) {
        fetch(`/tasks/complete/${taskId}`, {
            method: 'PATCH',  
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                const checkbox = taskElement.querySelector('input[type="checkbox"]');
                taskElement.classList.toggle('completed', checkbox.checked);
                updateProgress();
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    
    
    
    
    // Menghapus task
    function deleteTask(taskId) {
        fetch(`/tasks/delete/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                taskElement.remove();
                updateProgress();
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function updateProgress() {
        const totalTasks = document.querySelectorAll('.task').length;
        const completedTasks = document.querySelectorAll('.task.completed').length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
        document.querySelector('.progress').style.width = `${progress}%`;
        document.getElementById('completed-count').textContent = completedTasks;
        document.getElementById('total-count').textContent = totalTasks;
    }

    // Event delegation for handling task completion and deletion
    taskList.addEventListener('change', function(event) {
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
            const taskId = event.target.parentElement.getAttribute('data-task-id');
            toggleTaskCompletion(taskId);
        }
    });

    taskList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-task')) {
            const taskId = event.target.parentElement.getAttribute('data-task-id');
            deleteTask(taskId);
        }
    });

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        container.classList.toggle('dark-mode');
    });

    fab.addEventListener('click', () => {
        modal.style.display = 'block';
        newTaskInput.focus();
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initialize tasks and render them
    fetchTasks();

    
});
