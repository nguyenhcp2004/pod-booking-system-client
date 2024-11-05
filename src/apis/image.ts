import { AddImageToRoomBodyType } from '~/schemaValidations/roomImage.schema'
import http from '~/utils/http'

const CLOUD_NAME: string = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET: string = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string
const imageApiRequets = {
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    return fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        return data.secure_url
      })
      .catch((error) => {
        console.error('There was an error!', error)
      })
  },
  getImagesByRoomId: (roomId: number) => {
    return http.get(`/room-images/${roomId}`)
  },
  addImageToRoom: (body: AddImageToRoomBodyType) => {
    return http.post(`/room-images/${body.roomId}`, { images: body.image })
  }
}
export default imageApiRequets
