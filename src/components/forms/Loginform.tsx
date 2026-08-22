'use client'
// This must be a Client Component because we use React hooks (useState)
// and browser-only APIs (localStorage, useRouter) which don't work on the server.

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// STEP 1: Define the TYPES first
// This tells TypeScript exactly what shape our form data has.

// The actual values the user types into the form
type LoginValues = {
	username: string
	password: string
}

// The possible validation error messages for each field.
type LoginErrors = Partial<Record<keyof LoginValues, string>>

// STEP 2: Initialization
// We define a constant "empty" version of the form values.
// This is used both when the component first loads AND when we reset the form

const emptyValues: LoginValues = { username: '', password: '' }

// This is our FAKE / STATIC "database".
// The assignment specifically asks for static credentials with NO real
// backend, NO NextAuth, and NO database — just hardcoded username/password
// pairs, each one linked to a role (student, tutor, or admin).
// In a real app, this check would happen on a server with a real database.
const USERS: Record<string, { password: string; role: string }> = {
	test: { password: '1234', role: 'student' },
	tutor1: { password: '1234', role: 'tutor' },
	admin: { password: 'tutorly-admin', role: 'admin' },
}

// STEP 3: Validation logic, kept in its OWN function
function validate(values: LoginValues): LoginErrors {
	const errors: LoginErrors = {}

	if (!values.username.trim()) {
		errors.username = 'Username is required.'
	}

	if (!values.password) {
		errors.password = 'Password is required.'
	}

	return errors
}

export default function LoginForm() {
	// "values" holds what the user has typed so far in the form
	const [values, setValues] = useState<LoginValues>(emptyValues)

	// "errors" holds any validation messages to show under each field
	const [errors, setErrors] = useState<LoginErrors>({})

	// Next.js router, used to redirect the user to /dashboard after a
	// successful login
	const router = useRouter()

	// Runs every time the user types in an input field.
	function handleChange(field: keyof LoginValues, value: string) {
		setValues((prev) => ({ ...prev, [field]: value }))

		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }))
		}
	}
	// Runs when the form is submitted.
	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const nextErrors = validate(values)
		setErrors(nextErrors)
		if (Object.keys(nextErrors).length > 0) return

		const user = USERS[values.username]
		if (!user || user.password !== values.password) {
			setErrors({ password: 'Invalid username or password.' })
			return
		}

		// This is a SIMULATION only — no real authentication, no API call,
		// no database. We are just storing the result of our fake check
		// in the browser's localStorage so the /dashboard page can read it.
		localStorage.setItem('username', values.username)
		localStorage.setItem('role', user.role)

		router.push('/dashboard')
	}

	// Clears the form back to its empty state (used by the Cancel button)
	function handleReset() {
		setValues(emptyValues)
		setErrors({})
	}
	return (
		// Card wrapper: matches the rounded-2xl / border / shadow style
		// already used for the "Planr" card on the landing page, so the
		// login form feels like part of the same design system instead
		// of a plain unstyled HTML form.
		<form
			onSubmit={handleSubmit}
			noValidate
			className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-border bg-white p-8 shadow-sm"
		>
			<div className="flex flex-col gap-1.5">
				<label htmlFor="username" className="text-sm font-medium text-fg">
					Username
				</label>
				<input
					id="username"
					name="username"
					type="text"
					value={values.username}
					onChange={(e) => handleChange('username', e.target.value)}
					className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-fg outline-none transition-colors focus:border-forest"
				/>
				{errors.username && (
					<p className="text-xs text-red-600">{errors.username}</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="password" className="text-sm font-medium text-fg">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					value={values.password}
					onChange={(e) => handleChange('password', e.target.value)}
					className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-fg outline-none transition-colors focus:border-forest"
				/>
				{errors.password && (
					<p className="text-xs text-red-600">{errors.password}</p>
				)}
			</div>

			{/* Buttons use the same rounded-full pill shape as the rest of
			    the site's primary/secondary buttons (see "Browse all tutors"
			    on the landing page) instead of default unstyled <button>s. */}
			<div className="mt-2 flex items-center gap-3">
				<button
					type="submit"
					className="flex-1 rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
				>
					Login
				</button>
				<button
					type="reset"
					onClick={handleReset}
					className="flex-1 rounded-full border border-forest px-6 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
				>
					Cancel
				</button>
			</div>
		</form>
	)
	
}