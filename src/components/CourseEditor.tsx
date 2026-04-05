import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { updateCourseInFirebase } from "@/firebase/migration";
import type { Course } from "@/types/firebase";
import { Save, X, Plus, Trash2 } from "lucide-react";

interface CourseEditorProps {
  course: Course;
  onClose: () => void;
  onSave: () => void;
}

const CourseEditor = ({ course, onClose, onSave }: CourseEditorProps) => {
  const { toast } = useToast();
  const [editedCourse, setEditedCourse] = useState<Course>(course);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCourseInFirebase(course.id, editedCourse);
      toast({
        title: "Course Updated",
        description: `${editedCourse.title} has been updated successfully`,
      });
      onSave();
      onClose();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update course",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  const updateScheduleItem = (index: number, field: string, value: string) => {
    const newSchedule = [...editedCourse.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setEditedCourse({ ...editedCourse, schedule: newSchedule });
  };

  const addScheduleItem = () => {
    const newSchedule = [...editedCourse.schedule, {
      id: `new-${Date.now()}`,
      topic: "New Class",
      date: new Date().toISOString().split('T')[0],
      time: "7:00 PM",
      status: "upcoming" as const,
      meetLink: editedCourse.schedule[0]?.meetLink || ""
    }];
    setEditedCourse({ ...editedCourse, schedule: newSchedule });
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = editedCourse.schedule.filter((_, i) => i !== index);
    setEditedCourse({ ...editedCourse, schedule: newSchedule });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Course: {course.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={editedCourse.title}
                onChange={(e) => setEditedCourse({ ...editedCourse, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={editedCourse.instructor}
                onChange={(e) => setEditedCourse({ ...editedCourse, instructor: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editedCourse.category}
                onChange={(e) => setEditedCourse({ ...editedCourse, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                value={editedCourse.level}
                onChange={(e) => setEditedCourse({ ...editedCourse, level: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={editedCourse.duration}
                onChange={(e) => setEditedCourse({ ...editedCourse, duration: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={editedCourse.price}
                onChange={(e) => setEditedCourse({ ...editedCourse, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={editedCourse.capacity || ""}
                onChange={(e) => setEditedCourse({ ...editedCourse, capacity: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="enrolledCount">Enrolled Count</Label>
              <Input
                id="enrolledCount"
                type="number"
                value={editedCourse.enrolledCount || ""}
                onChange={(e) => setEditedCourse({ ...editedCourse, enrolledCount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedCourse.description}
              onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Schedule */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Course Schedule</h3>
              <Button onClick={addScheduleItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </div>
            <div className="space-y-4">
              {editedCourse.schedule.map((session, index) => (
                <Card key={session.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                      <Label>Topic</Label>
                      <Input
                        value={session.topic}
                        onChange={(e) => updateScheduleItem(index, 'topic', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={session.date}
                        onChange={(e) => updateScheduleItem(index, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        value={session.time}
                        onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeScheduleItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Zoom Link</Label>
                    <Input
                      value={session.meetLink || ""}
                      onChange={(e) => updateScheduleItem(index, 'meetLink', e.target.value)}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseEditor;