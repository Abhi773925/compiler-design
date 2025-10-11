# Video Call Feature Documentation

## Overview

A comprehensive video calling system integrated into the collaboration platform, enabling real-time video communication between users in the same room.

## Features

### 🎥 Video Calling

- **Multi-participant support**: Handle 4-6 users simultaneously in a video call
- **WebRTC technology**: Peer-to-peer video and audio streaming
- **High-quality video**: Supports up to 1280x720 resolution
- **Echo cancellation**: Built-in audio processing for clear communication

### 🎛️ Call Controls

- **Video toggle**: Turn camera on/off with visual indicators
- **Audio toggle**: Mute/unmute microphone with status display
- **Screen sharing**: Share screen with other participants
- **Fullscreen mode**: Expand video call to fullscreen view
- **Call management**: Start, join, and end calls with intuitive controls

### 🔔 Notification System

- **Incoming call modal**: Beautiful notification when receiving calls
- **Auto-decline**: Calls automatically decline after 30 seconds
- **Visual indicators**: Active call status in sidebar
- **Participant count**: Real-time display of connected users

### 🎨 UI/UX Features

- **Theme integration**: Matches dark/light theme of the application
- **Responsive design**: Works on desktop and mobile devices
- **Smooth animations**: Framer Motion powered transitions
- **Grid layout**: Dynamic video grid based on participant count
- **Modern interface**: Clean, professional design consistent with app theme

## Technical Implementation

### Frontend Components

#### VideoCall.jsx

- Main video calling component
- WebRTC peer connection management
- Media stream handling (camera, microphone, screen)
- UI controls and layout management
- Socket.io integration for signaling

#### IncomingCallModal.jsx

- Incoming call notification interface
- Accept/decline call actions
- Auto-dismiss functionality
- Themed modal design

### Backend Integration

- Socket.io event handlers for video call signaling
- WebRTC offer/answer/ICE candidate exchange
- Room-based call management
- Participant tracking and status updates

### WebRTC Configuration

```javascript
const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];
```

## Usage

### Starting a Video Call

1. Click the video call icon in the collaboration sidebar
2. The call request is sent to all users in the room
3. Other users see an incoming call notification modal
4. Users can accept or decline the call invitation

### During a Call

- **Toggle video**: Click camera icon to turn video on/off
- **Toggle audio**: Click microphone icon to mute/unmute
- **Share screen**: Click monitor icon to share your screen
- **Fullscreen**: Click expand icon for fullscreen view
- **End call**: Click red phone icon to leave the call

### Call Management

- Active calls show a green indicator on the video call button
- Participant count displays in the top-right of video area
- Video grid automatically adjusts based on participant count
- Disconnected users are automatically removed from the call

## Socket Events

### Client → Server

- `call-start`: Initiate a video call
- `call-accepted`: Accept an incoming call
- `call-declined`: Decline an incoming call
- `call-offer`: Send WebRTC offer
- `call-answer`: Send WebRTC answer
- `ice-candidate`: Exchange ICE candidates
- `call-end`: End the video call
- `video-toggle`: Toggle video state
- `audio-toggle`: Toggle audio state

### Server → Client

- `call-request`: Incoming call notification
- `call-accepted`: Call was accepted
- `call-declined`: Call was declined
- `call-offer`: Receive WebRTC offer
- `call-answer`: Receive WebRTC answer
- `ice-candidate`: Receive ICE candidate
- `user-left-call`: User left the call
- `user-video-toggle`: User video state changed
- `user-audio-toggle`: User audio state changed

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## Security & Privacy

- **HTTPS required**: WebRTC requires secure connections in production
- **Permission-based**: Requires user consent for camera/microphone access
- **Peer-to-peer**: Direct connection between users (no media server)
- **STUN servers**: Uses Google's public STUN servers for NAT traversal

## Performance Optimizations

- **Dynamic quality**: Adjusts video quality based on network conditions
- **Efficient encoding**: Optimized video/audio codecs
- **Resource cleanup**: Proper cleanup of media streams and connections
- **Error handling**: Robust error handling for connection failures

## Future Enhancements

- **Recording capability**: Record video calls
- **Virtual backgrounds**: Add background blur/replacement
- **Breakout rooms**: Split participants into smaller groups
- **Chat integration**: Text chat during video calls
- **File sharing**: Share files during calls
- **Whiteboard integration**: Shared whiteboard during calls

## Troubleshooting

### Common Issues

1. **Camera/microphone not working**: Check browser permissions
2. **Cannot connect to other users**: Verify network/firewall settings
3. **Poor video quality**: Check internet connection speed
4. **Echo/feedback**: Use headphones or enable echo cancellation

### Error Messages

- "Failed to access camera/microphone": Browser permission denied
- "Connection failed": Network connectivity issues
- "Call declined": Remote user declined the call
- "User disconnected": Network interruption or user left

## Integration

The video call feature is fully integrated with:

- **Collaboration system**: Works alongside code editing and whiteboard
- **Authentication**: Respects user permissions and login state
- **Theme system**: Matches application's dark/light theme
- **Responsive design**: Adapts to different screen sizes
- **Socket.io**: Uses existing real-time communication infrastructure
