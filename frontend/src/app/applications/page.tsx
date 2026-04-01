'use client';

import { useState, useEffect } from 'react';
import { Application } from '@/lib/types';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApplicationForm } from '@/components/applications/ApplicationForm';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.applications.getAll();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleCreate = async (data: any) => {
    try {
      console.log('Creating application with data:', data);
      await api.applications.create(data as Application);
      showToast('Application created successfully', 'success');
      setIsDialogOpen(false);
      loadApplications();
    } catch (error) {
      console.error('Create error:', error);
      showToast('Failed to create application', 'error');
    }
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (data: any) => {
    if (!editingApp?.id) return;
    try {
      await api.applications.update(editingApp.id, data);
      showToast('Application updated successfully', 'success');
      setIsDialogOpen(false);
      setEditingApp(undefined);
      loadApplications();
    } catch (error) {
      showToast('Failed to update application', 'error');
    }
  };

  const handleDelete = async (app: Application) => {
    if (!confirm(`Are you sure you want to delete "${app.Application}"?`)) return;
    try {
      await api.applications.delete(app.id!);
      showToast('Application deleted successfully', 'success');
      loadApplications();
    } catch (error) {
      showToast('Failed to delete application', 'error');
    }
  };

  const openAddDialog = () => {
    setEditingApp(undefined);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-navy-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-800">Applications</h1>
          <p className="text-slate-600 mt-1">
            Manage your application portfolio ({applications.length} total)
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-navy-500 hover:bg-navy-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-navy-700 sticky left-0 bg-slate-50 z-10">Application</TableHead>
                <TableHead className="font-semibold text-navy-700">Program</TableHead>
                <TableHead className="font-semibold text-navy-700">Owner</TableHead>
                <TableHead className="font-semibold text-navy-700">Contact</TableHead>
                <TableHead className="font-semibold text-navy-700 text-right">Users</TableHead>
                <TableHead className="font-semibold text-navy-700">Tech Stack</TableHead>
                <TableHead className="font-semibold text-navy-700">Purpose</TableHead>
                <TableHead className="font-semibold text-navy-700">Public</TableHead>
                <TableHead className="font-semibold text-navy-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-navy-700 sticky left-0 bg-white group-hover:bg-slate-50 z-10 min-w-[220px] max-w-[220px]">
                    <div className="truncate" title={app.Application}>
                      {app.Application}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[140px] max-w-[140px]">
                    <div className="truncate" title={app['Program Name']}>
                      {app['Program Name']}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[120px] max-w-[120px]">
                    <div className="truncate" title={app['Product Owner'] || 'N/A'}>
                      {app['Product Owner'] || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[140px] max-w-[140px]">
                    <div className="truncate" title={app['Product Contact'] || 'N/A'}>
                      {app['Product Contact'] || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right min-w-[80px]">
                    {app['Number of Users']?.toLocaleString() || 'N/A'}
                  </TableCell>
                  <TableCell className="min-w-[180px] max-w-[180px]">
                    <div className="truncate" title={app['Technology Stack']}>
                      {app['Technology Stack'] || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[200px] max-w-[200px]">
                    <div className="truncate" title={app.Purpose}>
                      {app.Purpose || 'Not documented'}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[80px]">
                    <Badge variant={app['Public Access?'] === 'Yes' ? 'default' : 'secondary'}>
                      {app['Public Access?'] === 'Yes' ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[100px] text-right">
                    <div className="flex gap-1 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(app)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(app)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy-800">
              {editingApp ? 'Edit Application' : 'Add New Application'}
            </DialogTitle>
          </DialogHeader>
          <ApplicationForm
            application={editingApp}
            onSubmit={editingApp ? handleUpdate : handleCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
