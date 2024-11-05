import { GetAssignmentsResType } from '~/schemaValidations/assignment.schema'
import http from '~/utils/http'

const assignmentApiRequest = {
  getAllAssignment: () => http.get<GetAssignmentsResType>('/assignment/all')
}

export default assignmentApiRequest
