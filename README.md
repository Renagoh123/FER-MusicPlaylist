# 🎶🤖 Facial Emotion Recognition with Attention-Enhanced ResNet18 for Emotion-Based Playlist Mapping 

This project focuses **Facial Emotion Recognition (FER)** with **Spotify-based music recommendations**, offering an interactive experience where the system detects your facial expression and maps it to a emotion-aligned playlist in real time. Built using deep learning and computer vision techniques, the application leverages a **ResNet18 model enhanced with CBAM (Convolutional Block Attention Module)** for improved emotion classification accuracy.

## Overview
- ⚡ Emotion classification using **ResNet18 + CBAM**
- 📈 Trained on **FER-2013** dataset (7 emotions → 4 selected)
- 🎭 Real-time facial emotion detection via webcam
- 🎼 Spotify integration for emotion-based music recommendations
- 📊 Model evaluation with accuracy, precision, recall, F1-score

## System Architecture
1. **Data Preparation**
   - Dataset: FER-2013 (32k grayscalebimages, 48x48)
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
