---
title: 'Use .env in Python'
status: 'published'
author:
  name: 'Jose Benitez'
  picture: 'https://avatars.githubusercontent.com/u/58047828?v=4'
slug: 'env-in-python'
description: 'Using .env in python quick note'
coverImage: ''
publishedAt: '2024-01-08T19:14:23.667Z'
---

Environment variables defined inside a .env file

```bash
GCP_PROJECT_ID=my-project-id
SERVICE_ACCOUNT_FILE=path/to/serviceAccountCredentials
STORAGE_BUCKET_NAME=my-super-important-data
```

 

```python
from dotenv import load_dotenv

load_dotenv()

GCP_PROJECT_ID = os.getenv('GCP_PROJECT_ID')
SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
STORAGE_BUCKET_NAME = os.getenv('STORAGE_BUCKET_NAME')
```

 