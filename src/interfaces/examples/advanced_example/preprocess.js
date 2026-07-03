// ========================================
// ENHANCED CONTENT REVIEW PIPELINE VALIDATION
// Handles writer-editor workflow with step progression
// ========================================

let pipelineData = {
  // Core validation tracking
  validation: {
    totalRequiredFields: 0,
    completedFields: 0,
    missingFields: [],
    missingFieldsByStep: {},
    completionPercentage: 0
  },
  
  // Pipeline state management
  currentUserRole: data.user_role || 'writer',
  currentRound: data.current_round || 1,
  currentPhase: 'Content Submission',
  readyForSubmission: false,
  
  // Content processing
  contentText: '',
  contentTitle: '',
  contentType: '',
  contentWordCount: 0,
  writerNotes: '',
  writerRevisionResponse: '',
  
  // Feedback tracking
  previousEditorFeedback: null,
  conversationHistory: data.conversation_history || []
};

// ========================================
// CONTENT DATA PROCESSING
// Extract and process content from AiEditor format
// ========================================

function extractAiEditorContent(aiEditorValue) {
  if (!aiEditorValue) return '';
  if (typeof aiEditorValue === 'string') return aiEditorValue;
  if (typeof aiEditorValue === 'object' && aiEditorValue.content) {
    return aiEditorValue.content;
  }
  return String(aiEditorValue || '');
}

// Process content data if available
if (data.content?.body) {
  const textContent = extractAiEditorContent(data.content.body);
  pipelineData.contentText = textContent;
  pipelineData.contentTitle = data.content.title || '';
  pipelineData.contentType = data.content.type || '';
  
  if (textContent) {
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    pipelineData.contentWordCount = wordCount;
  }
}

// Extract writer notes and revision response
if (data.writer_notes) {
  pipelineData.writerNotes = data.writer_notes;
}

if (data.writer_revision_response) {
  pipelineData.writerRevisionResponse = data.writer_revision_response;
}

// Check for previous editor feedback
if (data.previous_editor_feedback) {
  pipelineData.previousEditorFeedback = data.previous_editor_feedback;
}

// ========================================
// REQUIRED FIELDS DEFINITION
// Define validation rules based on user role and pipeline state
// ========================================

const requiredFields = [];

// Writer role requirements
if (pipelineData.currentUserRole === 'writer') {
  const writerFields = [
    {
      path: 'content.title',
      name: 'Content Title',
      displayName: 'Content Title',
      step: 1,
      stepName: 'Step 1: Content Submission'
    },
    {
      path: 'content.type',
      name: 'Content Type',
      displayName: 'Content Type Selection',
      step: 1,
      stepName: 'Step 1: Content Submission'
    },
    {
      path: 'content.body',
      name: 'Content Body',
      displayName: 'Content Body',
      step: 1,
      stepName: 'Step 1: Content Submission',
      minLength: 100
    },
    {
      path: 'stepStatus.step1Complete',
      name: 'Step 1 Completion',
      displayName: 'Content Submission Confirmation',
      step: 1,
      stepName: 'Step 1: Content Submission'
    }
  ];
  
  // Add revision response requirement for revision rounds
  if (pipelineData.currentRound > 1) {
    writerFields.push({
      path: 'writer_revision_response',
      name: 'Revision Response',
      displayName: 'Response to Editor Feedback',
      step: 1,
      stepName: 'Step 1: Content Submission',
      minLength: 30
    });
  }
  
  requiredFields.push(...writerFields);
}

// Editor role requirements
if (pipelineData.currentUserRole === 'editor') {
  const editorFields = [
    // Step 2: Editorial Review
    {
      path: 'evaluation.overall_assessment',
      name: 'Overall Assessment',
      displayName: 'Overall Content Assessment',
      step: 2,
      stepName: 'Step 2: Editorial Review'
    },
    {
      path: 'evaluation.content_quality',
      name: 'Content Quality',
      displayName: 'Content Quality Rating',
      step: 2,
      stepName: 'Step 2: Editorial Review'
    },
    {
      path: 'evaluation.structure_organization',
      name: 'Structure & Organization',
      displayName: 'Structure & Organization Rating',
      step: 2,
      stepName: 'Step 2: Editorial Review'
    },
    {
      path: 'evaluation.language_style',
      name: 'Language & Style',
      displayName: 'Language & Style Rating',
      step: 2,
      stepName: 'Step 2: Editorial Review'
    },
    {
      path: 'evaluation.detailed_feedback',
      name: 'Detailed Feedback',
      displayName: 'Editorial Feedback',
      step: 2,
      stepName: 'Step 2: Editorial Review',
      minLength: 50
    },
    {
      path: 'stepStatus.step2Complete',
      name: 'Step 2 Completion',
      displayName: 'Editorial Review Confirmation',
      step: 2,
      stepName: 'Step 2: Editorial Review'
    },
    
    // Step 3: Final Decision
    {
      path: 'final_decision.verdict',
      name: 'Final Decision',
      displayName: 'Final Verdict',
      step: 3,
      stepName: 'Step 3: Final Decision'
    },
    {
      path: 'stepStatus.step3Complete',
      name: 'Step 3 Completion',
      displayName: 'Final Decision Confirmation',
      step: 3,
      stepName: 'Step 3: Final Decision'
    }
  ];
  
  // Add conditional requirement for revision priority
  if (data.final_decision?.verdict === 'revise') {
    editorFields.push({
      path: 'final_decision.revision_priority',
      name: 'Revision Priority',
      displayName: 'Revision Priority Level',
      step: 3,
      stepName: 'Step 3: Final Decision'
    });
  }
  
  requiredFields.push(...editorFields);
}

// ========================================
// VALIDATION PROCESSING
// Check field completion and organize missing fields
// ========================================

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

function checkFieldComplete(value, minLength) {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  
  if (typeof value === 'boolean') {
    return value === true;
  }
  
  if (typeof value === 'string') {
    return minLength ? value.trim().length >= minLength : value.trim().length > 0;
  }
  
  // Handle AiEditor content objects
  if (typeof value === 'object' && value.content) {
    const content = value.content;
    return minLength ? content.trim().length >= minLength : content.trim().length > 0;
  }
  
  return true;
}

// Set total required fields
pipelineData.validation.totalRequiredFields = requiredFields.length;

// Evaluate each required field
requiredFields.forEach(field => {
  const value = getNestedValue(data, field.path);
  const isFieldComplete = checkFieldComplete(value, field.minLength);
  
  if (isFieldComplete) {
    pipelineData.validation.completedFields++;
  } else {
    // Add to missing fields list
    pipelineData.validation.missingFields.push(field.name);
    
    // Organize by step for better UX
    const stepKey = `step${field.step}`;
    if (!pipelineData.validation.missingFieldsByStep[stepKey]) {
      pipelineData.validation.missingFieldsByStep[stepKey] = {
        stepName: field.stepName,
        fields: []
      };
    }
    
    pipelineData.validation.missingFieldsByStep[stepKey].fields.push({
      name: field.name,
      displayName: field.displayName,
      path: field.path,
      minLength: field.minLength
    });
  }
});

// Calculate completion percentage
pipelineData.validation.completionPercentage = pipelineData.validation.totalRequiredFields > 0 
  ? Math.round((pipelineData.validation.completedFields / pipelineData.validation.totalRequiredFields) * 100)
  : 0;

// ========================================
// PIPELINE STATE DETERMINATION
// Determine current phase and submission readiness
// ========================================

// Determine current phase based on role and completion
if (pipelineData.currentUserRole === 'writer') {
  pipelineData.currentPhase = pipelineData.currentRound > 1 ? 'Content Revision' : 'Content Submission';
} else if (pipelineData.currentUserRole === 'editor') {
  if (!data.stepStatus?.step2Complete) {
    pipelineData.currentPhase = 'Editorial Review';
  } else if (!data.stepStatus?.step3Complete) {
    pipelineData.currentPhase = 'Final Decision';
  } else {
    pipelineData.currentPhase = 'Review Complete';
  }
}

// Determine submission readiness
pipelineData.readyForSubmission = pipelineData.validation.missingFields.length === 0;

// Return the processed pipeline data
return pipelineData;
