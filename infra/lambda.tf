resource "aws_lambda_function" "api" {
  function_name = "paper-summarizer-api"
  role          = aws_iam_role.api_lambda.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.api.repository_url}:latest"

  environment {
    variables = {
      PAPERS_TABLE_NAME = aws_dynamodb_table.papers.name
      SQS_QUEUE_URL     = aws_sqs_queue.paper_summarize.url
    }
  }
}

resource "aws_lambda_function" "worker" {
  function_name = "paper-summarizer-worker"
  role          = aws_iam_role.worker_lambda.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.worker.repository_url}:latest"
  timeout       = 300

  environment {
    variables = {
      PAPERS_TABLE_NAME       = aws_dynamodb_table.papers.name
      GEMINI_API_KEY_SSM_NAME = aws_ssm_parameter.gemini_api_key.name
    }
  }
}

resource "aws_lambda_event_source_mapping" "worker_sqs" {
  event_source_arn = aws_sqs_queue.paper_summarize.arn
  function_name    = aws_lambda_function.worker.arn
  batch_size       = 1
}
