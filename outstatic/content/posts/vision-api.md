---
title: 'Vision API'
status: 'published'
author:
  name: 'Jose Benitez'
  picture: 'https://avatars.githubusercontent.com/u/58047828?v=4'
slug: 'vision-api'
description: 'Hello and welcome to VisionAPI, where cutting-edge GPT-based models meet simplicity in a sleek API interface. The mission is to harness the power of AI to work with images, videos, and audio to create Apps faster than ever.'
coverImage: '/images/visionapi-I1Mj.png'
tags: [{"label":"AI","value":"ai"},{"label":"Machine Learning","value":"machineLearning"},{"label":"LLM","value":"llm"},{"label":"Computer Vision","value":"computerVision"}]
publishedAt: '2023-11-13T01:32:21.417Z'
---

## Making Large Vision Models even easier to use.

The main idea behind bulding VisionAPI is to use cutting-edge GPT-based models with simplicity in a sleek API interface.

Make sure you have Python installed on your system and you're ready to dive into the world of AI.

Repo: https://github.com/josebenitezg/VisionAPI

#### 📦 Installation

To install VisionAPI, simply run the following command in your terminal:

```bash
pip install visionapi
```

##### 🔑 Authentication

Before you begin, authenticate your OpenAI API key with the following command:

```bash
export OPENAI_API_KEY='your-api-key-here'
```

#### 🔩 Usage

##### 🖼️ Image Inference

Empower your applications to understand and describe images with precision.

```python
import visionapi

# Initialize the Inference Engine
inference = visionapi.Inference()

# Provide an image URL or a local path
image = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"

# Set your descriptive prompt
prompt = "What is this image about?"

# Get the AI's perspective
response = inference.image(image, prompt)

# Revel in the AI-generated description
print(response.message.content)
```

##### 🎥 Video Inference

Narrate the stories unfolding in your videos with our AI-driven descriptions.

```python
import visionapi

# Gear up the Inference Engine
inference = visionapi.Inference()

# Craft a captivating prompt
prompt = "Summarize the key moments in this video."

# Point to your video file
video = "path/to/video.mp4"

# Let the AI weave the narrative
response = inference.video(video, prompt)

# Display the narrative
print(response.message.content)
```

##### 🎨 Image Generation

Watch your words paint pictures with our intuitive image generation capabilities.

```python
import visionapi

# Activate the Inference Engine
inference = visionapi.Inference()

# Describe your vision
prompt = "A tranquil lake at sunset with mountains in the background."

# Bring your vision to life
image_urls = inference.generate_image(prompt, save=True)  # Set `save=True` to store locally

# Behold the AI-crafted imagery
print(image_urls)
```

##### 🗣️ TTS (Text to Speech)

Transform your text into natural-sounding speech with just a few lines of code.

```python
import visionapi

# Power up the Inference Engine
inference = visionapi.Inference()

# Specify where to save the audio
save_path = "output/speech.mp3"

# Type out what you need to vocalize
text = "Hey, ready to explore AI-powered speech synthesis?"

# Make the AI speak
inference.TTS(text, save_path)
```

##### 🎧 STT (Speech to Text)

Convert audio into text with unparalleled clarity, opening up a world of possibilities.

```python
import visionapi

# Initialize the Inference Engine
inference = visionapi.Inference()

# Convert spoken words to written text
text = inference.STT('path/to/audio.mp3')

# Marvel at the transcription
print(text)
```

To contribute to the code, you can fork the repository, make your desired changes, and submit a pull request for review. Make sure to follow the guidelines and conventions specified by the project to ensure smooth integration of your contributions. Happy coding!