package com.reactnativecommunity.netinfo;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkInfo;
import android.net.NetworkRequest;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;

import com.facebook.react.bridge.ReactApplicationContext;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.junit.Test;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;

@RunWith(RobolectricTestRunner.class)
public class NetworkCallbackConnectivityReceiverTest {

//    @Mock
//    private Context mockApplicationContext;
//
//    @Mock
//    private ContextWrapper mockContextWrapper;
//
//    @Mock
//    private ConnectivityManager mockConnectivityManager;
//
//    @Mock
//    private Network mockNetwork;
//
//    @Mock
//    private NetworkInfo mockNetworkInfo;
//
//    @Mock
//    private  WifiManager mockWifiManager;
//
//    @Mock
//    private TelephonyManager mockTelephonyManager;
//
//    @Mock
//    private ReactApplicationContext mockReactApplicationContext;
//
//    @Mock
//    private  Resources mockContextResources;
//
//    @Mock
//    private SharedPreferences mockSharedPreferences;
//
//    @Mock
//    private ConnectivityManager.NetworkCallback mockNetworkCallback;

//    @Before
//    public void setupTests() {
//        // Mockito has a very convenient way to inject mocks by using the @Mock annotation. To
//        // inject the mocks in the test the initMocks method needs to be called.
//        MockitoAnnotations.initMocks(this);
//
//        // During unit testing sometimes test fails because of your methods
//        // are using the app Context to retrieve resources, but during unit test the Context is null
//        // so we can mock it.
//
//        when(mockApplicationContext.getResources()).thenReturn(mockContextResources);
//
//        when(mockApplicationContext.getSharedPreferences(anyString(), anyInt())).thenReturn(mockSharedPreferences);
//
//
//        when(mockContextWrapper.getSystemService(anyString())).thenReturn("mocked string");
//        when(mockContextResources.getString(anyInt())).thenReturn("mocked string");
//        when(mockContextResources.getStringArray(anyInt())).thenReturn(new String[]{"mocked string 1", "mocked string 2"});
//        when(mockContextResources.getColor(anyInt())).thenReturn(Color.BLACK);
//        when(mockContextResources.getBoolean(anyInt())).thenReturn(false);
//        when(mockContextResources.getDimension(anyInt())).thenReturn(100f);
//        when(mockContextResources.getIntArray(anyInt())).thenReturn(new int[]{1,2,3});
//
//
//        // here you can mock additional methods ...
//        when(mockReactApplicationContext.getBaseContext()).thenReturn(mockContextWrapper);
//        when(mockReactApplicationContext.getApplicationContext()).thenReturn(mockApplicationContext);
//        when(mockReactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE)).thenReturn(mockConnectivityManager);
//        when(mockReactApplicationContext.getSystemService(Context.WIFI_SERVICE)).thenReturn(mockWifiManager);
//        when(mockReactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE)).thenReturn(mockTelephonyManager);
//
//
//        when(mockConnectivityManager.getActiveNetwork()).thenReturn(mockNetwork);
//        when(mockConnectivityManager.getNetworkInfo(mockNetwork)).thenReturn(mockNetworkInfo);
//        doNothing().when(mockConnectivityManager).registerDefaultNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
//        doNothing().when(mockConnectivityManager).unregisterNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
//    }


//    @Test
//    public void registrationCallsDefaultNetworkCallback() {
//        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
//        connectivityReceiver.register();
//        verify(mockConnectivityManager, times(1)).registerDefaultNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
//    }
//
//    @Test
//    public void unregistrationCallsUnRegisterNetworkCallback() {
//        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
//        connectivityReceiver.unregister();
//        verify(mockConnectivityManager, times(1)).unregisterNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
//    }
//
//    @Test
//    public void onUpdated() {
//        mockNetworkCallback.onAvailable(mockNetwork);
//        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
//        connectivityReceiver.register();
//        verify(mockConnectivityManager, times(1)).registerNetworkCallback(any(NetworkRequest.class), any(ConnectivityManager.NetworkCallback.class));
//    }

    @Test
    public void registrationCallsDefaultNetworkCallback() {
        Robolectric.build
        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
        connectivityReceiver.register();
        verify(mockConnectivityManager, times(1)).registerDefaultNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
    }
}
