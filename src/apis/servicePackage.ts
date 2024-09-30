import { ServicePackageResType } from '~/types/servicePackage'
import http from '~/utils/http'

const servicePackageApiRequest = {
  getAll: () => {
    return http.get<ServicePackageResType>('/service-package')
  }
}
export default servicePackageApiRequest
