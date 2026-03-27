/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DevSecOps } from './pages/DevSecOps';
import { LogsAnalytics } from './pages/LogsAnalytics';
import { DDoSPreventor } from './pages/DDoSPreventor';
import { Settings } from './pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'devsecops' && <DevSecOps />}
      {activeTab === 'ddos' && <DDoSPreventor />}
      {activeTab === 'analytics' && <LogsAnalytics />}
      {activeTab === 'settings' && <Settings />}
    </Layout>
  );
}
