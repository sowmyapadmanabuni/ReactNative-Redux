package com.oyespace.oyesafe;

import android.app.Application;
import android.content.Context;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.dooboolab.RNAudioRecorderPlayerPackage;
import com.goodatlas.audiorecord.RNAudioRecordPackage;
import com.synclovis.RNLocationSatellitesPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.rumax.reactnative.pdfviewer.PDFViewPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.devstepbcn.wifi.AndroidWifiPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.react.rnspinkit.RNSpinkitPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.lynxit.contactswrapper.ContactsWrapperPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import cl.json.ShareApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.ninty.system.setting.SystemSettingPackage;
import com.horcrux.svg.SvgPackage;
import com.anyline.RNImageToPDF.RNImageToPdfPackage;
import com.ocetnik.timer.BackgroundTimerPackage;

import com.rnfs.RNFSPackage;
import cl.json.RNSharePackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;


import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;

import com.BV.LinearGradient.LinearGradientPackage;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

    @Override
    public String getFileProviderAuthority() {
        return BuildConfig.APPLICATION_ID + ".provider";
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNCWebViewPackage(),
                    new NetInfoPackage(),
                    new RNScreensPackage(),
                    new ReanimatedPackage(),
                    new RNAudioRecorderPlayerPackage(),
                    new RNAudioRecordPackage(),
                    new RNPermissionsPackage(),
                    new PDFViewPackage(),
                    new DocumentPickerPackage(),

                    new RNHTMLtoPDFPackage(),
                    new AndroidWifiPackage(),
                    new RNDeviceInfo(),
                    new RNSpinkitPackage(),
                    new RNFetchBlobPackage(),
                    new RNSoundPackage(),
                    new RNFirebasePackage(),
                    new VectorIconsPackage(),
                    new RNViewShotPackage(),
                    new RNFSPackage(),
                    new RNSharePackage(),
                    new ImagePickerPackage(),
                    new RNGestureHandlerPackage(),
                    new RNFirebaseMessagingPackage(),
                    new RNFirebaseNotificationsPackage(),
                    new ContactsWrapperPackage(),
                    new MapsPackage(),
                    new RNFusedLocationPackage(),
                    new FabricPackage(),
                    new RNAndroidLocationEnablerPackage(),
                    new LottiePackage(),
                    new SystemSettingPackage(),
                    new SvgPackage(),
                    new GeolocationPackage(),
                    new RNImageToPdfPackage(),
                    new RNLocationSatellitesPackage(),
                    new BackgroundTimerPackage(),
                    new SafeAreaContextPackage(),
                    new RNDateTimePickerPackage(),
                    new LinearGradientPackage()

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
        Fabric.with(this, new Crashlytics());

    }

}
