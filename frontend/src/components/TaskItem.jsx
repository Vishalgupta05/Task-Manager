const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString())

  return (
    <div
      className={`bg-white rounded-xl border p-4 flex items-start gap-3 transition ${
        task.completed ? 'border-slate-100 opacity-70' : 'border-slate-200'
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-1 w-4 h-4 accent-primary-600 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className={`font-medium text-slate-800 ${task.completed ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h4>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
          {isOverdue && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              Overdue
            </span>
          )}
        </div>
        {task.description && (
          <p className="text-sm text-slate-500 mt-1 break-words">{task.description}</p>
        )}
        {task.dueDate && (
          <p className="text-xs text-slate-400 mt-1">Due {task.dueDate}</p>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="text-xs font-medium text-slate-500 hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-primary-50 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs font-medium text-slate-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
