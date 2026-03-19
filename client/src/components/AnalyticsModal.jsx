import { useEffect, useState } from 'react';
import { urls } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsModal({ code, onClose }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    
    useEffect(() => {
        urls.analytics(code)
            .then(r => setData(r.data))
            .catch(err => setError(err.response?.data?.error || 'Failure to load.'));
    }, [code]);

    return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div onClick={e => e.stopPropagation()} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:28, width:'100%', maxWidth:620 }}>
        
        {/* header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
            <h2 style={{ fontSize:18, fontWeight:600 }}>stats</h2>
            <span style={{ fontSize:13, color:'var(--accent)' }}>/{code}</span>
            </div>
            <button className="btn-ghost btn-sm" onClick={onClose}>✕ close</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        
        {!data && !error && <p style={{ color:'var(--text2)' }}>loading...</p>}

        {data && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 16px' }}>
                <div style={{ fontSize:28, fontWeight:600 }}>{data.totalClicks}</div>
                <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>total clicks</div>
            </div>
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 16px' }}>
                <div style={{ fontSize:18, fontWeight:600 }}>{new Date(data.createdAt).toLocaleDateString()}</div>
                <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>created</div>
            </div>
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 16px' }}>
                <div style={{ fontSize:18, fontWeight:600 }}>{data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : 'never'}</div>
                <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>expires</div>
            </div>
            {/* click chart */}
            <div style={{ marginTop:20 }}>
                <p style={{ fontSize:13, color:'var(--text2)', marginBottom:12 }}>clicks — last 14 days</p>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={(() => {
                        const result = [];
                        for (let i = 13; i >= 0; i--) {
                            const d = new Date();
                            d.setDate(d.getDate() - i);
                            const key = d.toISOString().slice(0, 10);
                            result.push({ date: key.slice(5), clicks: data.clicksByDay?.[key] || 0 });
                        }
                        return result;
                    })()} barSize={18}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize:11, fill:'var(--text3)' }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize:11, fill:'var(--text3)' }} axisLine={false} tickLine={false} width={28} />
                        <Tooltip
                            contentStyle={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8, fontSize:13 }}
                            cursor={{ fill:'rgba(124,106,247,0.08)' }}
                        />
                        <Bar dataKey="clicks" fill="#7c6af7" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
        )}

        </div>
    </div>
)};