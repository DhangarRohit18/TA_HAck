/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DevSecOps } from './pages/DevSecOps';
import { ThreatIntelligence } from './pages/ThreatIntelligence';
import { Infrastructure } from './pages/Infrastructure';
import { AIIntelligence } from './pages/AIIntelligence';
import { LogsAnalytics } from './pages/LogsAnalytics';
import { Settings } from './pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'devsecops' && <DevSecOps />}
      {activeTab === 'threats' && <ThreatIntelligence />}
      {activeTab === 'infra' && <Infrastructure />}
      {activeTab === 'ai' && <AIIntelligence />}
      {activeTab === 'analytics' && <LogsAnalytics />}
      {activeTab === 'settings' && <Settings />}
    </Layout>
  );
}
