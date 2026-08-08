import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Activity, FileText, PlusCircle, ArrowRight, Clock, User, ClipboardList } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports');
        // Sort newest first
        const sortedReports = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReports(sortedReports);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFirstName = (name) => {
    return name ? name.split(' ')[0] : 'User';
  };

  const latestReport = reports.length > 0 ? reports[0] : null;
  const recentReports = reports.slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Activity className="h-10 w-10 text-primary-600 animate-pulse mb-4" />
        <p className="text-slate-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {getFirstName(user?.name)}! 👋
        </h1>
        <p className="text-slate-600 mt-2">Here is an overview of your recent diagnostic predictions.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        /* Empty State */
        <div className="card text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 mb-6">
            <ClipboardList className="h-10 w-10 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Predictions Yet</h2>
          <p className="text-slate-600 max-w-md mx-auto mb-8">
            You haven't generated any medical reports yet. Start by creating your first AI-powered disease prediction.
          </p>
          <Link 
            to="/predict" 
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-lg"
          >
            <PlusCircle className="h-5 w-5" />
            Create First Prediction
          </Link>
        </div>
      ) : (
        /* Dashboard Content */
        <div className="space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="card flex items-center p-6 border-l-4 border-l-primary-500">
              <div className="bg-primary-100 p-4 rounded-full mr-6">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Reports</p>
                <p className="text-3xl font-bold text-slate-900">{reports.length}</p>
              </div>
            </div>

            <div className="card flex items-center p-6 border-l-4 border-l-blue-500">
              <div className="bg-blue-100 p-4 rounded-full mr-6">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Latest Prediction</p>
                <p className="text-xl font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[300px]">
                  {latestReport?.predictedDisease || 'Unknown'}
                </p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Quick Actions (Sidebar) */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">Quick Actions</h2>
              
              <Link 
                to="/predict" 
                className="flex items-center justify-between p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-md shadow-primary-200 group"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="h-6 w-6" />
                  <span className="font-semibold text-lg">New Prediction</span>
                </div>
                <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link 
                to="/reports" 
                className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl transition-colors shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-slate-500" />
                  <span className="font-semibold text-lg">View All Reports</span>
                </div>
                <ArrowRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>

            {/* Recent Reports List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
                <h2 className="text-lg font-bold text-slate-800">Recent Reports</h2>
                {reports.length > 5 && (
                  <Link to="/reports" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {recentReports.map(report => (
                  <div key={report._id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 p-2.5 rounded-lg text-slate-500 hidden sm:block">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-0.5">{report.patientName}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-3">
                          <span>{report.age}y • {report.gender}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(report.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {report.predictedDisease || 'Unknown'}
                      </span>
                      
                      <Link 
                        to={`/report/${report._id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 border border-primary-200 hover:bg-primary-50 px-3 py-1.5 rounded transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
