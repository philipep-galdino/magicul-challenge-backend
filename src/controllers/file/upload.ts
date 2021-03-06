import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { File } from '../../typeorm/entities/File'
import { User } from '../../typeorm/entities/User'

export const upload = async (request: Request, response: Response) => {
  const { body, file } = request

  console.log({ body })
  console.log({ file })

  const user = await User.findById(parseInt(body.user_id))

  if (!user) return response.status(404).send('User not found')
  if (!file) return response.status(404).send('File not found')

  const fileWithOwner = {
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    owner: user,
  }

  const fileToSave = await getRepository(File).save(fileWithOwner)

  return response.send({
    fileName: fileToSave.filename,
    fileSize: fileToSave.size,
    fileFormat: fileToSave.mimeType,
    lastModifiedDate: fileToSave.updatedAt,
  })
}
