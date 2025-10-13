import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createOssRecord, getOssAuth } from '~/apis/resource'

export const useOss = () => {
  const ossConfig = useState('oss-config', () => ({
    expired: Date.now(),
    config: {
      endpoint: '',
      bucket: '',
      region: 'us-east-1',
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
        sessionToken: ''
      },
      forcePathStyle: true
    }
  }))
  /**
   * 获取上传凭证
   */
  const getOssToken = async () => {
    try {
      const { expired, config } = ossConfig.value
      // 修复: token未过期且存在时,直接返回,不重复获取
      if (expired > Date.now() && config.credentials.sessionToken) {
        return ossConfig.value
      }
      
      // token过期或不存在时,重新获取
      const { data } = await getOssAuth()
      ossConfig.value.config.endpoint = data.endpoint
      ossConfig.value.config.bucket = data.bucket
      ossConfig.value.config.credentials = {
        accessKeyId: data.accessKeyId,
        secretAccessKey: data.secretAccessKey,
        sessionToken: data.sessionToken
      }
      ossConfig.value.expired = Date.now() + 3500 * 1000
      return ossConfig.value
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 获取时间字符串
   */
  const getDateStr = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const monthStr = month >= 10 ? month : `0${month}`
    const day = now.getDate()
    const dayStr = day >= 10 ? day : `0${day}`
    return `${year}${monthStr}${dayStr}`
  }
  /**
   * 生成随机字符串
   */
  const guid = () => {
    return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
      const r = (Math.random() * 16) | 0
      return r.toString(16)
    })
  }
  /**
   * 获取上传key
   */
  const getFilePath = (fileName = '') => {
    const timeStr = getDateStr()
    const randomStr = guid()
    const extStr = fileName.substring(fileName.lastIndexOf('.'))
    return `uploads/${timeStr}/${randomStr}${extStr.toLowerCase()}`
  }
  /**
   * 单文件上传
   */
  const putFile = async (file: File) => {
    try {
      await getOssToken()
      const { config } = ossConfig.value
      const s3Client = new S3Client(config)
      const fileArrayBuffer = await file.arrayBuffer()
      const key = getFilePath(file.name)
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: new Uint8Array(fileArrayBuffer),
        ContentType: file.type
      })
      const s3Result = await s3Client.send(command)
      const url = `${config.endpoint}/${config.bucket}/${key}`
      const params = {
        name: file.name,
        url,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        timestamp: Date.now(),
        hash: s3Result.ETag.replaceAll('\"', '')
      }
      // 提交创建记录
      return createOssRecord(params)
    } catch (error) {
      console.error(error)
    }
  }
  return {
    putFile
  }
}
