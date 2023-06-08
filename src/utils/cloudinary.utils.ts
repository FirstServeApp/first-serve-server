const getCloudinaryPublicId = (secureUrl: string): string => {
  const splitedUrl = secureUrl.split('/')
  const fileName = splitedUrl[splitedUrl.length - 1]
  const publicId = fileName.split('.')[0]

  return publicId
}

export default getCloudinaryPublicId
