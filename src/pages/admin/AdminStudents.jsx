import { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Field'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminStudents() {
  const { students, rooms, updateStudent } = useData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ fullName: '', mobile: '', email: '', college: '', roomNumber: '', bed: '', course: '' })

  const filtered = students.filter((s) =>
    (s.name + s.college + s.mobile).toLowerCase().includes(query.toLowerCase()),
  )

  const submit = (e) => {
    e.preventDefault()
    if (!form.fullName || !form.roomNumber) {
      toast.warning('Name and room are required.')
      return
    }
    updateStudent({
      id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.fullName,
      firstName: form.fullName.split(' ')[0],
      mobile: form.mobile,
      email: form.email,
      college: form.college,
      course: form.course,
      roomNumber: form.roomNumber,
      bed: form.bed || `Bed 1`,
      joiningDate: new Date().toISOString().slice(0, 10),
      paymentStatus: 'pending',
    })
    toast.success(`${form.fullName} added as a student.`)
    setAdding(false)
    setForm({ fullName: '', mobile: '', email: '', college: '', roomNumber: '', bed: '', course: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Manage Students</h1>
          <p className="mt-0.5 text-sm text-slate-500">{students.length} students enrolled.</p>
        </div>
        <Button onClick={() => setAdding(true)} icon={<Plus className="h-4 w-4" />}>Add Student</Button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search students…"
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />

      <Card>
        <CardHeader title="Student List" subtitle="Add, search and edit students." icon={Users} />
        <CardBody className="p-0">
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Mobile</th>
                    <th className="px-5 py-3">College</th>
                    <th className="px-5 py-3">Room / Bed</th>
                    <th className="px-5 py-3">Joined</th>
                    <th className="px-5 py-3">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-bold text-slate-800">{s.name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{s.mobile}</td>
                      <td className="max-w-44 truncate px-5 py-3.5 text-slate-600">{s.college}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-700">{s.roomNumber} · {s.bed}</td>
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(s.joiningDate)}</td>
                      <td className="px-5 py-3.5"><Badge status={s.paymentStatus} label={s.paymentStatus === 'paid' ? 'Paid' : 'Pending'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5"><EmptyState title="No students found" /></div>
          )}
        </CardBody>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Student" subtitle="Register a new student manually.">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" required>
            <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
          </Field>
          <Field label="Mobile">
            <Input value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="College">
            <Input value={form.college} onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))} />
          </Field>
          <Field label="Course">
            <Input value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))} />
          </Field>
          <Field label="Room" required>
            <Select value={form.roomNumber} onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))}>
              <option value="">Select room</option>
              {rooms.map((r) => <option key={r.roomNumber} value={r.roomNumber}>Room {r.roomNumber} ({r.typeLabel})</option>)}
            </Select>
          </Field>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            <Button type="submit"><Plus className="h-4 w-4" /> Add</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}