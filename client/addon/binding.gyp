{
  "targets": [
    {
      "target_name": "get_selected_text",
      "sources": [ "get_selected_text.cc" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "<!@(node -p \"require('path').resolve('./node_modules/electron/dist/include/electron/37.4.0/node')\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cflags": ["-std=c++17"],
      "msvs_settings": {
        "VCCLCompilerTool": { "ExceptionHandling": "2" }
      },
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }
  ]
}