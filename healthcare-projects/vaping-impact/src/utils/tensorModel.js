import * as tf from '@tensorflow/tfjs';

/**
 * 1. Generate Synthetic Medical Data
 * Simulates a study of 500 patients to train the model.
 * 
 * Features (Inputs):
 * - Age (0-100, normalized)
 * - Nicotine Mg/Day (0-100, normalized)
 * - Device Type (0=Mod, 1=Pod, 2=Disposable)
 * - Years Vaping (0-20, normalized)
 * 
 * Label (Output):
 * - Addiction Risk Score (0.0 - 1.0)
 */
const generateSyntheticData = (count = 500) => {
    const inputs = [];
    const labels = [];

    for (let i = 0; i < count; i++) {
        // Random User Profile
        const age = Math.floor(Math.random() * 60) + 15; // 15-75
        const nicotine = Math.floor(Math.random() * 60); // 0-60mg
        const deviceType = Math.floor(Math.random() * 3); // 0, 1, 2
        const years = Math.floor(Math.random() * 10); // 0-10 years

        // Calculate "True" Risk (The Logic we want the AI to learn)
        // We add non-linear weights to simulate complex biological interactions
        let riskScore = 0;

        // Base Nicotine Risk (Linear)
        riskScore += (nicotine / 60) * 0.5;

        // Device Multiplier (Disposables are more efficient)
        if (deviceType === 2) riskScore *= 1.2; // Disposable boost

        // Age Vulnerability (Younger brains get addicted faster)
        if (age < 25) riskScore += 0.2;

        // Chronic Exposure (Years) - UPDATED with NIH Research
        // Study: Long-term vaping impairs blood vessels similar to smoking.
        // Source: https://www.nih.gov/news-events/news-releases/nih-funded-studies-show-damaging-effects-vaping-smoking-blood-vessels
        if (years > 2) {
            riskScore += (years / 10) * 0.4; // Increased weight for vascular damage
        } else {
            riskScore += (years / 10) * 0.3;
        }

        // Clamp between 0 and 1
        riskScore = Math.min(Math.max(riskScore, 0), 1);

        // Add to dataset (Normalize inputs)
        inputs.push([
            age / 100,          // Norm Age
            nicotine / 100,     // Norm Nicotine
            deviceType / 2,     // Norm Device
            years / 20          // Norm Years
        ]);
        labels.push([riskScore]);
    }

    return {
        inputs: tf.tensor2d(inputs),
        labels: tf.tensor2d(labels)
    };
};

/**
 * 2. Create & Train Model
 */
let model = null;

export const trainModel = async () => {
    if (model) return model; // Return if already trained

    // Define Neural Network Architecture
    model = tf.sequential();

    // Input Layer (4 features) -> Hidden Layer (8 neurons)
    model.add(tf.layers.dense({
        inputShape: [4],
        units: 8,
        activation: 'relu'
    }));

    // Output Layer (1 neuron: Risk Score)
    model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid' // Output 0-1
    }));

    model.compile({
        optimizer: tf.train.adam(0.1),
        loss: 'meanSquaredError'
    });

    // Generate Data
    const { inputs, labels } = generateSyntheticData(500);

    // Train
    console.log('Training TensorFlow Model...');
    await model.fit(inputs, labels, {
        epochs: 20,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                // console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
            }
        }
    });
    console.log('Model Trained!');

    // Cleanup tensors
    inputs.dispose();
    labels.dispose();

    return model;
};

/**
 * 3. Predict Risk
 */
export const predictRisk = async (age, nicotine, deviceStr, years) => {
    if (!model) await trainModel();

    // Encode Device
    let deviceVal = 0; // Mod
    if (deviceStr === 'pod') deviceVal = 1;
    if (deviceStr === 'disposable') deviceVal = 2;

    // Create Input Tensor
    const inputTensor = tf.tensor2d([[
        age / 100,
        nicotine / 100,
        deviceVal / 2,
        years / 20
    ]]);

    // Run Inference
    const prediction = model.predict(inputTensor);
    const riskValue = prediction.dataSync()[0];

    // Cleanup
    inputTensor.dispose();
    prediction.dispose();

    return riskValue; // 0.0 to 1.0
};
