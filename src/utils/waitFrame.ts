const nextFrame = () => new Promise<void>(r => requestAnimationFrame(() => r()))
export const waitTwoFrames = async () => {
  await nextFrame()
  await nextFrame()
}
