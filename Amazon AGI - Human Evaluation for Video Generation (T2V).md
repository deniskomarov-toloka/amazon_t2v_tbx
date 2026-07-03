# **Amazon AGI \- Human Evaluation for Video Generation (T2V)**

**Project approach:**

Each single item from the batch is a pair of videos. Our expert-annotators need to evaluate videos and tell which one is better according to their evaluation.

We have 7 different metrics which people need to evaluate:

1. Overall Preference  
2. Video Image Quality  
3. Video Motion Quality  
4. Subject-Background Consistency  
5. Video Realism  
6. Video Image-Text Alignment  
7. Video Motion-Text Alignment

**Overall Preference:**   
This is the most important metric for the client and it directly correlates with Video Image-Text Alignment & Video Image Quality. Client explicitly stated that:  
	1\. Overall Preference \== Video Image-Text Alignment (if not tie)  
	2\. If the value above is a tie, Overall Preference \== Video Image Quality (if not tie)  
	3\. If the value above is a tie, Overall Preference \== Overall Preference

**Video Image Quality:**  
When observing the video frames independently, people need to determine which video has the clearest and sharpest details of three entities present in the images (with no visible noise, distortion, and low resolution). People also can select None if both the videos are very poor in quality.

If there is a watermark on the video \- it’s considered as bad.

**Video Motion Quality:**  
People need to determine which video features better motion quality of the subject and the background, maintaining a smooth motion between frames, avoiding abrupt jumps (no or lesser temporal flickering). Unless specifically asked in the prompts, videos with the following traits are considered poor in quality: a) Videos showing nearly no motion. b) Videos with only camera motions (for example, zoom in or out) and no movements in the subject and the background.

**Subject-Background Consistency:**  
People need to determine which video exhibits a more consistent appearance of the subject and the background environment throughout the video. Unless specifically asked in the text prompt, videos showing unnatural changes in the subject or background are considered poor in quality.

**Video Realism:**  
People need to determine which video shows more real or natural looking content. Unless specifically asked in the prompt, videos with the following traits are not preferred: a) Videos with cartoonish or animated looking content. b) Videos showing unnatural motions of objects and backgrounds.

**Video Image-Text Alignment:**  
People need to determine which video better follows the prompt. In this case, we ask people to split prompt into multiple entities (e.g. dog, cat, etc. \- atomic items) and count them. The video with most entities is preferred.

**Video Motion-Text Alignment:**  
People need to determine which video unfolds the scene in a logical and coherent manner, aligning with the expected sequence of events as described in the text prompt. Motions in the videos include the actions of the subject, movements in the background, camera motions, scene changes, and so on.

**Important Notice:**

Lately (starting for Mar 20th 2025), client started to send us almost the same videos. They’re actually not the same but in 99% they are. Now they’re specifically looking for more realistic and videos with better quality.

Since both videos are almost the same, it might seem that the Video Image-Text Alignment metric will also always be the same? No, let’s say we have: ripples entity in the prompt and both videos have ripples but one of the videos has more ripples than the other, so we need to choose the video with most ripples.

 