import React, { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { INITIAL_LEADS } from '@/data/sampleData';
import { StudentLead } from '@/types/models';
import { 
  Search, 
  Download, 
  Eye, 
  Phone, 
  Mail, 
  GraduationCap, 
  User, 
  Flame,
  ArrowUpDown
} from 'lucide-react';

export const LeadManagementPage: React.FC = () => {
  const [leads, setLeads] = useState<StudentLead[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [temperatureFilter, setTemperatureFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<StudentLead | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and search logic
  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.interestedCourse.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      const matchesTemp = temperatureFilter === 'ALL' || lead.leadTemperature === temperatureFilter;
      return matchesSearch && matchesStatus && matchesTemp;
    })
    .sort((a, b) => {
      const comp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortAsc ? -comp : comp;
    });

  const handleUpdateStatus = (leadId: string, newStatus: StudentLead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  return (
    <AdminLayout
      title="Student Lead Management"
      subtitle="Track, qualify, and assign student admissions inquiries generated through the AI counsellor."
      actions={
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" /> Export Leads
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Search & Filter Toolbar */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by student name, phone, or interested course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="w-40">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 text-xs"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Counselled">Counselled</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Application Sent">Application Sent</option>
                  <option value="Enrolled">Enrolled</option>
                </Select>
              </div>

              <div className="w-36">
                <Select
                  value={temperatureFilter}
                  onChange={(e) => setTemperatureFilter(e.target.value)}
                  className="h-9 text-xs"
                >
                  <option value="ALL">All Heat</option>
                  <option value="Hot">Hot Lead 🔥</option>
                  <option value="Warm">Warm Lead ⚡</option>
                  <option value="Cold">Cold Lead ❄️</option>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortAsc(!sortAsc)}
                className="h-9 text-xs gap-1.5 border-slate-200"
                title="Sort by Date"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{sortAsc ? 'Oldest' : 'Newest'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Qualification</th>
                    <th className="py-3 px-4">Interested Course</th>
                    <th className="py-3 px-4">Heat</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {lead.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{lead.id}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{lead.phone}</div>
                        <div className="text-[10px] text-slate-400">{lead.email}</div>
                      </td>
                      <td className="py-3 px-4">{lead.qualification}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{lead.interestedCourse}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.leadTemperature === 'Hot'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : lead.leadTemperature === 'Warm'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          <Flame className="w-3 h-3" /> {lead.leadTemperature}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          lead.status === 'Qualified'
                            ? 'bg-emerald-50 text-emerald-700'
                            : lead.status === 'Enrolled'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{lead.assignedCounsellor}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">{lead.createdAt}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLead(lead)}
                          className="h-7 text-xs px-2.5 gap-1 text-slate-700 hover:text-primary"
                        >
                          <Eye className="w-3 h-3" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                        No leads match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Showing 1-{filteredLeads.length} of {leads.length} leads</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Detail Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead ? `Lead Profile: ${selectedLead.name}` : ''}
        description={selectedLead ? `ID: ${selectedLead.id} &bull; Created ${selectedLead.createdAt}` : ''}
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setSelectedLead(null)}>
              Close
            </Button>
            <Button size="sm" className="gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Call Student
            </Button>
          </>
        }
      >
        {selectedLead && (
          <div className="space-y-4 text-xs">
            {/* Lead Status & Temperature Bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Current Stage</span>
                <span className="font-bold text-slate-900 text-sm">{selectedLead.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Change Status:</span>
                <Select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value as StudentLead['status'])}
                  className="h-8 text-xs w-36 bg-white"
                >
                  <option value="New">New</option>
                  <option value="Counselled">Counselled</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Application Sent">Application Sent</option>
                  <option value="Enrolled">Enrolled</option>
                </Select>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 border rounded-lg bg-white space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </span>
                <p className="font-semibold text-slate-800">{selectedLead.phone}</p>
              </div>
              <div className="p-3 border rounded-lg bg-white space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </span>
                <p className="font-semibold text-slate-800">{selectedLead.email}</p>
              </div>
              <div className="p-3 border rounded-lg bg-white space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Academic Score
                </span>
                <p className="font-semibold text-slate-800">{selectedLead.qualification}</p>
              </div>
              <div className="p-3 border rounded-lg bg-white space-y-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3" /> Assigned Counsellor
                </span>
                <p className="font-semibold text-slate-800">{selectedLead.assignedCounsellor}</p>
              </div>
            </div>

            {/* Preferences */}
            <div className="p-3 border rounded-lg bg-white space-y-2">
              <span className="font-semibold text-slate-800 block">Student Aspirations</span>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Interested Program</span>
                  <p className="font-medium">{selectedLead.interestedCourse}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Preferred Destinations</span>
                  <p className="font-medium">{selectedLead.preferredCountry || 'India'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Estimated Annual Budget</span>
                  <p className="font-medium">{selectedLead.budget || 'Standard Fee Range'}</p>
                </div>
              </div>
            </div>

            {/* Counsellor Notes */}
            <div className="p-3 border rounded-lg bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-800 block">AI & Academic Notes</span>
              <p className="text-slate-600 leading-relaxed">{selectedLead.notes}</p>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};
