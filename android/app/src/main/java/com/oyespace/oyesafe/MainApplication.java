package com.oyespace.oyesafe;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.razorpay.rn.RazorpayPackage;
import com.rpt.reactnativecheckpackageinstallation.CheckPackageInstallationPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.zmxv.RNSound.RNSoundPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; 
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line

import com.github.yamill.orientation.OrientationPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.rnfs.RNFSPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import cl.json.RNSharePackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeRestartPackage(),
            new SplashScreenReactPackage(),
            new RNSpinkitPackage(),
            new RNVersionNumberPackage(),
            new RazorpayPackage(),
            new CheckPackageInstallationPackage(),
            new SvgPackage(),
            new ReactNativeDocumentPicker(),
            new RNFetchBlobPackage(),
            new RNSoundPackage(),
            new RNFirebasePackage(),
            new OrientationPackage(),
            new RNHTMLtoPDFPackage(),
            new RNExitAppPackage(),
            new VectorIconsPackage(),
            new RNViewShotPackage(),
            new RNFSPackage(),
            new RNFileViewerPackage(),
            new RNSharePackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new SQLitePluginPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage()

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
