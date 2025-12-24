import { motion } from "framer-motion";
import { Monitor, Mouse, Shield, AlertTriangle, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: typeof Monitor;
  granted: boolean;
  required: boolean;
}

interface PermissionGateProps {
  permissions: Permission[];
  onGrant: (id: string) => void;
  onDeny: (id: string) => void;
  onProceed: () => void;
  className?: string;
}

export function PermissionGate({ 
  permissions, 
  onGrant, 
  onDeny, 
  onProceed,
  className 
}: PermissionGateProps) {
  const allRequiredGranted = permissions
    .filter(p => p.required)
    .every(p => p.granted);

  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <CardHeader className="relative text-center pb-2">
        <div className="mx-auto mb-3 p-4 rounded-full bg-warning/20 w-fit">
          <Shield className="w-8 h-8 text-warning" />
        </div>
        <CardTitle className="text-xl">Desktop Automation Permissions</CardTitle>
        <CardDescription className="text-sm max-w-md mx-auto">
          Solaris needs permission to interact with your desktop. 
          You'll always be asked before any action is taken.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Permission List */}
        <div className="space-y-3">
          {permissions.map((permission) => (
            <motion.div
              key={permission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-colors",
                permission.granted 
                  ? "bg-success/5 border-success/30" 
                  : "bg-background-elevated border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  permission.granted ? "bg-success/20" : "bg-background-hover"
                )}>
                  <permission.icon className={cn(
                    "w-5 h-5",
                    permission.granted ? "text-success" : "text-foreground-secondary"
                  )} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{permission.name}</span>
                    {permission.required && (
                      <span className="text-xs text-warning">Required</span>
                    )}
                  </div>
                  <p className="text-xs text-foreground-tertiary">{permission.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {permission.granted ? (
                  <div className="flex items-center gap-1 text-success text-sm">
                    <Check className="w-4 h-4" />
                    Granted
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-foreground-secondary hover:text-error"
                      onClick={() => onDeny(permission.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => onGrant(permission.id)}
                    >
                      Allow
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-foreground-secondary">
            Desktop automation allows Solaris to control your mouse and keyboard.
            All actions will be shown for your approval before execution.
          </p>
        </div>

        {/* Proceed Button */}
        <Button 
          className="w-full btn-gradient"
          disabled={!allRequiredGranted}
          onClick={onProceed}
        >
          {allRequiredGranted ? "Continue to Automation" : "Grant Required Permissions"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Default permissions for convenience
export const defaultPermissions: Permission[] = [
  {
    id: "screen",
    name: "Screen Viewing",
    description: "View your screen to understand context",
    icon: Monitor,
    granted: false,
    required: true,
  },
  {
    id: "mouse",
    name: "Mouse Control",
    description: "Move cursor and click elements",
    icon: Mouse,
    granted: false,
    required: true,
  },
];
