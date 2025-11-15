import { useEffect, useMemo, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [organizers, setOrganizers] = useState([])
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ name: '', email: '', organization: '' })
  const [eventForm, setEventForm] = useState({ title: '', description: '', capacity: 50 })
  const [selectedOrganizer, setSelectedOrganizer] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [regForm, setRegForm] = useState({ participant_name: '', participant_email: '' })

  const load = async () => {
    const orgs = await fetch(`${apiBase}/organizers`).then(r => r.json())
    setOrganizers(orgs)
    const evs = await fetch(`${apiBase}/events`).then(r => r.json())
    setEvents(evs)
  }

  useEffect(() => { load() }, [])

  const createOrganizer = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    await fetch(`${apiBase}/organizers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ name: '', email: '', organization: '' })
    await load()
  }

  const createEvent = async (e) => {
    e.preventDefault()
    if (!selectedOrganizer || !eventForm.title) return
    await fetch(`${apiBase}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...eventForm, organizer_id: selectedOrganizer, capacity: Number(eventForm.capacity) }) })
    setEventForm({ title: '', description: '', capacity: 50 })
    await load()
  }

  const register = async (e) => {
    e.preventDefault()
    if (!selectedEvent) return
    await fetch(`${apiBase}/events/${selectedEvent}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(regForm) })
    setRegForm({ participant_name: '', participant_email: '' })
    await load()
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Competitions Service</h1>
          <span className="text-sm text-gray-500">Backend-focused demo</span>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Create Organizer</h2>
            <form className="space-y-2" onSubmit={createOrganizer}>
              <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Organization" value={form.organization} onChange={e=>setForm({...form,organization:e.target.value})} />
              <button className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Create Event</h2>
            <form className="space-y-2" onSubmit={createEvent}>
              <select className="w-full border p-2 rounded" value={selectedOrganizer} onChange={e=>setSelectedOrganizer(e.target.value)}>
                <option value="">Select organizer</option>
                {organizers.map(o=> <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              <input className="w-full border p-2 rounded" placeholder="Title" value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Description" value={eventForm.description} onChange={e=>setEventForm({...eventForm,description:e.target.value})} />
              <input type="number" className="w-full border p-2 rounded" placeholder="Capacity" value={eventForm.capacity} onChange={e=>setEventForm({...eventForm,capacity:e.target.value})} />
              <button className="bg-green-600 text-white px-3 py-2 rounded">Create</button>
            </form>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Events</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <ul className="divide-y">
                {events.map(ev => (
                  <li key={ev.id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-xs text-gray-500">Organizer {ev.organizer_id}</div>
                    </div>
                    <button className="text-blue-600" onClick={()=>setSelectedEvent(ev.id)}>Register</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <form className="space-y-2" onSubmit={register}>
                <div className="text-sm text-gray-600">Selected event: {selectedEvent||'-'}</div>
                <input className="w-full border p-2 rounded" placeholder="Your name" value={regForm.participant_name} onChange={e=>setRegForm({...regForm,participant_name:e.target.value})} />
                <input className="w-full border p-2 rounded" placeholder="Your email" value={regForm.participant_email} onChange={e=>setRegForm({...regForm,participant_email:e.target.value})} />
                <button className="bg-purple-600 text-white px-3 py-2 rounded">Register</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
