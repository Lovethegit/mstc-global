#!/usr/bin/env python3
# Helper script to insert property batches into main.mo
# Run from /home/ubuntu/workspace/app/src/backend/
import sys

with open('main.mo', 'r') as f:
    content = f.read()

anchor = '    propertyListings.addAll(batchA.vals());
  };'

if anchor not in content:
    print('ERROR: anchor not found!')
    sys.exit(1)

print('Anchor found at position:', content.index(anchor))
print('Total length:', len(content))
