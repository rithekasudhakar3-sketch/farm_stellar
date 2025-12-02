# AWS S3 Setup Guide

This guide will help you set up AWS S3 for file uploads in the Farm Stellar application.

## Prerequisites
- AWS Account
- AWS CLI installed (optional but recommended)

## Step 1: Create an S3 Bucket

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/)
2. Navigate to **S3** service
3. Click **Create bucket**
4. Configure the bucket:
   - **Bucket name**: Choose a unique name (e.g., `farmstellar-uploads`)
   - **AWS Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Block Public Access settings**: Uncheck "Block all public access" if you want public read access to uploaded files
   - Click **Create bucket**

## Step 2: Configure CORS

To allow uploads from your frontend application:

1. Go to your bucket
2. Click on the **Permissions** tab
3. Scroll down to **Cross-origin resource sharing (CORS)**
4. Click **Edit** and paste this configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://yourdomain.com"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

5. Click **Save changes**

## Step 3: Create IAM User for Programmatic Access

1. Navigate to **IAM** service
2. Click **Users** → **Add users**
3. User name: `farmstellar-app`
4. Select **Programmatic access**
5. Click **Next: Permissions**
6. Click **Attach existing policies directly**
7. Search for and select: **AmazonS3FullAccess** (or create a custom policy for more security)
8. Click through to **Create user**
9. **IMPORTANT**: Copy the **Access Key ID** and **Secret Access Key** (you won't see the secret key again!)

## Step 4: (Optional) Create Custom IAM Policy

For better security, create a custom policy that only allows access to your specific bucket:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:HeadObject"
            ],
            "Resource": [
                "arn:aws:s3:::farmstellar-uploads",
                "arn:aws:s3:::farmstellar-uploads/*"
            ]
        }
    ]
}
```

## Step 5: Configure Backend Environment Variables

Update your `.env` file:

```env
AWS_REGION=us-east-1
AWS_S3_BUCKET=farmstellar-uploads
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
UPLOAD_MAX_BYTES=10485760
```

## Step 6: Configure Bucket Policy (Optional)

If you want uploaded files to be publicly readable:

1. Go to your bucket
2. Click **Permissions** tab
3. Scroll to **Bucket policy**
4. Click **Edit** and paste:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::farmstellar-uploads/*"
        }
    ]
}
```

## Testing the Setup

1. Start your backend server:
```bash
npm run dev
```

2. Test the presigned URL endpoint:
```bash
curl -X POST http://localhost:4000/api/uploads/presign \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mimeType":"image/jpeg","sizeBytes":12345}'
```

3. You should receive a response with `uploadUrl` and `key`

4. Use the `uploadUrl` to upload a file:
```bash
curl -X PUT "UPLOAD_URL" \
  -H "Content-Type: image/jpeg" \
  --upload-file /path/to/image.jpg
```

## File Access URLs

After uploading, files can be accessed at:
```
https://farmstellar-uploads.s3.us-east-1.amazonaws.com/uploads/file-key
```

Or use the signed URL for temporary access:
```javascript
const signedUrl = await s3Service.getSignedDownloadUrl(key);
```

## Security Best Practices

1. **Never commit AWS credentials** to version control
2. Use **IAM roles** instead of access keys when running on AWS infrastructure (EC2, Lambda, etc.)
3. Enable **bucket versioning** for file recovery
4. Enable **server-side encryption** (SSE-S3 or SSE-KMS)
5. Set up **CloudWatch alarms** for unusual activity
6. Implement **lifecycle policies** to archive or delete old files
7. Use **AWS CloudFront** CDN for better performance and security

## Cost Optimization

1. Use **S3 Intelligent-Tiering** for automatic cost optimization
2. Set up **lifecycle rules** to move old files to cheaper storage classes
3. Enable **S3 Transfer Acceleration** only if needed for global uploads
4. Monitor usage with **AWS Cost Explorer**

## Troubleshooting

### 403 Forbidden Error
- Check IAM permissions
- Verify bucket policy
- Ensure CORS is configured correctly

### SignatureDoesNotMatch Error
- Verify AWS credentials in .env
- Check that credentials haven't expired
- Ensure correct AWS region is set

### Network Timeout
- Check if backend can reach AWS endpoints
- Verify no firewall blocking AWS services
- Consider using VPC endpoints if in AWS infrastructure

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
