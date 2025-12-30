# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Preserve line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ============================================
# Capacitor Rules
# ============================================
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-keep class com.ionicframework.** { *; }
-dontwarn com.getcapacitor.**
-dontwarn com.capacitorjs.**

# Keep Capacitor plugins
-keep class * extends com.getcapacitor.Plugin { *; }
-keep class * implements com.getcapacitor.PluginCall { *; }

# Keep Capacitor bridge
-keep class com.getcapacitor.Bridge { *; }
-keep class com.getcapacitor.BridgeActivity { *; }
-keep class com.getcapacitor.Plugin { *; }

# ============================================
# React Native / React Rules
# ============================================
# Note: This is a React web app, but keeping these for compatibility
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

# ============================================
# WebView / JavaScript Interface
# ============================================
# Keep JavaScript interfaces for WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebView classes
-keep class android.webkit.** { *; }
-dontwarn android.webkit.**

# ============================================
# Supabase / HTTP Client Rules
# ============================================
# Keep Supabase classes (if using native modules)
-keep class io.supabase.** { *; }
-dontwarn io.supabase.**

# Keep OkHttp (used by Supabase)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Keep Retrofit (if used)
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepattributes Signature, Exceptions

# ============================================
# JSON / Serialization
# ============================================
# Keep classes used for JSON serialization
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
-dontwarn com.google.gson.**

# Keep classes with @SerializedName annotation
-keepclassmembers,allowobfuscation class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# ============================================
# Android Support / AndroidX
# ============================================
-keep class androidx.** { *; }
-keep interface androidx.** { *; }
-dontwarn androidx.**

# Keep Android support library classes
-keep class android.support.** { *; }
-dontwarn android.support.**

# ============================================
# Kotlin (if used)
# ============================================
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}

# ============================================
# Keep Native Methods
# ============================================
-keepclasseswithmembernames class * {
    native <methods>;
}

# ============================================
# Keep Parcelable
# ============================================
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# ============================================
# Keep Enums
# ============================================
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ============================================
# Keep R class
# ============================================
-keepclassmembers class **.R$* {
    public static <fields>;
}

# ============================================
# Keep Application class
# ============================================
-keep class * extends android.app.Application {
    <init>();
}

# ============================================
# Keep Activity classes
# ============================================
-keep class * extends android.app.Activity {
    <init>();
}

# ============================================
# Keep MainActivity (Capacitor entry point)
# ============================================
-keep class com.mayara.henshindb.MainActivity { *; }

# ============================================
# General Android Rules
# ============================================
# Keep custom views
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
    *** get*();
}

# Keep custom exceptions
-keep public class * extends java.lang.Exception

# Keep annotations
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses

# ============================================
# Remove logging in release builds (optional)
# ============================================
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
