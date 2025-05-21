
export const BASE_URL = 'http://10.80.120:100:2602';


export function fetchWithTimeout(
    url: string | URL,
    options?: RequestInit & { timeout?: number }
): Promise<Response> {
    const ac = new AbortController()
    let timeout = options?.timeout ?? 2000

    if(timeout < 1) {
        timeout = 2000
    }

    const init = options ?? {};
    delete init.timeout;

    return Promise.race([
        fetch(url, init),
        new Promise<Response>((_, reject) => {
            setTimeout(() => {
                ac.abort();
                reject(new Error('Request timeout reached'))
            }, timeout)
        })
    ])
}