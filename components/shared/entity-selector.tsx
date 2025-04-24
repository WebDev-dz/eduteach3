import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

import { useState } from "react";
import {
  MultiSelectorFields,
  SelectorFields,
  SelectEntities
} from "@/types/ui";



const singleSelectors: SelectorFields<SelectEntities> = {
  GradeSelectorField: ({ form, data }) => {
    return (
      <FormField
        control={form.control}
        name="gradeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grade</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.grades?.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    ({grade.score})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  ClassSelectorField: ({ form, data }) => {
    return (
      <FormField
        control={form.control}
        name="classId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} ({cls.gradeLevel} Level)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  StudentSelectorField: ({ form, data }) => {
    return (
      <FormField
        control={form.control}
        name="studentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  TeacherSelectorField: function ({ form, data }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="teacherId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teacher</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.users?.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  LessonPlanSelectorField: function ({ form, data }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="lessonPlanId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lesson Plan</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select lesson plan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.lessonPlans?.map((lessonPlan) => (
                  <SelectItem key={lessonPlan.id} value={lessonPlan.id}>
                    {lessonPlan.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  AssignmentSelectorField: function ({ form, data }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="assignmentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assignment</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.assignments?.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  CalendarEventSelectorField: function ({ form, data }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="calendarEventId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Calendar Event</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select calendar event" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.calendarEvents?.map((calendarEvent) => (
                  <SelectItem key={calendarEvent.id} value={calendarEvent.id}>
                    {calendarEvent.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  AssignmentSubmissionSelectorField: function ({
    form,
    data,
  }): React.ReactNode {
    return (
      <FormField
        control={form.control}
        name="assignmentSubmissionId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assignment Submission</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment submission" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.assignmentSubmissions?.map((assignmentSubmission) => (
                  <SelectItem
                    key={assignmentSubmission.id}
                    value={assignmentSubmission.id}
                  >
                    {assignmentSubmission.gradedBy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
};

const multiSelectors: MultiSelectorFields<SelectEntities> = {
  StudentMultiSelectorField: ({ form, data }) => {
    const [open, setOpen] = useState(false);

    const selected = form.watch("studentIds") || [];

    const toggleStudent = (id: string) => {
      const current = new Set(selected);
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }
      form.setValue("studentIds", Array.from(current));
    };

    return (
      <FormField
        control={form.control}
        name="studentIds"
        render={() => (
          <FormItem>
            <FormLabel>Students</FormLabel>
            <FormControl>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(true)}
              >
                {selected.length === 0
                  ? "Select students"
                  : `${selected.length} selected`}
              </Button>
            </FormControl>
            <FormMessage />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Students</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {data?.students?.map((student) => {
                    const isChecked = selected.includes(student.id);
                    return (
                      <div key={student.id} className="flex items-center gap-2">
                        <Checkbox
                          id={student.id}
                          checked={isChecked}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <label htmlFor={student.id} className="text-sm">
                          {student.firstName} {student.lastName}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    );
  },
  ClassMultiSelectorField: ({ form, data }) => {
    const [open, setOpen] = useState(false);
    const selected = form.watch("classIds") || [];

    const toggle = (id: string) => {
      const set = new Set(selected);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      form.setValue("classIds", Array.from(set));
    };

    return (
      <FormField
        control={form.control}
        name="classIds"
        render={() => (
          <FormItem>
            <FormLabel>Classes</FormLabel>
            <FormControl>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected.length === 0
                  ? "Select classes"
                  : `${selected.length} selected`}
              </Button>
            </FormControl>
            <FormMessage />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Classes</DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {data?.classes?.map((cls) => {
                    const isChecked = selected.includes(cls.id);
                    return (
                      <div key={cls.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(cls.id)}
                          id={cls.id}
                        />
                        <label htmlFor={cls.id} className="text-sm">
                          {cls.name} ({cls.gradeLevel} Level)
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    );
  },
  GradeMultiSelectorField: ({ form, data }) => {
    const [open, setOpen] = useState(false);
    const selected = form.watch("gradeIds") || [];

    const toggle = (id: string) => {
      const set = new Set(selected);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      form.setValue("gradeIds", Array.from(set));
    };

    return (
      <FormField
        control={form.control}
        name="gradeIds"
        render={() => (
          <FormItem>
            <FormLabel>Grades</FormLabel>
            <FormControl>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected.length === 0
                  ? "Select grades"
                  : `${selected.length} selected`}
              </Button>
            </FormControl>
            <FormMessage />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Grades</DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {data?.grades?.map((grade) => {
                    const isChecked = selected.includes(grade.id);
                    return (
                      <div key={grade.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(grade.id)}
                          id={grade.id}
                        />
                        <label htmlFor={grade.id} className="text-sm">
                          ({grade.score})
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    );
  },
  TeacherMultiSelectorField: ({ form, data }) => {
    const [open, setOpen] = useState(false);
    const selected = form.watch("teacherIds") || [];

    const toggle = (id: string) => {
      const set = new Set(selected);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      form.setValue("teacherIds", Array.from(set));
    };

    return (
      <FormField
        control={form.control}
        name="teacherIds"
        render={() => (
          <FormItem>
            <FormLabel>Teachers</FormLabel>
            <FormControl>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected.length === 0
                  ? "Select teachers"
                  : `${selected.length} selected`}
              </Button>
            </FormControl>
            <FormMessage />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Teachers</DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {data?.users?.map((teacher) => {
                    const isChecked = selected.includes(teacher.id);
                    return (
                      <div key={teacher.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(teacher.id)}
                          id={teacher.id}
                        />
                        <label htmlFor={teacher.id} className="text-sm">
                          {teacher.firstName} {teacher.lastName}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    );
  },

  LessonPlanMultiSelectorField: ({ form, data }) => {
    const [open, setOpen] = useState(false);
    const selected = form.watch("lessonPlanIds") || [];

    const toggle = (id: string) => {
      const set = new Set(selected);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      form.setValue("lessonPlanIds", Array.from(set));
    };

    return (
      <FormField
        control={form.control}
        name="lessonPlanIds"
        render={() => (
          <FormItem>
            <FormLabel>Lesson Plans</FormLabel>
            <FormControl>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected.length === 0
                  ? "Select lesson plans"
                  : `${selected.length} selected`}
              </Button>
            </FormControl>
            <FormMessage />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Lesson Plans</DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {data?.lessonPlans?.map((plan) => {
                    const isChecked = selected.includes(plan.id);
                    return (
                      <div key={plan.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(plan.id)}
                          id={plan.id}
                        />
                        <label htmlFor={plan.id} className="text-sm">
                          {plan.title}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    );
  },

  AssignmentMultiSelectorField: ({ form, data }) => {
    const [open, setOpen] = useState(false);
    const selected = form.watch("assignmentIds") || [];

    const toggle = (id: string) => {
      const set = new Set(selected);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      form.setValue("assignmentIds", Array.from(set));
    };

    return (
      <FormField
        control={form.control}
        name="assignmentIds"
        render={() => (
          <FormItem>
            <FormLabel>Assignments</FormLabel>
            <FormControl>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected.length === 0
                  ? "Select assignments"
                  : `${selected.length} selected`}
              </Button>
            </FormControl>
            <FormMessage />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Assignments</DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {data?.assignments?.map((assignment) => {
                    const isChecked = selected.includes(assignment.id);
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(assignment.id)}
                          id={assignment.id}
                        />
                        <label htmlFor={assignment.id} className="text-sm">
                          {assignment.title}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    );
  },

  CalendarEventMultiSelectorField: ({ form, data }) => {
    const [open, setOpen] = useState(false);
    const selected = form.watch("calendarEventIds") || [];

    const toggle = (id: string) => {
      const set = new Set(selected);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      form.setValue("calendarEventIds", Array.from(set));
    };

    return (
      <FormField
        control={form.control}
        name="calendarEventIds"
        render={() => (
          <FormItem>
            <FormLabel>Calendar Events</FormLabel>
            <FormControl>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected.length === 0
                  ? "Select events"
                  : `${selected.length} selected`}
              </Button>
            </FormControl>
            <FormMessage />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Calendar Events</DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {data?.calendarEvents?.map((event) => {
                    const isChecked = selected.includes(event.id);
                    return (
                      <div key={event.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(event.id)}
                          id={event.id}
                        />
                        <label htmlFor={event.id} className="text-sm">
                          {event.title}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    );
  },

  AssignmentSubmissionMultiSelectorField: ({ form, data }) => {
    const [open, setOpen] = useState(false);
    const selected = form.watch("assignmentSubmissionIds") || [];

    const toggle = (id: string) => {
      const set = new Set(selected);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      form.setValue("assignmentSubmissionIds", Array.from(set));
    };

    return (
      <FormField
        control={form.control}
        name="assignmentSubmissionIds"
        render={() => (
          <FormItem>
            <FormLabel>Assignment Submissions</FormLabel>
            <FormControl>
              <Button variant="outline" onClick={() => setOpen(true)}>
                {selected.length === 0
                  ? "Select submissions"
                  : `${selected.length} selected`}
              </Button>
            </FormControl>
            <FormMessage />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Assignment Submissions</DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {data?.assignmentSubmissions?.map((submission) => {
                    const isChecked = selected.includes(submission.id);
                    return (
                      <div
                        key={submission.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggle(submission.id)}
                          id={submission.id}
                        />
                        <label htmlFor={submission.id} className="text-sm">
                          Submission by {submission.studentId}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    );
  },
};

export const {
  GradeSelectorField,
  ClassSelectorField,
  StudentSelectorField,
  TeacherSelectorField,
  LessonPlanSelectorField,
  AssignmentSelectorField,
  CalendarEventSelectorField,
  AssignmentSubmissionSelectorField,
  StudentMultiSelectorField,
  ClassMultiSelectorField,
  GradeMultiSelectorField,
  TeacherMultiSelectorField,
  LessonPlanMultiSelectorField,
  AssignmentMultiSelectorField,
  CalendarEventMultiSelectorField,
  AssignmentSubmissionMultiSelectorField,
} = { ...singleSelectors, ...multiSelectors };
