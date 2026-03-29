---
title: "Raft训练日志2"
description:
date: 2026-03-28T17:25:09+08:00
image:
math:
license:
tag: ["Blog", "CV", "DL", "AI"]
comments: true
draft: false
categories: "实验日志"
build:
  list: always # Change to "never" to hide the page from the list
---

## 1、前情提要

我上一个训练日志中，尝试对RAFT-Stereo模型进行优化，通过添加refinement层和边缘损失感知，然后训练完的模型的EPE和D1几乎没有产生变化。因为这个层结构对整个模型来说都没什么影响。接着我在改完的这个模型后，对模型进行了partial unfreezement，然后在此基础上对middlebury数据集进行训练。最后得到的结果EPE和D1反而变差了，这个大概率是因为我本地的数据集太小，在此基础上进行训练会很容易导致过拟合的现象。自此，我便将研究重心转移到模型轻量化方面来。

---

## 2.模型设计

首先，我先去官方库上找到了不同版本模型的[下载链接](https://drive.google.com/drive/folders/1booUFYEXmsdombVuglatP0nZXb5qI89J)。我原本一直都是使用他的middlebury版本，因为我本地的数据集也是middelbury，得到的效果也很好，然后我注意到除了middlebury，以外还有两个以数据集命名的预训练模型eth3d和sceneflow。还有一个模型就是raftstereo-realtime.pt，我后来调查得到，这个模型就是官方训练出来的**轻量化版本**，然，我就想着先拿这个模型测试一下。
除此以外，我还想了通过转换精度来实现轻量化，具体就是不改变模型原始网络结构，也不用重新训练模型，将原本的**Float32转换成Float16**,这样便可以大幅度降低模型的大小和显存占用，对于低显存的边缘设备，能提升帧率和处理速度。以下为处理代码，处理逻辑实际上`value.half()`这一句。

```python
def convert_to_fp16(input_path, output_path):
    print(f"Reading original checkpoint from: {input_path}")
    state_dict = torch.load(input_path, map_location='cpu')
    new_state_dict = {}
    for key, value in state_dict.items():
        if isinstance(value, torch.Tensor) and value.is_floating_point():
            new_state_dict[key] = value.half()  # Convert to float16
        else:
            new_state_dict[key] = value  # Keep non-floating-point parameters unchanged
    print(f"Saving FP16 checkpoint to: {output_path}")
    torch.save(new_state_dict, output_path)
    print("Conversion completed successfully!")
```

这一方案的核心思想就是：

- 保留原始高精度模型结构。
- 避免重新训练带来的额外成本。

---

## 3.训练结果

### (1)、官方 realtime 模型与高精度模型对比

| 模型                   | 参数量 |     EPE |      D1 |
| ---------------------- | -----: | ------: | ------: |
| RAFT-Stereo Middlebury | 11.14M |  2.3758 | 12.0526 |
| RAFT-Stereo Realtime   |  9.89M | 11.1557 | 28.5460 |

从结果可以看出，官方 realtime 模型参数量相较高精度 Middlebury 模型有所减少，但在 Middlebury2014 数据集上的精度下降非常明显：

- EPE 由 **2.3758** 上升到 **11.1557**
- D1 由 **12.0526** 上升到 **28.5460**

这说明：**直接采用官方轻量模型虽然能够降低模型规模，但会带来较大的精度损失，不适合作为当前任务的最终部署方案。**

### (2)、FP16 半精度部署结果

| 模型          |    EPE |      D1 | 平均推理时间 |  FPS | 最大显存占用 | 模型大小 |
| ------------- | -----: | ------: | -----------: | ---: | -----------: | -------: |
| Baseline FP32 | 2.3758 | 12.0526 |    209.80 ms | 4.77 |    844.91 MB |    43 MB |
| FP16          | 2.3535 | 12.0593 |    173.59 ms | 5.76 |    662.34 MB |    22 MB |

进一步计算可得：

- **模型大小**：43 MB → 22 MB，下降约 **48.8%**
- **显存占用**：844.91 MB → 662.34 MB，下降约 **21.6%**
- **平均推理时间**：209.80 ms → 173.59 ms，缩短约 **17.3%**
- **FPS**：4.77 → 5.76，提升约 **20.8%**

而在精度方面：

- **EPE**：2.3758 → 2.3535，基本保持一致
- **D1**：12.0526 → 12.0593，几乎不变

这说明：**将高精度 Middlebury 模型直接转换为 FP16 半精度模型后，模型精度基本保持稳定，同时明显降低了模型存储、显存占用和推理时间。**

## 4.小结

虽然我做出的改进非常小，但是得到的效果我觉得还是可以的，应该是足够支撑去作为本科毕业设计的成果的，但不知道胡老师会怎么看，希望能美美通关。
