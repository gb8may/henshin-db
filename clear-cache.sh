#!/bin/bash
echo "Desinstalando app..."
adb uninstall com.mayara.henshindb

echo "Limpando cache do WebView..."
adb shell pm clear com.google.android.webview 2>/dev/null || echo "WebView não encontrado"

echo "Limpando dados do app (se ainda existir)..."
adb shell pm clear com.mayara.henshindb 2>/dev/null || echo "App já desinstalado"

echo "Cache limpo! Agora reinstale o app pelo Android Studio."
