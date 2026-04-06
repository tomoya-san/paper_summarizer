data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "api_lambda" {
  name               = "paper-summarizer-api-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "api_lambda_basic" {
  role       = aws_iam_role.api_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "api_lambda_dynamodb" {
  statement {
    actions = [
      "dynamodb:GetItem",
      "dynamodb:Scan",
    ]
    resources = [aws_dynamodb_table.papers.arn]
  }
}

resource "aws_iam_policy" "api_lambda_dynamodb" {
  name   = "paper-summarizer-api-dynamodb"
  policy = data.aws_iam_policy_document.api_lambda_dynamodb.json
}

resource "aws_iam_role_policy_attachment" "api_lambda_dynamodb" {
  role       = aws_iam_role.api_lambda.name
  policy_arn = aws_iam_policy.api_lambda_dynamodb.arn
}

data "aws_iam_policy_document" "api_lambda_sqs" {
  statement {
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.paper_summarize.arn]
  }
}

resource "aws_iam_policy" "api_lambda_sqs" {
  name   = "paper-summarizer-api-sqs"
  policy = data.aws_iam_policy_document.api_lambda_sqs.json
}

resource "aws_iam_role_policy_attachment" "api_lambda_sqs" {
  role       = aws_iam_role.api_lambda.name
  policy_arn = aws_iam_policy.api_lambda_sqs.arn
}