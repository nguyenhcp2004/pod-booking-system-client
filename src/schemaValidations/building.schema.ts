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
    address: z.string().min(5, 'Địa chỉ từ 5 - 100 kí tự').max(100, 'Địa chỉ từ 5 - 100 kí tự'),
    description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự').max(150, 'Mô tả tối đa ký tự'),
    hotlineNumber: z.string().regex(/^(0[1-9]{1}[0-9]{8})$/, 'Số điện thoại không hợp lệ'),
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
    id: z.number(),
    address: z.string().min(5, 'Địa chỉ từ 5 - 100 kí tự').max(100, 'Địa chỉ từ 5 - 100 kí tự'),
    description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự').max(150, 'Mô tả tối đa ký tự'),
    hotlineNumber: z.string().regex(/^(0[1-9]{1}[0-9]{8})$/, 'Số điện thoại không hợp lệ'),
    status: z.string()
  })
  .strict()

export type EditBuildingBodyType = z.TypeOf<typeof EditBuildingBody>

export const EditBuildingRes = z.object({
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

export type EditBuildingResType = z.TypeOf<typeof EditBuildingRes>

export const GetFilteredBuildingQuery = z.object({
  page: z.number(),
  take: z.number(),
  address: z.string()
})

export type GetFilteredBuildingQueryType = z.TypeOf<typeof GetFilteredBuildingQuery>

export const BuildingSchema = z.object({
  id: z.number(),
  address: z.string(),
  description: z.string(),
  hotlineNumber: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const GetAllBuildingRes = z.object({
  code: z.number(),
  data: z.array(BuildingSchema),
  message: z.string()
})

export type GetAllBuildingsResType = z.TypeOf<typeof GetAllBuildingRes>
