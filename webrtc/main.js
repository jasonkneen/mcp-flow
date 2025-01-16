navigator.mediaDevices.getUserMedia({ video: false, audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    // You can process the audio stream here
  })
  .catch(error => {
    console.error('Error accessing media devices.', error);
  });