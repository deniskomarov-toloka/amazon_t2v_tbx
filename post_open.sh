#!/usr/bin/env bash
# Auto-update hook for TBX course repository and TBX context files
# Run this when opening the project to keep everything in sync

# Silent mode - only show output on errors or if explicitly requested
VERBOSE=${1:-""}

log() {
    if [ "$VERBOSE" = "-v" ] || [ "$VERBOSE" = "--verbose" ]; then
        echo "$1"
    fi
}

error() {
    echo "❌ $1" >&2
}

warning() {
    echo "⚠️  $1" >&2
}

# Update main repository with git pull
update_main_repo() {
    log "🔄 Checking for main repository updates..."
    
    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        log "Not in a git repository, skipping main repo update"
        return 0
    fi
    
    # Check for staged changes only - unstaged changes are OK
    if ! git diff --cached --quiet 2>/dev/null; then
        warning "Staged changes detected, skipping main repo update for safety"
        log "  💡 Commit your changes first, then run: ./post_open.sh"
        return 0
    fi
    
    # Warn about unstaged changes but continue
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log "  ⚠️  Unstaged changes detected, but continuing with update"
    fi
    
    # Get current branch
    current_branch=$(git branch --show-current 2>/dev/null)
    if [ -z "$current_branch" ]; then
        # Fallback for older git versions
        current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    fi
    
    if [ -z "$current_branch" ] || [ "$current_branch" = "HEAD" ]; then
        log "Not on a named branch (detached HEAD?), skipping main repo update"
        return 0
    fi
    
    log "  📍 Current branch: $current_branch"
    
    # Try to fetch with better error handling
    log "  🔍 Fetching latest changes..."
    if ! git fetch origin "$current_branch" 2>/dev/null; then
        if [ "$VERBOSE" = "-v" ] || [ "$VERBOSE" = "--verbose" ]; then
            warning "Cannot fetch from remote - checking connectivity:"
            git fetch origin "$current_branch" 2>&1 | head -3
        else
            warning "Cannot fetch from remote repository. Run with -v for details."
        fi
        log "  📱 Using local repository state"
        return 0
    fi
    
    # Check if remote branch exists
    if ! git rev-parse "origin/$current_branch" >/dev/null 2>&1; then
        log "  📋 Remote branch 'origin/$current_branch' doesn't exist, skipping update"
        return 0
    fi
    
    # Compare commits
    local_commit=$(git rev-parse HEAD 2>/dev/null)
    remote_commit=$(git rev-parse "origin/$current_branch" 2>/dev/null)
    
    if [ "$local_commit" = "$remote_commit" ]; then
        log "  ✅ Repository already up to date"
        return 0
    fi
    
    # Check if we can fast-forward
    if git merge-base --is-ancestor HEAD "origin/$current_branch" 2>/dev/null; then
        log "  ⬇️  Pulling latest changes..."
        if git pull --ff-only origin "$current_branch" 2>/dev/null; then
            echo "✅ Repository updated with recent changes"
            # Show what was updated (briefly)
            if [ "$VERBOSE" = "-v" ] || [ "$VERBOSE" = "--verbose" ]; then
                echo "  📋 Recent changes:"
                git log --oneline "$local_commit..HEAD" | head -5
            fi
        else
            error "Fast-forward pull failed. Manual intervention required."
            if [ "$VERBOSE" = "-v" ] || [ "$VERBOSE" = "--verbose" ]; then
                echo "  💡 Try: git status && git pull"
            fi
        fi
    else
        # We're ahead or diverged
        ahead_count=$(git rev-list --count "origin/$current_branch..HEAD" 2>/dev/null || echo "0")
        behind_count=$(git rev-list --count "HEAD..origin/$current_branch" 2>/dev/null || echo "0")
        
        if [ "$ahead_count" -gt 0 ] && [ "$behind_count" -gt 0 ]; then
            warning "Repository has diverged (ahead: $ahead_count, behind: $behind_count)"
            log "  💡 Manual merge required: git pull --no-ff"
        elif [ "$ahead_count" -gt 0 ]; then
            log "  ⬆️  Repository is $ahead_count commits ahead of remote"
            log "  💡 Consider pushing: git push origin $current_branch"
        fi
    fi
}

# Update main repository first
update_main_repo

# Check if setup has been run, and run it if needed
if [ ! -d ".tbx-cache" ]; then
    echo "🔧 TBX cache not found. Running setup..."
    
    # Check if setup.sh exists
    if [ ! -f "./setup.sh" ]; then
        error "setup.sh not found. Cannot initialize TBX cache."
        exit 1
    fi
    
    # Make setup.sh executable if it isn't
    chmod +x ./setup.sh
    
    # Run setup.sh
    if ! ./setup.sh; then
        error "Setup failed. Please check the setup.sh script."
        exit 1
    fi
    
    echo "✅ Setup completed successfully"
fi

# Update TBX cache with better error handling
log "🔄 Updating TBX cache..."
cd .tbx-cache

# Check if it's a git repository
if [ ! -d ".git" ]; then
    error "TBX cache is not a git repository. Please run './setup.sh' to reinitialize."
    exit 1
fi

# Try to fetch first, then pull
git_update_success=false

# Try fetching to test connectivity
if git fetch origin main >/dev/null 2>&1; then
    # If fetch works, try to pull
    if git pull --ff-only origin main >/dev/null 2>&1; then
        git_update_success=true
        log "  ✓ TBX cache updated successfully"
    elif git diff --quiet HEAD origin/main 2>/dev/null; then
        # Already up to date
        git_update_success=true
        log "  ✓ TBX cache already up to date"
    else
        warning "Git pull failed, but will continue with existing files"
    fi
else
    warning "Cannot connect to remote repository. Using cached files."
fi

cd ..

# Copy files if they've changed
log "📋 Checking for context file updates..."
files_updated=0
missing_files=0

# Check and copy elements.d.ts
elements_src=".tbx-cache/launchers/launcher-editor/public/elements.d.ts"
elements_dst="src/interfaces/tbx/elements.d.ts"

if [ -f "$elements_src" ]; then
    if ! cmp -s "$elements_src" "$elements_dst" 2>/dev/null; then
        mkdir -p src/interfaces/tbx
        cp "$elements_src" "$elements_dst"
        log "  ✓ Updated elements.d.ts"
        files_updated=$((files_updated + 1))
    fi
else
    warning "Source file $elements_src not found"
    missing_files=$((missing_files + 1))
fi

# Check and copy snippets.json
snippets_src=".tbx-cache/launchers/launcher-editor/public/snippets.json"
snippets_dst="src/interfaces/tbx/snippets.json"

if [ -f "$snippets_src" ]; then
    if ! cmp -s "$snippets_src" "$snippets_dst" 2>/dev/null; then
        mkdir -p src/interfaces/tbx
        cp "$snippets_src" "$snippets_dst"
        log "  ✓ Updated snippets.json"
        files_updated=$((files_updated + 1))
    fi
else
    warning "Source file $snippets_src not found"
    missing_files=$((missing_files + 1))
fi

# Final status
if [ $missing_files -gt 0 ]; then
    error "Missing $missing_files required source file(s). Try running './setup.sh' to fix the cache."
    exit 1
elif [ $files_updated -gt 0 ]; then
    echo "✅ Updated $files_updated TBX context file(s)"
elif [ "$VERBOSE" = "-v" ] || [ "$VERBOSE" = "--verbose" ]; then
    echo "✅ TBX context files are up to date"
fi 