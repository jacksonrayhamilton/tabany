#!/bin/bash

#
# Downloads and extracts the latest set of images for Tabany.
# Requires wget and tar. If you don't have them:
#
#   $ sudo apt-get install wget tar
#
# To run this script:
#
#   $ cd /path/to/tabany/tools/
#   $ chmod +x download_images.sh
#   $ ./download_images.sh
#
# (Or you could visit the following link in a web browser, download the file,
# and use a GUI application like 7-zip to extract its contents.)
#
#   http://tabany.zxq.net/images.tar.gz
#

FILENAME="images.tar.gz"
DOWNLOAD_URL="http://tabany.zxq.net/${FILENAME}"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMAGES_DIR="${SCRIPT_DIR}/../gamefiles/client/images"
DOWNLOAD_DIR="${IMAGES_DIR}/.download"
ARCHIVE="${DOWNLOAD_DIR}/${FILENAME}"

mkdir -p "$DOWNLOAD_DIR"
wget "$DOWNLOAD_URL" -O "$ARCHIVE"
tar -zxvf "$ARCHIVE" -C "$IMAGES_DIR"
rm -rf "$DOWNLOAD_DIR"
