import { useQuery } from '@tanstack/react-query'
import servicePackageApiRequest from '~/apis/servicePackage'

export const getAllServicePackage = () => {
  return useQuery({
    queryKey: ['servicePackage'],
    queryFn: servicePackageApiRequest.getAll
  })
}
