import { subscriptionPlanEnum } from "../lib/db/schema/index";
// @/types/ui
import { UseFormReturn } from "react-hook-form";
import {
  students,
  classes,
  calendarEvents,
  grades,
  assignments,
  lessonPlans,
  personalEvents,
  assignmentSubmissions,
  users,
} from "@/lib/db/schema";

import {
  userRoleEnum,
  subscriptionPlanEnum,
  subscriptionStatusEnum,
  eventTypeEnum,
  assignmentStatusEnum,
  lessonPlanStatusEnum,
  eventVisibilityEnum,
} from "@/lib/db/schema/";

const schema = {
  students,
  classes,
  calendarEvents,
  grades,
  assignments,
  lessonPlans,
  personalEvents,
  assignmentSubmissions,
  users,
};

type Schema = typeof schema;
type WritableSchemaData = {
  [Key in keyof Schema]?: Array<
    Schema[Key] extends { $inferSelect: infer U } ? U : never
  >;
};

// Final improved version
export type FormFields<T extends FieldValues> = {
  [K in keyof T as K extends string
    ? `${Capitalize<K>}Field`
    : never]: (props: {
    form: UseFormReturn<T>;
    data?: WritableSchemaData;
  }) => React.ReactNode;
};

// Selectors
const userRoles = userRoleEnum.enumValues;
const subscriptionPlans = subscriptionPlanEnum.enumValues;
const subscriptionStatus = subscriptionStatusEnum.enumValues;
const eventType = eventTypeEnum.enumValues;
const assignmentStatus = assignmentStatusEnum.enumValues;
const lessonPlanStatus = lessonPlanStatusEnum.enumValues;
const eventVisibility = eventVisibilityEnum.enumValues;

export type SelectEnums = {
  UserRole : typeof userRoles;
  SubscriptionPlan: typeof subscriptionPlans;
  SubscriptionStatus: typeof subscriptionStatus;
  EventType: typeof eventType;
  AssignmentStatus: typeof assignmentStatus;
  LessonPlanStatus: typeof lessonPlanStatus;
  EventVisibility: typeof eventVisibility;
}

export type SelectorField<T extends FieldValues> = (props: {
  form: UseFormReturn<T>;
  data?: WritableSchemaData;
}) => React.ReactNode;

export type MultiSelectorField<T extends FieldValues> = (props: {
  form: UseFormReturn<T>;
  data?: WritableSchemaData;
}) => React.ReactNode;


export type SelectEntities = {
  Student: Student;
  Grade: Grade;
  Class: Class;
  Teacher: User;
  LessonPlan: LessonPlan;
  Assignment: Assignment;
  CalendarEvent: CalendarEvent;
  AssignmentSubmission: AssignmentSubmission;
};

export type SelectorFields<T extends FieldValues> = {
  [K in keyof T as K extends string
    ? `${Capitalize<K>}SelectorField`
    : never]: (props: {
    form: UseFormReturn<T>;
    data?: T[K];
  }) => React.ReactNode;
};

export type MultiSelectorFields<T extends FieldValues> = {
  [K in keyof T as K extends string
    ? `${Capitalize<K>}MultiSelectorField`
    : never]: (props: {
    form: UseFormReturn<T>;
    data?: WritableSchemaData;
  }) => React.ReactNode;
};
