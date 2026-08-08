import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Search, FileText, Download, Trash2, AlertCircle, Calendar, User } from 'lucide-react';
import api from '../api/axios';

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete Dialog State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports');
      // Sort newest first
      const sortedReports = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReports(sortedReports);
      setError(null);
    } catch (err) {
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/reports/${deleteId}`);
      setReports(reports.filter(r => r._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete report. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = (id) => {
    navigate(`/report/${id}`, { state: { autoDownload: true } });
  };

  const filteredReports = reports.filter(report => {
    const searchLower = searchTerm.toLowerCase();
    const diseaseMatch = report.predictedDisease?.toLowerCase().includes(searchLower);
    const nameMatch = report.patientName?.toLowerCase().includes(searchLower);
    return diseaseMatch || nameMatch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary-600" />
            Report History
          </h1>
          <p className="text-slate-600 mt-2">View and manage your past AI-generated diagnostic reports.</p>
        </div>
        <Link to="/predict" className="btn-primary">
          New Prediction
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete Report?</h3>
            <p className="text-center text-slate-600 mb-6">
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)} 
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card mb-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by patient name or disease..."
          />
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No reports found</h3>
            <p className="text-slate-500 mt-1">
              {searchTerm ? "We couldn't find any reports matching your search." : "You haven't generated any diagnostic reports yet."}
            </p>
            {!searchTerm && (
              <Link to="/predict" className="text-primary-600 font-medium hover:underline mt-4 inline-block">
                Create your first report &rarr;
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="pb-3 pt-2 font-semibold text-slate-600">Patient</th>
                  <th className="pb-3 pt-2 font-semibold text-slate-600">Diagnosis</th>
                  <th className="pb-3 pt-2 font-semibold text-slate-600">Date</th>
                  <th className="pb-3 pt-2 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{report.patientName}</p>
                          <p className="text-xs text-slate-500">{report.age}y • {report.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.predictedDisease || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(report.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/report/${report._id}`}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <FileText className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => handleDownload(report._id)}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => setDeleteId(report._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
