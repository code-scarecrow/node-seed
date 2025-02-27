import boto3

s3_client = boto3.client(
    "s3",
    endpoint_url=f"http://localhost:4566/",
    aws_access_key_id="local",
    aws_secret_access_key="local"
)

s3_client.create_bucket(Bucket="test-bucket")

print("S3 Succesfully started")