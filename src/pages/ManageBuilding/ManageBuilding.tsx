import { Box, Button, Card, Table, TableContainer, TablePagination, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BuildingTableToolbar from '~/pages/ManageBuilding/BuildingTableToolbar'
import { useCallback, useState } from 'react'
import BuildingTableHead from '~/pages/ManageBuilding/BuildingTableHead'
import BuildingTableRow, { BuildingProps } from '~/pages/ManageBuilding/BuildingTableRow'
import { applyFilter, emptyRows, getComparator } from '~/utils/utils'
import TableBody from '@mui/material/TableBody'
import { TableEmptyRows } from '~/pages/ManageBuilding/TableEmptyRows'
import TableNoData from '~/pages/ManageBuilding/TableNoData'

const _buildings = [
  {
    id: 1,
    address: '123 Main St, HCM City',
    status: 'Available',
    desciption: 'A modern office building with high-speed internet.',
    hotlineNumber: '0901234567'
  },
  {
    id: 2,
    address: '456 Second Ave, HCM City',
    status: 'Under Maintenance',
    desciption: 'A spacious building with conference rooms and amenities.',
    hotlineNumber: '0909876543'
  },
  {
    id: 3,
    address: '789 Third Blvd, HCM City',
    status: 'Occupied',
    desciption: 'A cozy building located in the heart of the city.',
    hotlineNumber: '0912345678'
  },
  {
    id: 4,
    address: '101 Fourth St, HCM City',
    status: 'Available',
    desciption: 'An eco-friendly building with green spaces.',
    hotlineNumber: '0918765432'
  },
  {
    id: 5,
    address: '202 Fifth Rd, HCM City',
    status: 'Available',
    desciption: 'A luxurious building with state-of-the-art facilities.',
    hotlineNumber: '0901357924'
  },
  {
    id: 6,
    address: '202 Fifth Rd, HCM City',
    status: 'Available',
    desciption: 'A luxurious building with state-of-the-art facilities.',
    hotlineNumber: '0901357924'
  }
]
export default function ManageBuilding() {
  const table = useTable()

  const [filterName, setFilterName] = useState('')
  const dataFiltered: BuildingProps[] = applyFilter({
    inputData: _buildings,
    comparator: getComparator(table.order, table.orderBy),
    filterName
  })

  const notFound = !dataFiltered.length && !!filterName

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' fontWeight='500' flexGrow={1}>
          Các tòa nhà
        </Typography>
        <Button variant='contained' sx={{ backgroundColor: 'grey.900', borderRadius: '12px' }} startIcon={<AddIcon />}>
          Tạo mới
        </Button>
      </Box>

      <Card sx={{ borderRadius: '16px' }}>
        <BuildingTableToolbar
          numSelected={table.selected.length}
          filterName={filterName || ''}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value)
            table.onResetPage()
          }}
        />

        <Box>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <BuildingTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_buildings.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _buildings.map((building) => building.id.toString())
                  )
                }
                headLabel={[
                  { id: 'address', label: 'Địa chỉ' },
                  { id: 'description', label: 'Mô tả' },
                  { id: 'hotlineNumber', label: 'Hotline' },
                  { id: 'status', label: 'Trạng thái' },
                  { id: '' }
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <BuildingTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id.toString())}
                      onSelectRow={() => table.onSelectRow(row.id.toString())}
                    />
                  ))}

                <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, _buildings.length)} />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <TablePagination
          component='div'
          page={table.page}
          count={_buildings.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Box>
  )
}

export function useTable() {
  const [page, setPage] = useState(0)
  const [orderBy, setOrderBy] = useState('name')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selected, setSelected] = useState<string[]>([])
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(id)
    },
    [order, orderBy]
  )

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }, [])

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue]

      setSelected(newSelected)
    },
    [selected]
  )

  const onResetPage = useCallback(() => {
    setPage(0)
  }, [])

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage)
  }, [])

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      onResetPage()
    },
    [onResetPage]
  )

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage
  }
}
