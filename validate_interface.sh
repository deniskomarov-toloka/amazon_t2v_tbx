#!/usr/bin/env bash
# TBX Interface Validation Script
# Supports both modular folders and combined JSON files
# Usage: ./validate_interface.sh <interface_folder_or_json> [--fix]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Validation counters
PASSED=0
FAILED=0
WARNINGS=0

input_path="$1"
auto_fix_mode="$2"

if [ -z "$input_path" ]; then
    echo -e "${BLUE}TBX Interface Validation Script${NC}"
    echo "Validates TBX interfaces (modular folders or combined JSON)"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./validate_interface.sh <interface_folder_or_json> [--fix]"
    echo ""
    echo -e "${YELLOW}Modes:${NC}"
    echo "  Default: Validate only, provide fix suggestions"
    echo "  --fix:   Attempt automatic fixes where possible"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  # Validate modular folder:"
    echo "  ./validate_interface.sh generated-interfaces/my_evaluation"
    echo ""
    echo "  # Validate combined JSON:"
    echo "  ./validate_interface.sh generated-interfaces/my_evaluation.json"
    echo ""
    echo -e "${YELLOW}For modular folders:${NC}"
    echo "  Will combine first, then validate the combined JSON"
    exit 1
fi

# Remove trailing slash
input_path="${input_path%/}"

# Determine if input is a folder or JSON file
IS_FOLDER=false
TEMP_JSON=""

if [ -d "$input_path" ]; then
    IS_FOLDER=true
    FOLDER_NAME=$(basename "$input_path")
    PARENT_DIR=$(dirname "$input_path")
    interface_file="${PARENT_DIR}/${FOLDER_NAME}.json"
    
    echo -e "${BLUE}📁 Detected modular folder: $input_path${NC}"
    echo -e "${BLUE}🔧 Combining files first...${NC}"
    echo "=================================================="
    
    # Combine the folder
    if ! ./combine_interface.sh "$input_path" "$interface_file"; then
        echo -e "${RED}❌ Failed to combine interface files${NC}"
        exit 1
    fi
    echo ""
    
elif [ -f "$input_path" ]; then
    interface_file="$input_path"
else
    echo -e "${RED}❌ Path not found: $input_path${NC}"
    echo "Provide either a folder path or JSON file path"
    exit 1
fi

echo -e "${BLUE}🔍 Validating TBX Interface: $interface_file${NC}"
if [ "$auto_fix_mode" = "--fix" ]; then
    echo -e "${YELLOW}🔧 Auto-fix mode enabled${NC}"
fi
echo "=================================================="

# Test function
test_step() {
    local name="$1"
    local command="$2"
    local fix_suggestion="$3"
    
    echo -n "Testing $name... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        if [ -n "$fix_suggestion" ]; then
            echo -e "${YELLOW}   💡 Fix: $fix_suggestion${NC}"
        fi
        FAILED=$((FAILED + 1))
        return 1
    fi
}

warn_step() {
    local name="$1"
    local command="$2"
    local suggestion="$3"
    
    echo -n "Checking $name... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  WARNING${NC}"
        if [ -n "$suggestion" ]; then
            echo -e "${YELLOW}   💡 Suggestion: $suggestion${NC}"
        fi
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

# CRITICAL VALIDATIONS (Must Pass)
echo -e "\n${BLUE}🚨 CRITICAL VALIDATIONS${NC}"

test_step "JSON Syntax" \
    "jq '.' '$interface_file'" \
    "Fix JSON syntax errors with: jq '.' $interface_file"

test_step "Required Fields (code, data, preprocess, constants)" \
    "jq 'has(\"code\") and has(\"data\") and has(\"preprocess\") and has(\"constants\")' '$interface_file' | grep -q true" \
    "Add missing fields: {\"code\": \"\", \"data\": \"\", \"preprocess\": \"\", \"constants\": \"\"}"

test_step "Exactly 4 Fields" \
    "jq 'keys | length == 4' '$interface_file' | grep -q true" \
    "Remove extra fields - only code, data, preprocess, constants allowed"

test_step "Code Field Not Empty" \
    "jq -r '.code' '$interface_file' | grep -q '[^[:space:]]'" \
    "Add JSX components to code field"

test_step "Data Field Valid JSON String" \
    "jq -r '.data' '$interface_file' | jq '.' >/dev/null" \
    "Fix data field JSON syntax"

test_step "Constants Field Valid JSON String" \
    "jq -r '.constants' '$interface_file' | jq '.' >/dev/null" \
    "Fix constants field JSON syntax"

test_step "Preprocess Contains Return Statement" \
    "jq -r '.preprocess' '$interface_file' | grep -q 'return'" \
    "Add 'return data;' to preprocess function"

# COMPONENT VALIDATIONS
echo -e "\n${BLUE}🧩 COMPONENT VALIDATIONS${NC}"

# Extract components from code
components=$(jq -r '.code' "$interface_file" | grep -o 'View\.[A-Za-z]*\|Field\.[A-Za-z]*\|Layout\.[A-Za-z]*' | sort -u)

if [ -n "$components" ]; then
    echo "Found components: $(echo $components | tr '\n' ' ')"
    
    for comp in $components; do
        # Handle Field.*, View.*, and Layout.* components by extracting the component name
        if [[ $comp == Field.* ]]; then
            component_name=${comp#Field.}
            test_step "Component $comp exists" \
                "grep -q 'readonly $component_name:' src/interfaces/tbx/elements.d.ts" \
                "Check component name spelling or use alternative from elements.d.ts"
        elif [[ $comp == View.* ]]; then
            component_name=${comp#View.}
            test_step "Component $comp exists" \
                "grep -q '$component_name:' src/interfaces/tbx/elements.d.ts" \
                "Check component name spelling or use alternative from elements.d.ts"
        elif [[ $comp == Layout.* ]]; then
            component_name=${comp#Layout.}
            test_step "Component $comp exists" \
                "grep -q '$component_name:' src/interfaces/tbx/elements.d.ts" \
                "Check component name spelling or use alternative from elements.d.ts"
        else
            test_step "Component $comp exists" \
                "grep -q '$comp' src/interfaces/tbx/elements.d.ts" \
                "Check component name spelling or use alternative from elements.d.ts"
        fi
    done
else
    echo -e "${YELLOW}⚠️  No TBX components found in code${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# BEST PRACTICES VALIDATIONS
echo -e "\n${BLUE}📋 BEST PRACTICES${NC}"

warn_step "Root View.Flex present" \
    "jq -r '.code' '$interface_file' | grep -q '<View\.Flex'" \
    "Start with <View.Flex vertical={true}> as root container"

warn_step "View.Card uses flat={true}" \
    "jq -r '.code' '$interface_file' | grep 'View\.Card' | grep -q 'flat={true}' || ! jq -r '.code' '$interface_file' | grep -q 'View\.Card'" \
    "Add flat={true} to all View.Card components"

warn_step "Form fields have validation" \
    "jq -r '.code' '$interface_file' | grep 'Field\.' | grep -q 'validation=' || ! jq -r '.code' '$interface_file' | grep -q 'Field\.'" \
    "Add validation=[{required: true}] to form fields"

warn_step "Uses rem units for spacing" \
    "jq -r '.code' '$interface_file' | grep -q \"gap={'[0-9.]*rem'}\" || ! jq -r '.code' '$interface_file' | grep -q 'gap='" \
    "Use rem units for spacing: gap={'1rem'}"

# SECURITY/SAFETY CHECKS
echo -e "\n${BLUE}🔒 SECURITY CHECKS${NC}"

warn_step "No eval() or dangerous functions" \
    "! jq -r '.preprocess' '$interface_file' | grep -q '\\beval\\b\\|\\bFunction\\b\\|setTimeout\\|setInterval'" \
    "Remove dangerous JavaScript functions"

warn_step "No external URLs in code" \
    "! jq -r '.code' '$interface_file' | grep -q 'http://\\|https://'" \
    "Remove external URLs for security (put URLs in constants instead)"

# PERFORMANCE CHECKS
echo -e "\n${BLUE}⚡ PERFORMANCE CHECKS${NC}"

warn_step "Reasonable code size (< 10KB)" \
    "[ \$(jq -r '.code' '$interface_file' | wc -c) -lt 10240 ]" \
    "Consider splitting complex interfaces"

warn_step "Reasonable constants size (< 5KB)" \
    "[ \$(jq -r '.constants' '$interface_file' | wc -c) -lt 5120 ]" \
    "Move large data to external files"

# MODULAR FOLDER SPECIFIC CHECKS (if validating a folder)
if [ "$IS_FOLDER" = true ]; then
    echo -e "\n${BLUE}📁 MODULAR STRUCTURE CHECKS${NC}"
    
    warn_step "code.jsx exists" \
        "[ -f '$input_path/code.jsx' ]" \
        "Create code.jsx file"
    
    warn_step "data.json exists" \
        "[ -f '$input_path/data.json' ]" \
        "Create data.json file"
    
    warn_step "preprocess.js exists" \
        "[ -f '$input_path/preprocess.js' ]" \
        "Create preprocess.js file"
    
    warn_step "constants.json exists" \
        "[ -f '$input_path/constants.json' ]" \
        "Create constants.json file"
fi

# GENERATE REPORT
echo -e "\n${BLUE}📊 VALIDATION REPORT${NC}"
echo "=================================================="
echo -e "✅ Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Tests Failed: ${RED}$FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 VALIDATION SUCCESS!${NC}"
    echo ""
    echo -e "${BLUE}📁 Validated file:${NC} $interface_file"
    if [ "$IS_FOLDER" = true ]; then
        echo -e "${BLUE}📁 Source folder:${NC} $input_path"
    fi
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "   Test in TBX Editor: Upload $interface_file"
    echo "   URL: https://tlkfrontprodpublic.blob.core.windows.net/template-builder-production/tb-jsx.editor/index.html"
    exit 0
else
    echo -e "\n${RED}❌ VALIDATION FAILED!${NC}"
    echo "Fix the failed tests before using this interface."
    
    if [ "$IS_FOLDER" = true ]; then
        echo ""
        echo -e "${BLUE}🔧 FIX IN MODULAR FILES:${NC}"
        echo "   Edit: $input_path/code.jsx"
        echo "   Edit: $input_path/data.json"
        echo "   Edit: $input_path/preprocess.js"
        echo "   Edit: $input_path/constants.json"
        echo ""
        echo "Then recombine: ./combine_interface.sh $input_path"
    else
        echo ""
        echo -e "${BLUE}🔧 AUTO-FIX COMMANDS:${NC}"
        echo "# Fix JSON syntax:"
        echo "jq '.' $interface_file > temp.json && mv temp.json $interface_file"
    fi
    
    exit 1
fi
