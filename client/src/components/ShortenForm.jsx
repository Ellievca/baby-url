import { useState } from 'react';
import { urls } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ShortenForm({ onSuccess}) {
    // state variables
    const [bigUrl, setBigUrl] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [expireAt, setExpireAt] = useState('');
    const [alias, setAlias] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents default form behavior
        setError('');
        setLoading(true);

        try {
            const { data } = await urls.create({ bigUrl, expiresAt: expireAt, alias });
            setResult(data);
            setBigUrl('');
            setAlias('');
            if (onSuccess) onSuccess(data);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Link shortening failed.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
    <div className="card">
        <form onSubmit={handleSubmit}>
            <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
                <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:4 }}>
                    <label style={{ fontSize:11, color:'var(--text3)' }}>big url</label>
                    <input
                        type="url"
                        placeholder="enter big url..."
                        value={bigUrl}
                        onChange={(e) => setBigUrl(e.target.value)}
                        required
                    />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <label style={{ fontSize:11, color:'var(--text3)' }}>expiration date (optional)</label>
                    <input
                        type="date"
                        value={expireAt}
                        onChange={(e) => setExpireAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                        style={{ width:'auto' }}
                    />
                </div>
                {user && (
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                        <label style={{ fontSize:11, color:'var(--text3)' }}>custom alias (optional)</label>
                        <input
                            type="text"
                            placeholder="my-cool-link"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                            style={{ width:'auto' }}
                        />
                    </div>
                )}
                <button className="btn-primary" type="submit" disabled={loading} style={{ alignSelf:'flex-end' }}>
                    {loading ? 'bebe being made...' : 'create bebe'}
                </button>
            </div>
        </form>

        {error && <p style={{ color:'red' }}>{error}</p>}
        {result && (
            <div style={{ marginTop:14, padding:'12px 16px', background:'var(--accent-dim)', borderRadius:'var(--radius)' }}>
                <p style={{ fontSize:12, color:'var(--text2)', marginBottom:4 }}>ur baby url is ready!</p>
                <a href={`http://localhost:5001/${result.babyCode}`} target="_blank" rel="noopener noreferrer">
                    http://localhost:5001/{result.babyCode}
                </a>
            </div>
        )}
    </div>
)
}