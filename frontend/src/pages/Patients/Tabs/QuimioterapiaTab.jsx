import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const QuimioterapiaTab = ({ pacienteId }) => {
  const [quimios, setQuimios] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    diagnostico_id: '',
    profesional_id: '',
    numero_ciclo: 1,
    regimen: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'Programado'
  });

  const fetchData = async () => {
    try {
      const [qRes, dRes, pRes] = await Promise.all([
        api.get(`/quimioterapias/paciente/${pacienteId}`),
        api.get(`/diagnosticos/paciente/${pacienteId}`),
        api.get('/profesionales')
      ]);
      setQuimios(qRes.data);
      setDiagnosticos(dRes.data);
      setProfesionales(pRes.data);
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
      await api.post('/quimioterapias', { ...formData, paciente_id: pacienteId });
      setShowForm(false);
      fetchData();
    } catch (err) { alert('Error al guardar ciclo'); }
  };

  const markAsCompleted = async (q) => {
    try {
      await api.put(`/quimioterapias/${q.id}`, { ...q, estado: 'Completado' });
      fetchData();
    } catch (err) { alert('Error al actualizar'); }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Plan de Quimioterapia</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
          disabled={diagnosticos.length === 0}
        >
          {showForm ? 'Cancelar' : 'Programar Ciclo'}
        </button>
      </div>

      {diagnosticos.length === 0 && (
        <div className="mb-4 text-sm text-orange-600 bg-orange-50 p-3 rounded">
          Debe agregar un diagnóstico primero para poder programar quimioterapias.
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg border mb-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Diagnóstico Asociado</label>
            <select required className="w-full p-2 border rounded" value={formData.diagnostico_id} onChange={e => setFormData({...formData, diagnostico_id: e.target.value})}>
              <option value="">Seleccione...</option>
              {diagnosticos.map(d => <option key={d.id} value={d.id}>{d.icdo_desc}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Médico Prescriptor</label>
            <select required className="w-full p-2 border rounded" value={formData.profesional_id} onChange={e => setFormData({...formData, profesional_id: e.target.value})}>
              <option value="">Seleccione...</option>
              {profesionales.map(p => <option key={p.id} value={p.id}>Dr. {p.nombres}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número de Ciclo</label>
            <input type="number" min="1" required className="w-full p-2 border rounded" value={formData.numero_ciclo} onChange={e => setFormData({...formData, numero_ciclo: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Régimen (Medicamentos y Dosis)</label>
            <input type="text" required placeholder="Ej: FOLFOX, CHOP" className="w-full p-2 border rounded" value={formData.regimen} onChange={e => setFormData({...formData, regimen: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
            <input type="date" required className="w-full p-2 border rounded" value={formData.fecha_inicio} onChange={e => setFormData({...formData, fecha_inicio: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Fin (Aprox)</label>
            <input type="date" required className="w-full p-2 border rounded" value={formData.fecha_fin} onChange={e => setFormData({...formData, fecha_fin: e.target.value})} />
          </div>
          <div className="col-span-2 text-right">
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded font-medium">Programar</button>
          </div>
        </form>
      )}

      {quimios.length === 0 ? (
        <p className="text-slate-500 text-center py-4">No hay ciclos programados.</p>
      ) : (
        <div className="space-y-4">
          {quimios.map(q => (
            <div key={q.id} className="border p-4 rounded-lg flex justify-between items-center bg-white">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-slate-200 px-2 py-0.5 rounded text-xs">Ciclo {q.numero_ciclo}</span>
                  {q.regimen}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {new Date(q.fecha_inicio).toLocaleDateString()} a {new Date(q.fecha_fin).toLocaleDateString()}
                </div>
                <div className="text-xs text-slate-400 mt-1">Para: {q.icdo_desc}</div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${q.estado === 'Completado' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {q.estado}
                </span>
                {q.estado !== 'Completado' && (
                  <button onClick={() => markAsCompleted(q)} className="text-xs text-emerald-600 hover:underline">Marcar Completado</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuimioterapiaTab;
