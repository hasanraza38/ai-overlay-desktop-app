#include <napi.h>
#include <windows.h>
#include <uiautomation.h>

Napi::Value GetSelectedText(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  CoInitialize(NULL);

  IUIAutomation* pAutomation = NULL;
  HRESULT hr = CoCreateInstance(__uuidof(CUIAutomation), NULL, CLSCTX_INPROC_SERVER,
      __uuidof(IUIAutomation), (void**)&pAutomation);
  if (FAILED(hr)) {
    Napi::Error::New(env, "Failed to create UIAutomation instance").ThrowAsJavaScriptException();
    CoUninitialize();
    return Napi::String::New(env, "");
  }

  IUIAutomationElement* pRoot = NULL;
  hr = pAutomation->GetRootElement(&pRoot);
  if (FAILED(hr)) {
    Napi::Error::New(env, "Failed to get root element").ThrowAsJavaScriptException();
    pAutomation->Release();
    CoUninitialize();
    return Napi::String::New(env, "");
  }

  IUIAutomationElement* pFocused = NULL;
  hr = pAutomation->GetFocusedElement(&pFocused);
  if (FAILED(hr)) {
    Napi::Error::New(env, "Failed to get focused element").ThrowAsJavaScriptException();
    pRoot->Release();
    pAutomation->Release();
    CoUninitialize();
    return Napi::String::New(env, "");
  }

  IUIAutomationTextPattern* pTextPattern = NULL;
  hr = pFocused->GetCurrentPatternAs(UIA_TextPatternId, __uuidof(IUIAutomationTextPattern), (void**)&pTextPattern);
  if (FAILED(hr)) {
    Napi::Error::New(env, "Failed to get text pattern").ThrowAsJavaScriptException();
    pFocused->Release();
    pRoot->Release();
    pAutomation->Release();
    CoUninitialize();
    return Napi::String::New(env, "");
  }

  IUIAutomationTextRangeArray* pRangeArray = NULL;
  hr = pTextPattern->GetSelection(&pRangeArray);
  if (FAILED(hr) || pRangeArray == NULL) {
    Napi::Error::New(env, "Failed to get selection or selection is null").ThrowAsJavaScriptException();
    pTextPattern->Release();
    pFocused->Release();
    pRoot->Release();
    pAutomation->Release();
    CoUninitialize();
    return Napi::String::New(env, "");
  }

  int count = 0;
  hr = pRangeArray->get_Length(&count);
  if (FAILED(hr)) {
    Napi::Error::New(env, "Failed to get selection length").ThrowAsJavaScriptException();
    pRangeArray->Release();
    pTextPattern->Release();
    pFocused->Release();
    pRoot->Release();
    pAutomation->Release();
    CoUninitialize();
    return Napi::String::New(env, "");
  }
  if (count == 0) {
    pRangeArray->Release();
    pTextPattern->Release();
    pFocused->Release();
    pRoot->Release();
    pAutomation->Release();
    CoUninitialize();
    return Napi::String::New(env, "No selection");
  }

  IUIAutomationTextRange* pRange = NULL;
  hr = pRangeArray->GetElement(0, &pRange);
  if (FAILED(hr) || pRange == NULL) {
    Napi::Error::New(env, "Failed to get first selected range").ThrowAsJavaScriptException();
    pRangeArray->Release();
    pTextPattern->Release();
    pFocused->Release();
    pRoot->Release();
    pAutomation->Release();
    CoUninitialize();
    return Napi::String::New(env, "");
  }

  BSTR selectedText = NULL;
  hr = pRange->GetText(-1, &selectedText);
  if (FAILED(hr) || selectedText == NULL) {
    Napi::Error::New(env, "Failed to get selected text").ThrowAsJavaScriptException();
    pRange->Release();
    pRangeArray->Release();
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
  pRange->Release();
  pRangeArray->Release();
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

