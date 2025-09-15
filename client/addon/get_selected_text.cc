#include <napi.h>
#include <windows.h>
#include <uiautomation.h>

Napi::String GetSelectedText(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    CoInitialize(NULL);

    IUIAutomation* pAutomation = NULL;
    HRESULT hr = CoCreateInstance(__uuidof(CUIAutomation), NULL, CLSCTX_INPROC_SERVER,
        __uuidof(IUIAutomation), (void**)&pAutomation);
    if (FAILED(hr)) {
        CoUninitialize();
        return Napi::String::New(env, "");
    }

    IUIAutomationElement* pRoot = NULL;
    hr = pAutomation->GetRootElement(&pRoot);
    if (FAILED(hr)) {
        pAutomation->Release();
        CoUninitialize();
        return Napi::String::New(env, "");
    }

    IUIAutomationElement* pFocused = NULL;
    hr = pAutomation->GetFocusedElement(&pFocused);
    if (FAILED(hr)) {
        pRoot->Release();
        pAutomation->Release();
        CoUninitialize();
        return Napi::String::New(env, "");
    }

    IUIAutomationTextPattern* pTextPattern = NULL;
    hr = pFocused->GetCurrentPatternAs(UIA_TextPatternId, __uuidof(IUIAutomationTextPattern), (void**)&pTextPattern);
    if (FAILED(hr)) {
        pFocused->Release();
        pRoot->Release();
        pAutomation->Release();
        CoUninitialize();
        return Napi::String::New(env, "");
    }

    BSTR selectedText;
    hr = pTextPattern->GetSelection(&selectedText);
    if (FAILED(hr)) {
        pTextPattern->Release();
        pFocused->Release();
        pRoot->Release();
        pAutomation->Release();
        CoUninitialize();
        return Napi::String::New(env, "");
    }

    std::wstring ws(selectedText);
    std::string result(ws.begin(), ws.end());
    SysFreeString(selectedText);

    pTextPattern->Release();
    pFocused->Release();
    pRoot->Release();
    pAutomation->Release();
    CoUninitialize();

    return Napi::String::New(env, result.c_str());
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getSelectedText"),
        Napi::Function::New(env, GetSelectedText));
    return exports;
}

NODE_API_MODULE(get_selected_text, Init)