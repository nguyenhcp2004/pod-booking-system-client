import { useState, useCallback } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import MenuList from '@mui/material/MenuList'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import { menuItemClasses } from '@mui/material/MenuItem'
import { Chip } from '@mui/material'

import EditBuilding from '~/pages/ManageBuilding/EditBuilding'
import DeleteBuilding from '~/pages/ManageBuilding/DeleteBuilding'

export type BuildingProps = {
  id: number
  address: string
  status: string
  desciption: string
  hotlineNumber: string
}

type BuildingTableRowProps = {
  row: BuildingProps
  selected: boolean
  onSelectRow: () => void
}

export default function BuildingTableRow({ row, selected, onSelectRow }: BuildingTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null)

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])

  return (
    <>
      <TableRow hover tabIndex={-1} role='checkbox' selected={selected}>
        <TableCell padding='checkbox'>
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component='th' scope='row' sx={{ fontSize: '14px' }}>
          {row.address}
        </TableCell>

        <TableCell sx={{ fontSize: '14px' }}>{row.desciption}</TableCell>

        <TableCell sx={{ fontSize: '14px' }}>{row.hotlineNumber}</TableCell>

        <TableCell>
          <Chip
            label={row.status}
            color='success'
            sx={{ color: 'success.main', bgcolor: 'success.light', fontWeight: '500' }}
          />
        </TableCell>

        <TableCell align='right' sx={{ fontSize: '14px' }}>
          <IconButton onClick={handleOpenPopover}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' }
            }
          }}
        >
          <EditBuilding row={row} />

          <DeleteBuilding row={row} />
        </MenuList>
      </Popover>
    </>
  )
}
