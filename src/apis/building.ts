import {
  CreateBuildingBodyType,
  CreateBuildingResType,
  EditBuildingBodyType,
  GetListBuidlingResType
} from '~/schemaValidations/building.schema'
import http from '~/utils/http'

const buildingApiRequest = {
  getListBuidling: () => http.get<GetListBuidlingResType>('/buildings?take=50'),
  createBuilding: (body: CreateBuildingBodyType) => http.post<CreateBuildingResType>('/buildings', body),
  editBuilding: (body: EditBuildingBodyType) => http.put<CreateBuildingResType>(`/buildings/${body.id}`, body)
}

export default buildingApiRequest
