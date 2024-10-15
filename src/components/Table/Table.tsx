import { DataGrid, GridColDef, GridSlots, GridValidRowModel } from '@mui/x-data-grid'
import { viVN } from '@mui/x-data-grid/locales'
import { Dispatch, SetStateAction, useMemo, useRef } from 'react'

const Table = ({
  columns,
  rows,
  loading = false,
  toolbarComponents,
  paginationModel,
  setPaginationModel,
  totalRowCount
}: {
  columns: GridColDef[]
  rows: GridValidRowModel[]
  setRows?: Dispatch<SetStateAction<GridValidRowModel[]>>
  loading?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolbarComponents?: any
  paginationModel?: { pageSize: number; page: number }
  setPaginationModel?: Dispatch<SetStateAction<{ pageSize: number; page: number }>>
  totalRowCount?: number
}) => {
  const rowCountRef = useRef(totalRowCount || 0)

  const rowCount = useMemo(() => {
    if (totalRowCount !== undefined) {
      rowCountRef.current = totalRowCount
    }
    return rowCountRef.current
  }, [totalRowCount])

  return (
    <DataGrid
      loading={loading}
      rows={rows}
      columns={columns}
      localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      autoHeight
      getRowHeight={() => 'auto'}
      slotProps={{
        loadingOverlay: {
          variant: 'skeleton',
          noRowsVariant: 'skeleton'
        },
        toolbar: {
          showQuickFilter: true
        }
      }}
      sx={{
        '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
          py: 1
        },
        '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
          py: '15px'
        },
        '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
          py: '22px'
        },
        padding: '16px 0'
      }}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      disableRowSelectionOnClick
      disableColumnSelector
      disableColumnFilter
      disableDensitySelector
      density='comfortable'
      editMode='row'
      rowCount={rowCount}
      paginationMode='server'
      pageSizeOptions={[5, 10, 25]}
      slots={{
        toolbar: toolbarComponents as GridSlots['toolbar']
      }}
    />
  )
}

export default Table
