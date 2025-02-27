import boto3

# Configuring boto3 to use LocalStack
dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:4566', region_name='us-west-2')

dynamodb.create_table(
    TableName='local_ms-transaction_budget',
    KeySchema=[
        {
            'AttributeName': 'uuid',
            'KeyType': 'HASH'  # Partition key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'uuid',
            'AttributeType': 'S'  # String
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
).wait_until_exists()

dynamodb.create_table(
    TableName='rabbits',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH'  # Partition key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'S'  # String
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
).wait_until_exists()

print("DynamoDB Succesfully started")