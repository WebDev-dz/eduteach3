// @/types/ui

// Type for creating form field components from form values
export type FormFields<T extends FieldValues> = {
    [K in keyof T as K extends string ? `${Capitalize<K>}Field` : never]: (
      form: UseFormReturn<T>
    ) => React.ReactNode;
  };