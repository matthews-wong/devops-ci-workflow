# CI Workflow Lab

A lightweight, robust continuous integration and delivery template utilizing GitHub Actions for automated testing, linting, and container security scanning.

## Overview

This repository demonstrates a clean, modular CI/CD pipeline setup for modern containerized microservices. It features:
- Automated code linting and formatting checks.
- Container image vulnerability scanning using Trivy.
- Automated testing and artifact publishing.

## Pipeline Architecture

```
[ Push / PR ] ---> [ Lint & Code Quality ] ---> [ Unit Tests ] ---> [ Container Scan ] ---> [ Release ]
```

## Getting Started

Check the `.github/workflows/` directory for workflow definitions.
