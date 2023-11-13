---
title: 'Playing with AWS Inferentia Chips'
status: 'published'
author:
  name: 'Jose Benitez'
  picture: 'https://avatars.githubusercontent.com/u/58047828?v=4'
slug: 'playing-with-aws-inferentia-chips'
description: 'AWS Inferentia accelerators are designed by AWS to deliver high performance at the lowest cost for your deep learning (DL) inference applications. '
coverImage: '/images/inferentia-g0MD.jpeg'
tags: [{"value":"ai","label":"AI"},{"value":"machineLearning","label":"Machine Learning"},{"label":"Intuitivo","value":"intuitivo"},{"value":"computerVision","label":"Computer Vision"},{"label":"AWS","value":"aws"}]
publishedAt: '2023-11-13T02:29:19.486Z'
---

![](/images/apop_render-QzMD.png)

Original blogpost: [https://aws.amazon.com/blogs/machine-learning/intuitivo-achieves-higher-throughput-while-saving-on-ai-ml-costs-using-aws-inferentia-and-pytorch/](https://aws.amazon.com/blogs/machine-learning/intuitivo-achieves-higher-throughput-while-saving-on-ai-ml-costs-using-aws-inferentia-and-pytorch/%22%3Ehttps://aws.amazon.com/blogs/machine-learning/intuitivo-achieves-higher-throughput-while-saving-on-ai-ml-costs-using-aws-inferentia-and-pytorch/%3C/a&gt)

Intuitivo, a pioneer in retail innovation, is revolutionizing shopping with its cloud-based AI/ML transactional processing system. This groundbreaking technology enables us to operate millions of autonomous points of purchase (A-POPs) concurrently, transforming the way customers shop. Our solution outpaces traditional vending machines and alternatives, offering an economical edge with its 10x cheaper cost, easy setup, and maintenance-free operation. Our Innovative new A-POPs (or Vending machines) deliver enhanced customer experiences at 10x lower cost because of performance and cost advantages AWS Inferentia delivers. AWS Inferentia has enabled us to run our YOLO computer vision models 5x faster compared to GPUs and allowing for seamless, realtime shopping experiences for our customers. Additionally, AWS Inferentia has also helped us reduce costs by 95% . In this post, we cover our use case, challenges, and a brief overview of our solution using AWS Inferentia.

### The changing retail landscape and need for A-POP

The retail landscape is evolving rapidly and consumers expect the same easy-to-use and frictionless experiences they are so used to when shopping digitally. To effectively bridge the gap between the digital and physical world, and to meet the changing needs and expectations of customers, a transformative approach is required. At Intuitivo, we believe that the future of retail lies in creating highly personalized, AI-powered, and computer vision-driven autonomous points of purchase (A-POP). This technological innovation brings products within an arm's reach of customers. Not only does it put customers' favorite items at their fingertips, but it also offers them a seamless shopping experience, devoid of long lines or complex transaction processing systems. We are excited to lead this exciting new era in retail. With our cutting-edge technology, retailers can quickly and efficiently deploy thousands of A-POPs. Scaling has always been a daunting challenge for retailers, mainly due to the logistic and maintenance complexities associated with expanding traditional vending machines or other solutions. However, our camera-based solution, which eliminates the need for weight sensors, RFID or other high cost sensors, requires no maintenance and is significantly cheaper. This enables retailers to efficiently establish thousands of A-POPs, providing customers with an unmatched shopping experience while offering retailers a cost-effective and scalable solution.

### Using Cloud Inference for real-time product identification

While designing a camera-based product recognition and payment system, we ran into a decision of whether this should be done on the edge or the cloud. After considering several architectures, we designed a system that uploads videos of the transactions to the cloud for processing. Our end users start a transaction by scanning the A-POP’s QR code, which triggers the A-POP to unlock and then customers grab what they want and go. Preprocessed videos of these transactions are uploaded to the cloud. Our AI-powered transaction pipeline automatically processes these videos and charges the customer’s account accordingly. The following diagram shows the architecture of our solution. 

![](/images/diagram_aws-E0NT.png)

### Unlocking High-Performance and Cost-Effective Inference using AWS Inferentia

As retailers look to scale operations, cost of A-POPs becomes a consideration. At the same time, providing a seamless real-time shopping experience for the end-users is paramount. Our AI/ML research team focuses on identifying the best computer vision (CV) models for our system. We were now presented with a challenge on how to optimize the AI/ML operations for performance and cost simultaneously. We deploy our models on Amazon EC2 Inf1 instances powered by AWS Inferentia, Amazon’s first ML silicon designed to accelerate deep learning inference workloads. Inferentia has shown to reduce inference costs by up to 70% compared to Amazon EC2 GPU-based instances. We used the AWS Neuron SDK — a set of software tools used with Inferentia — to compile and optimize our models for deployment on EC2 Inf1 instances. The code snippet below shows how to compile a Yolo model with Neuron. Like torch.jit.trace(), neuron.trace() records the model’s operations on an example input during the forward pass to build a static IR graph.

```python
from ultralytics import YOLO
import torch_neuronx
import torch

batch_size = 1
imgsz = (640, 640)
im = torch.zeros(batch_size, 3, *imgsz).to('cpu')  # mock input

# Compiler options
half = True  # fp16
fp8 = False
dynamic = False  # dynamic batch

f = 'yolov8n.neuronx'  # output model name
neuronx_cc_args = ['--auto-cast', 'none']

if half:
    neuronx_cc_args = ['--auto-cast', 'all', '--auto-cast-type', 'fp16']
elif fp8:
    neuronx_cc_args = ['--auto-cast', 'all', '--auto-cast-type', 'fp8_e4m3']

model = torch.load('yolov8n.pt')['model']
model.eval()
model.float()
model = model.fuse()
neuronx_model = torch_neuronx.trace(
    model,
    example_inputs=im,
    compiler_args=neuronx_cc_args,
)

if dynamic:
    neuronx_model = torch_neuronx.dynamic_batch(neuronx_model)

neuronx_model.save(f)
```

We migrated our compute-heavy models from GPU-based EC2 instances p2 and p3 to Inf1. By leveraging AWS Inferentia, we achieved the throughput and performance to match our business needs. Adopting Inferentia-based Inf1 instances in the MLOps life cycle was a key to achieve remarkable results: \* Performance improvement: Our large computer vision models now run 5x faster, achieving over 120 FPS, allowing for seamless, realtime shopping experiences for our customers. Furthermore, the ability to process at this frame rate not only enhances transaction speed, but also, enables us to feed more information into our models. This 5x increase in data input significantly improves the accuracy of product detection within our models, further boosting the overall efficacy of our shopping systems. \* Cost savings: We managed to slash inference costs by an impressive 95%. This significantly enhanced the architecture design supporting our A-POPs. The higher reduction has been achieved by switching from EC2 p3.2xlarge instances. As said before, we were also able to process five times more images within the same time frame. The following chart shows the Frame per second (FPS) improvement for one of our product detection models that was running in containers on EC2 p3.2xlarge instances. 

![](/images/fps_achived-E5ND.png)

### Data Parallel Inference was easy with AWS Neuron SDK

To improve performance of our inference workloads and extract maximum performance from AWS Inferentia, we wanted to use all available NeuronCores in the Inferentia accelerator. Achieving this performance was easy to do with the built in tools and apis from the Neuron SDK. We used the torch.neuron.DataParallel(). This Python function implements data parallelism at module level on models created by the PyTorch Neuron API. Data parallelism is a form of parallelization across multiple devices or cores (NeuronCores for Inferentia), referred to as nodes. Each node contains the same model and parameters, but data is distributed across the different nodes. By distributing the data across multiple nodes, data parallelism reduces the total execution time of large batch size inputs compared to sequential execution. Data parallelism works best for models in latency-sensitive applications that have large batch size requirements.

### Looking Ahead: Accelerating Retail Transformation with Foundation Models and Scalable Deployment

As we venture into the future, the impact of foundation models on the retail industry cannot be overstated. Foundation models can make a significant difference in product labeling. The ability to quickly and accurately identify and categorize different products is crucial in a fast-paced retail environment. With modern transformer-based models, we will be looking to deploy a larger diversity of models to serve more of our AI/ML needs, with higher accuracy, improving the experience for users, and without having to waste time and money training models from scratch. By harnessing the power of foundation models, we can accelerate the process of labeling, enabling retailers to scale their A-POP solutions more rapidly and efficiently. We have begun implementing Segment Anything Model (SAM), a vision transformer foundation model that can segment any object in any image. We will discuss this in another blog. SAM allows us to accelerate our labeling process with unparalleled speed. SAM is significantly more efficient, able to process approximately 62 times more images than a human can manually create bounding boxes for in the same timeframe. SAM's output is used to train a model that detects segmentation masks in transactions, opening up a window of opportunity for processing millions of images exponentially faster. This reduces training time and cost for product planogram models significantly. 

![](/images/sam-QwMD.png)

Our product and AI/ML research teams are excited to be at the forefront of this transformation. The ongoing partnership with AWS and our use of AWS Inferentia in our infrastructure will ensure that we can deploy these foundation models in a cost-effective way. As early adopters, we are working with the new AWS Inferentia 2-based instances. Inf2 instances are built built for today's Generative AI and LLM inference acceleration, delivering higher performance and lower costs. Inf2 will enable us to empower retailers to harness the benefits of AI-driven technologies without breaking the bank, ultimately making the retail landscape more innovative, efficient, and customer-centric. As we continue to migrate more models to AWS Inferentia and AWS Inferentia2, including transformers-based foundational models, we are confident that our alliance with AWS will enable us to grow and innovate alongside our trusted cloud provider. Together, we will reshape the future of retail, making it smarter, faster, and more attuned to the ever-evolving needs of consumers.

In this technical traverse, we've highlighted our transformational journey using AWS Inferentia for its innovative AI/ML transactional processing system. This partnership has led to a five-fold increase in processing speed and a stunning 95% cut in inference costs, changing the current approach of the retail industry by facilitating a real-time and seamless shopping experience.

# About the authors

**Matias Ponchon** is the Head of Infrastructure at Intuitivo. He specializes in architecting secure and robust applications. With extensive experience in FinTech and Blockchain companies, coupled with his strategic mindset, helps him to design innovative solutions. He has a deep commitment to excellence, that's why he consistently delivers resilient solutions that push the boundaries of what's possible.

**Jose Benitez** is the Founder and Director of AI at Intuitivo, specializing in the development and implementation of computer vision applications. He leads a talented Machine Learning team, nurturing an environment of innovation, creativity, and cutting-edge technology. In 2022, Jose was recognized as an 'Innovator Under 35' by MIT Technology Review, a testament to his groundbreaking contributions to the field. This dedication extends beyond accolades and into every project he undertakes, showcasing a relentless commitment to excellence and innovation.