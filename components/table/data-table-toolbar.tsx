export function DataTableToolbar({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-x-4 py-4">
      {children}
    </div>
  )
}
