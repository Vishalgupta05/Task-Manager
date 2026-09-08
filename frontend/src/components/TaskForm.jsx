import { useState, useEffect } from 'react'

const emptyTask = { title: '', description: '', priority: 'MEDIUM', dueDate: '', completed: false }

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [form, setForm] = useState(emptyTask)

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'MEDIUM',
        dueDate: editingTask.dueDate || '',
        completed: editingTask.completed || false,
      })
    } else {
      setForm(emptyTask)
    }
  }, [editingTask])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit({ ...form, dueDate: form.dueDate || null })
    if (!editingTask) setForm(emptyTask)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h3 className="font-semibold text-slate-800">
        {editingTask ? 'Edit Task' : 'New Task'}
      </h3>

      <div>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Due date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate || ''}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition"
        >
          {editingTask ? 'Save changes' : 'Add task'}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
