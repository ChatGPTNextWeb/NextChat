; ActorAIchat - NSIS Installer Script
; =====================================
; Build: makensis.exe /DVersion=X.Y.Z setup.nsi
; Requires: NSIS v3 (winget install NSIS.NSIS)
;
; Preprocessor defines (passed via /D flag):
;   Version    - e.g. "2.16.1"
;   ExeSource  - path to ActorAIchat.exe
;   DllSource  - path to WebView2Loader.dll
;   IconSource - path to icon.ico
;   OutFile    - output setup.exe path (optional)

!ifndef Version
  !define Version "0.1.0"
!endif
!ifndef ExeSource
  !define ExeSource "..\release\ActorAIchat.exe"
!endif
!ifndef DllSource
  !define DllSource "..\release\WebView2Loader.dll"
!endif
!ifndef IconSource
  !define IconSource "..\src-tauri\icons\icon.ico"
!endif
!ifndef OutFile
  !define OutFile "..\release\ActorAIchat_${Version}_x64-setup.exe"
!endif

!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "ActorAIchat"
OutFile "${OutFile}"
InstallDir "$LOCALAPPDATA\Programs\ActorAIchat"
InstallDirRegKey HKCU "Software\ActorAI\ActorAIchat" "InstallDir"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "ActorAIchat v${Version}"
VIProductVersion "${Version}.0"
VIAddVersionKey "ProductName" "ActorAIchat"
VIAddVersionKey "FileVersion" "${Version}"
VIAddVersionKey "LegalCopyright" "ActorAI"
VIAddVersionKey "FileDescription" "ActorAIchat - AI Chat Client"

!define MUI_ICON "${IconSource}"
!define MUI_UNICON "${IconSource}"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\ActorAIchat.exe"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "license.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_SHOWREADME ""
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Create Desktop Shortcut"
!define MUI_FINISHPAGE_SHOWREADME_FUNCTION CreateDesktopShortcut
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "SimpChinese"

Section "Install"
  SetOutPath "$INSTDIR"
  File "${ExeSource}"
  File "${DllSource}"
  File "${IconSource}"

  WriteRegStr HKCU "Software\ActorAI\ActorAIchat" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\ActorAI\ActorAIchat" "Version" "${Version}"

  CreateDirectory "$SMPROGRAMS\ActorAIchat"
  CreateShortcut "$SMPROGRAMS\ActorAIchat\ActorAIchat.lnk" "$INSTDIR\ActorAIchat.exe" "" "$INSTDIR\icon.ico"
  CreateShortcut "$SMPROGRAMS\ActorAIchat\Uninstall ActorAIchat.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\icon.ico"
  CreateShortcut "$DESKTOP\ActorAIchat.lnk" "$INSTDIR\ActorAIchat.exe" "" "$INSTDIR\icon.ico"

  WriteUninstaller "$INSTDIR\uninstall.exe"

  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "DisplayName" "ActorAIchat"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "DisplayVersion" "${Version}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "Publisher" "ActorAI"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "DisplayIcon" "$INSTDIR\icon.ico"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "EstimatedSize" $0
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "NoRepair" 1
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat" "URLInfoAbout" "https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web"

  ; WebView2 check
  ReadRegStr $0 HKLM "SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  ReadRegStr $1 HKCU "SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  ${If} $0 == ""
  ${AndIf} $1 == ""
    MessageBox MB_ICONEXCLAMATION|MB_OK "WebView2 Runtime was not detected.$\n$\nPlease install from:$\nhttps://developer.microsoft.com/microsoft-edge/webview2/$\n$\n(Windows 11 and recent Win10 include it.)"
  ${EndIf}
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\ActorAIchat.exe"
  Delete "$INSTDIR\WebView2Loader.dll"
  Delete "$INSTDIR\icon.ico"
  Delete "$INSTDIR\uninstall.exe"
  RMDir "$INSTDIR"
  Delete "$SMPROGRAMS\ActorAIchat\ActorAIchat.lnk"
  Delete "$SMPROGRAMS\ActorAIchat\Uninstall ActorAIchat.lnk"
  RMDir "$SMPROGRAMS\ActorAIchat"
  Delete "$DESKTOP\ActorAIchat.lnk"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\ActorAIchat"
  DeleteRegKey HKCU "Software\ActorAI\ActorAIchat"
SectionEnd

Function CreateDesktopShortcut
  CreateShortcut "$DESKTOP\ActorAIchat.lnk" "$INSTDIR\ActorAIchat.exe" "" "$INSTDIR\icon.ico"
FunctionEnd
