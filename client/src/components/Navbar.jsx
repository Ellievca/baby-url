import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // navigates to home
    };

    return (
    <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 32px', borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
      <Link to="/" style={{ fontSize:20, fontWeight:600, color:'var(--text)', textDecoration:'none' }}>
        baby<span style={{ color:'var(--accent)' }}>url</span>
      </Link>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {user ? (
          <>
            <span style={{ fontSize:13, color:'var(--text2)' }}>{user.email}</span>
            <Link to="/dashboard"><button className="btn-ghost btn-sm">dashboard</button></Link>
            <button className="btn-ghost btn-sm" onClick={handleLogout}><label htmlFor=""></label>log out</button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn-ghost btn-sm">log in</button></Link>
            <Link to="/register"><button className="btn-primary btn-sm">register</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
