import com.google.common.truth.Truth.assertThat;
import com.reactnativecommunity.netinfo.NetworkCallbackConnectivityReceiver;

import org.junit.Test;

import static org.junit.Assert.assertThat;

public class NetworkCallbackConnectivityReceiverTest {

    @Test
    public void emailValidator_CorrectEmailSimple_ReturnsTrue() {
        assertThat(NetworkCallbackConnectivityReceiver.isValidEmail("name@email.com")).isTrue();
    }
}
