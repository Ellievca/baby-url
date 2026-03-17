import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents default form behavior
        setError('');
        setLoading(true);

        try {
            const { data } = await auth.login(email, password);
            login(data.token, data.user);
            navigate('/dashboard'); // successful login
        }
        catch (err) {
            setError(err.response?.data?.error || 'Login failed.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth:420, paddingTop:80 }}>
            <h1 style={{ fontSize:28, fontWeight:600, marginBottom:8 }}>welcome back!</h1>
            <p style={{ color:'var(--text2)', marginBottom:32 }}>log in to manage your baby urls~</p>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                    <label>email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
                <div>
                    <label>password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log in'}
                </button>
                </form>
            </div>

            <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text2)' }}>
                no account? <Link to="/register">click here to register</Link>
            </p>
        </div>
    );
}