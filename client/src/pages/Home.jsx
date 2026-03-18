import ShortenForm from '../components/ShortenForm';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container" style={{ paddingTop:64, paddingBottom:80 }}>
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <h1 style={{ fontSize:48, fontWeight:600, marginBottom:16 }}>
          make long 67,000 character links into cute bebes
        </h1>
        <p style={{ fontSize:17, color:'var(--text2)', maxWidth:480, margin:'0 auto' }}>
          have u ever had a link that is so long that it makes you hate your chungus life? fear no more. baby url is here to take those scawy links and make them into cute bebes.
        </p>
      </div>
      <ShortenForm />
      <div style={{ textAlign:'center', marginTop:24 }}>
        <Link to="/dashboard">
            <button className="btn-ghost">view all ur baby urls →</button>
        </Link>
</div>
    </div>
  );
}