if (!/yarn/.test(process.env.npm_execpath || '')) { // eslint-disable-line
  // 强制使用yarn安装，否则报错
  console.warn(
    `\u001b[33mThis repository must using yarn as the package manager ` +
    ` for scripts to work properly.\u001b[39m\n`,
  )
  process.exit(1) // eslint-disable-line
}