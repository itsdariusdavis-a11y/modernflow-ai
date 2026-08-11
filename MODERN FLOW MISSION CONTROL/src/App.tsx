import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/context/AuthContext';
import { load } from '@/lib/store';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import LogToday from '@/pages/LogToday';
import Standup from '@/pages/Standup';
import Pipeline from '@/pages/Pipeline';
import WeeklyReview from '@/pages/WeeklyReview';
import UnitEconomics from '@/pages/UnitEconomics';

export default function App() {
  const { person } = useAuth();

  useEffect(() => {
    if (person) void load();
  }, [person]);

  if (!person) return <Login />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<LogToday />} />
        <Route path="/standup" element={<Standup />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/review" element={<WeeklyReview />} />
        <Route path="/econ" element={<UnitEconomics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
