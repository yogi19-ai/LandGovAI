import React, { useState } from 'react';
import { UserRole } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Views
import { NationalDashboard } from './components/views/NationalDashboard';
import { DigitalRepository } from './components/views/DigitalRepository';
import { AISearchView } from './components/views/AISearchView';
import { GISExplorer } from './components/views/GISExplorer';
import { AnalyticsView } from './components/views/AnalyticsView';
import { PolicySimulatorView } from './components/views/PolicySimulatorView';
import { DatasetCatalogue } from './components/views/DatasetCatalogue';
import { AIResearchToolkitView } from './components/views/AIResearchToolkitView';
import { WorkspacesView } from './components/views/WorkspacesView';
import { InnovationPortal } from './components/views/InnovationPortal';
import { ReportsView } from './components/views/ReportsView';
import { UserManagementView } from './components/views/UserManagementView';
import { APIIntegrationView } from './components/views/APIIntegrationView';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('PUBLIC_USER');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <NationalDashboard onNavigate={setActiveView} />;
      case 'repository':
        return <DigitalRepository currentRole={currentRole} onNavigate={setActiveView} />;
      case 'search':
        return <AISearchView onNavigate={setActiveView} />;
      case 'gis':
        return <GISExplorer onNavigate={setActiveView} />;
      case 'analytics':
        return <AnalyticsView onNavigate={setActiveView} />;
      case 'simulation':
        return <PolicySimulatorView />;
      case 'datasets':
        return <DatasetCatalogue />;
      case 'ai-toolkit':
        return <AIResearchToolkitView />;
      case 'workspaces':
        return <WorkspacesView currentRole={currentRole} onNavigate={setActiveView} />;
      case 'innovation':
        return <InnovationPortal currentRole={currentRole} onNavigate={setActiveView} />;
      case 'reports':
        return <ReportsView />;
      case 'user-management':
        return <UserManagementView currentRole={currentRole} onRoleChange={setCurrentRole} />;
      case 'api-docs':
        return <APIIntegrationView />;
      default:
        return <NationalDashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <Header 
        currentRole={currentRole} 
        onRoleChange={setCurrentRole} 
        activeView={activeView}
        onNavigate={setActiveView}
      />

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar 
          activeView={activeView} 
          onNavigate={setActiveView} 
          currentRole={currentRole}
        />

        {/* Main View Container */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderView()}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
