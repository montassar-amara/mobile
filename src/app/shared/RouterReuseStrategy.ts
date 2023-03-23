import { DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class MyCustomRouteReuseStrategy implements RouteReuseStrategy {
    // Never reuse a component!
    shouldReuseRoute(): boolean {
      return false;
    }
  
    // Implement the other default methods. Keep same functionality.
    shouldDetach(): boolean { return false; }
    store(): void {}
    shouldAttach(): boolean { return false; }
    retrieve(): DetachedRouteHandle | null { return null; }
  }