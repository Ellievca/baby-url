import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { urls } from '../utils/api';
import ShortenForm from '../components/ShortenForm';
import UrlTable from '../components/UrlTable';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [urlList, setUrlList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (!user) { navigate('/login'); return; } // if no user, redirect to login
    urls.list()
        .then(r => setUrlList(r.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, [user, navigate]);

    const handleNewUrl = (newUrl) => {
        setUrlList((prevList) => [newUrl, ...prevList]);
    };

    const handleDeleteUrl = (code) => {
        // filter out deleted url from list 
        setUrlList((prevList) => prevList.filter((url) => url.babyCode !== code));
    };

    const handleViewAnalytics = (code) => {
        console.log(code);
    };

    return (
    <div className="container" style={{ paddingTop:40, paddingBottom:80 }}>
        <h1 style={{ fontSize:26, fontWeight:600, marginBottom:4 }}>your baby urls</h1>
        <p style={{ color:'var(--text2)', fontSize:14, marginBottom:28 }}>{user?.email}</p>

        <ShortenForm onSuccess={handleNewUrl} />

        <div className="card" style={{ marginTop:24 }}>
            {loading
                ? <p style={{ color:'var(--text3)' }}>loading...</p>
                : <UrlTable data={urlList} onDelete={handleDeleteUrl} onViewAnalytics={handleViewAnalytics} />
            }
        </div>
    </div>
);
}