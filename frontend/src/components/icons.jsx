// icons.jsx
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsMicFill,
  BsMicMuteFill,
  BsChatDots,
} from "react-icons/bs";

import { MdScreenShare, MdStopScreenShare, MdCallEnd } from "react-icons/md";

export const Icons = {
  Videocam: () => <BsCameraVideo className="icon" />,
  VideocamOff: () => <BsCameraVideoOff className="icon" />,
  CallEnd: () => <MdCallEnd className="icon" />,
  Mic: () => <BsMicFill className="icon" />,
  MicOff: () => <BsMicMuteFill className="icon" />,
  ScreenShare: () => <MdScreenShare className="icon" />,
  StopScreenShare: () => <MdStopScreenShare className="icon" />,
  Chat: () => <BsChatDots className="icon" />,
};
