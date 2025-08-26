provider "aws" {
  region     = "ap-south-1"   # Change if you use another region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
