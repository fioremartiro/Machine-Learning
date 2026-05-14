# Supervised Learning

Supervised learning is the type of machine learning where the model learns from a labeled dataset, meaning every training example already includes the correct answer. The fundamental goal is for the algorithm to discover the mathematical map that connects inputs (X) with outputs (Y), allowing it to accurately predict the result of new data it has never seen before by identifying the patterns learned during training.

Supervised learning problems are broadly categorized into:

---

## 📈 Regression
Regression is the technique specialized in predicting a magnitude or measurable quantity to answer the question "how much," always resulting in a continuous numerical output. Through this process, the algorithm seeks the formula that best models how the final result directly depends on changes in the input data.



*   **Goal:** Predict a continuous numeric value.
*   **Example:** Predicting House Prices (Output: Price).
*   **Algorithms:** Linear, Multiple, Polynomial, Ridge, Lasso, Elastic Net.
*   👉 See [Regression Examples](./Regression_examples/README.md)

---

## 🏷️ Classification
Classification is the technique specialized in assigning labels or categories to answer the question "what is it," always resulting in a discrete output. The algorithm seeks to establish decision boundaries that divide data according to its membership in a specific group, allowing it to identify the identity of a new data point.



*   **Goal:** Assign data to predefined classes or categories.
*   **Example:** Email Spam Detection (Output: Spam / Not Spam).
*   **Algorithms:** Logistic Regression, Decision Trees, Random Forest, SVM, KNN, Naive Bayes.
*   👉 See [Classification Examples](./Classification_Examples/README.md)
