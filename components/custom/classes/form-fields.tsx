// @/components/custom/classes/form-fields.tsx
import { defaultValues } from "@/lib/consts";
import { 
  BaseInputProps, 
  StringInput, 
  SelectInput, 
  NumberInput,
  TextInput,
  CheckboxInput,
  DateInput
} from "../form-inputs";
import React from "react";

type ClassFormData = typeof defaultValues.class.insert;

// Extended BaseInputProps to include any data needed for specific fields
interface ClassFieldProps extends BaseInputProps {
  data?: {[key in keyof ClassFormData]?: ClassFormData[key]};
}

const ClassForm = () => {
  return;
};

// Define the NameField component with a display name
const NameField = ({ form, name = "name", label = "Class Name", required = true }: ClassFieldProps) => (
  <StringInput 
    form={form} 
    name={name} 
    label={label} 
    placeholder="e.g., Class 9A"
    required={required}
  />
);
NameField.displayName = "ClassForm.NameField";
ClassForm.NameField = NameField;

// Define the RoomField component with a display name
const RoomField = ({ form, name = "room", label = "Room" }: ClassFieldProps) => (
  <StringInput 
    form={form} 
    name={name} 
    label={label}
    placeholder="e.g., Room 203"
  />
);
RoomField.displayName = "ClassForm.RoomField";
ClassForm.RoomField = RoomField;

// Define the SubjectField component with a display name
const SubjectField = ({ form, name = "subject", label = "Subject", required = true }: ClassFieldProps) => (
  <SelectInput 
    form={form} 
    name={name} 
    label={label}
    required={required}
    options={[
      { value: "mathematics", label: "Mathematics" },
      { value: "science", label: "Science" },
      { value: "english", label: "English" },
      { value: "history", label: "History" },
      { value: "geography", label: "Geography" },
      { value: "art", label: "Art" },
      { value: "music", label: "Music" },
      { value: "physical_education", label: "Physical Education" }
    ]}
  />
);
SubjectField.displayName = "ClassForm.SubjectField";
ClassForm.SubjectField = SubjectField;

// Define the GradeLevelField component with a display name
const GradeLevelField = ({ form, name = "gradeLevel", label = "Grade Level", required = true }: ClassFieldProps) => (
  <SelectInput 
    form={form} 
    name={name} 
    label={label}
    required={required}
    options={[...Array(12)].map((_, i) => ({
      value: String(i + 1),
      label: `Grade ${i + 1}`
    }))}
  />
);
GradeLevelField.displayName = "ClassForm.GradeLevelField";
ClassForm.GradeLevelField = GradeLevelField;

// Define the AcademicYearField component with a display name
const AcademicYearField = ({ form, name = "academicYear", label = "Academic Year", required = true }: ClassFieldProps) => (
  <SelectInput 
    form={form} 
    name={name} 
    label={label}
    required={required}
    options={[
      { value: "2024-2025", label: "2024-2025" },
      { value: "2025-2026", label: "2025-2026" },
      { value: "2026-2027", label: "2026-2027" }
    ]}
  />
);
AcademicYearField.displayName = "ClassForm.AcademicYearField";
ClassForm.AcademicYearField = AcademicYearField;

// Define the ScheduleField component with a display name
const ScheduleField = ({ form, name = "schedule", label = "Schedule" }: ClassFieldProps) => (
  <StringInput 
    form={form} 
    name={name} 
    label={label}
    placeholder="e.g., Mon/Wed/Fri 9:00-10:30 AM"
  />
);
ScheduleField.displayName = "ClassForm.ScheduleField";
ClassForm.ScheduleField = ScheduleField;

// Define the CapacityField component with a display name
const CapacityField = ({ form, name = "capacity", label = "Maximum Capacity" }: ClassFieldProps) => (
  <NumberInput 
    form={form} 
    name={name} 
    label={label}
    placeholder="e.g., 30"
    min={1}
  />
);
CapacityField.displayName = "ClassForm.CapacityField";
ClassForm.CapacityField = CapacityField;

// Define the DescriptionField component with a display name
const DescriptionField = ({ form, name = "description", label = "Description" }: ClassFieldProps) => (
  <TextInput 
    form={form} 
    name={name} 
    label={label}
    placeholder="Enter a brief description of the class"
    rows={3}
  />
);
DescriptionField.displayName = "ClassForm.DescriptionField";
ClassForm.DescriptionField = DescriptionField;

// Define the IsActiveField component with a display name
const IsActiveField = ({ form, name = "isActive", label = "Active Class" }: ClassFieldProps) => (
  <CheckboxInput 
    form={form} 
    name={name} 
    label={label}
    description="Inactive classes won't appear in the active classes list."
  />
);
IsActiveField.displayName = "ClassForm.IsActiveField";
ClassForm.IsActiveField = IsActiveField;

// Define the StartDateField component with a display name
const StartDateField = ({ form, name = "startDate", label = "Start Date" }: ClassFieldProps) => (
  <DateInput 
    form={form} 
    name={name} 
    label={label}
  />
);
StartDateField.displayName = "ClassForm.StartDateField";
ClassForm.StartDateField = StartDateField;

// Define the EndDateField component with a display name
const EndDateField = ({ form, name = "endDate", label = "End Date" }: ClassFieldProps) => (
  <DateInput 
    form={form} 
    name={name} 
    label={label}
  />
);
EndDateField.displayName = "ClassForm.EndDateField";
ClassForm.EndDateField = EndDateField;

// Define the TeacherIdField component with a display name
const TeacherIdField = ({ form, name = "teacherId", label = "Teacher", options = [] }: ClassFieldProps & { options: Array<{value: string, label: string}> }) => (
  <SelectInput 
    form={form} 
    name={name} 
    label={label}
    options={options}
    placeholder="Select a teacher"
  />
);
TeacherIdField.displayName = "ClassForm.TeacherIdField";
ClassForm.TeacherIdField = TeacherIdField;

export default ClassForm;