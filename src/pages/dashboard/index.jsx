import React from 'react';
import { Link } from 'react-router';

function Dashboard() {
  return (
    <div className="page-content">
      <h1>Dashboard</h1>

      <Link to="/login">Login</Link>
    </div>
  );
}

export default Dashboard;
