import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

import '../css/Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, signup, response } = useAuth()

  const handleLogin = async (e) => {
    login(email, password)
  }
  const handleRegister= async (e) => {
    signup(email, password)
  }


  const { socialLogin, _signInAnonymously } = useAuth()
  
  return (
    <div className='container flex-col-center-start mt-2'>
      <div className="flex-col-center-start w-40">
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
          className='input'
        />
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
          className='input mt-1'
        />
        <button onClick={handleLogin} className='btn-purple mt-2'>Log In</button>
        <button onClick={handleRegister} className='btn-orange mt-2'>Register</button>
        {response.error && <p className='mt-2'>{response.error}</p>}
      </div>

      <div className="divider flex-row-center-between w-40 m-2-0">
        <div className="line"></div>
        <div className="circle"></div>
        <div className="line"></div>
      </div>

      <button className='btn-blue w-40 mt-1' onClick={() => socialLogin('google.com')}>Log In with Google</button>
      <button className='btn w-40 mt-1' onClick={() => _signInAnonymously()}>Log In Anonymously</button>
    </div>
  )
}

