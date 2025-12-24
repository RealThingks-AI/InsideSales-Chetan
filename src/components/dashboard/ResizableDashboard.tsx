import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import ReactGridLayout, { type Layout } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import {
  WidgetKey,
  DEFAULT_WIDGETS,
  WidgetLayoutConfig,
  WidgetLayout,
} from "./DashboardCustomizeModal";

interface ResizableDashboardProps {
  isResizeMode: boolean;
  visibleWidgets: WidgetKey[];
  widgetLayouts: WidgetLayoutConfig;
  onLayoutChange: (layouts: WidgetLayoutConfig) => void;
  onWidgetRemove: (key: WidgetKey) => void;
  renderWidget: (key: WidgetKey) => React.ReactNode;
  containerWidth: number;
}

const COLS = 12;
const ROW_HEIGHT = 28;

export const ResizableDashboard = ({
  isResizeMode,
  visibleWidgets,
  widgetLayouts,
  onLayoutChange,
  onWidgetRemove,
  renderWidget,
  containerWidth,
}: ResizableDashboardProps) => {
  const layout: Layout[] = useMemo(() => {
    const defaults = new Map<WidgetKey, WidgetLayout>();
    DEFAULT_WIDGETS.forEach((w) => defaults.set(w.key, w.defaultLayout));

    return visibleWidgets.map((key) => {
      const saved = widgetLayouts[key];
      const d = defaults.get(key) ?? { x: 0, y: 0, w: 3, h: 2 };

      return {
        i: key,
        x: Math.max(0, Math.min(COLS - 1, saved?.x ?? d.x ?? 0)),
        y: Math.max(0, saved?.y ?? d.y ?? 0),
        w: Math.max(2, Math.min(COLS, saved?.w ?? d.w ?? 3)),
        h: Math.max(2, saved?.h ?? d.h ?? 2),
        minW: 2,
        minH: 2,
      };
    });
  }, [visibleWidgets, widgetLayouts]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    const next: WidgetLayoutConfig = { ...widgetLayouts };

    newLayout.forEach((l) => {
      const key = l.i as WidgetKey;
      next[key] = { x: l.x, y: l.y, w: l.w, h: l.h };
    });

    onLayoutChange(next);
  };

  return (
    <div className="dashboard-grid">
      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={Math.max(320, containerWidth)}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={isResizeMode}
        isResizable={isResizeMode}
        draggableHandle=".dash-drag-handle"
        resizeHandles={["se", "s", "e", "n", "w", "ne", "nw", "sw"]}
        compactType="vertical"
        preventCollision
        allowOverlap={false}
        onLayoutChange={handleLayoutChange}
        useCSSTransforms
      >
        {visibleWidgets.map((key) => (
          <div
            key={key}
            className={isResizeMode ? "dash-item dash-item--edit" : "dash-item"}
          >
            {isResizeMode && (
              <Button
                variant="destructive"
                size="icon"
                className="dash-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onWidgetRemove(key);
                }}
                aria-label={`Remove ${key} widget`}
              >
                <X className="h-3 w-3" />
              </Button>
            )}

            {isResizeMode && (
              <div
                className="dash-drag-handle"
                role="button"
                aria-label="Drag widget"
                tabIndex={0}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <div className={isResizeMode ? "dash-content dash-content--locked" : "dash-content"}>
              {renderWidget(key)}
            </div>
          </div>
        ))}
      </ReactGridLayout>

      <style>{`
        .dashboard-grid .react-grid-layout {
          min-height: 200px;
        }

        .dash-item {
          height: 100%;
          position: relative;
        }

        .dash-content {
          height: 100%;
        }

        .dash-content--locked {
          pointer-events: none;
          user-select: none;
        }

        .dash-item--edit {
          animation: dash-wiggle 0.28s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes dash-wiggle {
          0%, 100% { transform: rotate(-0.25deg); }
          50% { transform: rotate(0.25deg); }
        }

        .dash-remove {
          position: absolute;
          top: -8px;
          right: -8px;
          z-index: 20;
          height: 24px;
          width: 24px;
          border-radius: 9999px;
          box-shadow: 0 6px 16px hsl(var(--foreground) / 0.12);
        }

        .dash-drag-handle {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 20;
          cursor: grab;
          border-radius: 10px;
          padding: 6px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background) / 0.9);
          backdrop-filter: blur(8px);
          box-shadow: 0 6px 16px hsl(var(--foreground) / 0.08);
        }
        .dash-drag-handle:active {
          cursor: grabbing;
        }

        /* Make resize handles more visible while matching theme */
        .dashboard-grid .react-resizable-handle {
          background-image: none;
          opacity: ${isResizeMode ? 1 : 0};
          transition: opacity 0.15s ease;
        }
        .dashboard-grid .react-resizable-handle::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          border-right: 2px solid hsl(var(--primary));
          border-bottom: 2px solid hsl(var(--primary));
          right: 6px;
          bottom: 6px;
          border-radius: 2px;
        }

        .dashboard-grid .react-grid-item.react-grid-placeholder {
          background: hsl(var(--primary) / 0.12);
          border: 1px dashed hsl(var(--primary) / 0.35);
        }
      `}</style>
    </div>
  );
};
