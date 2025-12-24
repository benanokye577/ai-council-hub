import { VoiceInterface } from "@/components/Voice/VoiceInterface";
import { useNavigate } from "react-router-dom";

export default function Voice() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full">
      <VoiceInterface onClose={() => navigate(-1)} />
    </div>
  );
}