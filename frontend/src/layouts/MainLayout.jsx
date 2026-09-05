import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity } from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/', icon: LayoutDashboard },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b flex items-center gap-3 text-emerald-600">
          <Activity size={28} />
          <h1 className="text-xl font-bold tracking-tight">EHR Oncológico</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t text-xs text-slate-400 text-center">
          Dr. Carlos Mendoza <br/> Oncología Médica
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
