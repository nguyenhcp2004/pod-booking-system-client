import { DataGrid, GridColDef, GridRowId, GridSlots, GridValidRowModel, useGridApiRef } from '@mui/x-data-grid'
import { viVN } from '@mui/x-data-grid/locales'
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react'

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
  getDetailPanelContent?: (row: GridValidRowModel) => JSX.Element
  getDetailPanelHeight?: (row: GridValidRowModel) => number
  detailPanelExpandedRowIds?: GridRowId[]
  onDetailPanelExpandedRowIdsChange?: (expandedIds: GridRowId[]) => void
}) => {
  const apiRef = useGridApiRef()
  const rowCountRef = useRef(totalRowCount || 0)
  const rowCount = useMemo(() => {
    if (totalRowCount !== undefined) {
      rowCountRef.current = totalRowCount
    }
    return rowCountRef.current
  }, [totalRowCount])

  useEffect(() => {
    apiRef.current.autosizeColumns({
      columns: columns.map((column) => column.field),
      includeOutliers: true,
      includeHeaders: true,
      expand: true
    })
  }, [rows, loading, apiRef, columns])

  return (
    <DataGrid
      apiRef={apiRef}
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
        borderRadius: '16px',
        backgroundColor: 'white',
        padding: '16px 10px'
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
