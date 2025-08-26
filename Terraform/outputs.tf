output "instance_public_ips" {
  value = aws_instance.mern[*].public_ip
}

output "instance_ids" {
  value = aws_instance.mern[*].id
}
