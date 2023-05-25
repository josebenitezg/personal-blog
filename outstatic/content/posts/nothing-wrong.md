---
title: 'Anotación Automática de Imágenes con Segment Anything Model (SAM)'
status: 'published'
author:
  name: 'Andre Vitorio'
  picture: ''
slug: 'nothing-wrong'
description: 'One more day, one more joy. I feel blessed.'
coverImage: '/images/industrial-pattern.png'
publishedAt: '2023-05-15T17:55:40.000Z'
---

👋 🚧WIP🚧

## **Configuración inicial**

Para hacer todo esto posible, primero necesitamos configurar nuestro entorno. Utilizamos varias bibliotecas importantes, como OpenCV y PyTorch, que nos permiten trabajar con imágenes y modelos de aprendizaje profundo, respectivamente. Además, definimos algunas variables importantes, como el dispositivo en el que se ejecutará nuestro modelo (una CPU o GPU, dependiendo de lo que esté disponible) y la carpeta en la que se encuentran nuestras imágenes.

```python
import os
import cv2
from pathlib import Path
import torch
import numpy as np

DEVICE = 'cuda:0' if torch.cuda.is_available() else 'cpu'
IMAGES_FOLDER = 'images'
LABELS_FOLDER = 'yolo_box_labels'
```

## **Carga del modelo SAM**

Una vez que nuestro entorno está configurado, cargamos el modelo Segment Anything Model (SAM) que será responsable de la segmentación de nuestras imágenes.

```python
SAM_ENCODER_VERSION = "vit_h"
SAM_CHECKPOINT_PATH = 'sam_vit_h_4b8939.pth'

from segment_anything import sam_model_registry, SamPredictor

sam = sam_model_registry[SAM_ENCODER_VERSION](checkpoint=SAM_CHECKPOINT_PATH).to(device=DEVICE)
predictor = SamPredictor(sam)
```

## **Anotación automática**

Ahora viene la parte interesante: la función `auto_annotate`. Esta función se encarga de anotar automáticamente las imágenes utilizando un modelo de detección de objetos YOLO y un modelo de segmentación SAM. Para cada objeto identificado por YOLO en una imagen, la función genera una máscara de segmentación que se ajusta a la forma del objeto.

🚧 WIP

```python

```

