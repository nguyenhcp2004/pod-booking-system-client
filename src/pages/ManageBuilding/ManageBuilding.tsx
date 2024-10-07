import { Box, Button, Card, Table, TableContainer, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BuildingTableToolbar from '~/pages/ManageBuilding/BuildingTableToolbar'
import { useCallback, useState } from 'react'
import Scrollbar from '~/components/ScrollBar'
import BuildingTableHead from '~/pages/ManageBuilding/BuildingTableHead'

const _users = [
  {
    id: '1',
    name: 'Hoàng Anh Tuấn'
  },
  {
    id: '2',
    name: 'Hoàng Anh Tuấn'
  },
  {
    id: '3',
    name: 'Hoàng Anh Tuấn'
  },
  {
    id: '4',
    name: 'Hoàng Anh Tuấn'
  },
  {
    id: '5',
    name: 'Hoàng Anh Tuấn'
  }
]
export default function ManageBuilding() {
  const table = useTable()

  const [filterName, setFilterName] = useState('')

  return (
    <Box>
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

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <BuildingTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'address', label: 'Địa chỉ' },
                  { id: 'description', label: 'Mô tả' },
                  { id: 'hotlineNumber', label: 'Hotline' },
                  { id: 'status', label: 'Trạng thái' }
                ]}
              />
            </Table>
          </TableContainer>
        </Scrollbar>
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
