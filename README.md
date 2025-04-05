# 🎶🤖 Facial Emotion Recognition with Attention-Enhanced ResNet18 for Emotion-Based Playlist Mapping 

This project focuses on developing a **Facial Emotion Recognition (FER)** model using **ResNet18 enhanced with CBAM (Convolutional Block Attention Module)** to improve classification accuracy. The trained model is integrated with the **Spotify Web API** to enable **emotion-aligned playlist mapping** based on real-time facial expressions detected via webcam.

The CBAM-enhanced ResNet18 model achieved an accuracy of **78%**, outperforming baseline models and confirming the benefit of attention mechanisms in FER tasks. The system demonstrates **real-time emotion recognition** and provides an interactive music recommendation experience aligned with the user's emotional state.

While the system does not generate fully personalized playlists based on listening history, it offers an **automated, emotion-aware music recommendation** process, enhancing user engagement through affective computing.

This project showcases the potential of AI in **context-aware media recommendations** and lays the groundwork for future research in emotionally responsive systems. Future improvements may include:
- Expanding the emotion categories beyond the core four
- Refining the playlist mapping mechanism
- Introducing personalization to adapt to individual user preferences


## Overview
- ⚡ Emotion classification using **ResNet18 + CBAM**
- 📈 Trained on **FER-2013** dataset (7 emotions → 4 selected)
- 🎭 Real-time facial emotion detection via webcam
- 🎼 Spotify integration for emotion-based music recommendations
- 📊 Model evaluation with accuracy, precision, recall, F1-score

## System Architecture
1. **Data Preparation**
   - Dataset: [FER-2013](https://www.kaggle.com/datasets/msambare/fer2013)  (32k grayscale images, 48x48)
   - Preprocessing: image filtering, augmentation, class balancing
     
2. **Model Training**
   - Baseline: Simple CNN
   - Proposed Final Model: ResNet18 with CBAM
     
3. **Emotion-to-Music Mapping**
   - Webcam integration for live input
   - Trained model classifies emotion (happy, sad, angry, neutral)
   - Spotify API retrieves playlists based on detected emotion
   - Mapping logic aligns moods to playlist types (e.g. sad → depressed playlist)
     
4. **Evaluation**
   - Model performance on test data (Confusion Matrix, Accuracy, F1-score)

## Technologies Used
- **Python, PyTorch, OpenCV**
- **Spotify Web API** (spotipy)
- **pandas, scikit-learn, matplotlib**
- **Google Colab** for training and prototyping

## To Run the Project
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/FER-MusicSync.git
   cd FER-MusicSync

2. Set up your .env file (for Spotify API credentials):
   ```sh
   SPOTIPY_CLIENT_ID=your_client_id
   SPOTIPY_CLIENT_SECRET=your_client_secret
   SPOTIPY_REDIRECT_URI=http://localhost:8888/callback

3. Launch the notebook or run the script:
   ```sh
   jupyter notebook
