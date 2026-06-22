'use client';

import { Settings as SettingsIcon, Bell, Shield, Users, Save } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your enterprise account and preferences.</p>
        </div>

        <div className="vy-card divide-y divide-slate-100">
          {/* Profile Section */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-indigo-500" /> Account Profile
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input type="text" defaultValue="Infrastructure Admin" className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input type="email" defaultValue="admin@vyomai.ai" disabled className="w-full h-11 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-emerald-500" /> Notification Preferences
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Critical Hardware Alerts (Email)', checked: true },
                { label: 'Critical Hardware Alerts (SMS)', checked: true },
                { label: 'Weekly Performance Summaries', checked: false },
                { label: 'New AI Model Deployments', checked: true },
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                    {item.checked && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security Section */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-orange-500" /> Security
            </h2>
            <p className="text-sm text-slate-500 mb-4">Update your password or configure Two-Factor Authentication (2FA).</p>
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => alert('Password reset email sent to your registered address.')}>Change Password</Button>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 gap-2" onClick={() => alert('Settings saved successfully!')}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// CheckCircle icon for the checkboxes
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
