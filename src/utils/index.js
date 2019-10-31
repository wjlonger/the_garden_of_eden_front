const phoneReg = /^1[3|4|5|7|8][0-9]\d{8}$/
const emailReg = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/

export function requestFullScreen () {
  var elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullScreen) {
    elem.webkitRequestFullScreen()
  } else if (elem.msRequestFullscreen) {
    document.body.msRequestFullscreen()
  }
}

export function exitFullscreen () {
  var doc = document
  if (doc.exitFullscreen) {
    doc.exitFullscreen()
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen()
  } else if (doc.webkitCancelFullScreen) {
    doc.webkitCancelFullScreen()
  } else if (doc.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

export function isvalidPhone (phone) {
  return phoneReg.test(phone)
}

export function isvalidEmail (email) {
  return emailReg.test(email)
}
