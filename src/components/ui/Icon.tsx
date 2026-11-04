import {
  ChartLine,
  Compass,
  Eye,
  Fingerprint,
  Handshake,
  Layers,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  PenTool,
  Puzzle,
  Target,
  TrendingUp,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconKey } from "@/types/content";

/**
 * Correspondance entre les clés d'icônes utilisées dans `src/data` et les icônes Lucide.
 * Les données restent ainsi sérialisables et indépendantes de la librairie d'icônes.
 */
const icons: Record<IconKey, LucideIcon> = {
  fingerprint: Fingerprint,
  megaphone: Megaphone,
  "trending-up": TrendingUp,
  eye: Eye,
  "message-circle": MessageCircle,
  "mouse-pointer-click": MousePointerClick,
  compass: Compass,
  target: Target,
  "pen-tool": PenTool,
  "chart-line": ChartLine,
  puzzle: Puzzle,
  workflow: Workflow,
  handshake: Handshake,
  layers: Layers,
};

interface IconProps extends LucideProps {
  name: IconKey;
}

/** Icône décorative par défaut (masquée aux lecteurs d'écran). */
export function Icon({ name, ...props }: IconProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" strokeWidth={1.6} {...props} />;
}
