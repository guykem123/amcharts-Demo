import { Route } from '@angular/router';

const isLazyLoading = false
//return false when network is to slow and true when the network can load in the background
export function shouldPreload(route: Route): boolean {
    // Get NetworkInformation object
    const conn = (<any>navigator).connection;

    if (isLazyLoading)
        return false

    if (conn) {
        // Save-Data mode
        if (conn.saveData) {
            return false;
        }
        // 'slow-2g', '2g', '3g', or '4g'
        const effectiveType = conn.effectiveType || '';
        // 2G network
        if (effectiveType.includes('2g')) {
            return false;
        }
    }
    return true;
}