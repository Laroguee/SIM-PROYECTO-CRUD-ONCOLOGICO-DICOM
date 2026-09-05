import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Activity, FileText, Pill } from 'lucide-react';
import api from '../../services/api';

import DiagnosticosTab from './Tabs/DiagnosticosTab';
import TumorEstadiajeTab from './Tabs/TumorEstadiajeTab';
import QuimioterapiaTab from './Tabs/QuimioterapiaTab';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('diagnosticos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get('/patients');
        const found = response.data.find(p => p.id === id);
        setPatient(found);
      } catch (err) {
        console.error('Error fetching patient:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando expediente...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Paciente no encontrado.</div>;

  const fullName = `${patient.name?.[0]?.given?.join(' ')} ${patient.name?.[0]?.family}`;
  const identifier = patient.identifier?.[0]?.value || 'N/A';

  const tabs = [
    { id: 'diagnosticos', label: 'Diagnósticos (CIE-O)', icon: FileText },
    { id: 'tumor', label: 'Tumor y Estadiaje', icon: Activity },
    { id: 'quimio', label: 'Quimioterapia', icon: Pill },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header del Expediente */}
      <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/pacientes" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{fullName}</h1>
            <p className="text-slate-500 text-sm">DUI: {identifier} • Género: {patient.gender} • Nacimiento: {patient.birthDate}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">ID FHIR</div>
          <div className="text-sm font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-md">{patient.id}</div>
        </div>
      </div>

      {/* Navegación de Pestañas */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${
                  isActive 
                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenido de las Pestañas */}
        <div className="p-6 min-h-[400px]">
          {activeTab === 'diagnosticos' && <DiagnosticosTab pacienteId={id} />}
          {activeTab === 'tumor' && <TumorEstadiajeTab pacienteId={id} />}
          {activeTab === 'quimio' && <QuimioterapiaTab pacienteId={id} />}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
