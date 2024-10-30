import { Box, TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'

interface Props {
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{
      take: number
      page: number
      address: string
    }>
  >
}
export default function SearchInput({ setPaginationModel }: Props) {
  const [query, setQuery] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPaginationModel((prev) => ({ ...prev, address: query }))
  }

  return (
    <>
      <Box component={'form'} onSubmit={handleSubmit}>
        <TextField
          size='small'
          placeholder='Tìm kiếm...'
          value={query}
          onChange={handleInputChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
              value: query
            }
          }}
        />
      </Box>
    </>
  )
}
