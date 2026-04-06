data "archive_file" "api_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/api"
  output_path = "${path.module}/builds/api_lambda.zip"
}

resource "aws_lambda_function" "api" {
  function_name    = "paper-summarizer-api"
  role             = aws_iam_role.api_lambda.arn
  handler          = "handler.handler"
  runtime          = "python3.12"
  filename         = data.archive_file.api_lambda.output_path
  source_code_hash = data.archive_file.api_lambda.output_base64sha256

  environment {
    variables = {
      PAPERS_TABLE_NAME = aws_dynamodb_table.papers.name
    }
  }
}