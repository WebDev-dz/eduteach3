import { assignmentSelectSchema } from "@/lib/validation/select";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, GripVerticalIcon, LoaderIcon, MoreVerticalIcon } from "lucide-react";
import { z } from "zod";
import { Badge, Button, Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui";
import { AssignmentActions } from "@/types/ui";


type FilterFormControl = ReturnType<
  typeof useForm<z.infer<typeof assignmentSelectSchema>>
>;
// Create a separate component for the drag handle
function DragHandle({
  id,
  filterForm,
}: {
  id: number;
  filterForm: FilterFormControl;
}) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}


const Actions : AssignmentActions = [{
    label: "View Details", action: (data: Assignemnt) => {},
    label: "Grade Assignments", action: (data: Assignemnt) => {},
    label: "Send Reminder", action: (data: Assignemnt) => {},
    label: "Duplicate", action: (data: Assignemnt) => {},
    label: "Archive", action: (data: Assignemnt) => {},
}
]

const Actions : ColumnDef<z.infer<typeof assignmentSelectSchema>> = {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Grade Assignments</DropdownMenuItem>
          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };



export const columns = (
    filterForm: FilterFormControl
  ): ColumnDef<z.infer<typeof assignmentSelectSchema>>[] => [
    {
      id: "drag",
      header: () => null,
      cell: ({ row,  }) => (
        <DragHandle id={row.index} filterForm={filterForm} />
      ),
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "header",
      header: "Assignment",
      cell: ({ row }) => {
        return <TableCellViewer filterForm={filterForm} item={row.original} />;
      },
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {row.original.type}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.status === "graded" ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : (
            <LoaderIcon />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "target",
      header: "Class",
      cell: ({ row }) => <div>{row.original.target}</div>,
    },
    {
      accessorKey: "limit",
      header: "Completion",
      cell: ({ row }) => <div>{row.original.limit}</div>,
    },
    {
      accessorKey: "reviewer",
      header: "Teacher",
      cell: ({ row }) => {
        return row.original.reviewer;
      },
    },
    {
      id: "actions",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {Actions.map((action) => (
              <DropdownMenuItem key={action.label} onClick={() => action.action(row.row.original)}>
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];