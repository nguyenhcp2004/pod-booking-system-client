import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridRowModesModel,
  GridSlots,
  GridValidRowModel
} from '@mui/x-data-grid'
import { viVN } from '@mui/x-data-grid/locales'
import { Dispatch, SetStateAction } from 'react'

const Table = ({
  columns,
  rows,
  setRows,
  rowModesModel,
  setRowModesModel,
  loading = false,
  toolbarComponents
}: {
  columns: GridColDef[]
  rows: GridValidRowModel[]
  setRows?: Dispatch<SetStateAction<GridValidRowModel[]>>
  rowModesModel?: GridRowModesModel
  setRowModesModel?: Dispatch<SetStateAction<GridRowModesModel>>
  loading?: boolean
  toolbarComponents?: any
}) => {
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    if (setRows) setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    if (setRowModesModel) setRowModesModel(newRowModesModel)
  }
  return (
    <DataGrid
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
          showQuickFilter: true,
          setRows,
          setRowModesModel
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
      loading={loading}
      disableRowSelectionOnClick
      disableColumnSelector
      disableColumnFilter
      disableDensitySelector
      density='comfortable'
      editMode='row'
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      slots={{
        toolbar: toolbarComponents as GridSlots['toolbar']
      }}
    />
  )
}

export default Table
