import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  PhoneCall, 
  FileSpreadsheet,
  Clock,
  ArrowRight
} from 'lucide-react';
import { INITIAL_LEADS } from '@/data/sampleData';

export const AdminDashboardPage: React.FC = () => {
  const recentActivities = [
    { title: 'New hot lead: Aarav Sharma', time: '12m ago', type: 'lead', desc: 'Inquired for B.Tech AI & Data Science' },
    { title: 'Callback requested: Priya Patel', time: '45m ago', type: 'call', desc: 'Scheduled with Vikram Mehta for 11:00 AM' },
    { title: 'Lead converted to Enrolled: Diya Rathore', time: '2h ago', type: 'enrolled', desc: 'BBA Digital Marketing batch assigned' },
    { title: 'Voice transcript processed: CONV-8802', time: '3h ago', type: 'conv', desc: 'Language: Hinglish, Sentiment: Positive' },
  ];

  return (
    <AdminLayout
      title="Admissions Performance Overview"
      subtitle="Real-time pulse of student inquiries, qualification rates, and counsellor interactions."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </Button>
          <Link to="/admin/leads">
            <Button size="sm" className="gap-1.5 text-xs shadow-sm">
              <Users className="w-3.5 h-3.5" /> View All Leads
            </Button>
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Student Leads"
            value="1,482"
            change="+14.2%"
            subtitle="vs last month"
            isPositive={true}
            icon={Users}
            iconColor="text-primary"
            iconBg="bg-primary-50"
          />
          <StatCard
            title="New Inquiries (Today)"
            value="34"
            change="+8 leads"
            subtitle="since 9 AM"
            isPositive={true}
            icon={UserPlus}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
          />
          <StatCard
            title="Qualified Leads"
            value="684"
            change="46.1%"
            subtitle="conversion rate"
            isPositive={true}
            icon={CheckCircle2}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Callback Requests"
            value="19"
            change="5 pending"
            subtitle="requires assignment"
            isPositive={false}
            icon={PhoneCall}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />
        </div>

        {/* Charts & Analytics Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Lead Trend Over Time */}
          <Card className="lg:col-span-8 shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Lead Generation Trend</CardTitle>
                <CardDescription className="text-xs">Weekly volume of AI counsellor interactions vs human handoffs</CardDescription>
              </div>
              <Badge variant="outline" className="text-[11px]">Last 7 Days</Badge>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Visual CSS-based Bar Chart Representation */}
              <div className="h-56 flex items-end justify-between gap-3 px-2 pt-6 pb-2 border-b border-slate-100">
                {[
                  { day: 'Mon', ai: 48, human: 18 },
                  { day: 'Tue', ai: 62, human: 24 },
                  { day: 'Wed', ai: 55, human: 20 },
                  { day: 'Thu', ai: 78, human: 32 },
                  { day: 'Fri', ai: 90, human: 38 },
                  { day: 'Sat', ai: 70, human: 26 },
                  { day: 'Sun', ai: 40, human: 14 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 max-w-[42px] h-full">
                      {/* AI Inquiries Bar */}
                      <div
                        className="w-1/2 bg-primary rounded-t-md hover:bg-primary-600 transition-all cursor-pointer relative group"
                        style={{ height: `${(item.ai / 90) * 100}%` }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap transition-opacity">
                          {item.ai} AI
                        </span>
                      </div>
                      {/* Human Transferred Bar */}
                      <div
                        className="w-1/2 bg-secondary-100 border border-secondary rounded-t-md hover:bg-secondary-200 transition-all cursor-pointer relative group"
                        style={{ height: `${(item.human / 90) * 100}%` }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap transition-opacity">
                          {item.human} Human
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{item.day}</span>
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-primary"></span> AI Chat/Voice Leads
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-secondary-100 border border-secondary"></span> Transferred to Dean
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Course Interest & Status Share */}
          <Card className="lg:col-span-4 shadow-sm border-slate-200 flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Program Interest Distribution</CardTitle>
              <CardDescription className="text-xs">Student stream preference breakdown</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                {[
                  { name: 'Engineering & AI', pct: 45, count: '667 leads', color: 'bg-primary' },
                  { name: 'Management & MBA', pct: 25, count: '370 leads', color: 'bg-secondary' },
                  { name: 'Design & Media', pct: 18, count: '266 leads', color: 'bg-indigo-400' },
                  { name: 'Biotech & Health', pct: 12, count: '179 leads', color: 'bg-teal-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <span className="text-slate-500">{item.pct}% ({item.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">Lead Stage Ratios</span>
                  <span className="text-emerald-600 font-bold">1,482 Total</span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full" style={{ width: '38%' }} title="Qualified 38%"></div>
                  <div className="bg-primary h-full" style={{ width: '32%' }} title="Counselled 32%"></div>
                  <div className="bg-amber-400 h-full" style={{ width: '18%' }} title="New 18%"></div>
                  <div className="bg-slate-300 h-full" style={{ width: '12%' }} title="Closed 12%"></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Qualified</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Counselled</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> In Review</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Recent Inquiries & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Student Leads Table Snippet */}
          <Card className="lg:col-span-8 shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Recent Student Admissions Stream</CardTitle>
                <CardDescription className="text-xs">Latest students interacting with the counsellor</CardDescription>
              </div>
              <Link to="/admin/leads">
                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                  Manage Leads <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Interested Course</th>
                      <th className="py-3 px-4">Temperature</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {INITIAL_LEADS.slice(0, 4).map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{lead.name}</div>
                          <div className="text-[11px] text-slate-400">{lead.phone}</div>
                        </td>
                        <td className="py-3 px-4">{lead.interestedCourse}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            lead.leadTemperature === 'Hot'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {lead.leadTemperature}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700">{lead.status}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link to="/admin/leads">
                            <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="lg:col-span-4 shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Live Activity Feed</CardTitle>
              <CardDescription className="text-xs">Real-time alerts and state changes</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{act.title}</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{act.desc}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
