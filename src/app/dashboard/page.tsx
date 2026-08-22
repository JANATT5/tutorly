'use client'
// Must be a Client Component: we read the role from localStorage,
// which only exists in the browser (not available during server render).

import { useEffect, useState } from 'react'
import SectionCard from '@/components/SectionCard'
import StatCard from '@/components/StatCard'
import PageHeader from '@/components/layout/PageHeader'
import PlaceholderBlock from '@/components/layout/PlaceholderBlock'
import Link from 'next/link'

// TUTOR DASHBOARD
function TutorDashboard() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Tutor Dashboard</h1>
				<p className="mt-2 text-slate-500">Manage your tutoring activity.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<StatCard label="Pending Requests" value="4" />
				<StatCard label="Upcoming Sessions" value="6" />
				<StatCard label="This Month" value="$240" />
				<StatCard label="Rating" value="4.9" />
			</div>
			<SectionCard title="Booking Requests">
				<div className="space-y-4">
					{["Maya Hassan", "Karim Ali", "Nour Ahmad"].map((student) => (
						<div
							key={student}
							className="flex items-center justify-between rounded-xl border p-4"
						>
							<div>
								<h3 className="font-semibold">{student}</h3>
								<p className="text-sm text-slate-500">
									Data Structures · Tomorrow 4:00 PM
								</p>
							</div>

							<div className="flex gap-2">
								<button className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white">
									Accept
								</button>
								<button className="rounded-lg border px-3 py-2 text-sm">
									Decline
								</button>
							</div>
						</div>
					))}
				</div>
			</SectionCard>
			<SectionCard title="Upcoming Sessions">
				<div className="space-y-4">
					<div className="rounded-xl border p-4">
						<h3 className="font-semibold">Data Structures</h3>
						<p className="mt-1 text-sm text-slate-500">Student: Maya Hassan</p>
						<p className="mt-1 text-sm text-slate-500">Tomorrow · 4:00 PM</p>
					</div>
				</div>
			</SectionCard>
			<SectionCard title="Availability">
				<div className="space-y-4">
					{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
						<div
							key={day}
							className="flex items-center justify-between rounded-xl border p-4"
						>
							<span className="font-medium">{day}</span>
							<span className="text-sm text-green-600">Available</span>
						</div>
					))}
				</div>
			</SectionCard>

			<SectionCard title="Subjects">
				<div className="flex flex-wrap gap-3">
					{[
						"Computer Science",
						"Programming",
						"Mathematics",
						"Algorithms",
						"Web Development",
					].map((subject) => (
						<button
							key={subject}
							className="rounded-full border px-4 py-2 text-sm hover:border-indigo-400"
						>
							{subject}
						</button>
					))}
				</div>
			</SectionCard>
			<SectionCard title="Session History">
				<div className="space-y-4">
					{[
						"Programming · Maya Hassan",
						"Algorithms · Karim Ali",
						"Web Development · Nour Ahmad",
					].map((session) => (
						<div key={session} className="rounded-xl border p-4">
							<p className="font-medium">{session}</p>
							<p className="mt-1 text-sm text-slate-500">
								Completed · August 2026
							</p>
						</div>
					))}
				</div>
			</SectionCard>

			<SectionCard title="Tutor Profile">
				<div className="space-y-5">
					<input
						className="w-full rounded-xl border px-4 py-3"
						placeholder="Full name"
					/>
					<textarea
						className="min-h-32 w-full rounded-xl border px-4 py-3"
						placeholder="Tell students about yourself..."
					/>
					<input
						className="w-full rounded-xl border px-4 py-3"
						placeholder="Hourly rate"
					/>
					<button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">
						Save Changes
					</button>
				</div>
			</SectionCard>
			<div>
				<PageHeader eyebrow="Tutor" title="Your courses" />
				<PlaceholderBlock
					label="Courses you teach + subject/topic management"
					height="h-56"
				/>
			</div>
		</div>
	)
}
// STUDENT DASHBOARD
type StudentHistoryItem = {
	id: string
	type: 'session' | 'project'
	title: string
	subtitle: string
	date: string
	status: 'Completed' | 'Upcoming' | 'In progress'
	meta?: string
}
 
const studentMockHistory: StudentHistoryItem[] = [
	{ id: '1', type: 'session', title: 'Mechanics & Kinematics', subtitle: 'Physics with Mariam Haidar', date: '2026-08-04', status: 'Upcoming' },
	{ id: '2', type: 'project', title: 'Path to Computer Engineering', subtitle: 'Planr roadmap · 5 courses', date: '2026-07-22', status: 'In progress', meta: '62% ready' },
	{ id: '3', type: 'session', title: 'Organic Chemistry basics', subtitle: 'Chemistry with Karim Fakhoury', date: '2026-07-14', status: 'Completed' },
	{ id: '4', type: 'session', title: 'Python fundamentals', subtitle: 'Computer Science with Rana Debs', date: '2026-06-30', status: 'Completed' },
	{ id: '5', type: 'project', title: 'Path to Data Science', subtitle: 'Planr roadmap · 4 courses', date: '2026-06-15', status: 'Completed', meta: '100% ready' },
	{ id: '6', type: 'session', title: 'Calculus: integration by parts', subtitle: 'Mathematics with Mariam Haidar', date: '2026-06-02', status: 'Completed' },
]
 
const studentStatusStyle: Record<StudentHistoryItem['status'], string> = {
	Completed: 'bg-[#1B4D3E]/15 text-[#1B4D3E]',
	Upcoming: 'bg-[#dbeafe] text-[#1d4ed8]',
	'In progress': 'bg-[#1B4D3E]/8 text-[#1B4D3E]/70',
}
 
function formatStudentDate(iso: string) {
	return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
 
function StudentDashboard() {
	const sessionsCompleted = studentMockHistory.filter(
		(h) => h.type === 'session' && h.status === 'Completed',
	).length
	const activeProjects = studentMockHistory.filter(
		(h) => h.type === 'project' && h.status === 'In progress',
	).length
	const upcoming = studentMockHistory.filter((h) => h.status === 'Upcoming').length
 
	return (
		<div className="min-h-screen bg-[#FAF7F2] pb-20">
			{/* Header */}
			<div className="bg-[#1B4D3E] py-10 px-4 sm:px-6">
				<div className="max-w-4xl mx-auto">
					<div className="mb-6">
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
						>
							<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 hover:bg-white/20">
								←
							</span>
							Back to home
						</Link>
					</div>
					<p className="font-mono text-[#7ABF00] text-xs tracking-[0.2em] uppercase mb-3">
						Student dashboard
					</p>
					<h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-2">
						Your learning, in one place
					</h1>
					<p className="text-white/60 text-sm max-w-md">
						Track your sessions and roadmaps, and sharpen your skills with a practice test.
					</p>
				</div>
			</div>
 
			<div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
				{/* Summary stats */}
				<div className="grid grid-cols-3 gap-4 mb-8">
					{[
						{ value: String(sessionsCompleted), label: 'Sessions completed' },
						{ value: String(activeProjects), label: 'Active Planr roadmaps' },
						{ value: String(upcoming), label: 'Upcoming sessions' },
					].map((s) => (
						<div key={s.label} className="bg-white rounded-2xl p-4 border border-[#1B4D3E]/5">
							<p className="font-display text-2xl font-semibold text-[#1B4D3E]">{s.value}</p>
							<p className="text-xs text-[#1B4D3E]/50 mt-1">{s.label}</p>
						</div>
					))}
				</div>
 
				{/* Practice CTA - links to a real /practice route instead of
				    toggling local component state, since this project uses
				    real routes rather than the prototype's fake page-switching. */}
				<Link
					href="/practice"
					className="block w-full rounded-3xl p-6 sm:p-7 mb-10 relative overflow-hidden text-left hover:-translate-y-0.5 transition-transform duration-200"
					style={{ background: 'linear-gradient(135deg, #1B4D3E 0%, #245C4B 100%)' }}
				>
					<div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
					<div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
						<div>
							<p className="font-mono text-[#7ABF00] text-xs tracking-widest uppercase mb-2">
								AI-powered
							</p>
							<p className="text-white font-display text-xl font-semibold mb-1">
								Take a practice test
							</p>
							<p className="text-white/55 text-sm">
								10 questions, any subject, instant personalised feedback.
							</p>
						</div>
						<span className="shrink-0 bg-[#1B4D3E] text-white font-semibold px-6 py-3 rounded-full whitespace-nowrap">
							Start practicing →
						</span>
					</div>
				</Link>
 
				{/* History */}
				<div className="flex items-center justify-between mb-5">
					<h2 className="font-display text-xl font-semibold text-[#1B4D3E]">History</h2>
					<p className="text-xs text-[#1B4D3E]/40">Sessions and Planr roadmaps, combined</p>
				</div>
 
				<div className="space-y-3">
					{studentMockHistory
						.slice()
						.sort((a, b) => b.date.localeCompare(a.date))
						.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-2xl p-5 border border-[#1B4D3E]/5 flex items-center gap-4"
							>
								<div
									className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${
										item.type === 'session' ? 'bg-[#1B4D3E]/15' : 'bg-[#F0EBE3]'
									}`}
								>
									{item.type === 'session' ? '🎓' : '🗺️'}
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-[#1B4D3E] truncate">{item.title}</p>
									<p className="text-sm text-[#1B4D3E]/50 truncate">{item.subtitle}</p>
								</div>
								<div className="text-right shrink-0">
									<p className="text-xs text-[#1B4D3E]/40 mb-1.5">
										{formatStudentDate(item.date)}
									</p>
									<div className="flex items-center gap-2 justify-end">
										{item.meta && (
											<span className="text-xs font-mono text-[#1B4D3E]/50">{item.meta}</span>
										)}
										<span
											className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${studentStatusStyle[item.status]}`}
										>
											{item.status}
										</span>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	)
}
// ADMIN DASHBOARD
function AdminDashboard() {
	return (
		<div>
			<h1 className="text-3xl font-bold">Admin Dashboard</h1>
			<p className="mt-2 text-slate-500">Coming soon.</p>
		</div>
	)
}

export default function DashboardPage() {
	// Starts as null so we can tell "haven't checked yet" apart
	// from "checked, and there's no role" (e.g. not logged in).
	const [role, setRole] = useState<string | null>(null)

	// useEffect runs only in the browser, after the first render —
	// this is required because localStorage doesn't exist during
	// server-side rendering in Next.js.
	useEffect(() => {
		setRole(localStorage.getItem('role'))
	}, [])

	if (role === null) {
		return <p className="p-8 text-slate-500">Loading...</p>
	}

	if (role === 'tutor') return <TutorDashboard />
	if (role === 'student') return <StudentDashboard />
	if (role === 'admin') return <AdminDashboard />

	// Fallback: if role is some unexpected value (or the user
	// never logged in), show a clear message instead of silently
	// rendering the wrong dashboard.
	return (
		<p className="p-8 text-red-600">
			No valid role found. Please log in again.
		</p>
	)
}