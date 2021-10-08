#import <Cocoa/Cocoa.h>

int main()
{
    NSAutoreleasePool* pool = [[NSAutoreleasePool alloc] init];
    // NSApplication* app = [NSApplication sharedApplication];

    //Create the main window
    NSRect rc = NSMakeRect(0, 0, 800, 600);
    NSUInteger uiStyle = NSTitledWindowMask | NSResizableWindowMask | NSClosableWindowMask;
    NSBackingStoreType backingStoreStyle = NSBackingStoreBuffered;
    NSWindow* win = [[NSWindow alloc] initWithContentRect:rc styleMask:uiStyle backing:backingStoreStyle defer:NO];
    [win setTitle:@"测试字符串"];
    [win makeKeyAndOrderFront:win];
    [win makeMainWindow];

    //Start the event loop by calling NSApp run
    [NSApp run];
    [pool drain];
    return 0;
}
