import { GetListBuidlingResType } from '~/schemaValidations/building.schema'
import http from '~/utils/http'

const buildingApiRequest = {
  getListBuidling: () => http.get<GetListBuidlingResType>('/buildings?take=50')
}

export default buildingApiRequest
