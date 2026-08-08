import React from 'react';
import { Database, Server, Code2, Brain } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">About MediPredict</h1>
        <p className="text-xl text-slate-600">A modern microservices architecture built for healthcare.</p>
      </div>

      <div className="prose prose-slate prose-lg max-w-none mb-16">
        <p>
          MediPredict is an advanced, AI-driven disease prediction system designed to provide instant medical insights based on clinical symptoms. The project bridges the gap between state-of-the-art machine learning models and robust, scalable web technologies.
        </p>
        <p>
          Instead of relying on a monolithic architecture, this project was intentionally built using a decoupled microservices approach, ensuring maximum performance, security, and scalability.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-2">Technology Stack</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* React Frontend */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">React Frontend</h3>
          </div>
          <p className="text-slate-600">
            The user interface is powered by React and Vite, utilizing Tailwind CSS for a modern, highly responsive design. State management is handled natively via React Context API, and Axios intercepts API requests for seamless JWT authentication handling.
          </p>
        </div>

        {/* Express Backend */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Server className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Express Node.js</h3>
          </div>
          <p className="text-slate-600">
            A robust Node.js and Express.js REST API serves as the central API Gateway. It enforces the MVC architecture, handles user authentication, encrypts passwords with bcrypt, and proxies verified requests over to the isolated Python ML service.
          </p>
        </div>

        {/* Python ML Service */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">FastAPI & SVM</h3>
          </div>
          <p className="text-slate-600">
            The core intelligence of the application lives in an isolated Python FastAPI microservice. It loads a pre-trained Support Vector Machine (SVM) algorithm via scikit-learn, achieving high accuracy in predicting diseases across 132 dimensions of symptom data.
          </p>
        </div>

        {/* MongoDB Database */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">MongoDB</h3>
          </div>
          <p className="text-slate-600">
            All user profiles and generated reports are securely persisted in MongoDB. Using Mongoose, we enforce strict schemas, lifecycle hooks, and cascading deletions to ensure data integrity across the entire application ecosystem.
          </p>
        </div>

      </div>

    </div>
  );
};

export default About;
