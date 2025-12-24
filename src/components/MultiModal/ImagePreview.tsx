import { motion } from "framer-motion";
import { X, ZoomIn, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function ImagePreview({ src, alt, onRemove, onEdit, className }: ImagePreviewProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "relative group rounded-lg overflow-hidden border border-border bg-background-card",
          className
        )}
      >
        <img
          src={src}
          alt={alt || "Preview"}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={() => setExpanded(true)}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          {onEdit && (
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Remove button */}
        {onRemove && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </motion.div>

      {/* Expanded view */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-background/90 backdrop-blur-xl"
          onClick={() => setExpanded(false)}
        >
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={src}
            alt={alt || "Preview"}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                window.open(src, '_blank');
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setExpanded(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
}
