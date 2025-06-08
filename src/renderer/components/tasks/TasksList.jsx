// Tasks List Component
import React from 'react';

const TasksList = ({
  tasks,
  newTaskText,
  setNewTaskText,
  menuOpenTaskId,
  setMenuOpenTaskId,
  editingTaskId,
  setEditingTaskId,
  editingTaskTitle,
  setEditingTaskTitle,
  addTask,
  toggleTaskCompletion,
  updateTasks,
  deleteTask
}) => {
  return (
    <div className="tasks-screen">
      <h2>任务列表</h2>
      <div className="task-input-container">
        <input
          type="text"
          placeholder="添加新任务..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>添加</button>
      </div>
      <ul className="task-list">
        {tasks.map(task => task.isDelete === true ? null : (
          <li key={task.id} className={task.completed ? 'completed' : ''} style={{display: 'flex', alignItems: 'center', position: 'relative'}}>
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  className="task-edit-input"
                  value={editingTaskTitle}
                  onChange={e => setEditingTaskTitle(e.target.value)}
                  style={{flex: 1, marginRight: 8}}
                />
                <button
                  className="task-edit-btn save"
                  onClick={() => {
                    const updatedTasks = tasks.map(t =>
                      t.id === editingTaskId ? { ...t, title: editingTaskTitle } : t
                    );
                    updateTasks(updatedTasks);
                    setEditingTaskId(null);
                    setEditingTaskTitle("");
                  }}
                >保存</button>
                <button
                  className="task-edit-btn cancel"
                  onClick={() => setEditingTaskId(null)}
                >取消</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleTaskCompletion(task.id)} style={{flex: 1}}>
                  {task.completed ? '✓' : '○'} {task.title}
                </span>
                <button
                  className="task-menu-btn"
                  onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)}
                >⋮</button>
                {menuOpenTaskId === task.id && (
                  <div className="task-menu-dropdown">
                    <div onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskTitle(task.title);
                      setMenuOpenTaskId(null);
                    }}>编辑</div>
                    <div onClick={() => {
                      deleteTask(task.id);
                      setMenuOpenTaskId(null);
                    }}>删除</div> 
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
