// TasksList Interactor
// This file provides an API for interacting with the tasks list.

const DATA_STORAGE_KEY = "ds-test";

// Helper function to load tasks from data storage
const loadTasks = async () => {
  const dataStorage = await window.DataStorage.loadDataStorage(DATA_STORAGE_KEY);
  const tasks = await dataStorage.load('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

// Helper function to save tasks to data storage
const saveTasks = async (tasks) => {
  const dataStorage = await window.DataStorage.loadDataStorage(DATA_STORAGE_KEY);
  await dataStorage.save('tasks', tasks);
};

/**
 * Adds a new task.
 * @param {string} taskContent - The content of the task to add.
 * @returns {string} A JSON string of the updated tasks list.
 */
const addTask = async (taskContent) => {
  const tasks = await loadTasks();
  const newTask = {
    id: Date.now(),
    title: taskContent,
    completed: false,
    isDelete: false,
  };
  const updatedTasks = [...tasks, newTask];
  await saveTasks(updatedTasks);
  return JSON.stringify(updatedTasks);
};

/**
 * Deletes a task by its content.
 * @param {string} taskContent - The content of the task to delete.
 * @returns {string} A JSON string of the updated tasks list.
 */
const deleteTaskByContent = async (taskContent) => {
  let tasks = await loadTasks();
  tasks = tasks.map(task => {
    if (task.title === taskContent) {
      return { ...task, isDelete: true };
    }
    return task;
  });
  await saveTasks(tasks);
  return JSON.stringify(tasks);
};

/**
 * Updates a task's content.
 * @param {string} oldTaskContent - The original content of the task.
 * @param {string} newTaskContent - The new content for the task.
 * @returns {string} A JSON string of the updated tasks list.
 */
const updateTask = async (oldTaskContent, newTaskContent) => {
  let tasks = await loadTasks();
  tasks = tasks.map(task => {
    if (task.title === oldTaskContent) {
      return { ...task, title: newTaskContent };
    }
    return task;
  });
  await saveTasks(tasks);
  return JSON.stringify(tasks);
};

/**
 * Toggles a task's completion status.
 * @param {string} taskContent - The content of the task to mark as complete.
 * @returns {string} A JSON string of the updated tasks list.
 */
const completeTask = async (taskContent) => {
  let tasks = await loadTasks();
  tasks = tasks.map(task => {
    if (task.title === taskContent) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  await saveTasks(tasks);
  return JSON.stringify(tasks);
};

/**
 * Gets all non-deleted tasks.
 * @returns {string} A JSON string of tasks with only their content and completion status.
 */
const getAllTasks = async () => {
  const tasks = await loadTasks();
  const filteredTasks = tasks
    .filter(task => !task.isDelete)
    .map(({ title, completed }) => ({ title, completed }));
  return JSON.stringify(filteredTasks);
};

export const getInteractor = () => {
  return {
    addTask,
    deleteTaskByContent,
    updateTask,
    completeTask,
    getAllTasks,
  };
};

export const getInteractorDescription = () => {
  return `
    addTask: (功能：添加一个新任务），参数列表： taskContent（任务内容） 返回值描述：返回更新后的任务列表的JSON字符串。
    deleteTaskByContent: (功能：删除一个任务），参数列表： taskContent（要删除的任务内容） 返回值描述：返回更新后的任务列表的JSON字符串。
    updateTask: (功能：更新一个任务），参数列表： oldTaskContent（原始任务内容）, newTaskContent（新任务内容） 返回值描述：返回更新后的任务列表的JSON字符串。
    completeTask: (功能：切换任务的完成状态），参数列表： taskContent（要操作的任务内容） 返回值描述：返回更新后的任务列表的JSON字符串。
    getAllTasks: (功能：获取所有未删除的任务），参数列表： 无 返回值描述：返回一个包含任务内容和完成状态的JSON字符串。
  `;
};