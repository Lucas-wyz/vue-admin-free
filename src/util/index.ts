export const util = {
  toBase64(blob: Blob): Promise<string> {
    const reader = new FileReader()

    const promise = new Promise<string>((resolve, reject) => {
      let result: string | ArrayBuffer | null | undefined
      reader.onload = (ev) => {
        console.log({ ev })
        result = ev.target?.result
        resolve(result as string)
      }
      reader.readAsDataURL(blob)
    })

    return promise
  },
  UUID(): string {
    // 例如 "36b8f84d-df4e-4d49-b662-bcde71a8764f"
    let crypto = new Crypto()
    let uuid = crypto.randomUUID()
    return uuid
  },
  async SHA256(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  },
  async SHA1(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  },
}
