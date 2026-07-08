#!/usr/bin/env bash
# Assembles the three AI Agency Launch Kit zips into products/agency-launch-kit/dist/.
#
# Design rules:
#   - Explicit file allowlist only — never glob a directory, so client data,
#     credentials, or Darius-specific context can't slip into a sellable zip.
#   - Personal contact details are replaced with buyer-facing placeholders at
#     copy time; the repo sources are never modified.
#   - Re-run any time a source file improves, then re-upload the zips.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
KIT_DIR="$REPO_ROOT/products/agency-launch-kit"
DIST="$KIT_DIR/dist"
STAGE="$DIST/.stage"
VERSION="$(date +%Y.%m.%d)"

rm -rf "$STAGE" && mkdir -p "$STAGE" "$DIST"

# Copy one repo file into a staging subdir, scrubbing personal contact details.
sanitize_copy() { # <repo-relative source> <stage-relative dest dir>
  local src="$REPO_ROOT/$1" dest_dir="$STAGE/$2"
  [ -f "$src" ] || { echo "MISSING SOURCE: $1" >&2; exit 1; }
  mkdir -p "$dest_dir"
  sed -e 's#ryan@modernflowai\.com#you@youragency.com#g' \
      -e 's#https://calendly\.com/ryan-modernflowai/30min#https://calendly.com/YOUR-LINK#g' \
      -e 's#calendly\.com/ryan-modernflowai#calendly.com/YOUR-LINK#g' \
      "$src" > "$dest_dir/$(basename "$src")"
}

# ---------------------------------------------------------------- tier 1 files
tier1() { # writes into stage subdir $1
  local t="$1"
  sanitize_copy "products/agency-launch-kit/content/START-HERE.md" "$t"
  sanitize_copy "products/agency-launch-kit/content/LICENSE.md"    "$t"
  sanitize_copy "BUSINESS-PLAN.md"          "$t/01-playbook"
  sanitize_copy "company-os/30-DAY-PLAN.md" "$t/01-playbook"
  local sop
  for sop in 00-overview 01-lead-generation 02-sales-outreach 03-crm-onboarding \
             04-booking-scheduling 05-meeting-intelligence 06-content-marketing \
             07-web-engineering 08-internal-comms 09-reporting; do
    sanitize_copy "docs/sops/$sop.md" "$t/01-playbook/sops"
  done
  local tpl
  for tpl in content-interview ghl-build-prompt morning-brief proposal \
             prospect-qualification reply-prep research-brief weekly-review; do
    sanitize_copy "company-os/02_Templates/$tpl.md" "$t/01-playbook/prompt-templates"
  done
}

# ---------------------------------------------------------------- tier 2 files
tier2() {
  local t="$1"
  tier1 "$t"
  local f
  for f in README.md AGENT-RUNBOOK.md workflow-1-apollo-lead-sourcing.json \
           workflow-2-initial-outreach.json workflow-3-ai-reply-handler.json \
           workflow-4-calendly-booking-alert.json; do
    sanitize_copy "automation/n8n/$f" "$t/02-automations/cold-email-machine"
  done
  for f in README.md CLIENT-GUIDE.md CLIENT-ONBOARDING.md workflow.json \
           inbound-workflow.json; do
    sanitize_copy "automations/servicetitan-followup/$f" "$t/02-automations/post-job-followup"
  done
  sanitize_copy "GHL-INTEGRATION-GUIDE.md" "$t/02-automations"
}

# ---------------------------------------------------------------- tier 3 files
tier3() {
  local t="$1"
  tier2 "$t"
  sanitize_copy "planner/index.html" "$t/03-command-center"
  local f
  for f in README.md 00-system-prompt.md 01-onboarding-brief.md 02-angle-research.md \
           03-soul-characters.md 04-production-workflow.md 05-pricing-packages.md \
           06-scaling-playbook.md 07-quality-and-compliance.md; do
    sanitize_copy "ugc-agency/$f" "$t/04-creative-engine/ugc-system"
  done
  sanitize_copy "BRAND-AD-GENERATOR.md" "$t/04-creative-engine"
  sanitize_copy ".claude/skills/static-ad-generator/SKILL.md" "$t/04-creative-engine/static-ad-generator"
  # references/ is the one allowed directory copy: template library, no client data
  if [ -d "$REPO_ROOT/.claude/skills/static-ad-generator/references" ]; then
    mkdir -p "$STAGE/$t/04-creative-engine/static-ad-generator"
    cp -R "$REPO_ROOT/.claude/skills/static-ad-generator/references" \
          "$STAGE/$t/04-creative-engine/static-ad-generator/"
  fi
}

package() { # <stage subdir> <zip name>
  ( cd "$STAGE/$1" && zip -qr "$DIST/$2-v$VERSION.zip" . )
  echo "built: dist/$2-v$VERSION.zip ($(du -h "$DIST/$2-v$VERSION.zip" | cut -f1))"
}

tier1 tier1 && package tier1 playbook
tier2 tier2 && package tier2 automation-toolkit
tier3 tier3 && package tier3 agency-in-a-box

# Final guard: no personal contact details or obvious secrets in any zip.
for z in "$DIST"/*-v"$VERSION".zip; do
  if unzip -p "$z" | grep -qE 'ryan@modernflowai\.com|ryan-modernflowai|sk-ant-|AKIA[0-9A-Z]{16}'; then
    echo "SANITIZATION FAILED in $z" >&2; exit 1
  fi
done
echo "sanitization check passed"

rm -rf "$STAGE"
