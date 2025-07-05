import { useEffect } from 'react';

function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard';
  }, []);
  return (
    <div className="page-content">
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
