import React, { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { INITIAL_COURSES } from '@/data/sampleData';
import { Course } from '@/types/models';
import { 
  Plus, 
  Search, 
  Edit, 
  Check 
} from 'lucide-react';

export const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editCourseModal, setEditCourseModal] = useState<Course | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State for Editing/Adding
  const [formState, setFormState] = useState<Partial<Course>>({});

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleToggleActive = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const openEditModal = (course: Course) => {
    setEditCourseModal(course);
    setFormState({ ...course });
  };

  const handleSaveCourse = () => {
    if (!formState.name) return;

    if (editCourseModal) {
      // Edit existing
      setCourses((prev) =>
        prev.map((c) => (c.id === editCourseModal.id ? ({ ...c, ...formState } as Course) : c))
      );
      setEditCourseModal(null);
    } else {
      // Add new
      const newCourse: Course = {
        id: `CRS-${Date.now().toString().slice(-4)}`,
        name: formState.name || 'Untitled Course',
        code: formState.code || 'CRS-NEW',
        category: (formState.category as Course['category']) || 'Engineering & Technology',
        duration: formState.duration || '3 Years',
        fees: formState.fees || '₹1,50,000 / year',
        eligibility: formState.eligibility || '10+2 with 50%',
        isActive: true,
        careerOutcomes: formState.careerOutcomes || ['Graduate Associate'],
        description: formState.description || 'Comprehensive university degree curriculum.'
      };
      setCourses([newCourse, ...courses]);
      setIsNewModalOpen(false);
    }
    setFormState({});
  };

  return (
    <AdminLayout
      title="Course Catalogue Management"
      subtitle="Maintain program database, duration, fee slabs, and eligibility constraints queried by the AI counsellor."
      actions={
        <Button
          size="sm"
          onClick={() => {
            setFormState({
              category: 'Engineering & Technology',
              duration: '4 Years',
              isActive: true
            });
            setIsNewModalOpen(true);
          }}
          className="gap-1.5 text-xs shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add New Course
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
                placeholder="Search courses by degree title, code, or eligibility criteria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="w-full md:w-60">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="ALL">All Categories</option>
                <option value="Engineering & Technology">Engineering & Technology</option>
                <option value="Management & Business">Management & Business</option>
                <option value="Design & Media">Design & Media</option>
                <option value="Science & Humanities">Science & Humanities</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Course Name & Code</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Estimated Fees</th>
                    <th className="py-3 px-4">Academic Eligibility</th>
                    <th className="py-3 px-4">AI Active</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{course.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{course.code} &bull; {course.id}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{course.category}</td>
                      <td className="py-3 px-4">{course.duration}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{course.fees}</td>
                      <td className="py-3 px-4 max-w-xs text-slate-600" title={course.eligibility}>
                        {course.eligibility}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(course.id)}
                          className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
                        >
                          {course.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(course)}
                          className="h-7 text-xs px-2.5 gap-1 text-slate-700 hover:text-primary"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No courses found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit or Add Course Modal */}
      <Modal
        isOpen={isNewModalOpen || !!editCourseModal}
        onClose={() => {
          setIsNewModalOpen(false);
          setEditCourseModal(null);
        }}
        title={editCourseModal ? `Edit Course: ${editCourseModal.name}` : 'Add New Course to Catalogue'}
        description="Updates will reflect immediately in the sample course database."
        maxWidth="lg"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsNewModalOpen(false);
                setEditCourseModal(null);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveCourse}>
              Save Course
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Course Title</label>
            <Input
              value={formState.name || ''}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              placeholder="e.g. B.Tech in Artificial Intelligence & Robotics"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Course Code</label>
              <Input
                value={formState.code || ''}
                onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                placeholder="e.g. CSE-AIML-4Y"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Category</label>
              <Select
                value={formState.category || 'Engineering & Technology'}
                onChange={(e) => setFormState({ ...formState, category: e.target.value as Course['category'] })}
              >
                <option value="Engineering & Technology">Engineering & Technology</option>
                <option value="Management & Business">Management & Business</option>
                <option value="Design & Media">Design & Media</option>
                <option value="Science & Humanities">Science & Humanities</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Duration</label>
              <Input
                value={formState.duration || ''}
                onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                placeholder="e.g. 4 Years (8 Semesters)"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Annual Tuition Fees</label>
              <Input
                value={formState.fees || ''}
                onChange={(e) => setFormState({ ...formState, fees: e.target.value })}
                placeholder="e.g. ₹2,40,000 / year"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Eligibility Criteria</label>
            <Input
              value={formState.eligibility || ''}
              onChange={(e) => setFormState({ ...formState, eligibility: e.target.value })}
              placeholder="e.g. 10+2 with PCM minimum 60% aggregate score"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Course Overview & Syllabus</label>
            <textarea
              rows={3}
              value={formState.description || ''}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              placeholder="Brief course synopsis for the AI counsellor to reference..."
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
