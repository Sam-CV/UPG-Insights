import os
import boto3
import sys

def test_aws_credentials():
    # Print current environment variables (will show as None if not set)
    print("Environment variables:")
    print(f"AWS_ACCESS_KEY_ID: {'Set' if os.environ.get('AWS_ACCESS_KEY_ID') else 'Not set'}")
    print(f"AWS_SECRET_ACCESS_KEY: {'Set' if os.environ.get('AWS_SECRET_ACCESS_KEY') else 'Not set'}")
    
    # Try to connect to AWS
    try:
        # Method 1: Use environment variables
        print("\nTrying to connect using environment variables...")
        s3_client = boto3.client('s3')
        response = s3_client.list_buckets()
        print("Success! Connected to AWS.")
        print("Available S3 buckets:", [bucket['Name'] for bucket in response['Buckets']])
        return s3_client
    except Exception as e:
        print(f"Error: {str(e)}")
        
        # Prompt for credentials
        print("\nWould you like to enter your AWS credentials manually? (y/n)")
        answer = input().strip().lower()
        if answer == 'y':
            aws_access_key = input("Enter your AWS Access Key ID: ")
            aws_secret_key = input("Enter your AWS Secret Access Key: ")
            aws_region = input("Enter AWS Region (default is us-east-1): ") or "us-east-1"
            
            try:
                # Method 2: Use explicitly provided credentials
                print("\nTrying to connect using provided credentials...")
                s3_client = boto3.client(
                    's3',
                    aws_access_key_id=aws_access_key,
                    aws_secret_access_key=aws_secret_key,
                    region_name=aws_region
                )
                response = s3_client.list_buckets()
                print("Success! Connected to AWS.")
                print("Available S3 buckets:", [bucket['Name'] for bucket in response['Buckets']])
                
                # Save to config file if desired
                print("\nWould you like to save these credentials to your AWS config file? (y/n)")
                save_answer = input().strip().lower()
                if save_answer == 'y':
                    home_dir = os.path.expanduser("~")
                    aws_dir = os.path.join(home_dir, ".aws")
                    os.makedirs(aws_dir, exist_ok=True)
                    
                    credentials_file = os.path.join(aws_dir, "credentials")
                    with open(credentials_file, "w") as f:
                        f.write("[default]\n")
                        f.write(f"aws_access_key_id = {aws_access_key}\n")
                        f.write(f"aws_secret_access_key = {aws_secret_key}\n")
                    
                    config_file = os.path.join(aws_dir, "config")
                    with open(config_file, "w") as f:
                        f.write("[default]\n")
                        f.write(f"region = {aws_region}\n")
                        
                    print(f"Credentials saved to {credentials_file}")
                
                return s3_client
            except Exception as e:
                print(f"Error with provided credentials: {str(e)}")
                print("Please check your credentials and try again.")
                sys.exit(1)
        else:
            print("Exiting without connecting to AWS.")
            sys.exit(1)

# Test AWS credentials
s3_client = test_aws_credentials()

# If we get here, credentials are working
print("\nCredentials are working! You can now use the full script to upload images.")