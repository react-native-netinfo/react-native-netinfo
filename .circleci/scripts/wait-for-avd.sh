#!/bin/bash

boot=""

echo "Waiting for AVD to finish booting"
export PATH=$(dirname $(dirname $(command -v android)))/platform-tools:$PATH

until [[ "$boot" =~ "1" ]]; do
  sleep 5
  boot=$(adb -e shell getprop sys.boot_completed 2>&1)
done

# extra time to let the OS settle
sleep 15

adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0

echo "Android Virtual Device is now ready."
