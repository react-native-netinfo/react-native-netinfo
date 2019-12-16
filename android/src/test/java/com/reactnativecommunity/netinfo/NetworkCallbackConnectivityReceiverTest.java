package com.reactnativecommunity.netinfo;

import android.app.NotificationManager;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.SystemClock;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.netinfo.types.CellularGeneration;
import com.reactnativecommunity.netinfo.types.ConnectionType;

import org.junit.Before;
import org.junit.Rule;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static android.net.NetworkCapabilities.NET_CAPABILITY_INTERNET;
import static android.net.NetworkCapabilities.NET_CAPABILITY_NOT_SUSPENDED;
import static android.net.NetworkCapabilities.NET_CAPABILITY_VALIDATED;
import static android.net.NetworkCapabilities.TRANSPORT_CELLULAR;
import static android.os.Build.VERSION_CODES.KITKAT;
import static android.os.Build.VERSION_CODES.N;
import static android.os.Build.VERSION_CODES.O;
import static android.os.Build.VERSION_CODES.P;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mock;

import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.rule.PowerMockRule;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import androidx.core.net.ConnectivityManagerCompat;


@PrepareForTest({
        Arguments.class,
        SystemClock.class,
        SoLoader.class,
        DeviceEventManagerModule.class,
        NotificationManager.class,
        ConnectivityManager.class,
        ConnectivityManagerCompat.class,
        TelephonyManager.class,
        WifiManager.class,
        NetworkInfo.class,
        JavaScriptModule.class,
        CellularGeneration.class,
})
@PowerMockIgnore({ "org.mockito.*", "org.robolectric.*", "android.*", "androidx.*" })
@RunWith(RobolectricTestRunner.class)
public class NetworkCallbackConnectivityReceiverTest {

    private static String EXPECTED_EVENT_NAME = "netInfo.networkStatusDidChange";

    @Rule
    public PowerMockRule rule = new PowerMockRule();

    @Mock
    private ContextWrapper mockContextWrapper;

    @Mock
    private ReactApplicationContext mockReactApplicationContext;

    @Mock
    private  Resources mockContextResources;

    @Mock
    private SharedPreferences mockSharedPreferences;

    @Mock
    private NotificationManager mockNotificationManager;

    @Mock
    private WifiManager mockWifiManager;

    @Mock
    private TelephonyManager mockTelephonyManager;

    @Mock
    private ConnectivityManager  mockConnectivityManager;

    @Mock
    private DeviceEventManagerModule.RCTDeviceEventEmitter emitter;

    @Mock
    private Network mockNetwork;


    @Before
    public void setupTests() {
        final long ts = SystemClock.uptimeMillis();
        PowerMockito.mockStatic(SoLoader.class);
        PowerMockito.mockStatic(Arguments.class);
        PowerMockito.when(Arguments.createArray())
                .thenAnswer(
                        new Answer<Object>() {
                            @Override
                            public Object answer(InvocationOnMock invocation) throws Throwable {
                                return new JavaOnlyArray();
                            }
                        });
        PowerMockito.when(Arguments.createMap())
                .thenAnswer(
                        new Answer<Object>() {
                            @Override
                            public Object answer(InvocationOnMock invocation) throws Throwable {
                                return new JavaOnlyMap();
                            }
                        });
        PowerMockito.mockStatic(SystemClock.class);
        PowerMockito.when(SystemClock.uptimeMillis())
                .thenAnswer(
                        new Answer<Object>() {
                            @Override
                            public Object answer(InvocationOnMock invocation) throws Throwable {
                                return ts;
                            }
                        });

        mock(ConnectivityManager.class);
        mock(TelephonyManager.class);
        mock(WifiManager.class);
        mock(Network.class);
        PowerMockito.mockStatic(CellularGeneration.class);
        PowerMockito.when(CellularGeneration.fromNetworkInfo(any(NetworkInfo.class)))
                .thenAnswer(
                        new Answer<Object>() {
                            @Override
                            public Object answer(InvocationOnMock invocation) throws Throwable {
                                return CellularGeneration.CG_4G;
                            }
                        });

        emitter = mock(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

        PowerMockito.spy(emitter);

        MockitoAnnotations.initMocks(this);


        when(mockReactApplicationContext.getBaseContext()).thenReturn(mockContextWrapper);
        when(mockReactApplicationContext.getApplicationContext()).thenReturn(mockReactApplicationContext);

        when(mockReactApplicationContext.getResources()).thenReturn(mockContextResources);
        when(mockReactApplicationContext.getSharedPreferences(anyString(), anyInt())).thenReturn(mockSharedPreferences);

        when(mockReactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE)).thenReturn(mockTelephonyManager);
        when(mockReactApplicationContext.getSystemService(Context.WIFI_SERVICE)).thenReturn(mockWifiManager);
        when(mockReactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE)).thenReturn(mockConnectivityManager);
        when(mockReactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE)).thenReturn(mockNotificationManager);
        when(mockReactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)).thenReturn(emitter);
        when(mockContextResources.getString(anyInt())).thenReturn("mocked string");
        when(mockContextResources.getStringArray(anyInt())).thenReturn(new String[]{"mocked string 1", "mocked string 2"});
        when(mockContextResources.getColor(anyInt())).thenReturn(Color.BLACK);
        when(mockContextResources.getBoolean(anyInt())).thenReturn(false);
        when(mockContextResources.getDimension(anyInt())).thenReturn(100f);
        when(mockContextResources.getIntArray(anyInt())).thenReturn(new int[]{1,2,3});
        doNothing().when(mockConnectivityManager).registerDefaultNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
        doNothing().when(mockConnectivityManager).unregisterNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
        when(mockConnectivityManager.isActiveNetworkMetered()).thenReturn(false);

        PowerMockito.when(ConnectivityManagerCompat.isActiveNetworkMetered(mockConnectivityManager))
                .thenAnswer(
                        new Answer<Object>() {
                            @Override
                            public Object answer(InvocationOnMock invocation) throws Throwable {
                                return false;
                            }
                        });
    }


    @Test
    public void registrationCallsDefaultNetworkCallback() {
        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
        connectivityReceiver.register();
        Mockito.verify(mockConnectivityManager, times(1)).registerDefaultNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
    }

    @Test
    public void unregistrationCallsUnRegisterNetworkCallback() {
        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
        connectivityReceiver.unregister();
        Mockito.verify(mockConnectivityManager, times(1)).unregisterNetworkCallback(any(ConnectivityManager.NetworkCallback.class));
    }

    @Test
    public void onUpdateCallsEmitterWithExpectedEventMap() {
        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
        ConnectionType typeToUpdate = ConnectionType.CELLULAR;
        CellularGeneration cellularGeneration = CellularGeneration.CG_4G;
        boolean isInternetReachable = true;
        connectivityReceiver.updateConnectivity(typeToUpdate, cellularGeneration, isInternetReachable);
        JavaOnlyMap expectedData = getDefaultConnectionData();
        Mockito.verify(emitter, times(1)).emit(anyString(), any());
        Mockito.verify(emitter, times(1)).emit(EXPECTED_EVENT_NAME, expectedData);
    }

    @Test
    public void eventMapIsUpdatedWhenConnectivityStatusChanges() {
        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
        ConnectionType typeToUpdate = ConnectionType.CELLULAR;
        CellularGeneration cellularGeneration = CellularGeneration.CG_4G;
        boolean isInternetReachable = true;
        connectivityReceiver.updateConnectivity(typeToUpdate, cellularGeneration, isInternetReachable);
        connectivityReceiver.updateConnectivity(typeToUpdate, cellularGeneration, false);
        JavaOnlyMap expectedData = getDefaultConnectionData();

        JavaOnlyMap unreachableData = new JavaOnlyMap();
        unreachableData.putBoolean("isConnected", true);
        unreachableData.putBoolean("isInternetReachable", false);
        unreachableData.putMap("details", getDefaultDetails());
        unreachableData.putString("type", "cellular");
        Mockito.verify(emitter, times(2)).emit(anyString(), any());
        Mockito.verify(emitter, times(1)).emit(EXPECTED_EVENT_NAME, expectedData);
        Mockito.verify(emitter, times(1)).emit(EXPECTED_EVENT_NAME, unreachableData);
    }

    @Test
    public void whenInternetSettingsAreUnavailableEmitterReturnsNoneForConnection() {
        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
        connectivityReceiver.updateAndSend();
        JavaOnlyMap expectedData = getNoneConnectionData();
        Mockito.verify(emitter, times(1)).emit(anyString(), any());
        Mockito.verify(emitter, times(1)).emit(EXPECTED_EVENT_NAME, expectedData);
    }

    @Config(sdk = P)
    @Test
    public void whenInternetConnectionIsSuspendedEmitterSetsInternetUnavailable() {
        NetworkCapabilities mockedNetworkCapabilities = mock(NetworkCapabilities.class);
        when(mockedNetworkCapabilities.hasTransport(TRANSPORT_CELLULAR)).thenReturn(true);
        when(mockedNetworkCapabilities.hasCapability(NET_CAPABILITY_VALIDATED)).thenReturn(true);
        when(mockedNetworkCapabilities.hasCapability(NET_CAPABILITY_INTERNET)).thenReturn(true);
        when(mockedNetworkCapabilities.hasCapability(NET_CAPABILITY_NOT_SUSPENDED)).thenReturn(false);
        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
        connectivityReceiver.mNetwork = mockNetwork;
        when(mockConnectivityManager.getNetworkInfo(connectivityReceiver.mNetwork)).thenReturn(any(NetworkInfo.class));
        connectivityReceiver.mNetworkCapabilities = mockedNetworkCapabilities;
        connectivityReceiver.updateAndSend();
        JavaOnlyMap expectedData = getUnreachableConnectionData();
        Mockito.verify(emitter, times(1)).emit(EXPECTED_EVENT_NAME, expectedData);
    }

    @Config(sdk = O)
    @Test
    public void suspendedInternetConnectionForOlderSDKsIsStillRegistered() {
        NetworkCapabilities mockedNetworkCapabilities = mock(NetworkCapabilities.class);
        when(mockedNetworkCapabilities.hasTransport(TRANSPORT_CELLULAR)).thenReturn(true);
        when(mockedNetworkCapabilities.hasCapability(NET_CAPABILITY_VALIDATED)).thenReturn(true);
        when(mockedNetworkCapabilities.hasCapability(NET_CAPABILITY_INTERNET)).thenReturn(true);
        NetworkCallbackConnectivityReceiver connectivityReceiver = new NetworkCallbackConnectivityReceiver(mockReactApplicationContext);
        connectivityReceiver.mNetwork = mockNetwork;
        NetworkInfo mockNetworkInfo = mock(NetworkInfo.class);
        when(mockNetworkInfo.getDetailedState()).thenReturn(NetworkInfo.DetailedState.SUSPENDED);
        when(mockConnectivityManager.getNetworkInfo(connectivityReceiver.mNetwork)).thenReturn(mockNetworkInfo);
        connectivityReceiver.mNetworkCapabilities = mockedNetworkCapabilities;
        connectivityReceiver.updateAndSend();
        JavaOnlyMap expectedData = getUnreachableConnectionData();
        Mockito.verify(emitter, times(1)).emit(EXPECTED_EVENT_NAME, expectedData);
    }

    private JavaOnlyMap getNoneConnectionData() {
        JavaOnlyMap noneConnectionData = new JavaOnlyMap();
        noneConnectionData.putBoolean("isConnected", false);
        noneConnectionData.putBoolean("isInternetReachable", false);
        noneConnectionData.putMap("details", null);
        noneConnectionData.putString("type", "none");
        return noneConnectionData;
    }

    private JavaOnlyMap getUnreachableConnectionData() {
        JavaOnlyMap unreachableConnectionData = new JavaOnlyMap();
        JavaOnlyMap details = new JavaOnlyMap();
        details.putBoolean("isConnectionExpensive", false);
        unreachableConnectionData.putBoolean("isConnected", true);
        unreachableConnectionData.putBoolean("isInternetReachable", false);
        unreachableConnectionData.putMap("details", details);
        unreachableConnectionData.putString("type", "cellular");
        return unreachableConnectionData;
    }

    private JavaOnlyMap getDefaultConnectionData() {
        JavaOnlyMap defaultData = new JavaOnlyMap();
        defaultData.putBoolean("isConnected", true);
        defaultData.putBoolean("isInternetReachable", true);
        defaultData.putMap("details", getDefaultDetails());
        defaultData.putString("type", "cellular");
        return defaultData;
    }

    public JavaOnlyMap getDefaultDetails() {
        JavaOnlyMap defaultDetails = new JavaOnlyMap();
        defaultDetails.putBoolean("isConnectionExpensive", false);
        defaultDetails.putString("cellularGeneration", "4g");
        return defaultDetails;
    }


}
