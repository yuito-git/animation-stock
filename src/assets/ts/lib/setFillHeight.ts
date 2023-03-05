export const setFillHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// 参考→https://zenn.dev/tak_dcxi/articles/2ac77656aa94c2cd40bf
