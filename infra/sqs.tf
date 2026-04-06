resource "aws_sqs_queue" "paper_summarize" {
  name                       = "paper-summarize"
  visibility_timeout_seconds = 300
  message_retention_seconds  = 86400
}
