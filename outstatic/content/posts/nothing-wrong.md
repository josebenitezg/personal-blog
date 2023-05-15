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



👋 Hoy les traigo un emocionante proyecto en el que hemos estado trabajando. Se trata de un sistema que anota automáticamente las etiquetas de segmentación a partir de bounding boxes. En otras palabras, hemos enseñado a una máquina a dibujar líneas alrededor de los objetos que queremos identificar en nuestras imágenes. ¡Y todo de forma automática!

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



