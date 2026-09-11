import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tr');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1013', color: '#fff' }}>
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
    </div>
  );
}
