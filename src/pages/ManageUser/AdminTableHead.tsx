import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '~/utils/utils'

type UserTableHeadProps = {
  orderBy: string
  rowCount: number
  numSelected: number
  order: 'asc' | 'desc'
  onSort: (id: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headLabel: Record<string, any>[]
  onSelectAllRows: (checked: boolean) => void
}

export default function UserTableHead({
  order,
  onSort,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onSelectAllRows
}: UserTableHeadProps) {
  return (
    <TableHead sx={{ backgroundColor: 'grey.100', borderBottom: 'none' }}>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onSelectAllRows(event.target.checked)}
          />
        </TableCell>

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              width: headCell.width,
              minWidth: headCell.minWidth,
              fontSize: '14px',
              fontWeight: '500',
              color: 'grey.600'
            }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => onSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
