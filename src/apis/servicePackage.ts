import { ServicePackageResType } from '~/constants/type'
import http from '~/utils/http'

const servicePackageApiRequest = {
  getAll: () => {
    return http.get<ServicePackageResType>('/service-package')
  }
}
export default servicePackageApiRequest
