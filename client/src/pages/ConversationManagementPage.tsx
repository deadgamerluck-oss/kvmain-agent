import React, { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { INITIAL_CONVERSATIONS } from '@/data/sampleData';
import { ConversationRecord } from '@/types/models';
import { 
  Search, 
  MessageSquare, 
  Headphones, 
  Eye, 
  Sparkles
} from 'lucide-react';

export const ConversationManagementPage: React.FC = () => {
  const [conversations] = useState<ConversationRecord[]>(INITIAL_CONVERSATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [selectedConv, setSelectedConv] = useState<ConversationRecord | null>(null);

  const filtered = conversations.filter((c) => {
    const matchesSearch = 
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = modeFilter === 'ALL' || c.mode === modeFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <AdminLayout
      title="Student Conversation Transcripts"
      subtitle="Audit AI counselling logs, review summaries, and monitor sentiment across chat and voice interactions."
      actions={
        <Badge variant="outline" className="text-xs">
          {conversations.length} Sample Sessions Logged
        </Badge>
      }
    >
      <div className="space-y-4">
        {/* Filter Controls */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search conversations by student name, ID, or key topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="ALL">All Interaction Modes</option>
                <option value="chat">Text Chat</option>
                <option value="voice">Voice Session</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Conversation List Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Session ID</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">AI Summary Preview</th>
                    <th className="py-3 px-4 text-right">Transcript</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((conv) => (
                    <tr key={conv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">{conv.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{conv.studentName}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-medium capitalize">
                          {conv.mode === 'voice' ? (
                            <Headphones className="w-3.5 h-3.5 text-secondary" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-primary" />
                          )}
                          {conv.mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 uppercase text-[11px] font-semibold text-slate-600">
                        {conv.language}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{conv.date}</td>
                      <td className="py-3 px-4 text-slate-500">{conv.duration}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                          conv.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {conv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={conv.summary}>
                        {conv.summary}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedConv(conv)}
                          className="h-7 text-xs px-2.5 gap-1 text-slate-700 hover:text-primary"
                        >
                          <Eye className="w-3 h-3" /> View Transcript
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                        No conversations matched your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcript Detail Modal */}
      <Modal
        isOpen={!!selectedConv}
        onClose={() => setSelectedConv(null)}
        title={selectedConv ? `Session Log: ${selectedConv.id} (${selectedConv.studentName})` : ''}
        description={selectedConv ? `${selectedConv.mode.toUpperCase()} session conducted on ${selectedConv.date} &bull; Duration: ${selectedConv.duration}` : ''}
        maxWidth="lg"
        footer={
          <Button size="sm" onClick={() => setSelectedConv(null)}>
            Done Reading
          </Button>
        }
      >
        {selectedConv && (
          <div className="space-y-4 text-xs">
            {/* AI Summary Highlight Box */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
              <span className="font-semibold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Generated Summary & Insights
              </span>
              <p className="text-indigo-950 leading-relaxed">{selectedConv.summary}</p>
            </div>

            {/* Transcript Messages Flow */}
            <div className="space-y-3 pt-2 max-h-96 overflow-y-auto pr-1">
              <span className="font-semibold text-slate-700 block">Full Verbatim Transcript:</span>
              {selectedConv.transcript.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border ${
                    msg.speaker === 'ai'
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-primary-50/40 border-primary-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-[11px] mb-1">
                    <span className={msg.speaker === 'ai' ? 'text-primary' : 'text-slate-800'}>
                      {msg.speaker === 'ai' ? 'AI Counsellor' : selectedConv.studentName}
                    </span>
                    <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};
