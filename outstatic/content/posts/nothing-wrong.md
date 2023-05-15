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

```python
from utils import convert_bbox

def auto_annotate(file_name, image_path, input_boxes, class_ids, output_dir=None):
    """
    Automatically annotates images using a YOLO object detection model and a SAM segmentation model.
    Args:
        data (str): Path to a folder containing images to be annotated.
        det_model (str, optional): Pre-trained YOLO detection model. Defaults to 'yolov8x.pt'.
        sam_model (str, optional): Pre-trained SAM segmentation model. Defaults to 'sam_b.pt'.
        device (str, optional): Device to run the models on. Defaults to an empty string (CPU or GPU, if available).
        output_dir (str, None, optional): Directory to save the annotated results.
            Defaults to a 'labels' folder in the same directory as 'data'.
    """
    
    image = cv2.imread(image_path)
    xyxy_bbox = convert_bbox(input_boxes, img_width=image.shape[1], img_height=image.shape[0])
    input_boxes = torch.tensor(xyxy_bbox, device=DEVICE)

    predictor.set_image(image)

    if not output_dir:
        output_dir = 'yolo_masks_labels'
    Path(output_dir).mkdir(exist_ok=True, parents=True)

    transformed_boxes = predictor.transform.apply_boxes_torch(input_boxes, image.shape[:2])

    if len(class_ids):
        masks, _, _ = predictor.predict_torch(
        point_coords=None,
        point_labels=None,
        boxes=transformed_boxes,
        multimask_output=False,
        )
        # create a list for segments 
        segments = []

        for i, mask in enumerate(masks):

            binary_mask = masks[i].squeeze().cpu().numpy().astype(np.uint8)
            # Find the contours of the mask
            contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            # Get the largest countour Area
            largest_contour = max(contours, key=cv2.contourArea)
            # Get the segmentation mask for object
            segmentation = largest_contour.flatten().tolist()
            mask = segmentation
            # width, height = image_path.size
            height, width = image.shape[:2]
            # normalized_coordinates = normalize_coordinates(mask, width, height)
            # convert mask to numpy array of shape (N,2)
            mask = np.array(mask).reshape(-1, 2)
            # normalize the pixel coordinates
            mask_norm = mask / np.array([width, height])
            segments.append(mask_norm)

        with open(str(Path(output_dir) / Path(file_name).stem) + '.txt', 'w') as f:
            for i in range(len(segments)):
                s = segments[i]
                if len(s) == 0:
                    continue
                segment = map(str, segments[i].reshape(-1).tolist())
                f.write(f'{class_ids[i]} ' + ' '.join(segment) + '\n')
```

