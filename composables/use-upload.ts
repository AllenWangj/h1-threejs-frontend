import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getOssAuth } from "~/apis/resource";

export const useUpload = () => {
    const config = useState<any>('oss-auth', () => ({
        endpoint: 'https://cdn.spic.cc',
        region: 'us-east-1',
        credentials: {
            accessKeyId: '',
            secretAccessKey: '',
            sessionToken: ''
        },
        forcePathStyle: true
    }))

    const fetchOssAuth = async () => {
        try {
            if (!!config.value.credentials.accessKeyId) return
            const { data } = await getOssAuth()
            console.log(data)
            config.value.endpoint = data.endpoint || '',
                config.value.credentials.accessKeyId = data.accessKeyId || ''
            config.value.credentials.secretAccessKey = data.secretAccessKey || ''
            config.value.credentials.sessionToken = data.sessionToken || ''
        } catch (error) {
            console.log(error)
        }
    }

    const loadFile = async (file: File) => {
        try {
            await fetchOssAuth()
            const s3Client = new S3Client(config.value)
            const fileArrayBuffer = await file.arrayBuffer();
            const command = new PutObjectCommand({
                Bucket: 'h1-static',
                Key: `uploads/${file.name}`,
                Body: new Uint8Array(fileArrayBuffer),
                ContentType: file.type
            })
            await s3Client.send(command)
            return { url: `https://cdn.spic.cc/h1-static/uploads/${file.name}` }
        } catch (error) {
            throw new Error(error);
        }
    }

    return {
        fetchOssAuth,
        loadFile
    }
}