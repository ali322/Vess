import base from './base'
import * as outbounds from './outbound'

export const mergeSettings = (
  server: Record<string, any>,
  routing: Record<string, any>,
  settings: Record<string, any>
): Record<string, any> => {
  let rules: any[] = routing.routes.map((route: any) => {
    let r: Record<string, any> = { type: 'field', outboundTag: route.outboundTag }
    if (route.type === 'domain') {
      r.domain = route.value.split(',')
    }
    if (route.type === 'ip') {
      r.ip = route.value.split(',')
    }
    return r
  })
  let config = Object.assign({}, base, {
    inbounds: base.inbounds.map((v: Record<string, any>) => {
      v.protocol === 'socks' && (v.port = settings.socksPort)
      v.protocol === 'http' && (v.port = settings.httpPort)
      v.tag === 'api' && (v.port = settings.apiPort)
      return v
    }),
    routing: {
      domainStrategy: routing.domainStrategy,
      rules: base.routing.rules.concat(rules)
    },
    outbounds: [Object.assign({}, server, { tag: 'proxy' })].concat(
      base.outbounds
    )
  })
  if (settings.extra) {
    config = Object.assign({}, config, settings.extra)
  }
  return config
}

export const outboundByProtocol = (protocol: string) => {
  return (outbounds as Record<string, any>)[protocol] || {}
}