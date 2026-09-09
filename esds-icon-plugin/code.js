// Debug mode
var DEBUG = true;
function log(message) {
  if (DEBUG) {
    console.log('[Icon Plugin]', message);
  }
}

// Import tokens
var ICON_TOKENS = {
  stroke: { 16: 1.25, 20: 1.5, 24: 1.75, 32: 2.0, 40: 2.25 },
  sizes: [16, 20, 24, 32, 40],
  canvas: 24,
  color: { default: { r: 0, g: 0, b: 0 }, disabled: { r: 0.5, g: 0.5, b: 0.5 } }
};

// Feature flag for multi-selection support
// Set to false to revert to single icon mode
var ENABLE_MULTI_SELECT = true;
log('Multi-select mode: ' + (ENABLE_MULTI_SELECT ? 'ENABLED' : 'DISABLED'));

// Load stroke configuration from storage or use defaults
var STROKE_CONFIG = null;

async function loadStrokeConfig() {
  try {
    var saved = await figma.clientStorage.getAsync('strokeConfig');
    if (saved) {
      STROKE_CONFIG = saved;
      log('Loaded stroke config from storage: ' + JSON.stringify(STROKE_CONFIG));
    } else {
      STROKE_CONFIG = Object.assign({}, ICON_TOKENS.stroke);
      log('Using default stroke config');
    }
  } catch (e) {
    log('ERROR loading stroke config: ' + e.message);
    STROKE_CONFIG = Object.assign({}, ICON_TOKENS.stroke);
  }
}

async function saveStrokeConfig(config) {
  try {
    await figma.clientStorage.setAsync('strokeConfig', config);
    STROKE_CONFIG = config;
    log('Stroke config saved: ' + JSON.stringify(config));
    return true;
  } catch (e) {
    log('ERROR saving stroke config: ' + e.message);
    return false;
  }
}

// Reset to defaults
async function resetStrokeConfig() {
  var defaultConfig = {
    16: ICON_TOKENS.stroke[16],
    20: ICON_TOKENS.stroke[20],
    24: ICON_TOKENS.stroke[24],
    32: ICON_TOKENS.stroke[32],
    40: ICON_TOKENS.stroke[40]
  };
  await saveStrokeConfig(defaultConfig);
}

// Detect stroke-related variables from Figma libraries
async function detectStrokeVariables() {
  try {
    log('Detecting stroke variables from libraries...');
    var detected = [];
    
    // Get available library collections
    var collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    log('Found ' + collections.length + ' variable collections');
    
    for (var i = 0; i < collections.length; i++) {
      var collection = collections[i];
      log('Checking collection: ' + collection.name);
      
      // Get variables in this collection
      var variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key);
      
      for (var j = 0; j < variables.length; j++) {
        var variable = variables[j];
        var nameLower = variable.name.toLowerCase();
        
        // Check if variable name contains "stroke" and a number
        if (nameLower.indexOf('stroke') !== -1) {
          // Extract size from name (e.g., "stroke/16" or "stroke_20")
          var match = variable.name.match(/(\d+)/);
          if (match) {
            var size = parseInt(match[1]);
            if (ICON_TOKENS.sizes.indexOf(size) !== -1) {
              detected.push({
                name: variable.name,
                size: size,
                collection: collection.name,
                key: variable.key
              });
              log('Detected stroke variable: ' + variable.name + ' for size ' + size);
            }
          }
        }
      }
    }
    
    log('Total stroke variables detected: ' + detected.length);
    return detected;
  } catch (e) {
    log('ERROR detecting stroke variables: ' + e.message);
    return [];
  }
}

// Apply detected stroke variables to configuration
async function applyStrokeVariables(variables) {
  try {
    log('Applying stroke variables...');
    var newConfig = Object.assign({}, STROKE_CONFIG);
    
    for (var i = 0; i < variables.length; i++) {
      var variable = variables[i];
      // Resolve variable value
      try {
        var value = await figma.variables.getVariableByIdAsync(variable.key);
        if (value && value.valuesByMode) {
          // Get the first mode value
          var modes = Object.keys(value.valuesByMode);
          if (modes.length > 0) {
            var modeValue = value.valuesByMode[modes[0]];
            if (typeof modeValue === 'number') {
              newConfig[variable.size] = modeValue;
              log('Applied variable ' + variable.name + ' = ' + modeValue + ' for size ' + variable.size);
            }
          }
        }
      } catch (e) {
        log('Could not resolve variable ' + variable.name + ': ' + e.message);
      }
    }
    
    await saveStrokeConfig(newConfig);
    return true;
  } catch (e) {
    log('ERROR applying stroke variables: ' + e.message);
    return false;
  }
}

// Initialize
log('Plugin initialized');

// Load stroke config at startup
loadStrokeConfig().then(function() {
  log('Stroke config loaded, ready');
});

// Show UI
figma.showUI(__html__, { width: 400, height: 500 });
log('UI shown');

// Handle messages from UI
figma.ui.onmessage = function(msg) {
  log('Received message: ' + JSON.stringify(msg));
  
  try {
    var messageType = msg.type || (msg.pluginMessage && msg.pluginMessage.type);
    
    log('Processing message type: ' + messageType);
    
    if (messageType === 'validate') {
      log('Starting validation...');
      
      if (ENABLE_MULTI_SELECT && figma.currentPage.selection.length > 1) {
        // Multi-select mode with detailed results
        var multiResult = validateMultipleSelectionsDetailed();
        log('Multi validation results: ' + JSON.stringify(multiResult));
        
        figma.ui.postMessage({
          type: 'validation-results',
          total: multiResult.total,
          validCount: multiResult.validCount,
          invalidCount: multiResult.invalidCount,
          icons: multiResult.icons
        });
      } else {
        // Single select mode (legacy)
        var result = validateSelection();
        log('Validation result: ' + JSON.stringify(result));
        
        figma.ui.postMessage({
          type: 'validation-result',
          valid: result.valid,
          name: result.name,
          error: result.error
        });
      }
    }
    
    if (messageType === 'generate') {
      log('Starting generation...');
      generateIcons();
    }
    
    if (messageType === 'cancel') {
      log('Cancelling...');
      figma.closePlugin('Generation annulée');
    }
    
    if (messageType === 'close') {
      log('Closing plugin...');
      figma.closePlugin();
    }
    
    // Settings handlers
    if (messageType === 'get-stroke-config') {
      log('Getting stroke config...');
      figma.ui.postMessage({
        type: 'stroke-config',
        config: STROKE_CONFIG || ICON_TOKENS.stroke
      });
    }
    
    if (messageType === 'save-stroke-config') {
      log('Saving stroke config...');
      saveStrokeConfig(msg.config).then(function(success) {
        figma.ui.postMessage({
          type: 'stroke-config-saved',
          success: success
        });
      });
    }
    
    if (messageType === 'reset-stroke-config') {
      log('Resetting stroke config...');
      resetStrokeConfig().then(function() {
        figma.ui.postMessage({
          type: 'stroke-config',
          config: STROKE_CONFIG
        });
      });
    }
    
    if (messageType === 'detect-stroke-variables') {
      log('Detecting stroke variables...');
      detectStrokeVariables().then(function(detected) {
        figma.ui.postMessage({
          type: 'stroke-variables-detected',
          variables: detected
        });
      });
    }
    
    if (messageType === 'apply-stroke-variables') {
      log('Applying stroke variables...');
      applyStrokeVariables(msg.variables).then(function(success) {
        figma.ui.postMessage({
          type: 'stroke-variables-applied',
          success: success,
          config: STROKE_CONFIG
        });
      });
    }
  } catch (error) {
    log('ERROR in message handler: ' + error.message);
    console.error(error);
    
    figma.ui.postMessage({
      type: 'validation-result',
      valid: false,
      error: 'Erreur interne: ' + error.message
    });
  }
};

log('Message handler registered');

// Validation function
function validateSelection() {
  log('validateSelection() called');
  
  try {
    var selection = figma.currentPage.selection;
    log('Selection count: ' + selection.length);
    
    if (selection.length !== 1) {
      return { valid: false, error: 'Veuillez sélectionner un seul composant ou ComponentSet' };
    }
    
    var node = selection[0];
    log('Selected node type: ' + node.type);
    log('Selected node name: ' + node.name);
    
    if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') {
      return { valid: false, error: 'La sélection doit être un Component ou ComponentSet (actuel: ' + node.type + ')' };
    }
    
    if (node.name && node.name.indexOf('[generated]') !== -1) {
      return { valid: false, error: 'Ce composant est déjà généré (contient [generated])' };
    }
    
    var nodeToCheck = node;
    
    if (node.type === 'COMPONENT_SET') {
      log('ComponentSet detected, looking for 24x24 variant to check size...');
      
      var found24Variant = false;
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if (child.type === 'COMPONENT') {
          var is24x24 = (Math.abs(child.width - 24) < 0.1 && Math.abs(child.height - 24) < 0.1);
          
          if (is24x24) {
            nodeToCheck = child;
            found24Variant = true;
            log('Found 24x24 variant: ' + child.name);
            break;
          }
        }
      }
      
      if (!found24Variant) {
        return { valid: false, error: 'Le ComponentSet doit contenir un variant de 24×24px' };
      }
    }
    
    log('Node dimensions: ' + nodeToCheck.width + 'x' + nodeToCheck.height);
    
    if (Math.abs(nodeToCheck.width - 24) > 0.1 || Math.abs(nodeToCheck.height - 24) > 0.1) {
      return { valid: false, error: 'Le composant doit faire exactement 24×24px (actuel: ' + Math.round(nodeToCheck.width) + '×' + Math.round(nodeToCheck.height) + ')' };
    }
    
    var hasStrokes = false;
    function checkNode(n) {
      if ('strokes' in n && n.strokes && n.strokes.length > 0) {
        hasStrokes = true;
      }
      if ('children' in n && n.children) {
        for (var idx = 0; idx < n.children.length; idx++) {
          checkNode(n.children[idx]);
        }
      }
    }
    checkNode(nodeToCheck);
    
    log('Has strokes: ' + hasStrokes);
    
    if (!hasStrokes) {
      return { valid: false, error: 'Le composant ne contient pas de strokes (lines/paths)' };
    }
    
    return { valid: true, name: node.name, type: node.type, has24Variant: true };
  } catch (error) {
    log('ERROR in validateSelection: ' + error.message);
    return { valid: false, error: 'Erreur lors de la validation: ' + error.message };
  }
}

// Validate multiple icon selections for multi-select mode
function validateMultipleSelections() {
  var selection = figma.currentPage.selection;
  var validIcons = [];
  var invalidCount = 0;
  
  log('Validating ' + selection.length + ' selected items...');
  
  for (var i = 0; i < selection.length; i++) {
    var node = selection[i];
    var result = validateSingleIcon(node);
    
    if (result.valid) {
      validIcons.push(node);
      log('✓ Valid: ' + node.name);
    } else {
      invalidCount++;
      log('✗ Invalid: ' + node.name + ' - ' + result.error);
    }
  }
  
  log('Validation complete: ' + validIcons.length + ' valid, ' + invalidCount + ' invalid');
  return validIcons;
}

// Validate multiple selections with detailed results for UI display
function validateMultipleSelectionsDetailed() {
  var selection = figma.currentPage.selection;
  var icons = [];
  var validCount = 0;
  var invalidCount = 0;
  
  log('Validating ' + selection.length + ' selected items with details...');
  
  for (var i = 0; i < selection.length; i++) {
    var node = selection[i];
    var result = validateSingleIcon(node);
    
    // Create short error messages
    var shortError = '';
    if (!result.valid) {
      if (result.error.indexOf('24×24px') !== -1) {
        shortError = 'Pas 24×24px';
      } else if (result.error.indexOf('strokes') !== -1) {
        shortError = 'Pas de strokes';
      } else if (result.error.indexOf('Not a Component') !== -1) {
        shortError = 'Pas un Component';
      } else if (result.error.indexOf('Already generated') !== -1) {
        shortError = 'Déjà généré';
      } else {
        shortError = 'Invalide';
      }
      invalidCount++;
    } else {
      validCount++;
    }
    
    icons.push({
      name: node.name,
      valid: result.valid,
      error: shortError,
      fullError: result.error,
      type: node.type
    });
    
    log((result.valid ? '✓' : '✗') + ' ' + node.name + (shortError ? ' - ' + shortError : ''));
  }
  
  log('Detailed validation complete: ' + validCount + ' valid, ' + invalidCount + ' invalid');
  
  return {
    total: selection.length,
    validCount: validCount,
    invalidCount: invalidCount,
    icons: icons
  };
}

// Check if a single node is a valid icon (extracted from validateSelection)
function validateSingleIcon(node) {
  try {
    // Check type
    if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') {
      return { valid: false, error: 'Not a Component or ComponentSet' };
    }
    
    // Check if already generated
    if (node.name && node.name.indexOf('[generated]') !== -1) {
      return { valid: false, error: 'Already generated' };
    }
    
    // Find the node to check (24x24 variant for ComponentSet)
    var nodeToCheck = node;
    if (node.type === 'COMPONENT_SET') {
      var found24 = false;
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if (child.type === 'COMPONENT' && 
            Math.abs(child.width - 24) < 0.1 && 
            Math.abs(child.height - 24) < 0.1) {
          nodeToCheck = child;
          found24 = true;
          break;
        }
      }
      if (!found24) {
        return { valid: false, error: 'No 24x24 variant found' };
      }
    }
    
    // Check size
    if (Math.abs(nodeToCheck.width - 24) > 0.1 || Math.abs(nodeToCheck.height - 24) > 0.1) {
      return { valid: false, error: 'Not 24x24px' };
    }
    
    // Check for strokes
    var hasStrokes = false;
    function checkNode(n) {
      if ('strokes' in n && n.strokes && n.strokes.length > 0) {
        hasStrokes = true;
      }
      if ('children' in n && n.children) {
        for (var idx = 0; idx < n.children.length; idx++) {
          checkNode(n.children[idx]);
        }
      }
    }
    checkNode(nodeToCheck);
    
    if (!hasStrokes) {
      return { valid: false, error: 'No strokes found' };
    }
    
    return { valid: true, name: node.name, type: node.type };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Main generation function - routes to legacy or multi mode based on feature flag
async function generateIcons() {
  log('generateIcons() called');
  log('Multi-select mode: ' + (ENABLE_MULTI_SELECT ? 'ON' : 'OFF'));
  
  if (!ENABLE_MULTI_SELECT) {
    log('Using legacy single-icon mode');
    return await generateIconsSingle();
  }
  
  log('Using multi-select mode');
  await generateIconsMulti();
}

// Legacy single icon generation (original working code)
async function generateIconsSingle() {
  try {
    var selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.ui.postMessage({ type: 'error', message: 'Aucune sélection' });
      return;
    }
    
    if (selection.length > 1) {
      figma.ui.postMessage({ type: 'error', message: 'Mode simple: sélectionnez une seule icône' });
      return;
    }
    
    // Call the shared generation logic for single icon
    await processSingleIcon(selection[0], 1, 1);
    
    // Send completion message for single icon mode
    figma.ui.postMessage({ type: 'complete', message: 'Génération terminée' });
    
  } catch (error) {
    log('ERROR in generateIconsSingle: ' + error.message);
    figma.ui.postMessage({ type: 'error', message: 'Erreur: ' + error.message });
  }
}

// Multi-select icon generation
async function generateIconsMulti() {
  try {
    var validIcons = validateMultipleSelections();
    
    if (validIcons.length === 0) {
      figma.ui.postMessage({ type: 'error', message: 'Aucune icône valide sélectionnée' });
      return;
    }
    
    log('Processing ' + validIcons.length + ' icons...');
    
    // Process each valid icon
    for (var i = 0; i < validIcons.length; i++) {
      if (await checkCancelled()) {
        log('Cancelled by user');
        return;
      }
      
      var icon = validIcons[i];
      log('=== Processing icon ' + (i + 1) + '/' + validIcons.length + ': ' + icon.name + ' ===');
      
      await processSingleIcon(icon, i + 1, validIcons.length);
    }
    
    figma.ui.postMessage({ 
      type: 'complete', 
      message: validIcons.length + ' icône(s) traitée(s)'
    });
    
  } catch (error) {
    log('ERROR in generateIconsMulti: ' + error.message);
    figma.ui.postMessage({ type: 'error', message: 'Erreur: ' + error.message });
  }
}

// Process a single icon (shared logic for both modes)
async function processSingleIcon(icon, currentIndex, totalIcons) {
  log('Processing single icon: ' + icon.name + ' (' + currentIndex + '/' + totalIcons + ')');
  
  try {
    var node = icon;  // Use the passed icon parameter
    log('Processing icon: ' + node.name);
    
    var generatedCount = { outlined: 0, filled: 0 };
    var totalSteps = ICON_TOKENS.sizes.length * 2;
    var currentStep = 0;
    
    var sourceComponent = node;
    var filledSource = null;
    
    if (node.type === 'COMPONENT_SET') {
      log('Analyzing ComponentSet variants...');
      
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if (child.type !== 'COMPONENT' || Math.abs(child.width - 24) > 0.1) {
          continue;
        }
        
        var childNameLower = child.name.toLowerCase();
        
        // Detect Filled variant: Filled=true, filled=yes, or contains "Filled" but not false/no
        var isFilled = (
          childNameLower.indexOf('filled=true') !== -1 ||
          childNameLower.indexOf('filled=yes') !== -1 ||
          (childNameLower.indexOf('filled') !== -1 && 
           childNameLower.indexOf('false') === -1 && 
           childNameLower.indexOf('no') === -1)
        );
        
        // Detect Outlined variant: Filled=false, filled=no, or contains "Outlined"
        var isOutlined = (
          childNameLower.indexOf('filled=false') !== -1 ||
          childNameLower.indexOf('filled=no') !== -1 ||
          childNameLower.indexOf('outlined') !== -1 ||
          childNameLower.indexOf('outline') !== -1
        );
        
        if (isFilled && !filledSource) {
          filledSource = child;
          log('Found Filled source: ' + child.name);
        } else if (isOutlined && sourceComponent === node) {
          sourceComponent = child;
          log('Found Outlined source: ' + child.name);
        }
      }
      
      // If we found variants but none matched criteria, use first available as default
      if (sourceComponent === node && node.children.length > 0) {
        for (var j = 0; j < node.children.length; j++) {
          if (node.children[j].type === 'COMPONENT' && Math.abs(node.children[j].width - 24) < 0.1) {
            sourceComponent = node.children[j];
            log('Using first available variant as source: ' + node.children[j].name);
            break;
          }
        }
      }
    }
    
    // Check if we have both Outlined and Filled (dual style mode)
    var isDualStyle = (filledSource !== null);
    log('Dual style mode: ' + isDualStyle);
    
    // Adjust total steps based on mode
    totalSteps = isDualStyle ? ICON_TOKENS.sizes.length * 2 : ICON_TOKENS.sizes.length;
    
    var newComponents = [];
    
    // Generate variants by size (interleaved order for dual style)
    // This creates the layer order: 16-false, 16-true, 20-false, 20-true, etc.
    log('Generating variants by size...');
    for (var j = 0; j < ICON_TOKENS.sizes.length; j++) {
      var size = ICON_TOKENS.sizes[j];
      log('Processing size: ' + size);
      
      // First: Generate primary style (Outlined or single style)
      if (await checkCancelled()) {
        log('Cancelled by user');
        return;
      }
      
      currentStep++;
      var primaryLabel = isDualStyle ? 'Outlined' : 'Single';
      var iconPrefix = totalIcons > 1 ? 'Icône ' + currentIndex + '/' + totalIcons + ' - ' : '';
      figma.ui.postMessage({ type: 'progress', step: currentStep, total: totalSteps, message: iconPrefix + 'Size ' + size + ' / ' + primaryLabel + '...' });
      
      try {
        var scaledComponent = await createScaledVariant(sourceComponent, size, 'Outlined', isDualStyle);
        if (scaledComponent) {
          newComponents.push(scaledComponent);
          generatedCount.outlined++;
          log('Created ' + primaryLabel + ' variant for size ' + size);
        }
      } catch (error) {
        log('ERROR creating primary variant for size ' + size + ': ' + error.message);
      }
      
      // Second: If dual style, generate Filled variant immediately after
      if (filledSource) {
        if (await checkCancelled()) {
          log('Cancelled by user');
          return;
        }
        
        currentStep++;
        figma.ui.postMessage({ type: 'progress', step: currentStep, total: totalSteps, message: iconPrefix + 'Size ' + size + ' / Filled...' });
        
        try {
          var scaledComponent = await createScaledVariant(filledSource, size, 'Filled', isDualStyle);
          if (scaledComponent) {
            newComponents.push(scaledComponent);
            generatedCount.filled++;
            log('Created Filled variant for size ' + size);
          }
        } catch (error) {
          log('ERROR creating Filled variant for size ' + size + ': ' + error.message);
        }
      }
    }
    
    if (await checkCancelled()) {
      log('Cancelled by user before ComponentSet creation');
      return;
    }
    
    log('Creating ComponentSet with ' + newComponents.length + ' components...');
    var assemblyPrefix = totalIcons > 1 ? 'Icône ' + currentIndex + '/' + totalIcons + ' - ' : '';
    figma.ui.postMessage({ type: 'progress', step: totalSteps, total: totalSteps, message: assemblyPrefix + 'Assemblage...' });
    
    var startX = node.x + node.width + 48;
    var startY = node.y;
    
    // Create ComponentSet with dual style flag
    var componentSet = createComponentSet(newComponents, node.name, isDualStyle);
    componentSet.x = startX;
    componentSet.y = startY;
    
    log('ComponentSet positioned at: ' + startX + ',' + startY);
    figma.currentPage.selection = [componentSet];
    
    // Progress is reported by the calling function, not here
    log('Icon ' + currentIndex + '/' + totalIcons + ' complete!');
  } catch (error) {
    log('ERROR in generateIcons: ' + error.message);
    console.error(error);
    figma.ui.postMessage({ type: 'error', message: 'Erreur lors de la génération: ' + error.message });
  }
}

// Create scaled variant using temporary frame approach (Option B)
async function createScaledVariant(sourceComponent, targetSize, styleName, isDualStyle) {
  try {
    var scale = targetSize / ICON_TOKENS.canvas;
    var targetStroke = STROKE_CONFIG ? STROKE_CONFIG[targetSize] : ICON_TOKENS.stroke[targetSize];
    
    log('Creating fresh component for size ' + targetSize + ' style ' + styleName + ' dualStyle=' + isDualStyle);
    
    // Step 1: Create temporary frame (not visible to user)
    var tempFrame = figma.createFrame();
    tempFrame.name = 'Temp_' + targetSize + '_' + styleName;
    tempFrame.resize(targetSize, targetSize);
    log('Created temporary frame: ' + tempFrame.name);
    
    // Step 2: Clone children from source and process them
    log('Source component has ' + (sourceComponent.children ? sourceComponent.children.length : 0) + ' children');
    
    if (sourceComponent.children && sourceComponent.children.length > 0) {
      for (var i = 0; i < sourceComponent.children.length; i++) {
        var child = sourceComponent.children[i];
        var processedChild;
        
        // Handle instances by detaching them
        if (child.type === 'INSTANCE') {
          log('Detaching instance: ' + child.name);
          processedChild = child.detach();
        } else {
          // Clone other types
          processedChild = child.clone();
        }
        
        if (processedChild) {
          // Step 3: Apply scale and transformations BEFORE adding to frame
          if ('width' in processedChild && 'height' in processedChild) {
            processedChild.resize(processedChild.width * scale, processedChild.height * scale);
          }
          
          // Apply strokes with hardcoded value (applied after scaling)
          updateNodeStrokes(processedChild, targetStroke);
          
          // Apply fills for Filled style
          if (styleName === 'Filled') {
            updateNodeFills(processedChild);
          }
          
          // Add to temporary frame
          tempFrame.appendChild(processedChild);
        }
      }
    }
    
      // Step 4: Vectorize strokes for Outlined style using node.outlineStroke()
    if (styleName === 'Outlined' && tempFrame.children.length > 0) {
      log('Vectorizing strokes for Outlined style...');
      
      // Process children from the end to avoid index issues when removing
      for (var m = tempFrame.children.length - 1; m >= 0; m--) {
        var childNode = tempFrame.children[m];
        
        // Check if node has strokes and the outlineStroke method exists
        if ('strokes' in childNode && childNode.strokes && childNode.strokes.length > 0 && typeof childNode.outlineStroke === 'function') {
          try {
            log('Vectorizing strokes on: ' + childNode.name + ' (strokeWeight: ' + childNode.strokeWeight + ')');
            
            // Call outlineStroke() which returns a new vector node
            var vectorizedNode = childNode.outlineStroke();
            
            if (vectorizedNode) {
              // Insert the new vectorized node before the original
              tempFrame.insertChild(m, vectorizedNode);
              // Remove the original node with strokes
              childNode.remove();
              log('Successfully vectorized: ' + vectorizedNode.name);
            } else {
              log('outlineStroke returned null for: ' + childNode.name);
            }
          } catch (e) {
            log('Could not vectorize strokes on: ' + childNode.name + ' - ' + e.message);
          }
        }
      }
      
      log('Stroke vectorization complete. Frame now has ' + tempFrame.children.length + ' children');
    }
    
    // Step 5: Flatten everything in the temporary frame
    var glyph = null;
    if (tempFrame.children.length > 0) {
      log('Flattening ' + tempFrame.children.length + ' nodes into glyph layer');
      
      // Collect all children to flatten
      var childrenArray = [];
      for (var k = 0; k < tempFrame.children.length; k++) {
        childrenArray.push(tempFrame.children[k]);
      }
      
      // Flatten - this removes the original nodes and creates a new one
      glyph = figma.flatten(childrenArray, tempFrame);
      glyph.name = 'glyph';
      
      // Apply final color
      if (glyph.fills && glyph.fills.length > 0) {
        glyph.fills = [{ type: 'SOLID', color: ICON_TOKENS.color.default }];
      }
      
      // Position glyph at center of the component
      glyph.x = (targetSize - glyph.width) / 2;
      glyph.y = (targetSize - glyph.height) / 2;
      log('Glyph positioned at center: ' + glyph.x + ',' + glyph.y);
      
      // Apply SCALE constraints
      glyph.constraints = {
        horizontal: 'SCALE',
        vertical: 'SCALE'
      };
      log('Applied SCALE constraints to glyph');
      
      log('Created glyph layer successfully');
    }
    
    // Step 6: Create the final component
    var newComponent = figma.createComponent();
    
    // Set component name — Figma derives the variant properties from this name.
    // Property names are lowercase: "size" and "filled".
    // "filled" is always present, even in single style mode (always false there),
    // so the generated ComponentSet exposes a boolean "filled" property.
    // The default value comes from the FIRST component of the set: generation is
    // interleaved (filled=false before filled=true), so the default is filled=false.
    var filledValue = (styleName === 'Filled') ? 'true' : 'false';
    newComponent.name = 'size=' + targetSize + ', filled=' + filledValue;
    
    newComponent.resize(targetSize, targetSize);
    
    // Step 7: Move glyph from temp frame to component
    if (glyph) {
      newComponent.appendChild(glyph);
    }
    
    // Step 8: Clean up - remove temporary frame
    tempFrame.remove();
    log('Cleaned up temporary frame');
    
    log('Component created: ' + newComponent.name + ' with glyph layer');
    return newComponent;
  } catch (error) {
    log('ERROR in createScaledVariant: ' + error.message);
    throw error;
  }
}

  // Helper function to update strokes - applies configured stroke value directly
function updateNodeStrokes(node, targetStroke) {
  if ('strokes' in node && node.strokes && node.strokes.length > 0) {
    // Store previous value for logging
    var previousStroke = node.strokeWeight;
    
    // Apply the configured stroke value directly (hardcoded per size)
    node.strokeWeight = targetStroke;
    
    log('Applied stroke: ' + previousStroke + ' -> ' + targetStroke + ' on ' + node.name);
    
    if (node.strokes[0].type === 'SOLID') {
      node.strokes = [{ type: 'SOLID', color: ICON_TOKENS.color.default }];
    }
  }
  
  if ('children' in node && node.children) {
    for (var i = 0; i < node.children.length; i++) {
      updateNodeStrokes(node.children[i], targetStroke);
    }
  }
}

// Helper function to update fills
function updateNodeFills(node) {
  if ('fills' in node && node.fills && node.fills.length > 0) {
    node.fills = [{ type: 'SOLID', color: ICON_TOKENS.color.default }];
  }
  
  if ('children' in node && node.children) {
    for (var i = 0; i < node.children.length; i++) {
      updateNodeFills(node.children[i]);
    }
  }
}

// Create ComponentSet
function createComponentSet(components, baseName, isDualStyle) {
  try {
    log('Creating ComponentSet using combineAsVariants... Dual style: ' + isDualStyle);
    
    if (components.length === 0) {
      throw new Error('Aucun composant à assembler');
    }
    
    log('Combining ' + components.length + ' components into variants...');
    
    var componentSet = figma.combineAsVariants(components, figma.currentPage);
    
    if (!componentSet) {
      throw new Error('combineAsVariants a retourné null');
    }
    
    if (componentSet.type !== 'COMPONENT_SET') {
      throw new Error('Le résultat n\'est pas un ComponentSet (type: ' + componentSet.type + ')');
    }
    
    componentSet.name = baseName + ' [generated]';
    
    // Note: variantGroupProperties is read-only in Figma API
    // Properties are automatically detected from component names
    log('ComponentSet created. Properties will be auto-detected from component names');
    
    // Layout configuration matching user's source ComponentSet
    componentSet.layoutMode = 'HORIZONTAL';
    componentSet.layoutWrap = 'WRAP';
    componentSet.primaryAxisSizingMode = 'FIXED';
    componentSet.counterAxisSizingMode = 'AUTO';
    componentSet.primaryAxisAlignItems = 'MIN';
    componentSet.counterAxisAlignItems = 'MIN';
    componentSet.itemSpacing = 32;
    componentSet.counterAxisSpacing = 32;
    componentSet.paddingTop = 32;
    componentSet.paddingBottom = 32;
    componentSet.paddingLeft = 32;
    componentSet.paddingRight = 32;
    componentSet.clipsContent = false;
    
    // Use resize() instead of setting width directly
    try {
      componentSet.resize(176, componentSet.height);
      log('✓ width set to 176px via resize()');
    } catch (e) {
      log('✗ width FAILED: ' + e.message + ' - using auto width');
    }
    
    log('ComponentSet created successfully: ' + componentSet.name);
    return componentSet;
  } catch (error) {
    log('ERROR in createComponentSet: ' + error.message);
    throw error;
  }
}

// Check if user cancelled
async function checkCancelled() {
  return new Promise(function(resolve) {
    var originalHandler = figma.ui.onmessage;
    
    figma.ui.onmessage = function(msg) {
      var messageType = msg.type || (msg.pluginMessage && msg.pluginMessage.type);
      
      if (messageType === 'cancel') {
        resolve(true);
      } else {
        if (originalHandler) {
          originalHandler(msg);
        }
      }
    };
    
    setTimeout(function() {
      figma.ui.onmessage = originalHandler;
      resolve(false);
    }, 50);
  });
}

log('Plugin code fully loaded');
