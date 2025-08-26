variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_name" {
  description = "Key pair name"
  default     = "ankit"
}

variable "ami_id" {
  description = "AMI ID for EC2"
  default     = "ami-0e670eb768a5fc3d4" # Ubuntu 22.04 in ap-south-1 (Mumbai)
}
