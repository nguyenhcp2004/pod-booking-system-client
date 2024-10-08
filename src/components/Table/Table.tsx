import { Button } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridValidRowModel
} from '@mui/x-data-grid'
import { viVN } from '@mui/x-data-grid/locales'
import { Dispatch, SetStateAction } from 'react'
import AddIcon from '@mui/icons-material/Add'
interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = ''
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', description: '', image: '', status: '', type: '', price: 0, isNew: true }
    ])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' }
    }))
  }

  return (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
        Thêm phòng
      </Button>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}

const Table = ({
  columns,
  rows,
  setRows,
  rowModesModel,
  setRowModesModel,
  loading = false
}: {
  columns: GridColDef[]
  rows: GridValidRowModel[]
  setRows?: Dispatch<SetStateAction<GridValidRowModel[]>>
  rowModesModel?: GridRowModesModel
  setRowModesModel?: Dispatch<SetStateAction<GridRowModesModel>>
  loading?: boolean
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
        toolbar: EditToolbar as GridSlots['toolbar']
      }}
    />
  )
}

export default Table
