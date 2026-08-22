// This is the ROUTE file (app/login/page.tsx).
// It stays intentionally minimal — its only job is to define the page
// layout (title + wrapper) and render the LoginForm component.
// All the actual form logic (state, validation, submit handling)
// lives inside components/LoginForm.tsx, kept separate so this route
// file doesn't get cluttered with unrelated logic.

import LoginForm from '@/components/forms/Loginform'

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
    </div>
  )
}