---
title: 'Create good requirements.txt'
status: 'published'
author:
  name: 'Jose Benitez'
  picture: 'https://avatars.githubusercontent.com/u/58047828?v=4'
slug: 'create-good-requirements'
description: ''
coverImage: ''
publishedAt: '2024-01-08T19:15:09.505Z'
---

First, install pipreqs and pip-tools:

```bash
pip3 install pipreqs pip-tools
```

Now, create requirements.in using pipreqs. Next, generate requirements.txt using pip-tools. But why do we combine these tools?

pipreqs doesn't capture sub-packages, which pip-tools does. So, we use pipreqs to create a package list in requirements.in. Then, we generate requirements.txt using pip-tools, where you'll find a comprehensive package list, including sub-packages.

Here is the final command:

```bash
pipreqs --savepath=requirements.in --use-local && pip-compile
```

Both --savepath and --use-local are crucial

parameters:

```
--savepath: Defines the exact filename and path for the requirements.in file.
--use-local: Retrieves the package list from your virtual environment.
So now you will find your desired requirements.txt
```

I haven't delved much into pip-tools. For a more detailed explanation, you can refer to my previous post about pip-tools.

 