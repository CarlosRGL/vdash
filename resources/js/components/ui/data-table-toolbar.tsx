"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Search, ChevronDown, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ColumnGroup {
  id: string
  label: string
  columns: string[]
}

export type { ColumnGroup }

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  perPage: number
  onPerPageChange: (perPage: string) => void
  showColumnVisibility?: boolean
  leftActions?: React.ReactNode
  actions?: React.ReactNode
  columnGroups?: ColumnGroup[]
  alwaysVisibleColumns?: string[]
}

export function DataTableToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  perPage,
  onPerPageChange,
  showColumnVisibility = true,
  leftActions,
  actions,
  columnGroups = [],
  alwaysVisibleColumns = [],
}: DataTableToolbarProps<TData>) {
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null)

  const handleGroupToggle = (groupId: string) => {
    if (activeGroup === groupId) {
      // If clicking the same group, deactivate it
      setActiveGroup(null)
      // Hide all group columns
      const allGroupColumns = columnGroups.flatMap(group => group.columns)
      allGroupColumns.forEach(columnId => {
        const column = table.getColumn(columnId)
        if (column && column.getCanHide()) {
          column.toggleVisibility(false)
        }
      })
    } else {
      // Switch to new group
      setActiveGroup(groupId)

      // Hide all group columns first
      const allGroupColumns = columnGroups.flatMap(group => group.columns)
      allGroupColumns.forEach(columnId => {
        const column = table.getColumn(columnId)
        if (column && column.getCanHide()) {
          column.toggleVisibility(false)
        }
      })

      // Show selected group columns
      const selectedGroup = columnGroups.find(group => group.id === groupId)
      if (selectedGroup) {
        selectedGroup.columns.forEach(columnId => {
          const column = table.getColumn(columnId)
          if (column) {
            column.toggleVisibility(true)
          }
        })
      }
    }

    // Always keep the always-visible columns visible
    alwaysVisibleColumns.forEach(columnId => {
      const column = table.getColumn(columnId)
      if (column) {
        column.toggleVisibility(true)
      }
    })
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64"
          />
        </div>


        {leftActions && <div className="flex items-center gap-2">{leftActions}</div>}
      </div>

        {/* Column Group Toggle Buttons */}
        {columnGroups.length > 0 && (
          <div className="flex items-center gap-2 border-l pl-4">
            {columnGroups.map((group) => (
              <Button
                key={group.id}
                variant={activeGroup === group.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleGroupToggle(group.id)}
                className="text-xs"
              >
                {group.label}
              </Button>
            ))}
          </div>
        )}

        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings2 />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      {actions && <div className="flex items-center gap-2">{actions}</div>}

    </div>
  )
}