import queryString from 'query-string'
import { Pagination } from '~/constants/type'
import {
  CreateBuildingBodyType,
  CreateBuildingResType,
  EditBuildingBodyType,
  GetListBuidlingResType
} from '~/schemaValidations/building.schema'
import http from '~/utils/http'

const buildingApiRequest = {
  getListBuidling: (query: Pagination) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListBuidlingResType>(`/buildings?${stringified}`)
  },
  createBuilding: (body: CreateBuildingBodyType) => http.post<CreateBuildingResType>('/buildings', body),
  editBuilding: (body: EditBuildingBodyType) => http.put<CreateBuildingResType>(`/buildings/${body.id}`, body)
}

export default buildingApiRequest
