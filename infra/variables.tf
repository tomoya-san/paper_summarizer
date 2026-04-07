variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "gemini_api_key" {
  type      = string
  sensitive = true
}

