resource "aws_ecr_repository" "api" {
  name         = "paper-summarizer-api"
  force_delete = true
}

resource "aws_ecr_repository" "worker" {
  name         = "paper-summarizer-worker"
  force_delete = true
}
