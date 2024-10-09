import { z } from 'zod'

export const GetListBuidlingRes = z.object({
  code: z.number(),
  currentPage: z.number(),
  totalPage: z.number(),
  recordPerPage: z.number(),
  totalRecord: z.number(),
  data: z.array(
    z.object({
      id: z.number(),
      address: z.string(),
      description: z.string(),
      hotlineNumber: z.string(),
      status: z.string(),
      createdAt: z.string(),
      updatedAt: z.string()
    })
  )
})

export type GetListBuidlingResType = z.TypeOf<typeof GetListBuidlingRes>

export const CreateBuildingBody = z
  .object({
    address: z.string(),
    description: z.string(),
    hotlineNumber: z.string(),
    status: z.string()
  })
  .strict()

export type CreateBuildingBodyType = z.TypeOf<typeof CreateBuildingBody>

export const CreateBuildingRes = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    address: z.string(),
    description: z.string(),
    hotlineNumber: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
  })
})

export type CreateBuildingResType = z.TypeOf<typeof CreateBuildingRes>

export enum BuildingStatus {
  Active = 'Active',
  UnderMaintenance = 'UnderMaintenance',
  Closed = 'Closed'
}

export const EditBuildingBody = z
  .object({
    address: z.string(),
    description: z.string(),
    hotlineNumber: z.string(),
    status: z.string()
  })
  .strict()

export type EditBuildingBodyType = z.TypeOf<typeof EditBuildingBody>

export const EditBuildingRes = z
  .object({
    address: z.string(),
    description: z.string(),
    hotlineNumber: z.string(),
    status: z.string()
  })
  .strict()

export type EditBuildingResType = z.TypeOf<typeof EditBuildingRes>
