// @/components/custom/form/form-inputs.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Base props that all input components share
export interface BaseInputProps {
  form: UseFormReturn<FieldValues>;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
}

/**
 * StringInput - For short text input fields
 */
export const StringInput = ({
  form,
  name,
  label,
  description,
  placeholder,
  required = false,
}: BaseInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input 
              id={name} 
              {...field} 
              value={field.value || ""}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`} 
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * NumberInput - For numeric input fields
 */
export const NumberInput = ({
  form,
  name,
  label,
  description,
  placeholder,
  min,
  max,
  step = 1,
  required = false,
}: BaseInputProps & {
  min?: number;
  max?: number;
  step?: number;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              type="number"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              min={min}
              max={max}
              step={step}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * TextInput - For multi-line text input fields
 */
export const TextInput = ({
  form,
  name,
  label,
  description,
  placeholder,
  rows = 3,
  required = false,
}: BaseInputProps & {
  rows?: number;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              id={name}
              {...field}
              value={field.value || ""}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              rows={rows}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * SelectInput - For dropdown selection fields
 */
export const SelectInput = ({
  form,
  name,
  label,
  description,
  placeholder,
  options = [],
  required = false,
}: BaseInputProps & {
  options: { value: string; label: string }[];
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id={name}>
                <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * MultiSelectInput - For selecting multiple items
 */
export const MultiSelectInput = ({
  form,
  name,
  label,
  description,
  placeholder,
  options = [],
  required = false,
}: BaseInputProps & {
  options: { value: string; label: string }[];
}) => {
  const [search, setSearch] = useState("");
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedValues = field.value || [];
        const availableOptions = options.filter(
          (option) => !selectedValues.includes(option.value)
        );
        
        return (
          <FormItem className="space-y-2">
            <FormLabel htmlFor={name}>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
                {selectedValues.map((value) => {
                  const option = options.find((o) => o.value === value);
                  return (
                    <Badge key={value} variant="secondary" className="py-1">
                      {option?.label || value}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => {
                          field.onChange(
                            selectedValues.filter((v) => v !== value)
                          );
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
              
              <Select
                onValueChange={(value) => {
                  field.onChange([...selectedValues, value]);
                  setSearch("");
                }}
                value=""
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {availableOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

/**
 * DateInput - For date selection fields
 */
export const DateInput = ({
  form,
  name,
  label,
  description,
  required = false,
}: BaseInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <DatePicker
              id={name}
              date={field.value ? new Date(field.value) : undefined}
              onSelect={(date) => field.onChange(date)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * CheckboxInput - For boolean toggle fields
 */
export const CheckboxInput = ({
  form,
  name,
  label,
  description,
  required = false,
}: BaseInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                id={name}
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel htmlFor={name} className="!mt-0">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * SwitchInput - For toggle switch fields
 */
export const SwitchInput = ({
  form,
  name,
  label,
  description,
  required = false,
}: BaseInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
              </FormLabel>
              {description && <FormDescription>{description}</FormDescription>}
            </div>
            <FormControl>
              <Switch
                id={name}
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * FileInput - For file upload fields
 */
export const FileInput = ({
  form,
  name,
  label,
  description,
  accept,
  multiple = false,
  required = false,
}: BaseInputProps & {
  accept?: string;
  multiple?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => {
                const files = e.target.files;
                onChange(multiple ? files : files?.[0] || null);
              }}
              {...fieldProps}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * RadioInput - For radio button selection fields
 */
export const RadioInput = ({
  form,
  name,
  label,
  description,
  options = [],
  required = false,
}: BaseInputProps & {
  options: { value: string; label: string }[];
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="radio"
                    id={`${name}-${option.value}`}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <FormLabel htmlFor={`${name}-${option.value}`} className="!mt-0">
                  {option.label}
                </FormLabel>
              </div>
            ))}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * SliderInput - For range selection fields
 */
export const SliderInput = ({
  form,
  name,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  required = false,
}: BaseInputProps & {
  min?: number;
  max?: number;
  step?: number;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel htmlFor={name}>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <span className="text-sm">{field.value || min}</span>
          </div>
          <FormControl>
            <input
              id={name}
              type="range"
              min={min}
              max={max}
              step={step}
              value={field.value || min}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * TimeInput - For time selection fields
 */
export const TimeInput = ({
  form,
  name,
  label,
  description,
  required = false,
}: BaseInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              type="time"
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * ColorInput - For color selection fields
 */
export const ColorInput = ({
  form,
  name,
  label,
  description,
  required = false,
}: BaseInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <div className="flex items-center gap-2">
            <FormControl>
              <Input
                id={name}
                type="color"
                {...field}
                value={field.value || "#000000"}
                className="w-12 h-10 p-1"
              />
            </FormControl>
            <Input 
              value={field.value || "#000000"} 
              onChange={(e) => field.onChange(e.target.value)}
              className="font-mono"
            />
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};