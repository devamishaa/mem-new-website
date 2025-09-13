export function isPointInsideRect(x, y, rect, pad = 0) {
  if (!rect) return false;
  return x >= rect.left - pad && x <= rect.right + pad && y >= rect.top - pad && y <= rect.bottom + pad;
}

export function getToggleRect() {
  const toggle = typeof document !== 'undefined' ? document.querySelector('[data-pen-toggle]') : null;
  return toggle ? toggle.getBoundingClientRect() : null;
}

export function withinToggleArea(e, pad = 8) {
  const r = getToggleRect();
  return isPointInsideRect(e.clientX, e.clientY, r, pad);
}

// Editable target detection (inputs, textareas, contentEditable or pen UI itself)
const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA']);

export function isEditableTarget(t) {
  if (!t) return false;
  if (EDITABLE_TAGS.has(t.tagName)) return true;
  if (t.isContentEditable) return true;
  const closest = typeof t.closest === 'function' ? t.closest('[data-pen-ui]') : null;
  return !!closest;
}

// Map keyboard events to high-level actions used by the pen tool
export function getKeyAction(e, selectedIndex) {
  if (isEditableTarget(e.target)) return null;
  const backspace = e.key === 'Backspace' && selectedIndex != null;
  const undoCombo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z';
  if (backspace) return 'delete';
  if (undoCombo) return 'undo';
  return null;
}
