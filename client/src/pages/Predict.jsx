import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Stethoscope, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Predict = () => {
  const navigate = useNavigate();

  // Form State
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // Symptoms State
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI State
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await api.get('/symptoms');
        setAllSymptoms(res.data.data || []);
      } catch {
        toast.error('Failed to load symptoms. Please refresh.');
        setError('Failed to load symptoms. Please try again.');
      } finally {
        setLoadingSymptoms(false);
      }
    };
    fetchSymptoms();
  }, []);

  const handleCheckboxChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleClearAll = () => {
    setSelectedSymptoms([]);
  };

  const filteredSymptoms = allSymptoms.filter(symptom => 
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSymptom = (symptom) => {
    return symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedSymptoms.length < 2) {
      toast.error('Select at least two symptoms');
      setError('Please select at least two symptoms for an accurate prediction.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/predict', {
        patientName,
        age: Number(age),
        gender,
        symptoms: selectedSymptoms
      });

      // Redirect to the report detail page
      toast.success('Prediction generated successfully!');
      navigate(`/report/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate prediction.');
      setError(err.response?.data?.error || 'Failed to generate prediction.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-primary-600" />
          New Disease Prediction
        </h1>
        <p className="text-slate-600 mt-2">Enter patient details and select symptoms to generate an AI-powered diagnostic report.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Patient Details Section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Patient Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="number" 
                  min="1" 
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-field"
                  placeholder="30"
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input-field"
                  required
                  disabled={isSubmitting}
                >
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Symptoms Section */}
          <section>
            <div className="flex justify-between items-end border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Symptoms</h2>
              <div className="text-sm">
                <span className="font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded-md">
                  {selectedSymptoms.length} selected
                </span>
                <span className="text-slate-500 ml-2">(min 2)</span>
              </div>
            </div>
            
            {loadingSymptoms ? (
              <div className="flex items-center text-slate-500 py-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading symptoms database...
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Search and Clear All Box */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Search symptoms..."
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={isSubmitting || selectedSymptoms.length === 0}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </button>
                </div>

                {/* Checkbox Grid */}
                <div className="h-[400px] overflow-y-auto border border-slate-200 rounded-md p-4 bg-slate-50">
                  {filteredSymptoms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredSymptoms.map((symptom) => (
                        <label 
                          key={symptom} 
                          className="flex items-start gap-3 p-2 rounded hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSymptoms.includes(symptom)}
                            onChange={() => handleCheckboxChange(symptom)}
                            disabled={isSubmitting}
                            className="mt-1 h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-slate-700 select-none">
                            {formatSymptom(symptom)}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>No matching symptoms found.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </section>

          {/* Actions */}
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="btn-primary w-full md:w-auto px-8 py-3 text-lg flex items-center justify-center gap-2"
              disabled={isSubmitting || loadingSymptoms}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Predict;
