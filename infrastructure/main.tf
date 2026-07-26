terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "peteshepley-ops-tofu-state"
    key            = "apps/resume-app/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "peteshepley-ops-tofu-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# --- Static app (S3 + CloudFront + GitHub OIDC deploy role) ---
# Shared shape with api-console/infrastructure and (once migrated)
# books-app/infrastructure — see github.com/PeteShepley/terraform-aws-static-app
# for what's common and why.

module "app" {
  source = "github.com/PeteShepley/terraform-aws-static-app"

  app_name             = "resume-app"
  site_bucket_name     = var.site_bucket_name
  domain_name          = var.domain_name
  root_domain_name     = var.root_domain_name
  distribution_comment = "resume-app (resume.peteshepley.com)"
  github_repo          = var.github_repo
}
