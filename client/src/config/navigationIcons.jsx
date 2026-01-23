import React from 'react';
import {
  Home,
  Users,
  User,
  Folder,
  Monitor,
  FileText,
  ClipboardList,
  LayoutGrid,
  PlusCircle
} from 'lucide-react';

/**
 * SVG icons used in navigation
 * Each icon is a React component from lucide-react
 */
export const navigationIcons = {
  home: <Home />,
  professors: <Users />,
  students: <User />,
  folder: <Folder />,
  'all-projects': <Monitor />,
  'project-students': <FileText />,
  requests: <ClipboardList />,
  domains: <LayoutGrid />,
  add: <PlusCircle />
};

/**
 * Get icon component by name
 * @param {string} iconName - Name of the icon
 * @returns {JSX.Element|null} SVG icon component or null if not found
 */
export const getIcon = (iconName) => {
  return navigationIcons[iconName] || null;
};

export default navigationIcons;
