TARGET = hello

CFLAGS ?= -std=c99 -Wall -Wextra -pedantic -I./

TARGET_OS ?= $(OS)
ifeq ($(TARGET_OS),Windows_NT)
else ifeq ($(shell uname -s),Linux)
else ifeq ($(shell uname -s),Darwin)
	WEBVIEW_CFLAGS := -x objective-c
	WEBVIEW_LDFLAGS := -framework Cocoa -framework WebKit
endif

$(TARGET): main.m
	$(CC) $(CFLAGS) $(WEBVIEW_CFLAGS) main.m $(LDFLAGS) $(WEBVIEW_LDFLAGS) -o $@

clean:
	rm -f $(TARGET)

.PHONY: clean
