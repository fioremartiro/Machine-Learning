# Vaping Impact Visualizer 🫁

A data-driven **Single Page Application (SPA)** designed to reveal the hidden health and financial costs of vaping. This project utilizes **TensorFlow.js** running entirely in the browser to analyze user habits and predict addiction risks using a custom-trained Neural Network.

### Website - https://vaping-impact.vercel.app/

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)
![Vite](https://img.shields.io/badge/vite-6.0+-purple.svg)
![TensorFlow.js](https://img.shields.io/badge/tensorflow.js-4.22-orange)
![Vercel](https://img.shields.io/badge/vercel-deployed-black)

## 🏗️ Architecture

The system is built as a **Client-Side Only** application for maximum privacy and performance:

1.  **Frontend:** Built with **React** and **Vite**. It handles all user logic, state management, and visual rendering.
2.  **ML Engine:** **TensorFlow.js** runs a sequential neural network directly in the user's browser. No data is ever sent to a server.
3.  **Visualizer:** Custom CSS and SVG animations dynamically represent the volume of smoke and cigarette equivalents based on user input.
4.  **Data Layer:** Local constants and calculation utilities for Costa Rican market data (prices, nicotine content).

## 🚀 Key Features

*   **Client-Side AI:** A Neural Network trains on-the-fly (using synthetic clinical data) to predict addiction risk (0-100%) based on age, device type, and usage duration.
*   **Toxicity Scanner:** An interactive breakdown of a vape device, revealing the hidden dangers of specific components (Coil, Aerosol, Battery).
*   **Real-Time Impact:** Instantly converts "ml of liquid" into "cigarettes smoked" to provide a shocking, relatable metric.
*   **Financial Calculator:** Estimates monthly spending in Costa Rican Colones (CRC) and compares it to local benchmarks (e.g., "Casados").
*   **Mobile-First Design:** Optimized touch interactions and responsive layouts for a seamless mobile experience.

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Language:** JavaScript (ES6+)
*   **Styling:** Vanilla CSS (Variables & Responsive Media Queries)

### Machine Learning
*   **Library:** TensorFlow.js (`@tensorflow/tfjs`)
*   **Model:** Sequential Neural Network (Dense Layers with ReLU/Sigmoid activation)
*   **Training:** In-browser training on synthetic datasets.

## 🧠 Machine Learning Engine (Technical Deep Dive)

Unlike traditional apps that use pre-trained models, this application **trains a Neural Network in real-time** within the user's browser. This demonstrates a privacy-first approach to Health AI.

### 1. Model Architecture
We utilize a **Sequential Model** optimized for tabular classification:
*   **Input Layer (4 Features):**
    *   `Age` (Normalized 0-1)
    *   `Nicotine Mg/Day` (Normalized 0-1)
    *   `Device Type` (Categorical Encoding: Mod=0, Pod=0.5, Disposable=1.0)
    *   `Years Vaping` (Normalized 0-1)
*   **Hidden Layer:** Dense layer with **8 Neurons** and **ReLU** activation. This allows the model to capture non-linear relationships (e.g., *younger users develop addiction exponentially faster*).
*   **Output Layer:** Single neuron with **Sigmoid** activation to output a probability score (0.0 - 1.0).

### 2. Synthetic Clinical Data
To simulate a medical study without compromising patient privacy, we generate a **Synthetic Dataset (n=500)** on the client side. The data generation logic incorporates real-world medical research:
*   **Age Vulnerability:** Weights are adjusted to reflect higher neuroplasticity and addiction susceptibility in users under 25.
*   **Device Efficiency:** Disposables (NicSalt) are weighted higher due to their efficient nicotine delivery systems compared to older mods.
*   **Chronic Exposure:** Non-linear penalty for users vaping >2 years, simulating vascular damage accumulation (based on NIH studies).

### 3. Training Process
*   **Optimizer:** Adam (`learningRate=0.1`)
*   **Loss Function:** Mean Squared Error (MSE)
*   **Epochs:** 20
*   **Performance:** Training completes in <200ms on an average smartphone, providing instant feedback without server latency.

## ⚙️ Local Setup

### Prerequisites
*   Node.js 18+

### 1. Clone the Repository
```bash
git clone https://github.com/fioremartiro/Machine-Learning.git
cd "healthcare-projects/vaping-impact"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
*App runs on `http://localhost:5173`*

## ☁️ Deployment

### Vercel
1.  **Install Vercel CLI:** `npm i -g vercel`
2.  **Deploy:**
    ```bash
    vercel --prod
    ```
3.  **Configuration:** The project uses a `vercel.json` to handle SPA routing (rewrites all paths to `index.html`).

## ⚠️ Disclaimer
This application is for **educational and awareness purposes only**. The "Addiction Risk" score is a mathematical prediction based on general patterns and is not a medical diagnosis. Always consult a healthcare professional for medical advice.
