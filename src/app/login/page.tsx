// app/login/page.tsx  →  /login
//
// Thin wrapper around the reusable LoginForm component.

import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}