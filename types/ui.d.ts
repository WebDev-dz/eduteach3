// @/types/ui

import {
  students,
  classes,
  calendarEvents,
  grades,
  assignments,
  lessonPlans,
  personalEvents,
}  from "@/lib/db/schema";
const schema = {
  students,
  classes,
  calendarEvents,
  grades,
  assignments,
  lessonPlans,
  personalEvents,
};
type Schema = typeof schema;
type WritableSchemaData = {
  [Key in keyof Schema]?: Array<
    Schema[Key] extends { $inferSelect: infer U } ? U : never
  >;
};

// Final improved version
export type FormFields<T extends FieldValues> = {
  [K in keyof T as K extends string ? `${Capitalize<K>}Field` : never]: (props: {
    form: UseFormReturn<T>,
    data?: WritableSchemaData
  }) => React.ReactNode;
};
