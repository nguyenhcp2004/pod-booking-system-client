import { useQuery } from '@tanstack/react-query'
import assignmentApiRequest from '~/apis/assigment'

export const useGetAllAssignment = () => {
  return useQuery({
    queryKey: ['assignment'],
    queryFn: assignmentApiRequest.getAllAssignment
  })
}
