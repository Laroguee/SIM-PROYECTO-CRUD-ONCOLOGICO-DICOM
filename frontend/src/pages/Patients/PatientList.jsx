import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      try {
        await api.delete(`/patients/${id}`);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Hubo un error al eliminar el paciente.');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Directorio de Pacientes</h2>
          <p className="text-slate-500 text-sm">Gestiona los expedientes oncológicos registrados en el sistema.</p>
        </div>
        <Link 
          to="/pacientes/nuevo" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nuevo Paciente
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Cargando pacientes...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b">
                <th className="py-3 px-4 font-semibold rounded-tl-lg">ID FHIR</th>
                <th className="py-3 px-4 font-semibold">Documento</th>
                <th className="py-3 px-4 font-semibold">Nombres</th>
                <th className="py-3 px-4 font-semibold">Género</th>
                <th className="py-3 px-4 font-semibold">Nacimiento</th>
                <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    No hay pacientes registrados. ¡Agrega uno nuevo!
                  </td>
                </tr>
              ) : (
                patients.map((patient) => {
                  // Mapear desde el formato FHIR
                  const identifier = patient.identifier?.[0]?.value || 'N/A';
                  const family = patient.name?.[0]?.family || '';
                  const given = patient.name?.[0]?.given?.join(' ') || '';
                  const fullName = `${given} ${family}`;
                  
                  return (
                    <tr key={patient.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-500 font-mono" title={patient.id}>
                        {patient.id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{identifier}</td>
                      <td className="py-3 px-4 text-slate-700">{fullName}</td>
                      <td className="py-3 px-4 text-slate-500 capitalize">{patient.gender}</td>
                      <td className="py-3 px-4 text-slate-500">{patient.birthDate}</td>
                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                        <Link 
                          to={`/pacientes/${patient.id}`}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Ver Expediente Médico"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </Link>
                        <Link 
                          to={`/pacientes/editar/${patient.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(patient.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;
