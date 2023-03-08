package org.altbeacon.beaconreference


import android.app.*
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.lifecycle.Observer
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import org.altbeacon.beacon.*
import org.altbeacon.beaconreference.MainActivity

// LEE: i will now attempt to merge BeaconReferenceApplication into this file

class MainApplication : Application(), ReactApplication {
    lateinit var region: Region

    private val mReactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            return PackageList(this).packages
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }

        override val isNewArchEnabled: Boolean
            protected get() = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean
            protected get() = BuildConfig.IS_HERMES_ENABLED
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this,  /* native exopackage */false)

        val beaconManager = BeaconManager.getInstanceForApplication(this)


        // By default the AndroidBeaconLibrary will only find AltBeacons.  If you wish to make it
        // find a different type of beacon, you must specify the byte layout for that beacon's
        // advertisement with a line like below.  The example shows how to find a beacon with the
        // same byte layout as AltBeacon but with a beaconTypeCode of 0xaabb.  To find the proper
        // layout expression for other beacon types, do a web search for "setBeaconLayout"
        // including the quotes.
        //
        //beaconManager.getBeaconParsers().clear();
        //beaconManager.getBeaconParsers().add(new BeaconParser().
        //        setBeaconLayout("m:0-1=4c00,i:2-24v,p:24-24"));


        // By default the AndroidBeaconLibrary will only find AltBeacons.  If you wish to make it
        // find a different type of beacon like Eddystone or iBeacon, you must specify the byte layout
        // for that beacon's advertisement with a line like below.
        //
        // If you don't care about AltBeacon, you can clear it from the defaults:
        beaconManager.getBeaconParsers().clear()

        // The example shows how to find iBeacon.
        beaconManager.getBeaconParsers().add(
            BeaconParser().
            setBeaconLayout("m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24"))

        // enabling debugging will send lots of verbose debug information from the library to Logcat
        // this is useful for troubleshooting problmes
        BeaconManager.setDebug(true)


        // The BluetoothMedic code here, if included, will watch for problems with the bluetooth
        // stack and optionally:
        // - power cycle bluetooth to recover on bluetooth problems
        // - periodically do a proactive scan or transmission to verify the bluetooth stack is OK
        // BluetoothMedic.getInstance().enablePowerCycleOnFailures(this)
        // BluetoothMedic.getInstance().enablePeriodicTests(this, BluetoothMedic.SCAN_TEST + BluetoothMedic.TRANSMIT_TEST)

        // By default, the library will scan in the background every 5 minutes on Android 4-7,
        // which will be limited to scan jobs scheduled every ~15 minutes on Android 8+
        // If you want more frequent scanning (requires a foreground service on Android 8+),
        // configure that here.
        // If you want to continuously range beacons in the background more often than every 15 mintues,
        // you can use the library's built-in foreground service to unlock this behavior on Android
        // 8+.   the method below shows how you set that up.
        setupForegroundService()
        beaconManager.setEnableScheduledScanJobs(false);
        beaconManager.setBackgroundBetweenScanPeriod(2000);
        beaconManager.setBackgroundScanPeriod(1100);

        // Ranging callbacks will drop out if no beacons are detected
        // Monitoring callbacks will be delayed by up to 25 minutes on region exit
        // beaconManager.setIntentScanningStrategyEnabled(true)

        // The code below will start "monitoring" for beacons matching the region definition below
        // the region definition is a wildcard that matches all beacons regardless of identifiers.
        // if you only want to detect beacons with a specific UUID, change the id1 paremeter to
        // a UUID like Identifier.parse("2F234454-CF6D-4A0F-ADF2-F4911BA9FFA6")

        // *** ESTIMOTE BEACON ID:
        val beaconID = Identifier.parse("B9407F30-F5F8-466E-AFF1-25556B57FE6D")

        // *** CIRCUITPY BEACON ID:
        // val beaconID = Identifier.parse("43697263-7569-7450-7974-686F6E313233")
        region = Region("all-beacons", beaconID, null, null)
        beaconManager.startMonitoring(region)
        // beaconManager.startRangingBeacons(region)
        // These two lines set up a Live Data observer so this Activity can get beacon data from the Application class
        val regionViewModel = BeaconManager.getInstanceForApplication(this).getRegionViewModel(region)
        // observer will be called each time the monitored regionState changes (inside vs. outside region)
        regionViewModel.regionState.observeForever( centralMonitoringObserver)
        // observer will be called each time a new list of beacons is ranged (typically ~1 second in the foreground)
        // regionViewModel.rangedBeacons.observeForever( centralRangingObserver)

        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
        }
        // LEE: commented out because it is annoying
        // ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
    }
    fun setupForegroundService() {
        val builder = Notification.Builder(this, "Pupi")
        builder.setSmallIcon(R.drawable.ic_launcher_background)
        builder.setContentTitle("Background Scanning for Toilet Beacon")
        Log.d("MainApplication", "setup foreground service")
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT + PendingIntent.FLAG_IMMUTABLE
        )
        builder.setContentIntent(pendingIntent);
        val channel =  NotificationChannel("beacon-ref-notification-id",
            "Toilet Beacon", NotificationManager.IMPORTANCE_HIGH)
        channel.setDescription("You'll get notifications when you approach the sensor on your toilet.")
        val notificationManager =  getSystemService(
            Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel);
        builder.setChannelId(channel.getId());
        BeaconManager.getInstanceForApplication(this).enableForegroundServiceScanning(builder.build(), 456);
    }

    val centralMonitoringObserver = Observer<Int> { state ->
        if (state == MonitorNotifier.OUTSIDE) {
            Log.d(BeaconReferenceApplication.TAG, "outside beacon region: "+region)
        }
        else {
            Log.d(BeaconReferenceApplication.TAG, "inside beacon region: "+region)
            sendNotification()
        }
    }

    private fun sendNotification() {
        val builder = NotificationCompat.Builder(this, "beacon-ref-notification-id")
            .setContentTitle("Pupi")
            .setContentText("Are you on the toilet? Record it!")
            .setSmallIcon(R.drawable.ic_launcher_background)
        val stackBuilder = TaskStackBuilder.create(this)
        stackBuilder.addNextIntent(Intent(this, MainActivity::class.java))
        val resultPendingIntent = stackBuilder.getPendingIntent(
            0,
            PendingIntent.FLAG_UPDATE_CURRENT + PendingIntent.FLAG_IMMUTABLE
        )
        builder.setContentIntent(resultPendingIntent)
        val notificationManager =
            this.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(1, builder.build())
    }
}