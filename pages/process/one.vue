<template>
  <div>
    <ez-image-upload v-model="imageUrl" :api="upload" />
  </div>
</template>

<script setup lang="ts">
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const imageUrl = ref('')
const upload = async (file: File) => {
  console.log(file);
  const s3Client = new S3Client({
    endpoint: 'https://cdn.spic.cc',
    region: 'us-east-1',
    credentials: {
      accessKeyId: '4IY5L9LYTRKT63I85RIW',
      secretAccessKey: 'YZpY2OnVghxEyAZV+Vr4MAd4TIrt916zL+SDP06b',
      sessionToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI0SVk1TDlMWVRSS1Q2M0k4NVJJVyIsImV4cCI6MTc1ODQ2NDEwMSwicGFyZW50IjoibWF4dGFuIn0.tobET0wQzm1qM2Lfqc2rOjZj6U-rIMdMTLXHJGiIelhLk43hZH0j8as1onwzMEZahpTvqX5NXcrX5d-oUEFueQ'
    },
    forcePathStyle: true
  })
  const fileArrayBuffer = await file.arrayBuffer();
  const command = new PutObjectCommand({
    Bucket: 'h1-static',
    Key: `uploads/${file.name}`,
    Body: new Uint8Array(fileArrayBuffer),
    ContentType: file.type
  })
  const result = await s3Client.send(command)
  console.log(`https://cdn.spic.cc/h1-static/uploads/${file.name}`);
  return { url: `https://cdn.spic.cc/h1-static/uploads/${file.name}` }
}
</script>

<style lang="less" scoped></style>
