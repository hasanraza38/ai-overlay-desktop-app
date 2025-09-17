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

    IUIAutomationTextRangeArray* pRangeArray = NULL;
    hr = pTextPattern->GetSelection(&pRangeArray);
    if (FAILED(hr) || pRangeArray == NULL) {
        pTextPattern->Release();
        pFocused->Release();
        pRoot->Release();
        pAutomation->Release();
        CoUninitialize();
        return Napi::String::New(env, "");
    }

    int count = 0;  // Change LONG to int here to match the API signature
    hr = pRangeArray->get_Length(&count);
    if (SUCCEEDED(hr) && count > 0) {
        IUIAutomationTextRange* pRange = NULL;
        hr = pRangeArray->GetElement(0, &pRange); // First selected range
        if (SUCCEEDED(hr) && pRange != NULL) {
            BSTR selectedText = NULL;
            hr = pRange->GetText(-1, &selectedText); // -1 for full text
            if (SUCCEEDED(hr) && selectedText != NULL) {
                std::wstring ws(selectedText);
                std::string result(ws.begin(), ws.end());
                SysFreeString(selectedText);
                pRange->Release();
                pRangeArray->Release();
                pTextPattern->Release();
                pFocused->Release();
                pRoot->Release();
                pAutomation->Release();
                CoUninitialize();
                return Napi::String::New(env, result.c_str());
            }
            pRange->Release();
        }
    }

    pRangeArray->Release();
    pTextPattern->Release();
    pFocused->Release();
    pRoot->Release();
    pAutomation->Release();
    CoUninitialize();
    return Napi::String::New(env, "");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getSelectedText"),
        Napi::Function::New(env, GetSelectedText));
    return exports;
}

NODE_API_MODULE(get_selected_text, Init)