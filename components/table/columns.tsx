"use client"

import { ColumnDef } from "@tanstack/react-table"

export function generateCols<T extends object>(colDefinition: ColumnDef<T>[]) {
    const columns = colDefinition.map(col => {
        return {
            ...colDefinition,
            accessorKey: col.header,
            header: `${col.header?.toString()[0].toUpperCase()}${col.header?.toString().slice(1)}`,
        }
    });
    return columns;
}