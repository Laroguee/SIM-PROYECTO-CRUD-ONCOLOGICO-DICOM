import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, XCircle } from 'lucide-react';
import api from '../../services/api';

const AgendaList = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCitas = async () => {
    try {
      const response = await api.get('/citas');
      setCitas(response.data);
    } catch (error) {
      console.error('Error fetching citas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      try {
        await api.delete(`/citas/${id}`);
        fetchCitas();
      } catch (error) {
        console.error('Error al cancelar cita:', error);
        alert('Hubo un error al cancelar la cita.');
      }
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Programada': return 'bg-blue-100 text-blue-700';
      case 'Completada': return 'bg-emerald-100 text-emerald-700';
      case 'Cancelada': return 'bg-red-100 text-red-700';
      case 'Ausente': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agenda de Citas</h2>
          <p className="text-slate-500 text-sm">Gestiona la programación de los pacientes oncológicos.</p>
        </div>
        <Link 
          to="/agenda/nueva" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Agendar Cita
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Cargando citas...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b">
                <th className="py-3 px-4 font-semibold rounded-tl-lg">Fecha y Hora</th>
                <th className="py-3 px-4 font-semibold">Paciente</th>
                <th className="py-3 px-4 font-semibold">Médico Asignado</th>
                <th className="py-3 px-4 font-semibold">Tipo de Cita</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    No hay citas programadas.
                  </td>
                </tr>
              ) : (
                citas.map((cita) => {
                  const fecha = new Date(cita.fecha_hora).toLocaleString('es-ES', { 
                    dateStyle: 'short', timeStyle: 'short' 
                  });
                  return (
                    <tr key={cita.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">{fecha}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {cita.paciente_nombres} {cita.paciente_apellidos}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        Dr. {cita.prof_apellidos} <br/>
                        <span className="text-xs text-slate-400">{cita.especialidad}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{cita.tipo_cita}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                        {cita.estado !== 'Cancelada' && (
                          <>
                            <Link 
                              to={`/agenda/editar/${cita.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </Link>
                            <button 
                              onClick={() => handleCancel(cita.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Cancelar Cita"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
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

export default AgendaList;
