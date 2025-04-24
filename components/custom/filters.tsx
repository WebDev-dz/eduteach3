import { z, ZodRawShape } from "zod"
import { filtersSchema } from "@/lib/validation/filters" // your schema
import {
  Form,
  FormField,
  FormItem,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
} from "@/components/ui"
import { Table } from "@tanstack/react-table"
import { UseFormReturn } from "react-hook-form"
import { Assignment } from "@/types/entities"

type FilterProps = {
  table: Table<Assignment>
  filterForm: UseFormReturn<ZodRawShape> // use z.infer<typeof filtersSchema> if known
}

export const AssignmentFilters = ({ filterForm }: FilterProps) => {
  const schemaShape = (filtersSchema as z.ZodObject<ZodRawShape>).shape

  return (
    <Form {...filterForm}>
      <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(schemaShape).map(([key, fieldSchema]) => {
          const fieldType = fieldSchema._def?.typeName
          const isEnum = fieldType === "ZodEnum"
          const isString = fieldType === "ZodString"

          return (
            <FormField
              key={key}
              control={filterForm.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <Label>{key}</Label>

                  {isEnum ? (
                    <Select value={field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${key}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldSchema.options.map((opt: string) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : isString ? (
                    <Input placeholder={key} {...field} />
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Unsupported field type
                    </p>
                  )}
                </FormItem>
              )}
            />
          )
        })}
      </form>
    </Form>
  )
}
