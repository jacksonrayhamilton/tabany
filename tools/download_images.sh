#!/bin/bash

#
# Downloads and extracts the latest set of images for Tabany.
# Requires wget (or curl) and tar.
#
# To run this script:
#
#   $ cd /path/to/tabany/tools/
#   $ chmod +x download_images.sh
#   $ ./download_images.sh
#
# By default, existing files will NOT be replaced.
#
# If you are okay with...
#
#   - updating unchanged existing files (you should be)
#   - overwriting changed existing files with files that are newer
#     than them (you should be wary of this)
#
# ...then specify the -k ("keep newer files") option.
#
#   $ ./download_images.sh -k
#
# If you are okay with overwriting everything, specify
# the -o ("overwrite") option.
#
#   $ ./download_images.sh -o
#
# If you are extra paranoid (you should be if you have modified any of
# the images) then specify the -d ("do not install") option to download
# and extract the files into a new folder in the current directory.
#
#   $ ./download_images.sh -d
#
# Instead of using this script, you could also visit the following link in a
# web browser, download the file, and use a GUI application like 7-zip to
# extract its contents.
#
#   http://tabany.zxq.net/images.tar.gz
#

# By default, don't replace existing files when extracting, treat them
# as errors.
TAR_OPTIONS="--keep-old-files"
DO_NOT_INSTALL=0

while getopts "kod" OPT
do
  case $OPT in
    k)
      # Keep any changes that you have to made your files, as long as
      # there isn't a version even newer than your's in the archive.
      # (From man tar: "don't replace existing files that are newer than
      # their archive copies")
      #
      # You should still back up any of your changes to ensure that
      # they don't get overwritten by upstream ones.
      TAR_OPTIONS="--keep-newer-files"
    ;;
    o)
      # Overwrite in tar's usual manner.
      TAR_OPTIONS=""
    ;;
    d)
      # Download and extract into the present directory, but do not install.
      DO_NOT_INSTALL=1
    ;;
  esac
done
shift $(($OPTIND - 1))

FILENAME="images.tar.gz"
DOWNLOAD_URL="http://tabany.zxq.net/${FILENAME}"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMAGES_DIR="${SCRIPT_DIR}/../gamefiles/client/images"
if (( $DO_NOT_INSTALL != 1 ))
then
  DOWNLOAD_DIR="${IMAGES_DIR}/.downloaded_images"
else
  DOWNLOAD_DIR=""$( pwd )"/downloaded_images"
fi
ARCHIVE="${DOWNLOAD_DIR}/${FILENAME}"

# Create a download directory.
mkdir -p "$DOWNLOAD_DIR"

# Use whichever transport mechanism is available.
if [ -n "$(which wget)" ]
then
  wget "$DOWNLOAD_URL" -O "$ARCHIVE"
elif [ -n "$(which curl)" ]
then
  curl "$DOWNLOAD_URL" -o "$ARCHIVE"
else
  echo "This script requires wget or curl. Please install either."
  exit 1
fi

# Make sure tar is installed.
if [ -n "$(which tar)" ]
then
  echo $TAR_OPTIONS
  tar -zxvf "$ARCHIVE" -C "$IMAGES_DIR" $TAR_OPTIONS
else
  echo "This script requires tar. Please install it."
  exit 1
fi

# Clean up.
if (( $DO_NOT_INSTALL != 1 ))
then
  rm -rf "$DOWNLOAD_DIR"
fi
