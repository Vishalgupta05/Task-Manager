import { useEffect, useMemo, useState, useCallback } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState(null)

  const [keyword, setKeyword] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (keyword.trim()) params.keyword = keyword.trim()
      if (priorityFilter) params.priority = priorityFilter
      if (statusFilter) params.completed = statusFilter === 'completed'

      const { data } = await api.get('/tasks', { params })
      setTasks(data)
    } catch (err) {
      setError('Could not load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [keyword, priorityFilter, statusFilter])

  useEffect(() => {
    const debounce = setTimeout(fetchTasks, 300)
    return () => clearTimeout(debounce)
  }, [fetchTasks])

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, formData)
        setEditingTask(null)
      } else {
        await api.post('/tasks', formData)
      }
      fetchTasks()
    } catch (err) {
      setError('Could not save task. Please check the fields and try again.')
    }
  }

  const handleToggle = async (id) => {
    try {
      await api.patch(`/tasks/${id}/toggle`)
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    } catch (err) {
      setError('Could not update task status.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}`)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError('Could not delete task.')
    }
  }

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0
    const done = tasks.filter((t) => t.completed).length
    return Math.round((done / tasks.length) * 100)
  }, [tasks])

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress tracking */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-800">Your progress</h2>
            <span className="text-sm text-slate-500">
              {completedCount} / {tasks.length} completed
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: form */}
          <div className="md:col-span-1">
            <TaskForm
              onSubmit={handleCreateOrUpdate}
              editingTask={editingTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>

          {/* Right: search, filters, list */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search tasks…"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
