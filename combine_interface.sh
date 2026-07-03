#!/usr/bin/env bash
# TBX Interface Combiner - Merges modular folder into single JSON
# Usage: ./combine_interface.sh <interface_folder> [output_file]
#
# Combines:
#   - code.jsx      → "code" field (stringified)
#   - data.json     → "data" field (stringified)
#   - preprocess.js → "preprocess" field (stringified)
#   - constants.json → "constants" field (stringified)

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

INTERFACE_FOLDER="$1"
OUTPUT_FILE="$2"

# Show usage
if [ -z "$INTERFACE_FOLDER" ]; then
    echo -e "${BLUE}TBX Interface Combiner${NC}"
    echo "Merges modular folder structure into single JSON for TBX Editor"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./combine_interface.sh <interface_folder> [output_file]"
    echo ""
    echo -e "${YELLOW}Arguments:${NC}"
    echo "  interface_folder  Path to folder containing code.jsx, data.json, etc."
    echo "  output_file       Optional output path (default: <folder_name>.json)"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./combine_interface.sh generated-interfaces/my_evaluation"
    echo "  ./combine_interface.sh generated-interfaces/my_evaluation output.json"
    echo ""
    echo -e "${YELLOW}Expected folder structure:${NC}"
    echo "  my_evaluation/"
    echo "    ├── code.jsx        # JSX component code"
    echo "    ├── data.json       # Initial form data"
    echo "    ├── preprocess.js   # Preprocessing logic"
    echo "    └── constants.json  # Static configuration"
    exit 1
fi

# Remove trailing slash if present
INTERFACE_FOLDER="${INTERFACE_FOLDER%/}"

# Validate folder exists
if [ ! -d "$INTERFACE_FOLDER" ]; then
    echo -e "${RED}❌ Error: Folder not found: $INTERFACE_FOLDER${NC}"
    exit 1
fi

# Set default output file if not provided
if [ -z "$OUTPUT_FILE" ]; then
    FOLDER_NAME=$(basename "$INTERFACE_FOLDER")
    PARENT_DIR=$(dirname "$INTERFACE_FOLDER")
    OUTPUT_FILE="${PARENT_DIR}/${FOLDER_NAME}.json"
fi

echo -e "${BLUE}🔧 Combining TBX Interface${NC}"
echo "Source folder: $INTERFACE_FOLDER"
echo "Output file:   $OUTPUT_FILE"
echo "=================================="

# Required files
CODE_FILE="$INTERFACE_FOLDER/code.jsx"
DATA_FILE="$INTERFACE_FOLDER/data.json"
PREPROCESS_FILE="$INTERFACE_FOLDER/preprocess.js"
CONSTANTS_FILE="$INTERFACE_FOLDER/constants.json"

# Validate all required files exist
MISSING_FILES=()
[ ! -f "$CODE_FILE" ] && MISSING_FILES+=("code.jsx")
[ ! -f "$DATA_FILE" ] && MISSING_FILES+=("data.json")
[ ! -f "$PREPROCESS_FILE" ] && MISSING_FILES+=("preprocess.js")
[ ! -f "$CONSTANTS_FILE" ] && MISSING_FILES+=("constants.json")

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required files:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo -e "   - $file"
    done
    echo ""
    echo -e "${YELLOW}💡 Create missing files or use ./generate_template.sh to scaffold${NC}"
    exit 1
fi

# Validate JSON files are valid
echo -n "Validating data.json... "
if ! jq '.' "$DATA_FILE" >/dev/null 2>&1; then
    echo -e "${RED}❌ Invalid JSON${NC}"
    echo "Run: jq '.' $DATA_FILE"
    exit 1
fi
echo -e "${GREEN}✅${NC}"

echo -n "Validating constants.json... "
if ! jq '.' "$CONSTANTS_FILE" >/dev/null 2>&1; then
    echo -e "${RED}❌ Invalid JSON${NC}"
    echo "Run: jq '.' $CONSTANTS_FILE"
    exit 1
fi
echo -e "${GREEN}✅${NC}"

# Read file contents
CODE_CONTENT=$(cat "$CODE_FILE")
DATA_CONTENT=$(cat "$DATA_FILE")
PREPROCESS_CONTENT=$(cat "$PREPROCESS_FILE")
CONSTANTS_CONTENT=$(cat "$CONSTANTS_FILE")

# Validate preprocess has return statement
echo -n "Checking preprocess.js has return statement... "
if ! echo "$PREPROCESS_CONTENT" | grep -q 'return'; then
    echo -e "${YELLOW}⚠️  Warning: No return statement found${NC}"
    echo -e "${YELLOW}   💡 Add 'return data;' or similar to preprocess.js${NC}"
else
    echo -e "${GREEN}✅${NC}"
fi

# Use jq to properly stringify and combine
# This handles all escaping automatically
echo -n "Combining files... "

# Create the combined JSON using jq for proper escaping
jq -n \
    --arg code "$CODE_CONTENT" \
    --arg data "$DATA_CONTENT" \
    --arg preprocess "$PREPROCESS_CONTENT" \
    --arg constants "$CONSTANTS_CONTENT" \
    '{
        code: $code,
        data: $data,
        preprocess: $preprocess,
        constants: $constants
    }' > "$OUTPUT_FILE"

echo -e "${GREEN}✅${NC}"

# Validate the output
echo -n "Validating output JSON... "
if jq '.' "$OUTPUT_FILE" >/dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ Failed to create valid JSON${NC}"
    exit 1
fi

# Show output stats
CODE_SIZE=$(echo "$CODE_CONTENT" | wc -c | tr -d ' ')
DATA_SIZE=$(echo "$DATA_CONTENT" | wc -c | tr -d ' ')
PREPROCESS_SIZE=$(echo "$PREPROCESS_CONTENT" | wc -c | tr -d ' ')
CONSTANTS_SIZE=$(echo "$CONSTANTS_CONTENT" | wc -c | tr -d ' ')
TOTAL_SIZE=$(wc -c < "$OUTPUT_FILE" | tr -d ' ')

echo ""
echo -e "${GREEN}✅ Interface combined successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Size breakdown:${NC}"
echo "   code.jsx:       $CODE_SIZE bytes"
echo "   data.json:      $DATA_SIZE bytes"
echo "   preprocess.js:  $PREPROCESS_SIZE bytes"
echo "   constants.json: $CONSTANTS_SIZE bytes"
echo "   ─────────────────────────"
echo "   Output total:   $TOTAL_SIZE bytes"
echo ""
echo -e "${BLUE}📁 Output:${NC} $OUTPUT_FILE"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Validate: ./validate_interface.sh $OUTPUT_FILE"
echo "   2. Test in TBX Editor: Upload $OUTPUT_FILE"
echo "   3. TBX Editor URL: https://tlkfrontprodpublic.blob.core.windows.net/template-builder-production/tb-jsx.editor/index.html"

