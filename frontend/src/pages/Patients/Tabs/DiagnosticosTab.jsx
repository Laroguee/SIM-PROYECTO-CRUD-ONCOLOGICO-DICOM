import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const DiagnosticosTab = ({ pacienteId }) => {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [icdoCatalog, setIcdoCatalog] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    icdo_id: '',
    profesional_id: '',
    fecha_diagnostico: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  const fetchData = async () => {
    try {
      const [diagRes, icdoRes, profRes] = await Promise.all([
        api.get(`/diagnosticos/paciente/${pacienteId}`),
        api.get('/icdo'),
        api.get('/profesionales')
      ]);
      setDiagnosticos(diagRes.data);
      setIcdoCatalog(icdoRes.data);
      setProfesionales(profRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pacienteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/diagnosticos', { ...formData, paciente_id: pacienteId });
      setShowForm(false);
      setFormData({ ...formData, icdo_id: '', observaciones: '' });
      fetchData();
    } catch (err) {
      alert('Error al guardar diagnóstico');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Eliminar diagnóstico?')) {
      try {
        await api.delete(`/diagnosticos/${id}`);
        fetchData();
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  if (loading) return <div>Cargando diagnósticos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Historial de Diagnósticos</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Añadir Diagnóstico'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg border mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Catálogo ICD-O-3</label>
            <select required className="w-full p-2 border rounded" value={formData.icdo_id} onChange={e => setFormData({...formData, icdo_id: e.target.value})}>
              <option value="">Seleccione...</option>
              {icdoCatalog.map(item => (
                <option key={item.id} value={item.id}>{item.codigo} - {item.descripcion}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Médico Responsable</label>
            <select required className="w-full p-2 border rounded" value={formData.profesional_id} onChange={e => setFormData({...formData, profesional_id: e.target.value})}>
              <option value="">Seleccione...</option>
              {profesionales.map(p => <option key={p.id} value={p.id}>Dr. {p.nombres} {p.apellidos}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input type="date" required className="w-full p-2 border rounded" value={formData.fecha_diagnostico} onChange={e => setFormData({...formData, fecha_diagnostico: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea className="w-full p-2 border rounded" rows="2" value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})}></textarea>
          </div>
          <div className="col-span-2 text-right">
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded font-medium">Guardar Diagnóstico</button>
          </div>
        </form>
      )}

      {diagnosticos.length === 0 ? (
        <p className="text-slate-500 text-center py-4">No hay diagnósticos registrados.</p>
      ) : (
        <div className="space-y-4">
          {diagnosticos.map(d => (
            <div key={d.id} className="border p-4 rounded-lg flex justify-between items-start hover:border-emerald-200 transition-colors">
              <div>
                <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-sm">{d.codigo}</span>
                  {d.icdo_desc}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Diagnosticado el: {new Date(d.fecha_diagnostico).toLocaleDateString()} por Dr. {d.prof_nombres} {d.prof_apellidos}
                </div>
                {d.observaciones && <p className="mt-2 text-slate-700 text-sm bg-slate-50 p-2 rounded">{d.observaciones}</p>}
              </div>
              <button onClick={() => handleDelete(d.id)} className="text-red-500 text-sm hover:underline">Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosticosTab;
