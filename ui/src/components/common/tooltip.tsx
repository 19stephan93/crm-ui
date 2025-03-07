import { forwardRef, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type CustomTooltipProps = {
  children: ReactNode;
  content: string | ReactNode;
  side?: "top" | "right" | "bottom" | "left";
};

export const CustomTooltip = forwardRef(
  ({ children, content, side }: CustomTooltipProps, _ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent className="pointer-events-none" side={side}>
            {typeof content === "string" ? (
              <p className="text-sm font-normal">{content}</p>
            ) : (
              content
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);
