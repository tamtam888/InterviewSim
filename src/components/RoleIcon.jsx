import {
  Monitor,
  Atom,
  Layers,
  Server,
  BugOff,
  Map,
  PenTool,
  BarChart3,
  Headphones,
  Briefcase,
  Code2,
  Users,
  MessageSquareHeart,
  Shuffle,
} from "lucide-react";

const ICONS = {
  Monitor,
  Atom,
  Layers,
  Server,
  BugOff,
  Map,
  PenTool,
  BarChart3,
  Headphones,
  Briefcase,
  Code2,
  Users,
  MessageSquareHeart,
  Shuffle,
};

/** Resolves an icon name from data files to a lucide component. */
export default function RoleIcon({ name, size = 22 }) {
  const Icon = ICONS[name] ?? Briefcase;
  return <Icon size={size} aria-hidden="true" />;
}
