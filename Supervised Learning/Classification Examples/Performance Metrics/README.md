# Performance metrics in Classification

Evaluation metrics in supervised classification assess how well a model predicts categorical outcomes. Different metrics provide specific insights into model performance depending on class distribution, cost of false predictions and decision thresholds.

This folder contains implementations of the following evaluation metrics:

## 1. Accuracy
The ratio of correctly predicted instances to the total instances. It provides a simple overall performance measure, best suited for balanced datasets.

## 2. Precision and Recall
Precision measures the proportion of positive identifications that were actually correct, minimizing false positives. Recall measures the proportion of actual positives correctly identified by the model, minimizing false negatives.

## 3. F1 Score
The harmonic mean of Precision and Recall. It provides a single balanced score when optimizing between false alarms and missed detections, particularly on imbalanced datasets.

## 4. Confusion Matrix
A performance measurement layout that visualizes the distribution of actual versus predicted classes across True Positives, True Negatives, False Positives, and False Negatives.

## 5. ROC and AUC
The Receiver Operating Characteristic (ROC) curve evaluates classification performance across all probability thresholds. The Area Under the Curve (AUC) summarizes the model's ability to distinguish between classes into a single score ranging from 0 to 1.

---

Each metric in this folder is demonstrated with example notebooks:

- `1. accuracy.ipynb`
- `2. precision_and_recall.ipynb`
- `3. f1_score.ipynb`
- `4. confusion_matrix.ipynb`
- `5. roc_auc.ipynb`
