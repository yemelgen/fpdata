#!/bin/bash

APPDIR=$(dirname $(readlink -f $0))

export PYTHONPATH="$APPDIR/src"

exec /usr/bin/env python3 "$APPDIR/src/local.py" "$@"
