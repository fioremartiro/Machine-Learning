# Thoracic Pathology Classifier  
**A Deep Learning Pipeline for Weakly-Supervised Chest X-ray Screening (NIH CXR8)**

> ⚠️ **Clinical Disclaimer**  
> This project is a research and educational prototype. It is **not a medical device** and must **not** be used for clinical diagnosis, treatment decisions or patient care. The model has not undergone prospective clinical validation.

---

## 1. Project overview

This repository implements a reproducible deep learning pipeline for **thoracic pathology classification** on chest X-ray images using **transfer learning with InceptionV3**. The primary experiment focuses on **binary classification of Cardiomegaly vs. Non-Cardiomegaly**, derived from the NIH Chest X-ray8 dataset.

The goal is to study:
- The feasibility of weakly-supervised learning for radiographic triage tasks  
- The performance limits of ImageNet-pretrained CNNs on medical imaging  
- Practical trade-offs between sensitivity and specificity for screening use cases  

This system is designed as a **clinical screening support prototype**, not a diagnostic system.

---

## 2. Dataset

**Source (official):**  
NIH Chest X-ray8 (CXR8):
The NIH Chest X-ray8 (CXR8) dataset is not included in this repository due to licensing restrictions and size constraints. Users must download the dataset from the official NIH source and place it locally before running any training or evaluation.

Download the dataset from:
https://nihcc.app.box.com/v/ChestXray-NIHCC

After downloading and extracting the files, organize them locally as follows:

data/  
&nbsp;&nbsp;cxr8/  
&nbsp;&nbsp;&nbsp;&nbsp;images/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00000001_000.jpg  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00000001_001.jpg  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...  
&nbsp;&nbsp;&nbsp;&nbsp;Data_Entry_2017.csv  

Configure the project to point to the dataset root directory (data/cxr8). The dataset directory should not be committed to version control.

> Do not use third-party GitHub mirrors of the dataset. Always obtain the data from the official NIH distribution to ensure correctness and licensing compliance.

**Description:**
- ~112,120 frontal chest X-ray images (JPG)
- 30,805 unique patients
- 14 thoracic pathology labels extracted via NLP from radiology reports  
- Labels are **weakly supervised** and contain known noise

**Target task:**
Binary classification:
- Positive: Cardiomegaly  
- Negative: No Cardiomegaly label

**Important dataset caveats:**
- Labels are not gold-standard radiologist annotations  
- Significant class imbalance exists  
- Potential dataset bias and domain shift  
- Multiple images per patient → requires patient-level splitting to prevent leakage  

---

## 3. Problem formulation

**Task:**  
Binary image classification:  
\[
P(y = 1 \mid X) = P(\text{Cardiomegaly} \mid \text{Chest X-ray})
\]

**Objective:**  
Maximize sensitivity at clinically acceptable false-positive rates for screening/triage scenarios.

---

## 4. Data splitting and leakage control

- Patient-level split to prevent identity leakage  
- Recommended split:
  - Train: 70% of patients  
  - Validation: 15% of patients  
  - Test: 15% of patients  

No patient appears in more than one split.

---

## 5. Preprocessing pipeline

- Input size: `299 x 299`  
- Pixel normalization:
  - Option A: `rescale = 1/255`
  - Option B (recommended): `tf.keras.applications.inception_v3.preprocess_input`
- On-the-fly loading using `ImageDataGenerator` to avoid memory overflow
- Optional augmentations:
  - Horizontal flip
  - Mild rotation
  - Intensity scaling  

All preprocessing steps are deterministic under fixed random seeds.

---

## 6. Model architecture

**Backbone:**  
InceptionV3 (pretrained on ImageNet)

**Architecture:**

- InceptionV3 (include_top = False)
- GlobalAveragePooling2D
- Dense(256, activation="relu")
- Dropout(0.5)
- Dense(1, activation="sigmoid")

**Fine-Tuning strategy:**

- Stage 1: Freeze entire backbone, train classification head  
- Stage 2: Unfreeze top N Inception blocks for fine-tuning  
- Weight decay and dropout used for regularization  

---

## 7. Training configuration

**Loss:**  
Binary Cross-Entropy

**Optimizer:**  
RMSprop or Adam  
Low learning rate fine-tuning (`1e-4` or lower)

**Class Imbalance Handling:**
- Class weights or balanced sampling  
- Explicit documentation of sampling strategy required  

**Hyperparameters (example):**

| Parameter       | Value      |
|-----------------|------------|
| Batch size      | 16–32      |
| Learning rate   | 1e-4       |
| Epochs          | 20–50      |
| Early stopping  | Patience 5 |
| LR scheduler    | ReduceLROnPlateau |

---

## 8. Evaluation protocol

**Primary Metrics:**
- ROC-AUC  
- Sensitivity (Recall for positive class)  
- Specificity  
- Precision  
- F1-score  

**Threshold Selection:**
- Fixed sensitivity operating point  
- Youden’s J statistic  
- Task-dependent clinical trade-off  

**Recommended Additional Analysis:**
- Precision–Recall curve  
- Calibration curve (reliability diagram)  
- Confusion matrix at selected threshold  

---

## 9. Results (Example Reporting Template)

> Replace with your actual numbers.

| Metric        | Validation | Test |
|---------------|------------|------|
| ROC-AUC       | 0.XX       | 0.XX |
| Sensitivity   | 0.XX       | 0.XX |
| Specificity   | 0.XX       | 0.XX |
| Precision     | 0.XX       | 0.XX |

---

## 10. Error analysis

Recommended qualitative review:
- False positives: cardiomegaly-like silhouettes due to projection or obesity  
- False negatives: subtle cardiomegaly or low contrast  
- Failure modes: rotated images, low exposure, medical devices in frame  

---

## 11. Reproducibility

To ensure reproducibility:

- Fix random seeds:
  - NumPy  
  - TensorFlow  
  - Python  
- Log:
  - Dataset version  
  - Model checkpoint hash  
  - Hyperparameters  
- Track experiments using:
  - TensorBoard / Weights & Biases  

---

## 12. Hardware and performance

**Training:**
- GPU: NVIDIA (>=8GB VRAM recommended)
- Training time: dataset and batch-size dependent  

**Inference:**
- Single-image latency: ~tens of milliseconds on GPU  
- Suitable for batch triage, not real-time bedside inference  

---

## 13. Deployment notes

This project provides:
- Offline batch inference  
- Prototype-level triage scoring  

Not provided:
- Regulatory compliance (FDA/CE)
- PACS integration
- Clinical workflow validation

---

## 14. Ethical considerations

- Weak labels introduce systemic bias  
- Performance may degrade across populations and imaging devices  
- Not evaluated for fairness or demographic stratification  
- Must not be used for automated diagnosis  

---

## 15. Requirements

- Python 3.10+
- TensorFlow 2.15+
- NumPy
- Pandas
- scikit-learn
- Matplotlib

---

## 16. References

- Wang et al., "ChestX-ray8: Hospital-scale Chest X-ray Database and Benchmarks on Weakly-Supervised Classification and Localization of Common Thorax Diseases", CVPR 2017  
- Rajpurkar et al., "CheXNet: Radiologist-Level Pneumonia Detection on Chest X-Rays with Deep Learning"

---

## 17. License

This project is released for research and educational purposes only.  
Dataset usage must comply with NIH CXR8 terms of use.
