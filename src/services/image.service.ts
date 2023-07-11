import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { getEnv } from '../utils/env.utils.js'
import getCloudinaryPublicId from '../utils/cloudinary.utils.js'

cloudinary.config({
  cloud_name: getEnv('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnv('CLOUDINARY_API_KEY'),
  api_secret: getEnv('CLOUDINARY_API_SECRET'),
  secure: true,
})

export const storage = new CloudinaryStorage({
  cloudinary,
})

const uploadImage = async (image: any, publicId?: string) => {
  const result = await cloudinary.uploader.upload(image, {
    folder: 'avatars',
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    fetch_format: 'auto',
    responsive: true,
  })

  return result.secure_url
}

const deleteImage = async (url: string) => {
  const publicId = getCloudinaryPublicId(url)

  await cloudinary.uploader.destroy(`avatars/${publicId}`)
}

export {
  uploadImage,
  deleteImage,
}
