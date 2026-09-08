import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onEdit, onDelete, loading }) {
  if (loading) {
    return <p className="text-slate-400 text-sm text-center py-10">Loading tasks…</p>
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-14 border border-dashed border-slate-300 rounded-xl">
        <p className="text-slate-400 text-sm">No tasks found. Add one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
