import queryString from 'query-string'
import { Pagination } from '~/constants/type'
import {
  CreateBuildingBodyType,
  CreateBuildingResType,
  EditBuildingBodyType,
  GetAllBuildingsResType,
  GetFilteredBuildingQueryType,
  GetListBuidlingResType
} from '~/schemaValidations/building.schema'
import http from '~/utils/http'

const buildingApiRequest = {
  getListBuidling: (query: Pagination) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListBuidlingResType>(`/buildings?${stringified}`)
  },
  getFilteredBuilding: (query: GetFilteredBuildingQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListBuidlingResType>(`/buildings/filtered-building?${stringified}`)
  },
  createBuilding: (body: CreateBuildingBodyType) => http.post<CreateBuildingResType>('/buildings', body),
  editBuilding: (body: EditBuildingBodyType) => http.put<CreateBuildingResType>(`/buildings/${body.id}`, body),
  getAllBuilding: () => http.get<GetAllBuildingsResType>('/buildings/all'),
  getBuildingOptions: () => http.get<GetAllBuildingsResType>('/buildings/buildings-option')
}

export default buildingApiRequest
