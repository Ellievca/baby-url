import { urls } from '../utils/api';

export default function UrlTable({ data, onDelete, onViewAnalytics }) {
    const handleDelete = async (code) => {
        if(!confirm('delete this baby url? this cant be undone!')) return;

        try {
            await urls.remove(code);
            onDelete(code);
        }
        catch (err) {
            alert(err.response?.data?.error || 'delete failed');
        }
    };

    if(!data.length) {
        return <p style={{ color:'var(--text3)', textAlign:'center', padding:'32px 0' }}>no baby urls yet!</p>;
    }

    return (
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr style={{ borderBottom:'1px solid var(--border)' }}>
          <th style={{ textAlign:'left', padding:'10px 12px', fontSize:12, color:'var(--text3)' }}>baby url</th>
          <th style={{ textAlign:'left', padding:'10px 12px', fontSize:12, color:'var(--text3)' }}>big url</th>
          <th style={{ textAlign:'left', padding:'10px 12px', fontSize:12, color:'var(--text3)' }}>clicks</th>
          <th style={{ textAlign:'left', padding:'10px 12px', fontSize:12, color:'var(--text3)' }}>actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(url => (
          <tr key={url.babyCode} style={{ borderBottom:'1px solid var(--border)' }}>
            <td style={{ padding:'12px' }}>
                <a 
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/${url.babyCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color:'var(--accent)', fontFamily:'monospace', fontSize:13 }}
                >
                    {import.meta.env.VITE_API_URL || 'http://localhost:5001'}/{url.babyCode}
                </a>
            </td>
            <td style={{ padding:'12px', fontSize:13, color:'var(--text2)' }}>{url.bigUrl}</td>
            <td style={{ padding:'12px' }}>{url.clickCount}</td>
            <td style={{ display:'flex', gap:6, padding:'8px 0' }}>
                <button className="btn-ghost btn-sm" onClick={() => onViewAnalytics(url.babyCode)}>
                    stats
                </button>
                <button className="btn-ghost btn-sm" onClick={() => handleDelete(url.babyCode)}>
                    delete
                </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}