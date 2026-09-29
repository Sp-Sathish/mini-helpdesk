import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BrandMark from './BrandMark'

function navClass({ isActive }) {
  return `app-nav-link${isActive ? ' is-active' : ''}`
}

export default function Navbar() {
  const { user, ready, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="app-nav">
      <div className="app-nav-inner">
        <Link className="brand" to={user ? '/tickets' : '/login'}>
          <BrandMark />
          <span>Mini Helpdesk</span>
        </Link>
        {ready && (
          <nav className="app-nav-links" aria-label="Main">
            {user ? (
              <>
                <NavLink className={navClass} to="/tickets">
                  My Tickets
                </NavLink>
                {user.role === 'ADMIN' && (
                  <NavLink className={navClass} to="/admin">
                    Admin
                  </NavLink>
                )}
                <span className="app-nav-user d-none d-sm-inline">{user.fullName}</span>
                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className={navClass} to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-primary btn-sm" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
