import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default function LoggaInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Laddar...</div>}>
      <LoginForm />
    </Suspense>
  )
}
