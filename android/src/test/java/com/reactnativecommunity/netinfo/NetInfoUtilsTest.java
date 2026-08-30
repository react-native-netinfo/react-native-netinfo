/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.reactnativecommunity.netinfo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import java.net.UnknownHostException;

import org.junit.Test;

public class NetInfoUtilsTest {
    @Test
    public void convertsWifiIpAddressEndingInZero() throws Exception {
        int wifiIpAddress = 0x0002A8C0;

        assertEquals(
                "192.168.2.0",
                NetInfoUtils.getWifiInetAddress(wifiIpAddress).getHostAddress());
    }

    @Test
    public void rejectsUnavailableWifiIpAddress() {
        assertThrows(UnknownHostException.class, () -> NetInfoUtils.getWifiInetAddress(0));
    }
}
