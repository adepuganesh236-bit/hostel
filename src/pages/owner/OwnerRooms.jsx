import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  BedDouble,
  Pencil,
  IndianRupee,
  Users,
  Eye,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Field'
import EmptyState from '../../components/ui/EmptyState'
import { cx } from '../../lib/utils'

const SHARING_OPTIONS = ['6', '10']

export default function OwnerRooms() {
  const { rooms, addRoom, updateRoom } = useData()
  const toast = useToast()

  const [sharing, setSharing] = useState('all')
  const [query, setQuery] = useState('')
  const [edit, setEdit] = useState(null) // { roomNumber, rent, advance }
  const [newRoom, setNewRoom] = useState(false)

  const [form, setForm] = useState({
    roomNumber: '',
    floor: '1',
sharing: '6',
    rent: '',
    advance: '',
    image: '',
  })

  const filtered = useMemo(() => {
    let list = rooms
    if (sharing !== 'all') list = list.filter((r) => r.sharing === Number(sharing))
    if (query) {
      const q = query.trim().toLowerCase()
      list = list.filter((r) => r.roomNumber.toLowerCase().includes(q))
    }
    return list
  }, [rooms, sharing, query])

  const openEdit = (room) => setEdit({ roomNumber: room.roomNumber, rent: room.rent, advance: room.advance, image: room.image })

  const saveRent = (e) => {
    e.preventDefault()
    if (!edit?.rent) {
      toast.warning('Enter a valid monthly rent.')
      return
    }
    const existing = rooms.find((r) => r.roomNumber === edit.roomNumber)
    if (existing) {
      updateRoom({ ...existing, rent: Number(edit.rent), advance: Number(edit.advance) || Number(existing.advance), image: edit.image || existing.image })
    }
    toast.success(`Room ${edit.roomNumber} updated.`)
    setEdit(null)
  }

  const createRoom = (e) => {
    e.preventDefault()
    if (!form.roomNumber || !form.rent) {
      toast.warning('Room number and rent are required.')
      return
    }
    if (rooms.some((r) => r.roomNumber === form.roomNumber)) {
      toast.error('A room with this number already exists.')
      return
    }
    const share = Number(form.sharing)
    const room = {
      id: form.roomNumber,
      roomNumber: form.roomNumber,
      floor: Number(form.floor),
      sharing: share,
      typeLabel: share === 6 ? '6 Sharing' : '10 Sharing',
      rent: Number(form.rent),
      advance: Number(form.advance) || Number(form.rent),
      image: form.image,
      beds: Array.from({ length: share }, (_, i) => ({
        id: `${form.roomNumber}-b${i + 1}`,
        bedNumber: `Bed ${i + 1}`,
        status: 'available',
        studentId: null,
      })),
    }
    addRoom(room)
    toast.success(`Room ${form.roomNumber} added with ${share} beds.`)
    setNewRoom(false)
    setForm({ roomNumber: '', floor: '1', sharing: '6', rent: '', advance: '', image: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Rooms & Beds</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {rooms.length} rooms · Click any room to see its beds & students.
          </p>
        </div>
        <Button onClick={() => setNewRoom(true)} icon={<Plus className="h-4 w-4" />}>
          Add Room
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {['all', '6', '10'].map((share) => (
            <button
              key={share}
              onClick={() => setSharing(share)}
              className={cx(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                sharing === share ? 'bg-brand-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300',
              )}
            >
              {share === 'all' ? 'All' : `${share} Sharing`}
            </button>
          ))}
        </div>
        <div className="relative sm:w-56">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search room…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Room cards */}
      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((room, i) => {
            const occ = room.beds.filter((b) => b.status === 'occupied').length
            const avail = room.beds.filter((b) => b.status === 'available').length
            const res = room.beds.filter((b) => b.status === 'reserved').length
            return (
              <div
                key={room.roomNumber}
                className="anim-fade-up rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
                      <BedDouble className="h-4 w-4 text-brand-600" /> Room {room.roomNumber}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      <Users className="mr-1 inline h-3.5 w-3.5" />
                      {room.typeLabel}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    Floor {room.floor}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-slate-50 py-2.5">
                    <p className="text-lg font-bold text-slate-800">{room.beds.length}</p>
                    <p className="text-[11px] font-semibold uppercase text-slate-400">Total</p>
                  </div>
                  <div className="rounded-xl bg-rose-50 py-2.5">
                    <p className="text-lg font-bold text-rose-600">{occ}</p>
                    <p className="text-[11px] font-semibold uppercase text-rose-400">Occupied</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 py-2.5">
                    <p className="text-lg font-bold text-emerald-600">{avail}</p>
                    <p className="text-[11px] font-semibold uppercase text-emerald-400">Available</p>
                  </div>
                </div>
                {res > 0 ? (
                  <p className="mt-2 text-center text-xs font-semibold text-amber-600">{res} bed(s) reserved</p>
                ) : null}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">Rent / month</p>
                    <p className="flex items-center gap-1 font-display text-lg font-bold text-slate-900">
                      <IndianRupee className="h-4 w-4" /> {room.rent.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(room)} icon={<Pencil className="h-4 w-4" />}>
                      Edit
                    </Button>
                    <Link to={`/owner/rooms/${room.roomNumber}`}>
                      <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />}>
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState title="No rooms match your filters" description="Try a different sharing type or search term." />
      )}

      {/* Edit rent modal */}
      <Modal open={Boolean(edit)} onClose={() => setEdit(null)} title={`Edit Room ${edit?.roomNumber || ''}`} subtitle="Change the monthly rent or advance.">
        <form onSubmit={saveRent} className="space-y-4">
          <Field label="Monthly Rent (₹)" required>
            <Input type="number" min={0} value={edit?.rent ?? ''} onChange={(e) => setEdit((m) => ({ ...m, rent: e.target.value }))} />
          </Field>
          <Field label="Advance (₹)">
            <Input type="number" min={0} value={edit?.advance ?? ''} onChange={(e) => setEdit((m) => ({ ...m, advance: e.target.value }))} />
          </Field>
          <Field label="Image URL">
            <Input type="text" value={edit?.image ?? ''} onChange={(e) => setEdit((m) => ({ ...m, image: e.target.value }))} placeholder="https://…/room.jpg" />
          </Field>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setEdit(null)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Add room modal */}
      <Modal open={newRoom} onClose={() => setNewRoom(false)} title="Add New Room" subtitle="Create a room with its beds.">
        <form onSubmit={createRoom} className="grid gap-4 sm:grid-cols-2">
          <Field label="Room Number" required>
            <Input value={form.roomNumber} onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value.toUpperCase() }))} placeholder="e.g. 105" />
          </Field>
          <Field label="Floor">
            <Select value={form.floor} onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))}>
              {['1', '2', '3', '4'].map((n) => <option key={n} value={n}>Floor {n}</option>)}
            </Select>
          </Field>
          <Field label="Sharing Type">
            <Select value={form.sharing} onChange={(e) => setForm((f) => ({ ...f, sharing: e.target.value }))}>
              {SHARING_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {`${n} Sharing`}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Monthly Rent (₹)" required>
            <Input type="number" min={0} value={form.rent} onChange={(e) => setForm((f) => ({ ...f, rent: e.target.value }))} placeholder="e.g. 8000" />
          </Field>
          <Field label="Advance (₹)">
            <Input type="number" min={0} value={form.advance} onChange={(e) => setForm((f) => ({ ...f, advance: e.target.value }))} placeholder="e.g. 8000" />
          </Field>
          <Field label="Image URL">
            <Input type="text" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://…/room.jpg" />
          </Field>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => setNewRoom(false)}>Cancel</Button>
            <Button type="submit">Create Room</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}