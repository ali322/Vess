export const routing = {
  routing: {
    domainStrategy: 'IPIfNonMatch',
    rules: [
      {
        inboundTag: ['api'],
        outboundTag: 'api',
        type: 'field'
      },
      {
        type: 'field',
        protocol: ['bittorrent'],
        outboundTag: 'direct'
      },
      {
        type: 'field',
        domain: ['geosite:category-ads-all'],
        outboundTag: 'block'
      }
    ]
  }
}

export const inbounds = [
  {
    listen: '127.0.0.1',
    protocol: 'socks',
    settings: {
      udp: true
    }
  },
  {
    listen: '127.0.0.1',
    protocol: 'http',
    settings: {
      timeout: 0
    }
  },
  {
    listen: '127.0.0.1',
    protocol: 'dokodemo-door',
    settings: {
      address: '127.0.0.1'
    },
    tag: 'api'
  }
]

export const outbounds = [
  {
    tag: 'block',
    protocol: 'blackhole'
  },
  {
    tag: 'direct',
    protocol: 'freedom'
  }
]

export const base = {
  log: {
    loglevel: 'debug'
  },
  dns: {
    servers: [
      {
        address: 'https+local://1.1.1.1/dns-query',
        domains: ['geosite:geolocation-!cn']
      },
      {
        address: 'https://doh.pub/dns-query',
        domains: ['geosite:cn'],
        expectIPs: ['geoip:cn']
      },
      {
        address: '119.29.29.29',
        domains: ['geosite:cn'],
        expectIPs: ['geoip:cn']
      },
      '223.5.5.5',
      '114.114.114.114',
      '8.8.8.8',
      'localhost'
    ]
  },
  stats: {},
  policy: {
    system: {
      statsInboundUplink: true,
      statsInboundDownlink: true,
      statsOutboundUplink: true,
      statsOutboundDownlink: true
    }
  },
  api: {
    tag: 'api',
    services: ['HandlerService', 'LoggerService', 'StatsService']
  }
}

export default Object.assign({}, base, { outbounds, inbounds }, routing)
