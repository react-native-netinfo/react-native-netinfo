/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.reactnativecommunity.netinfo;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.content.ContextCompat;

import java.net.InetAddress;
import java.net.UnknownHostException;

public class NetInfoUtils {
    static InetAddress getWifiInetAddress(int ipAddress) throws UnknownHostException {
        if (ipAddress == 0) {
            throw new UnknownHostException("Wi-Fi IPv4 address is unavailable");
        }

        return InetAddress.getByAddress(new byte[] {
                (byte) ipAddress,
                (byte) (ipAddress >>> 8),
                (byte) (ipAddress >>> 16),
                (byte) (ipAddress >>> 24),
        });
    }

    public static boolean isAccessWifiStatePermissionGranted(Context context) {
        return ContextCompat.checkSelfPermission(context,
                Manifest.permission.ACCESS_WIFI_STATE) == PackageManager.PERMISSION_GRANTED;
    }


    /**
     * Starting with Android 14, apps and services that target Android 14 and use context-registered
     * receivers are required to specify a flag to indicate whether or not the receiver should be
     * exported to all other apps on the device: either RECEIVER_EXPORTED or RECEIVER_NOT_EXPORTED
     * <a href="https://developer.android.com/about/versions/14/behavior-changes-14#runtime-receivers-exported"/>
     */
    @SuppressLint("UnspecifiedRegisterReceiverFlag")
    public static void compatRegisterReceiver(
            Context context, BroadcastReceiver receiver, IntentFilter filter, boolean exported) {
        if (Build.VERSION.SDK_INT >= 34 && context.getApplicationInfo().targetSdkVersion >= 34) {
            context.registerReceiver(
                    receiver, filter, exported ? Context.RECEIVER_EXPORTED : Context.RECEIVER_NOT_EXPORTED);
        } else {
            context.registerReceiver(receiver, filter);
        }
    }
}
