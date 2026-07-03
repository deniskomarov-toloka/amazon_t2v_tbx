#!/usr/bin/env bash
set -e

echo "🚀 TBX Interface Development Setup"
echo "=================================="

# Check for required tools
check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    local missing_tools=()
    
    if ! command -v git >/dev/null 2>&1; then
        missing_tools+=("git")
    fi
    
    if ! command -v curl >/dev/null 2>&1; then
        missing_tools+=("curl")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo "❌ Missing required tools: ${missing_tools[*]}"
        echo ""
        echo "Please install the missing tools and try again:"
        echo "  • macOS: brew install git curl"
        echo "  • Ubuntu/Debian: sudo apt-get install git curl"
        echo "  • CentOS/RHEL: sudo yum install git curl"
        exit 1
    fi
    
    echo "✅ All dependencies found"
}

# Clone or update TBX repository
setup_tbx_cache() {
    echo "📦 Setting up TBX repository cache..."
    
    if [ -d ".tbx-cache/.git" ]; then
        echo "🔄 Updating existing TBX cache..."
        (cd .tbx-cache && git pull --ff-only origin main) || {
            echo "⚠️  Git pull failed, trying to reset cache..."
            rm -rf .tbx-cache
            git clone https://github.com/toloka-dev/tbx.git .tbx-cache
        }
    else
        echo "📥 Cloning TBX repository..."
        rm -rf .tbx-cache
        git clone https://github.com/toloka-dev/tbx.git .tbx-cache
    fi
    
    echo "✅ TBX cache ready"
}

# Copy essential files to development context
copy_context_files() {
    echo "📋 Copying context files..."
    
    # Create target directory
    mkdir -p src/interfaces/tbx
    
    local files_copied=0
    
    # Copy TypeScript definitions
    if [ -f ".tbx-cache/launchers/launcher-editor/public/elements.d.ts" ]; then
        cp ".tbx-cache/launchers/launcher-editor/public/elements.d.ts" "src/interfaces/tbx/"
        echo "  ✓ elements.d.ts"
        files_copied=$((files_copied + 1))
    else
        echo "  ⚠️  elements.d.ts not found at expected path"
    fi
    
    # Copy code snippets
    if [ -f ".tbx-cache/launchers/launcher-editor/public/snippets.json" ]; then
        cp ".tbx-cache/launchers/launcher-editor/public/snippets.json" "src/interfaces/tbx/"
        echo "  ✓ snippets.json"
        files_copied=$((files_copied + 1))
    else
        echo "  ⚠️  snippets.json not found at expected path"
    fi
    
    # Create context README
    cat > src/interfaces/tbx/README.md << 'EOF'
# TBX Interface Context

This directory contains essential files from the TBX repository for interface development:

- **elements.d.ts** - TypeScript definitions for all TBX components
- **snippets.json** - Pre-built code patterns and snippets

## Usage

These files provide your editor with:
- Autocomplete for TBX components
- Type checking for component props
- Code snippets for common patterns

## Auto-Updates

These files are automatically updated when:
- You run `./setup.sh`
- Your editor opens the project (if configured)

**Note:** Don't edit these files directly - they're overwritten on each sync.
EOF
    
    echo "  ✓ README.md (context documentation)"
    files_copied=$((files_copied + 1))
    
    echo "✅ Copied $files_copied files to src/interfaces/tbx/"
}

# Main execution
main() {
    check_dependencies
    setup_tbx_cache  
    copy_context_files
    
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo "📁 Context files: src/interfaces/tbx/"
    echo "🔧 Auto-update: ./post_open.sh (run when opening project)"
    echo "📚 Start building interfaces with TBX components!"
    echo ""
    echo "💡 Pro tip: Your editor should now have autocomplete for TBX components"
}

main "$@" 