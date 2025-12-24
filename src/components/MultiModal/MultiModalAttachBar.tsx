import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Paperclip, 
  Image, 
  FileText, 
  Mic, 
  Camera,
  X,
  File
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./ImagePreview";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  name: string;
  url: string;
  size: number;
}

interface MultiModalAttachBarProps {
  attachments: Attachment[];
  onAttach: (files: File[]) => void;
  onRemove: (id: string) => void;
  onScreenCapture?: () => void;
  onVoiceStart?: () => void;
  className?: string;
}

export function MultiModalAttachBar({
  attachments,
  onAttach,
  onRemove,
  onScreenCapture,
  onVoiceStart,
  className,
}: MultiModalAttachBarProps) {
  const [showOptions, setShowOptions] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: 'image' | 'document') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      docInputRef.current?.click();
    }
    setShowOptions(false);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAttach(files);
    }
    e.target.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 flex-wrap"
          >
            {attachments.map((attachment) => (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {attachment.type === 'image' ? (
                  <ImagePreview
                    src={attachment.url}
                    alt={attachment.name}
                    onRemove={() => onRemove(attachment.id)}
                    className="w-16 h-16"
                  />
                ) : (
                  <div className="relative group flex items-center gap-2 px-3 py-2 rounded-lg bg-background-elevated border border-border">
                    <File className="w-4 h-4 text-foreground-tertiary" />
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground truncate max-w-[100px]">
                        {attachment.name}
                      </span>
                      <span className="text-[10px] text-foreground-tertiary">
                        {formatSize(attachment.size)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                      onClick={() => onRemove(attachment.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attach Button & Options */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowOptions(!showOptions)}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-2 p-2 rounded-lg bg-popover border border-border shadow-lg flex items-center gap-1"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleFileSelect('image')}
                  title="Attach image"
                >
                  <Image className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleFileSelect('document')}
                  title="Attach document"
                >
                  <FileText className="w-4 h-4" />
                </Button>
                {onVoiceStart && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      onVoiceStart();
                      setShowOptions(false);
                    }}
                    title="Voice message"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                )}
                {onScreenCapture && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      onScreenCapture();
                      setShowOptions(false);
                    }}
                    title="Screen capture"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick access buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => handleFileSelect('image')}
        >
          <Image className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => handleFileSelect('document')}
        >
          <FileText className="w-4 h-4" />
        </Button>
        {onVoiceStart && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={onVoiceStart}
          >
            <Mic className="w-4 h-4" />
          </Button>
        )}
        {onScreenCapture && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={onScreenCapture}
          >
            <Camera className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}
