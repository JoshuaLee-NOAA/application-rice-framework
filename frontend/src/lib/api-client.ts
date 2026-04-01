import { Application, RICEResult } from './types';

const API_BASE = '/api';

export const api = {
  // Applications
  applications: {
    async getAll(): Promise<Application[]> {
      const res = await fetch(`${API_BASE}/applications`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      return res.json();
    },

    async getOne(id: string): Promise<Application> {
      const res = await fetch(`${API_BASE}/applications/${id}`);
      if (!res.ok) throw new Error('Failed to fetch application');
      return res.json();
    },

    async create(data: Application): Promise<Application> {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create application');
      return res.json();
    },

    async update(id: string, data: Partial<Application>): Promise<Application> {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update application');
      return res.json();
    },

    async delete(id: string): Promise<void> {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete application');
    },
  },

  // Analysis
  analysis: {
    async run(): Promise<{ results: RICEResult[]; summary: any }> {
      const res = await fetch(`${API_BASE}/analysis`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to run analysis');
      return res.json();
    },

    async getLatest(): Promise<{ results: RICEResult[]; summary: any }> {
      const res = await fetch(`${API_BASE}/analysis`);
      if (!res.ok) throw new Error('No analysis results found');
      return res.json();
    },
  },
};
