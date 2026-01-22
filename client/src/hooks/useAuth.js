/**
 * Re-export useAuth from AuthContext
 * This maintains backward compatibility for imports from hooks directory
 */
export { useAuth } from '../context/AuthContext';
export { useAuth as default } from '../context/AuthContext';
