#!/usr/bin/env bash

set -e

eval "$(bin/get_s3_env)"

exec "$@"