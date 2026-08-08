import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader2, Download, AlertTriangle, ArrowLeft, Stethoscope, Clock, User, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import api from '../api/axios';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const autoDownloadTriggered = useRef(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        setReport(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError({ type: 'not_found', message: 'The requested medical report could not be found.' });
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError({ type: 'unauthorized', message: 'You are not authorized to view this report.' });
        } else {
          setError({ type: 'server_error', message: 'An error occurred while retrieving the report.' });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (report && !loading && location.state?.autoDownload && !autoDownloadTriggered.current) {
      autoDownloadTriggered.current = true;
      setTimeout(() => {
        handleDownloadPDF();
      }, 500);
    }
  }, [report, loading, location.state]);

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const element = reportRef.current;
    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right
      filename:     `${report.patientName.replace(/\s+/g, '_')}_Medical_Report.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    }).catch((err) => {
      console.error("PDF generation error:", err);
      setIsDownloading(false);
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Retrieving medical records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {error.type === 'not_found' ? 'Report Not Found' : 
           error.type === 'unauthorized' ? 'Access Denied' : 'Server Error'}
        </h1>
        <p className="text-slate-600 mb-8">{error.message}</p>
        <Link to="/reports" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Link to="/reports" className="text-slate-500 hover:text-primary-600 font-medium flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-4 w-4" /> All Reports
        </Link>
        <button 
          onClick={handleDownloadPDF} 
          disabled={isDownloading}
          className="btn-primary flex items-center gap-2"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
        </button>
      </div>

      {/* Printable Report Container */}
      <div 
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        ref={reportRef}
      >
        {/* Hospital Style Header */}
        <div className="bg-slate-900 text-white p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-[8px] border-primary-500">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="bg-white text-primary-600 p-2 rounded-lg">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">HealthAI Diagnostics</h1>
              <p className="text-slate-400 text-sm">Automated Disease Prediction Report</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-sm">
            <p className="text-slate-300">Report ID: <span className="font-mono text-white">{report._id.slice(-8).toUpperCase()}</span></p>
            <p className="text-slate-300 flex items-center gap-1 sm:justify-end mt-1">
              <Clock className="h-3 w-3" /> {formatDate(report.createdAt)}
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          {/* Patient Info Section */}
          <section className="mb-10">
            <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-4">
              <User className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Patient Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Patient Name</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{report.patientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Age</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{report.age} Years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Gender</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{report.gender}</p>
              </div>
            </div>
          </section>

          {/* Diagnosis Section */}
          <section className="mb-10">
            <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-4">
              <FileText className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Diagnostic Analysis</h2>
            </div>
            
            <div className="bg-primary-50 border border-primary-100 p-6 rounded-lg mb-6">
              <h3 className="text-sm font-bold text-primary-700 uppercase tracking-wide mb-1">Primary Prediction</h3>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 text-primary-900">
                {report.predictedDisease || 'Unknown'}
              </p>
              
              <div className="mt-4 pt-4 border-t border-primary-200/50">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Description</h4>
                <p className="text-slate-700 leading-relaxed">
                  {report.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Reported Symptoms */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">Reported Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {report.symptoms.map(s => (
                  <span key={s} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-sm font-medium">
                    {s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Recommendations Section */}
          <section>
            <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-4">
              <Stethoscope className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Recommendations & Care</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Precautions */}
              <div className="bg-orange-50 border border-orange-100 p-5 rounded-lg">
                <h3 className="text-orange-800 font-bold mb-3 flex items-center gap-2">
                  Precautions
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-orange-900/80">
                  {report.precautions && report.precautions.length > 0 ? (
                    report.precautions.map((item, i) => <li key={i}>{item}</li>)
                  ) : (
                    <li className="italic text-sm">No specific precautions listed.</li>
                  )}
                </ul>
              </div>

              {/* Medications */}
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg">
                <h3 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
                  Medications
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-900/80">
                  {report.medications && report.medications.length > 0 ? (
                    report.medications.map((item, i) => <li key={i}>{item}</li>)
                  ) : (
                    <li className="italic text-sm">No specific medications listed.</li>
                  )}
                </ul>
              </div>

              {/* Diet */}
              <div className="bg-green-50 border border-green-100 p-5 rounded-lg">
                <h3 className="text-green-800 font-bold mb-3 flex items-center gap-2">
                  Recommended Diet
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-green-900/80">
                  {report.diets && report.diets.length > 0 ? (
                    report.diets.map((item, i) => <li key={i}>{item}</li>)
                  ) : (
                    <li className="italic text-sm">No specific diet listed.</li>
                  )}
                </ul>
              </div>

              {/* Workout / Lifestyle */}
              <div className="bg-purple-50 border border-purple-100 p-5 rounded-lg">
                <h3 className="text-purple-800 font-bold mb-3 flex items-center gap-2">
                  Workout & Lifestyle
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-purple-900/80">
                  {report.workouts && report.workouts.length > 0 ? (
                    report.workouts.map((item, i) => <li key={i}>{item}</li>)
                  ) : (
                    <li className="italic text-sm">No specific workout listed.</li>
                  )}
                </ul>
              </div>

            </div>
          </section>

          {/* Footer Disclaimer */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            <p><strong>Disclaimer:</strong> This report is generated by an AI prediction model based on provided symptoms. It is not a definitive medical diagnosis. Please consult a certified healthcare professional before making any medical decisions.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
