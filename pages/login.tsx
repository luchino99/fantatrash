import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignup) {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) {
        alert(signUpError.message)
        setLoading(false)
        return
      }

      const userId = data.user?.id
      if (userId) {
        const { error: insertError } = await supabase.from('users').insert({
          id: userId,
          username,
        })
        if (insertError) {
          alert(insertError.message)
          setLoading(false)
          return
        }
        router.push('/select-coppie')
      }
    } else {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) {
        alert(loginError.message)
        setLoading(false)
        return
      }

      const userId = data.user?.id
      if (!userId) return

      const { data: userData, error } = await supabase
        .from('users')
        .select('selected')
        .eq('id', userId)
        .single()

      if (error || !userData) {
        alert('Utente non trovato nel database')
        setLoading(false)
        return
      }

      router.push(userData.selected ? '/dashboard' : '/select-coppie')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">{isSignup ? 'Registrati' : 'Accedi'}</h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? 'Attendere...' : isSignup ? 'Registrati' : 'Accedi'}
        </button>

        <p className="text-center text-sm text-gray-500">
          {isSignup ? 'Hai già un account?' : 'Non hai un account?'}{' '}
          <button type="button" className="text-blue-600 underline" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Accedi' : 'Registrati'}
          </button>
        </p>
      </form>
    </div>
  )
}
