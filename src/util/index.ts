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
}
