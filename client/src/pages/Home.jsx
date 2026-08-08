import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, BrainCircuit, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/50 border border-primary-500/30 text-primary-300 text-sm font-medium mb-8">
            <Activity className="h-4 w-4" /> Powering Healthcare with AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Predict Disease with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">
              Machine Learning
            </span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            MediPredict analyzes over 130 symptoms using advanced AI models to provide instant, highly accurate diagnostic predictions and medical recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2 group">
              Start Free Prediction 
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/about" className="px-8 py-4 text-lg font-medium text-white border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center">
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Machine Learning Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <BrainCircuit className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Intelligence Meets Healthcare
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Our platform utilizes a highly trained Support Vector Machine (SVM) algorithm, hosted on a lightning-fast Python FastAPI microservice. It analyzes 132 unique clinical symptoms to accurately detect 41 different diseases.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                By cross-referencing your inputs against a vast dataset of medical profiles, MediPredict doesn't just guess your illness—it provides actionable precautions, recommended medications, and tailored diets.
              </p>
              <ul className="space-y-3 font-medium text-slate-700">
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary-500"></span> 95%+ Prediction Accuracy</li>
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary-500"></span> Sub-second Inference Times</li>
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary-500"></span> Complete Privacy & Data Encryption</li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <h3 className="font-bold text-slate-800">Prediction Engine Demo</h3>
                  <span className="text-xs font-mono text-green-500 bg-green-50 px-2 py-1 rounded">API Online</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded text-sm text-slate-500 font-mono">
                    <span className="text-blue-600">POST</span> /api/predict
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto shadow-inner">
                    <pre>
{`{
  "symptoms": ["skin_rash", "high_fever"],
  "model": "SVM_Classifier",
  "result": {
    "disease": "Fungal infection",
    "confidence": 0.96
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Designed for speed, accuracy, and ease of use.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Comprehensive Analysis</h3>
            <p className="text-slate-600 leading-relaxed">
              Select from over 130 symptoms using our intuitive checkbox interface to generate a highly detailed medical diagnostic profile.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Instant PDF Reports</h3>
            <p className="text-slate-600 leading-relaxed">
              Every prediction automatically generates a professional, hospital-style medical report that can be downloaded as a PDF directly from your browser.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
            <p className="text-slate-600 leading-relaxed">
              Your health data is encrypted and protected via JWT authentication. Only you can access or delete your generated medical history.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 px-4 sm:px-6 lg:px-8 text-center mt-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to check your symptoms?</h2>
        <Link to="/register" className="inline-block bg-white text-primary-600 font-bold text-lg px-8 py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-lg">
          Create an Account
        </Link>
      </section>

    </div>
  );
};

export default Home;
