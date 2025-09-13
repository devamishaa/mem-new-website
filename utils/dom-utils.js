/**
 * Safe DOM manipulation utilities to prevent React reconciliation errors
 */

/**
 * Safely append a child to a parent node
 * @param {Node} parent - The parent node
 * @param {Node} child - The child node to append
 * @returns {boolean} - Whether the operation was successful
 */
export function safeAppendChild(parent, child) {
  try {
    if (parent && child && parent.nodeType === Node.ELEMENT_NODE) {
      parent.appendChild(child);
      return true;
    }
  } catch (error) {
    console.warn('[DOM Utils] Failed to append child:', error);
  }
  return false;
}

/**
 * Safely remove a child from its parent node
 * @param {Node} child - The child node to remove
 * @returns {boolean} - Whether the operation was successful
 */
export function safeRemoveChild(child) {
  try {
    if (child && child.parentNode) {
      child.parentNode.removeChild(child);
      return true;
    }
  } catch (error) {
    console.warn('[DOM Utils] Failed to remove child:', error);
  }
  return false;
}

/**
 * Safely replace a child node with a new node
 * @param {Node} parent - The parent node
 * @param {Node} newChild - The new child node
 * @param {Node} oldChild - The old child node to replace
 * @returns {boolean} - Whether the operation was successful
 */
export function safeReplaceChild(parent, newChild, oldChild) {
  try {
    if (parent && newChild && oldChild && parent.nodeType === Node.ELEMENT_NODE) {
      parent.replaceChild(newChild, oldChild);
      return true;
    }
  } catch (error) {
    console.warn('[DOM Utils] Failed to replace child:', error);
  }
  return false;
}

/**
 * Safely insert a node before a reference node
 * @param {Node} parent - The parent node
 * @param {Node} newNode - The new node to insert
 * @param {Node} referenceNode - The reference node
 * @returns {boolean} - Whether the operation was successful
 */
export function safeInsertBefore(parent, newNode, referenceNode) {
  try {
    if (parent && newNode && referenceNode && parent.nodeType === Node.ELEMENT_NODE) {
      parent.insertBefore(newNode, referenceNode);
      return true;
    }
  } catch (error) {
    console.warn('[DOM Utils] Failed to insert before:', error);
  }
  return false;
}

/**
 * Safely create and append a script element
 * @param {string} scriptContent - The script content
 * @param {Object} attributes - Additional attributes for the script
 * @returns {Node|null} - The created script element or null if failed
 */
export function safeCreateScript(scriptContent, attributes = {}) {
  try {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    // Set additional attributes
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
    
    script.innerHTML = scriptContent;
    
    if (document.body) {
      document.body.appendChild(script);
      return script;
    }
  } catch (error) {
    console.warn('[DOM Utils] Failed to create script:', error);
  }
  return null;
}

/**
 * Safely remove all elements matching a selector
 * @param {string} selector - CSS selector
 * @returns {number} - Number of elements removed
 */
export function safeRemoveElements(selector) {
  try {
    const elements = document.querySelectorAll(selector);
    let removedCount = 0;
    
    elements.forEach((element) => {
      if (safeRemoveChild(element)) {
        removedCount++;
      }
    });
    
    return removedCount;
  } catch (error) {
    console.warn('[DOM Utils] Failed to remove elements:', error);
    return 0;
  }
}
