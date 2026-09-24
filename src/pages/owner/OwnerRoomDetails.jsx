import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BedDouble,
  Users,
  IndianRupee,
  Phone,
  GraduationCap,
  CalendarClock,
  Wallet,
  ShieldCheck,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, cx } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Select } from '../../components/ui/Field'
import EmptyState from '../../components/ui/EmptyState'

export default function OwnerRoomDetails() {
  const { roomNumber } = useParams()
  const { students, roomByNumber, updateBedStatus } = useData()
  const toast = useToast()

  const room = useMemo(() => roomByNumber(roomNumber), [roomByNumber, roomNumber])
  const roomStudents = useMemo(
    () => students.filter((s) => s.roomNumber === roomNumber),
    [students, roomNumber],
  )

  const [assigning, setAssigning] = useState(null) // bedId

  if (!room) {
    return (
      <EmptyState
        title="Room not found"
        description={`There is no room ${roomNumber} in this hostel.`}
        action={
          <Link to="/owner/rooms" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">
            Back to Rooms
          </Link>
        }
      />
    )
  }

  const occ = room.beds.filter((b) => b.status === 'occupied').length
  const avail = room.beds.filter((b) => b.status === 'available').length
  const unassignedStudents = students.filter(
    (s) => !room.beds.some((b) => b.status === 'occupied' && b.studentId === s.id),
  )

  const setStatus = (bedId, status) => {
    updateBedStatus(room.roomNumber, bedId, status)
    toast.success('Bed status updated.')
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/owner/rooms" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
          <ArrowLeft className="h-4 w-4" /> Back to Rooms
        </Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 font-display text-lg font-bold text-white">
              {room.roomNumber}
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">{room.typeLabel}</h1>
              <p className="flex items-center gap-1.5 text-sm text-slate-500">
                {room.typeLabel} · Floor {room.floor}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center shadow-card">
              <p className="flex items-center justify-center gap-1 text-sm font-bold text-slate-800">
                <IndianRupee className="h-4 w-4" /> {room.rent.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] font-semibold uppercase text-slate-400">Rent / month</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center shadow-card">
              <p className="text-sm font-bold text-slate-800">{room.sharing}</p>
              <p className="text-[11px] font-semibold uppercase text-slate-400">Capacity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-100 px-4 py-4 text-center">
          <p className="font-display text-2xl font-bold text-slate-900">{room.beds.length}</p>
          <p className="text-xs font-semibold uppercase text-slate-500">Total Beds</p>
        </div>
        <div className="rounded-2xl bg-rose-100/60 px-4 py-4 text-center">
          <p className="font-display text-2xl font-bold text-rose-600">{occ}</p>
          <p className="text-xs font-semibold uppercase text-rose-500">Occupied</p>
        </div>
        <div className="rounded-2xl bg-emerald-100/60 px-4 py-4 text-center">
          <p className="font-display text-2xl font-bold text-emerald-600">{avail}</p>
          <p className="text-xs font-semibold uppercase text-emerald-500">Available</p>
        </div>
      </div>

      <Card>
        <CardHeader
          title={`Beds in Room ${room.roomNumber}`}
          subtitle={`${occ} of ${room.sharing} students staying in this room.`}
          icon={BedDouble}
        />
        <CardBody className="space-y-4">
          {room.beds.map((bed) => {
            const student = roomStudents.find((s) => s.id === bed.studentId) || null
            const isOccupiedClue = bed.status === 'occupied'
            return (
              <div
                key={bed.id}
                className={cx(
                  'rounded-2xl border-2 p-4 transition-all',
                  isOccupiedClue ? 'border-slate-200 bg-white' : 'border-emerald-200 bg-emerald-50/50',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-bold ${isOccupiedClue ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {bed.bedNumber.replace('Bed ', '')}
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-slate-900">{bed.bedNumber}</p>
                      <p className="text-xs text-slate-500">
                        {isOccupiedClue ? (student ? student.name : 'Occupied bed') : 'Currently available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge status={bed.status} />
                    {isOccupiedClue ? (
                      <Select
                        value="occupied"
                        onChange={(e) => {
                          if (e.target.value === 'available') setStatus(bed.id, 'available')
                          if (e.target.value === 'reserved') setStatus(bed.id, 'reserved')
                        }}
                        className="w-36 py-1.5 text-xs"
                      >
                        <option value="occupied">Occupied</option>
                        <option value="available">Mark Available</option>
                        <option value="reserved">Mark Reserved</option>
                      </Select>
                    ) : (
                      <Select
                        value={bed.status}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === 'occupied') {
                            if (!unassignedStudents.length) {
                              toast.warning('No unassigned students available to occupy this bed.')
                              return
                            }
                            setAssigning(bed.id)
                            return
                          }
                          setStatus(bed.id, val)
                        }}
                        className="w-36 py-1.5 text-xs"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Assign Student</option>
                        <option value="reserved">Reserved</option>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Student detail for occupied beds */}
                {isOccupiedClue && student ? (
                  <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StudentDetail icon={Users} label="Student" value={student.name} />
                    <StudentDetail icon={Phone} label="Mobile" value={student.mobile} />
                    <StudentDetail icon={GraduationCap} label="College" value={student.college} />
                    <StudentDetail icon={CalendarClock} label="Joined" value={formatDate(student.joiningDate)} />
                    <StudentDetail icon={Wallet} label="Payment Status" value={student.paymentStatus === 'paid' ? 'Paid' : 'Pending'} badge={student.paymentStatus} />
                    <StudentDetail icon={ShieldCheck} label="Course" value={student.course || '—'} />
                  </div>
                ) : isOccupiedClue ? (
                  <p className="mt-3 text-xs text-slate-400">Occupied — occupant details not linked.</p>
                ) : null}
              </div>
            )
          })}
        </CardBody>
      </Card>

      <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-card">
        Tip: On mobile, view the full student list under{' '}
        <Link to="/owner/students" className="font-bold text-brand-700 hover:text-brand-800">Students</Link>.
      </div>

      {/* Assign student modal */}
      {assigning ? (
        <AssignStudentModal
          room={room}
          bed={room.beds.find((b) => b.id === assigning)}
          unassignedStudents={unassignedStudents}
          onCancel={() => setAssigning(null)}
          onAssign={(student) => {
            updateBedStatus(
              room.roomNumber,
              assigning,
              'occupied',
              student?.id,
              room.beds.find((b) => b.id === assigning)?.bedNumber,
            )
            toast.success(`${student?.name || 'Student'} assigned to Room ${room.roomNumber}.`)
            setAssigning(null)
          }}
        />
      ) : null}
    </div>
  )
}

function StudentDetail({ icon: Icon, label, value, badge }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      {badge ? (
        <Badge status={badge} label={value} className="mt-1" />
      ) : (
        <p className="mt-0.5 text-sm font-bold text-slate-800">{value || '—'}</p>
      )}
    </div>
  )
}

function AssignStudentModal({ room, bed, unassignedStudents, onCancel, onAssign }) {
  const [selected, setSelected] = useState(unassignedStudents[0]?.id || '')
  const toast = useToast()
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-bold text-slate-900">Assign Student</h3>
        <p className="mt-1 text-sm text-slate-500">
          Occupy {bed?.bedNumber} in Room {room?.roomNumber} with a student.
        </p>
        {unassignedStudents.length ? (
          <>
            <Select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-4">
              {unassignedStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.college}
                </option>
              ))}
            </Select>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="ghost" onClick={onCancel}>Cancel</Button>
              <Button
                onClick={() => {
                  const student = unassignedStudents.find((s) => s.id === selected)
                  if (student) onAssign(student)
                  else toast.warning('Select a student first.')
                }}
              >
                Assign
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No unassigned students right now. Assign a student to the bed after adding them in the Students section.
          </div>
        )}
      </div>
    </div>
  )
}