import { useState } from 'react';
import { urls } from '../utils/api';

export default function ShortenForm({ onSuccess}) {
    const [bigUrl, setBigUrl] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents default form behavior
        setError('');
        setLoading(true);

        try {
            const { data } = await urls.create({ bigUrl });
            setResult(data);
            setBigUrl('');
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
            <form onSubmit={handleSubmit} style={{ display:'flex', gap:8 }}>
                <input
                    type="url"
                    placeholder="enter big url..."
                    value={bigUrl}
                    onChange={(e) => setBigUrl(e.target.value)}
                    required
                />
                <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? 'bebe being made...' : 'create bebe'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
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